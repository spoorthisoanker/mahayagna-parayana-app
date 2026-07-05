// operator.js — Operator window controller
// Runs animator, handles controls, sends state to projector via IPC
'use strict';

(function() {
  var currentPage = 0;
  var currentDisplayMode = 'asterisk';
  var projectorOpen = false;

  // --- Chant timing/tempo settings (operator-only, persisted in localStorage) ---
  // The standalone web app (index.html) keeps its own hardcoded defaults; this panel
  // only affects the Electron operator window.
  var CHANT_DEFAULTS = {
    colophonBpmDrop: 0,      // internal-bpm slow-down for the closing slide + Sarvadharmān; 0 = chapter pace (#5). Settings field is in BPM (×4).
    headerBpmDrop: 20,       // internal-bpm slow-down for chapter-opening header slides (default 5 BPM). Settings field is in BPM (×4), 5-BPM steps.
    countdownSeconds: 5,     // pre-play countdown length
    chapterGapSeconds: 3,    // gap between chapters before the countdown
    verseZoom: 100,          // projector verse-text zoom (%) — #34
    headerPauseBeats: 3,     // pause (mātrās) after each header line — #36.1
    anustubhBeats: 2,        // anuṣṭubh verse line-end pause (mātrās) — section table
    tristubhBeats: 3,        // triṣṭubh verse line-end pause (mātrās) — section table
    uvacaBeats: 2,           // "... uvāca -" speaker-label line-end pause (mātrās) — #26
    mahatmyamBeats: 3,       // Gita Mahātmyam verse line-end pause (mātrās) — section table
    theme: 'dark',           // projector theme: 'dark' (black bg) or 'light' (white bg) — #37
    sectionBpm: {}           // chapterId -> internal BPM override; empty = use data defaultBpm
  };

  function loadChantSettings() {
    var merged = {
      colophonBpmDrop: CHANT_DEFAULTS.colophonBpmDrop,
      headerBpmDrop: CHANT_DEFAULTS.headerBpmDrop,
      countdownSeconds: CHANT_DEFAULTS.countdownSeconds,
      chapterGapSeconds: CHANT_DEFAULTS.chapterGapSeconds,
      verseZoom: CHANT_DEFAULTS.verseZoom,
      headerPauseBeats: CHANT_DEFAULTS.headerPauseBeats,
      anustubhBeats: CHANT_DEFAULTS.anustubhBeats,
      tristubhBeats: CHANT_DEFAULTS.tristubhBeats,
      uvacaBeats: CHANT_DEFAULTS.uvacaBeats,
      mahatmyamBeats: CHANT_DEFAULTS.mahatmyamBeats,
      theme: CHANT_DEFAULTS.theme,
      sectionBpm: {}
    };
    try {
      var raw = window.localStorage.getItem('gitaChantSettings');
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          if (typeof parsed.colophonBpmDrop === 'number') merged.colophonBpmDrop = parsed.colophonBpmDrop;
          if (typeof parsed.headerBpmDrop === 'number') merged.headerBpmDrop = parsed.headerBpmDrop;
          if (typeof parsed.countdownSeconds === 'number') merged.countdownSeconds = parsed.countdownSeconds;
          if (typeof parsed.chapterGapSeconds === 'number') merged.chapterGapSeconds = parsed.chapterGapSeconds;
          if (typeof parsed.verseZoom === 'number') merged.verseZoom = parsed.verseZoom;
          if (typeof parsed.headerPauseBeats === 'number') merged.headerPauseBeats = parsed.headerPauseBeats;
          if (typeof parsed.anustubhBeats === 'number') merged.anustubhBeats = parsed.anustubhBeats;
          if (typeof parsed.tristubhBeats === 'number') merged.tristubhBeats = parsed.tristubhBeats;
          if (typeof parsed.uvacaBeats === 'number') merged.uvacaBeats = parsed.uvacaBeats;
          if (typeof parsed.mahatmyamBeats === 'number') merged.mahatmyamBeats = parsed.mahatmyamBeats;
          if (parsed.theme === 'dark' || parsed.theme === 'light') merged.theme = parsed.theme;
          if (parsed.sectionBpm && typeof parsed.sectionBpm === 'object') {
            for (var k in parsed.sectionBpm) {
              if (Object.prototype.hasOwnProperty.call(parsed.sectionBpm, k) && typeof parsed.sectionBpm[k] === 'number') {
                merged.sectionBpm[k] = parsed.sectionBpm[k];
              }
            }
          }
        }
      }
    } catch (e) {
      console.warn('Bad gitaChantSettings — using defaults:', e);
    }
    return merged;
  }

  var chantSettings = loadChantSettings();

  function saveChantSettings() {
    try {
      window.localStorage.setItem('gitaChantSettings', JSON.stringify(chantSettings));
    } catch (e) {
      console.warn('Could not persist gitaChantSettings:', e);
    }
  }

  // Line-end pauses are data-driven (renderer sets dataset.lineEndPauseBeats), and
  // colophon-drop / countdown / chapter-gap / section-BPM are read at their use sites.
  // applyChantSettings pushes the projector verse-zoom (#34) to the projector and the
  // operator's own (hidden) display.
  function applyChantSettings() {
    var scale = (chantSettings.verseZoom || 100) / 100;
    sendToProjector('verse-zoom', { scale: scale });
    var disp = document.getElementById('display');
    if (disp) disp.style.setProperty('--verse-zoom', String(scale));
    // Line-end pause config — renderer encodes these into dataset.lineEndPauseBeats
    // at render time (#36.1 header pause; #36.2 meter-aware verse pauses).
    renderer.setPaceConfig({
      headerPauseBeats: chantSettings.headerPauseBeats,
      anustubhBeats: chantSettings.anustubhBeats,
      tristubhBeats: chantSettings.tristubhBeats,
      uvacaBeats: chantSettings.uvacaBeats,
      mahatmyamBeats: chantSettings.mahatmyamBeats
    });
    // Projector theme — dark (black bg) / light (white bg) — #37
    sendToProjector('theme', { theme: chantSettings.theme });
  }

  // The tempo the chapter should run at: set on chapter load (defaultBpm or current),
  // updated on manual BPM change. Colophon pages run at currentChapterBpm - colophonBpmDrop.
  var currentChapterBpm = 380;
  var closerSlowApplied = false;
  var currentPageBpmDrop = 0;   // internal-bpm drop currently applied to this page (colophon #5 or Samarpana sloka-4 #12)
  var chapterSelect = document.getElementById('chapter-select');
  var shlokaSelect = document.getElementById('shloka-select');

  // --- IPC helpers ---
  function sendToProjector(channel, data) {
    window.electronAPI.send(channel, data);
  }

  function syncProjectorPage() {
    sendToProjector('render-page', {
      chapter: dataLayer.getCurrentChapterId(),
      pageIndex: currentPage,
      displayMode: currentDisplayMode
    });
  }

  // --- Instruction data ---
  var INSTRUCTION_DATA = {
    folded_hands:      { image: '../img/instructions/folded-hands.png' },
    namaskara_anim:    { image: '../img/instructions/image9.gif' },
    pranam:            { text: 'Pran\u0101m', image: '../img/instructions/image7.gif' },
    sit_straight:      { text: 'Sit Straight', image: '../img/instructions/image3.gif' },
    increase_sruti:    { image: '../img/instructions/shruti-increase.png' },
    listen_sync:       { text: 'Listen and Sync\nwith Pace Helpers' },
    good_job:          { image: '../img/instructions/image6.gif' },
    decrease_sruti:    { image: '../img/instructions/image4.jpeg', image2: '../img/instructions/image5.gif', arrow: 'down' },
    stop:              { text: 'STOP', color: '#ff4444' },
    starting_soon:     { text: 'Sampoorna Bhagavad Gita\nParayana Starting Soon' },
    sitting_placement: { text: 'Sit directly in your square\nLabel should be in front of you' }
  };

  // --- Position display ---
  function updatePositionBar() {
    var chapterId = dataLayer.getCurrentChapterId();
    var chapterName = chapterSelect.options[chapterSelect.selectedIndex].textContent;
    document.getElementById('chapter-name').textContent = chapterName;

    var page = dataLayer.getPage(currentPage);
    var total = dataLayer.getPageCount();
    var shlokaText;
    if (page && page.isHeader) {
      shlokaText = 'Header';
    } else if (page && page.isCloser) {
      shlokaText = 'Closing';
    } else if (page && page.shlokaNum) {
      shlokaText = 'Shloka ' + page.shlokaNum;
    } else {
      shlokaText = 'Page ' + (currentPage + 1);
    }
    if (page && !page.isHeader && page.repeatTotal > 1) {
      shlokaText += ' (' + page.repeatPass + '/' + page.repeatTotal + ')';
    }
    document.getElementById('shloka-info').textContent = shlokaText + '  ·  ' + (currentPage + 1) + ' of ' + total;
  }

  // --- Shloka dropdown ---
  function populateShlokaDropdown() {
    while (shlokaSelect.firstChild) shlokaSelect.removeChild(shlokaSelect.firstChild);
    var pageCount = dataLayer.getPageCount();
    for (var i = 0; i < pageCount; i++) {
      var page = dataLayer.getPage(i);
      var opt = document.createElement('option');
      opt.value = i;
      if (page.isHeader) {
        opt.textContent = page.shlokaNum ? 'Header (Shloka ' + page.shlokaNum + ')' : 'Header';
      } else if (page.isCloser) {
        opt.textContent = 'Closing';
      } else {
        opt.textContent = page.shlokaNum ? 'Shloka ' + page.shlokaNum : 'Page ' + (i + 1);
      }
      if (!page.isHeader && page.repeatTotal > 1) {
        opt.textContent += ' (' + page.repeatPass + '/' + page.repeatTotal + ')';
      }
      shlokaSelect.appendChild(opt);
    }
  }

  // --- Chapter loading ---
  // blankProjector=true: for manual chapter selection — blank the projector so the header
  // only appears after the countdown. blankProjector=false: for auto-advance — show immediately.
  async function loadChapter(chapterId, blankProjector) {
    try {
      renderer.invalidatePrefetch();
      var chData = await dataLayer.fetchChapter(chapterId);
      // Apply BPM for this section: a Settings override (internal bpm) wins over the
      // data defaultBpm. Sections without either keep the current running bpm.
      var override = chantSettings.sectionBpm[String(chapterId)];
      if (typeof override === 'number') {
        animator.setBpm(override);
        updateSpmDisplay();
      } else if (chData && chData.defaultBpm) {
        animator.setBpm(chData.defaultBpm);
        updateSpmDisplay();
      }
      // Capture the base tempo the chapter runs at (used to offset colophon pages).
      currentChapterBpm = animator.getState().bpm;
      closerSlowApplied = false;
      currentPageBpmDrop = 0;
      populateShlokaDropdown();
      currentPage = 0;
      showPage(0, blankProjector);
      chapterSelect.value = String(chapterId);
    } catch (err) {
      console.error('Load failed:', err);
    }
  }

  // --- Page display ---
  function showPage(index, blankProjector) {
    animator.reset();
    sendToProjector('animation-reset');

    var chId = dataLayer.getCurrentChapterId();
    var page = dataLayer.getPage(index);
    if (!renderer.swapPrefetched(index, chId)) {
      if (!page) return;
      renderer.renderPage(page);
    }

    currentPage = index;
    updatePositionBar();
    shlokaSelect.value = currentPage;

    // Automatic per-page tempo offsets (internal bpm; 5 BPM = 20 internal bpm):
    //   #5:  the closing slide ("om tatsaditi") AND the Sarvadharmān recitation run at the
    //        chapter pace by default (colophonBpmDrop = 0); the operator can dial in a
    //        slow-down (in BPM) via Settings to ease those endings.
    //   #12: the two Samarpana "sloka 4" slides always run 5 BPM slower, automatically.
    //   Dhyana sloka 8 (śāntākāraṃ) runs at a fixed 70 BPM (internal 280) — expressed as
    //   an offset from the section base so the drop-restore bookkeeping stays uniform
    //   (the offset is NEGATIVE when the base is slower, e.g. Dhyana's default 60).
    // Restore the chapter base tempo when leaving any such page.
    var pageBpmDrop = 0;
    if (page && (page.isCloser || page.shlokaNum === 'sarvadharmān')) {
      pageBpmDrop = chantSettings.colophonBpmDrop;
    } else if (page && chId === 'kshama_prarthana' && page.shlokaNum === '4') {
      pageBpmDrop = 20; // 5 BPM
    } else if (page && chId === '0' && page.shlokaNum === '8') {
      pageBpmDrop = currentChapterBpm - 280; // fixed 70 BPM
    } else if (page && page.isHeader && !(page.lines && page.lines[0] && page.lines[0].sty === 'uh')) {
      // Chapter-opening header slides (fh/sh/th) chant headerBpmDrop slower (5-BPM
      // steps via Settings). Closing 'uh' headers keep the chapter pace.
      pageBpmDrop = chantSettings.headerBpmDrop;
    }
    if (pageBpmDrop !== 0) {
      animator.setBpm(currentChapterBpm - pageBpmDrop);
      closerSlowApplied = true;
      currentPageBpmDrop = pageBpmDrop;
      updateSpmDisplay();
    } else if (closerSlowApplied) {
      animator.setBpm(currentChapterBpm);
      closerSlowApplied = false;
      currentPageBpmDrop = 0;
      updateSpmDisplay();
    }

    if (blankProjector) {
      // Blank the projector now — header will appear after countdown
      sendToProjector('countdown', { number: -1 });
    } else {
      syncProjectorPage();
    }

    // Feedback #6 + #7: namaskara mudra while header lines animate, on the colophon
    // ("|| ōṃ tatsaditi ...") page, on each chapter's trailing sarvadharmān recitation,
    // and on 18.66 / 18.78. Auto-dismissed on other pages.
    // Only auto-shown cards are auto-dismissed — manual instructions survive page flips.
    var needsMudra = page && (page.isHeader || page.isCloser ||
      page.shlokaNum === 'sarvadharmān' ||
      (chId === '18' && (page.shlokaNum === '66' || page.shlokaNum === '78')));
    if (needsMudra) {
      // Pranam añjali mudra for every mudra overlay site.
      var mudraKey = 'pranam';
      sendToProjector('show-instruction', INSTRUCTION_DATA[mudraKey]);
      instructionShowing = true;
      headerInstructionShowing = true;
    } else if (headerInstructionShowing) {
      dismissInstruction();
    }

    // Pre-render next page
    var nextIdx = currentPage + 1;
    if (nextIdx < dataLayer.getPageCount()) {
      renderer.prefetchPage(nextIdx, chId);
    }
  }

  // --- Navigation ---
  async function nextPage() {
    if (currentPage < dataLayer.getPageCount() - 1) {
      showPage(currentPage + 1);
    } else {
      var nextId = dataLayer.getNextChapterId();
      if (nextId) {
        await loadChapter(nextId, false); // auto-advance: show immediately
      }
    }
  }

  // --- Restart Chapter ---
  function restartChapter() {
    showPage(0);
  }

  // --- Countdown ---
  var countdownActive = false;

  function startCountdown(callback) {
    if (countdownActive) return;
    countdownActive = true;
    var count = chantSettings.countdownSeconds;
    sendToProjector('countdown', { number: count });
    var interval = setInterval(function() {
      count--;
      if (count <= 0) {
        clearInterval(interval);
        countdownActive = false;
        sendToProjector('countdown', { number: 0 });
        if (callback) callback();
      } else {
        sendToProjector('countdown', { number: count });
      }
    }, 1000);
  }

  function playWithCountdown() {
    if (currentPage === 0 && animator.getState().currentIndex < 0) {
      // Blank projector, pre-render behind the blank, then countdown
      sendToProjector('countdown', { number: -1 });
      syncProjectorPage();
      startCountdown(function() {
        animator.play();
      });
    } else {
      animator.play();
    }
  }

  // --- BPM display ---
  var spmInput = document.getElementById('spm-input');

  function updateSpmDisplay() {
    spmInput.value = Math.round(animator.getState().bpm / 4);
  }

  // Record an operator's manual tempo change as the new chapter base tempo so the
  // per-page offset stays relative to the operator's chosen BPM. If a page slow-down
  // is currently applied (colophon #5 or Samarpana sloka-4 #12), the running bpm is
  // already dropped by currentPageBpmDrop, so add it back to recover the base tempo.
  function noteManualTempoChange() {
    var runningBpm = animator.getState().bpm;
    currentChapterBpm = runningBpm + currentPageBpmDrop;
  }

  spmInput.addEventListener('change', function() {
    var val = parseInt(spmInput.value, 10);
    if (!isNaN(val) && val > 0) {
      animator.setBpm(val * 4);
    }
    noteManualTempoChange();
    updateSpmDisplay();
  });

  spmInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      spmInput.blur();
    }
    e.stopPropagation(); // prevent keyboard shortcuts while editing
  });

  // --- Hook into animator to send syllable updates to projector ---
  animator.setOnSyllableChange(function(index, state) {
    var beatMs = Math.round(60000 / animator.getState().bpm);
    var elems = renderer.getSyllableElements();
    var el = elems[index];
    var beats = el ? (parseInt(el.dataset.beats, 10) || 1) : 1;
    sendToProjector('syllable-update', { index: index, state: state, beatMs: beatMs, durationMs: beats * beatMs });
  });

  // --- Auto-advance: when animator reaches end of page, go to next and resume ---
  animator.setOnAutoAdvance(async function() {
    var atChapterEnd = currentPage >= dataLayer.getPageCount() - 1;
    var chapterId = dataLayer.getCurrentChapterId();

    if (atChapterEnd) {
      // Feedback #2 + #7: namaskara mudra at every chapter end (auto-shown — may be
      // auto-dismissed by the gap timer or the next chapter's verse pages).
      sendToProjector('show-instruction', INSTRUCTION_DATA['pranam']);
      instructionShowing = true;
      headerInstructionShowing = true;

      // Feedback #2: hard stop after Datta Stavam — operator resumes manually.
      if (chapterId === 'datta_stavam') return; // stay paused on the last page

      // Inter-chapter gap, then countdown, then play (feedback #5).
      // Issue #29: the countdown ("Listen to Śruti") must precede the chapter's
      // first header line ("Oṃ Śrī Paramātmanē Namaḥ"). Load the next chapter
      // with the projector BLANKED (blankProjector=true) so the fh header stays
      // hidden behind the countdown overlay and is only revealed when the
      // countdown completes and play begins on page 0 (the fh header).
      var gapMs = chantSettings.chapterGapSeconds * 1000;
      setTimeout(async function() {
        dismissInstruction();
        var nextId = dataLayer.getNextChapterId();
        if (!nextId) return; // no next chapter — stay stopped
        await loadChapter(nextId, true); // crosses into next chapter, blanked
        var newChapter = dataLayer.getCurrentChapterId();
        if (newChapter === chapterId) return; // chapter load failed — stay stopped
        startCountdown(function() {
          // Reveal page 0 (fh header) and animate it as chanting begins.
          syncProjectorPage();
          animator.play();
        });
      }, gapMs);
      return;
    }

    // Mid-chapter pages (headers included): advance immediately — old 3s pranam pause removed.
    await nextPage();
    animator.play();
  });

  // --- Pace indicators ---
  function setPace(mode) {
    var btnSpeedup = document.getElementById('btn-speedup');
    var btnSlowdown = document.getElementById('btn-slowdown');
    btnSpeedup.classList.remove('active');
    btnSlowdown.classList.remove('active');

    if (mode === 'speedup') {
      btnSpeedup.classList.add('active');
      sendToProjector('spm-change', { indicator: '\u26A1' });
    } else if (mode === 'slowdown') {
      btnSlowdown.classList.add('active');
      sendToProjector('spm-change', { indicator: '\u270B' });
    } else {
      sendToProjector('spm-change', { indicator: null });
    }
  }

  // --- Bind controls ---
  document.getElementById('btn-play').addEventListener('click', function() { playWithCountdown(); });
  document.getElementById('btn-pause').addEventListener('click', function() { animator.pause(); });
  document.getElementById('btn-reset').addEventListener('click', function() {
    animator.reset();
    sendToProjector('animation-reset');
  });
  document.getElementById('btn-restart-chapter').addEventListener('click', function() { restartChapter(); });
  document.getElementById('btn-next').addEventListener('click', function() { nextPage(); });

  chapterSelect.addEventListener('change', function() { loadChapter(chapterSelect.value, true); });
  shlokaSelect.addEventListener('change', function() {
    var pageIndex = parseInt(shlokaSelect.value, 10);
    if (!isNaN(pageIndex) && pageIndex >= 0 && pageIndex < dataLayer.getPageCount()) {
      showPage(pageIndex);
    }
  });

  // BPM controls
  document.getElementById('bpm-up').addEventListener('click', function() {
    animator.setBpm(animator.getState().bpm + 20);
    noteManualTempoChange();
    updateSpmDisplay();
  });
  document.getElementById('bpm-down').addEventListener('click', function() {
    animator.setBpm(animator.getState().bpm - 20);
    noteManualTempoChange();
    updateSpmDisplay();
  });

  // Display mode
  document.querySelectorAll('.mode-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.mode-btn').forEach(function(b) { b.classList.remove('selected'); });
      btn.classList.add('selected');
      currentDisplayMode = btn.dataset.mode;
      // #8: element indices differ between display modes (asterisk = per syllable,
      // english = per line), so carry the pointer across the re-render as a fraction
      // of its line — index + sub-element progress in, index + residual progress out.
      // Round trips are exact and playback continues from the same point.
      var state = animator.getState();
      var linePos = renderer.getLinePosition(state.currentIndex, state.progress);
      renderer.setMode(currentDisplayMode);
      if (state.currentIndex >= 0 && linePos) {
        var mapped = renderer.mapLinePosition(linePos);
        state.currentIndex = mapped.index;
        state.progress = mapped.progress;
      }
      animator.restore(state);
      sendToProjector('display-mode', { mode: currentDisplayMode });
      // Re-announce the active syllable so the projector pointer snaps to the right position
      var restoredState = animator.getState();
      if (restoredState.currentIndex >= 0) {
        var reBeatMs = Math.round(60000 / restoredState.bpm);
        var reElems = renderer.getSyllableElements();
        var reEl = reElems[restoredState.currentIndex];
        var reBeats = reEl ? (parseInt(reEl.dataset.beats, 10) || 1) : 1;
        sendToProjector('syllable-update', { index: restoredState.currentIndex, state: 'active', beatMs: reBeatMs, durationMs: reBeats * reBeatMs });
      }
    });
  });

  // Pace indicator buttons
  var btnSpeedup = document.getElementById('btn-speedup');
  var btnSlowdown = document.getElementById('btn-slowdown');
  btnSpeedup.addEventListener('click', function() {
    setPace(btnSpeedup.classList.contains('active') ? 'none' : 'speedup');
  });
  btnSlowdown.addEventListener('click', function() {
    setPace(btnSlowdown.classList.contains('active') ? 'none' : 'slowdown');
  });
  document.getElementById('btn-clear-pace').addEventListener('click', function() { setPace('none'); });

  // Instruction dropdown
  var instructionShowing = false;
  // True only when the card was auto-shown (header page / chapter end) — gates the
  // auto-dismiss in showPage so manual instructions survive page flips.
  var headerInstructionShowing = false;

  function dismissInstruction() {
    sendToProjector('dismiss-instruction');
    instructionShowing = false;
    headerInstructionShowing = false;
    document.getElementById('instruction-select').value = '';
  }

  document.getElementById('instruction-select').addEventListener('change', function() {
    var key = this.value;
    if (!key) return;
    var data = INSTRUCTION_DATA[key];
    if (data) {
      sendToProjector('show-instruction', data);
      instructionShowing = true;
      headerInstructionShowing = false; // manual card — don't auto-dismiss on page change
    }
  });

  document.getElementById('btn-dismiss-instruction').addEventListener('click', function() {
    dismissInstruction();
  });

  // Projector button
  var projectorBtn = document.getElementById('btn-projector');
  projectorBtn.addEventListener('click', function() {
    if (projectorOpen) {
      window.electronAPI.send('close-projector');
    } else {
      window.electronAPI.send('open-projector');
    }
  });

  window.electronAPI.on('projector-status', function(data) {
    projectorOpen = data.open;
    projectorBtn.textContent = projectorOpen ? '\uD83D\uDCFA Close Projector' : '\uD83D\uDCFA Open Projector';
    if (projectorOpen) {
      // Re-apply blank overlay, then render behind it (maintain pre-play blank state)
      sendToProjector('countdown', { number: -1 });
      applyChantSettings(); // push current verse-zoom (#34) to the (re)opened projector
      syncProjectorPage();
    }
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    // Don't intercept if user is typing in an input/select
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

    if (e.code === 'Space') {
      e.preventDefault();
      var state = animator.getState();
      if (state.isPlaying) {
        animator.pause();
      } else {
        playWithCountdown();
      }
    } else if (e.code === 'ArrowRight') {
      nextPage();
    } else if (e.code === 'ArrowLeft') {
      restartChapter();
    } else if (e.code === 'KeyR') {
      animator.reset();
      sendToProjector('animation-reset');
    } else if (e.key === '+' || e.key === '=') {
      animator.setBpm(animator.getState().bpm + 20);
      noteManualTempoChange();
      updateSpmDisplay();
    } else if (e.key === '-' || e.key === '_') {
      animator.setBpm(animator.getState().bpm - 20);
      noteManualTempoChange();
      updateSpmDisplay();
    } else if (e.code === 'Escape') {
      if (instructionShowing) {
        dismissInstruction();
      }
    }
  });

  // --- Settings panel ---
  var settingsOverlay = document.getElementById('settings-overlay');
  var settingsSectionList = document.getElementById('settings-section-list');
  var fldColophon = document.getElementById('set-colophon');
  var fldHeaderSlow = document.getElementById('set-header-slow');
  var fldCountdown = document.getElementById('set-countdown');
  var fldChapterGap = document.getElementById('set-chapter-gap');
  var fldVerseZoom = document.getElementById('set-verse-zoom');
  var fldHeaderPause = document.getElementById('set-header-pause');
  var fldAnustubh = document.getElementById('set-anustubh-pause');
  var fldTristubh = document.getElementById('set-tristubh-pause');
  var fldUvaca = document.getElementById('set-uvaca-pause');
  var fldMahatmyam = document.getElementById('set-mahatmyam-pause');
  var fldTheme = document.getElementById('set-theme');

  // Build the per-section BPM rows once (label + number input keyed by chapterId).
  // Displayed value is BPM = internal bpm / 4 (matches the rest of the UI); we store
  // internal = BPM * 4. Section labels reuse the chapter dropdown's option text.
  var sectionBpmInputs = {}; // chapterId -> input element
  function buildSectionBpmRows() {
    while (settingsSectionList.firstChild) settingsSectionList.removeChild(settingsSectionList.firstChild);
    sectionBpmInputs = {};
    var labelById = {};
    for (var oi = 0; oi < chapterSelect.options.length; oi++) {
      labelById[chapterSelect.options[oi].value] = chapterSelect.options[oi].textContent;
    }
    var order = dataLayer.CHAPTER_ORDER;
    for (var i = 0; i < order.length; i++) {
      var id = order[i];
      var row = document.createElement('div');
      row.className = 'settings-section-row';

      var lbl = document.createElement('span');
      lbl.className = 'settings-section-name';
      lbl.textContent = labelById[id] || id;
      row.appendChild(lbl);

      var inp = document.createElement('input');
      inp.type = 'number';
      inp.min = '10';
      inp.max = '150';
      inp.step = '1';
      inp.placeholder = 'manual';
      inp.dataset.chapterId = id;
      row.appendChild(inp);

      sectionBpmInputs[id] = inp;
      settingsSectionList.appendChild(row);
    }
  }

  // Effective internal BPM for a section: Settings override, else data defaultBpm.
  // Returns null when neither is known (sections without a defaultBpm → "manual").
  // Internal bpm = display BPM × 4. Defaults per the parayana team's BPM/pause table:
  // Dhyana 60, Ch1 75, Ch2 80, Ch3–15 85, Ch16 80, Ch17–18 75, Datta Stavam 75,
  // Invocation 65, Mahātmyam 75, Kshama Prārthana 75. Keep in sync with each section's
  // data defaultBpm.
  var DATA_DEFAULT_BPM = {
    datta_stavam: 300, invocation_prayers: 260, '0': 240, '1': 300,
    '2': 320, '3': 340, '4': 340, '5': 340, '6': 340, '7': 340, '8': 340,
    '9': 340, '10': 340, '11': 340, '12': 340, '13': 340, '14': 340,
    '15': 340, '16': 320, '17': 300, '18': 300, gita_mahatmyam: 300,
    kshama_prarthana: 300
  };
  function effectiveSectionBpm(id) {
    if (typeof chantSettings.sectionBpm[id] === 'number') return chantSettings.sectionBpm[id];
    if (typeof DATA_DEFAULT_BPM[id] === 'number') return DATA_DEFAULT_BPM[id];
    return null;
  }

  // Populate all settings inputs from the current chantSettings.
  function refreshSettingsInputs() {
    fldColophon.value = chantSettings.colophonBpmDrop / 4;  // stored internal bpm → shown in BPM
    if (fldHeaderSlow) fldHeaderSlow.value = chantSettings.headerBpmDrop / 4;  // stored internal bpm → shown in BPM
    fldCountdown.value = chantSettings.countdownSeconds;
    fldChapterGap.value = chantSettings.chapterGapSeconds;
    if (fldVerseZoom) fldVerseZoom.value = chantSettings.verseZoom;
    if (fldHeaderPause) fldHeaderPause.value = chantSettings.headerPauseBeats;
    if (fldAnustubh) fldAnustubh.value = chantSettings.anustubhBeats;
    if (fldTristubh) fldTristubh.value = chantSettings.tristubhBeats;
    if (fldUvaca) fldUvaca.value = chantSettings.uvacaBeats;
    if (fldMahatmyam) fldMahatmyam.value = chantSettings.mahatmyamBeats;
    if (fldTheme) fldTheme.value = chantSettings.theme;
    for (var id in sectionBpmInputs) {
      if (!Object.prototype.hasOwnProperty.call(sectionBpmInputs, id)) continue;
      var internal = effectiveSectionBpm(id);
      sectionBpmInputs[id].value = (internal === null) ? '' : Math.round(internal / 4);
    }
  }

  function openSettings() {
    refreshSettingsInputs();
    settingsOverlay.style.display = 'flex';
  }
  function closeSettings() {
    settingsOverlay.style.display = 'none';
  }

  function clampNum(val, min, max, fallback) {
    var n = parseFloat(val);
    if (isNaN(n)) return fallback;
    return Math.max(min, Math.min(max, n));
  }

  function saveSettings() {
    chantSettings.colophonBpmDrop = Math.round(clampNum(fldColophon.value, 0, 20, 0)) * 4;  // BPM field → internal bpm
    if (fldHeaderSlow) chantSettings.headerBpmDrop = Math.round(clampNum(fldHeaderSlow.value, 0, 20, CHANT_DEFAULTS.headerBpmDrop / 4) / 5) * 5 * 4;  // BPM field (5-BPM steps) → internal bpm
    chantSettings.countdownSeconds = Math.round(clampNum(fldCountdown.value, 0, 15, CHANT_DEFAULTS.countdownSeconds));
    chantSettings.chapterGapSeconds = clampNum(fldChapterGap.value, 0, 15, CHANT_DEFAULTS.chapterGapSeconds);
    if (fldVerseZoom) chantSettings.verseZoom = Math.round(clampNum(fldVerseZoom.value, 50, 250, CHANT_DEFAULTS.verseZoom));
    if (fldHeaderPause) chantSettings.headerPauseBeats = clampNum(fldHeaderPause.value, 0, 12, CHANT_DEFAULTS.headerPauseBeats);
    if (fldAnustubh) chantSettings.anustubhBeats = clampNum(fldAnustubh.value, 0, 12, CHANT_DEFAULTS.anustubhBeats);
    if (fldTristubh) chantSettings.tristubhBeats = clampNum(fldTristubh.value, 0, 12, CHANT_DEFAULTS.tristubhBeats);
    if (fldUvaca) chantSettings.uvacaBeats = clampNum(fldUvaca.value, 0, 12, CHANT_DEFAULTS.uvacaBeats);
    if (fldMahatmyam) chantSettings.mahatmyamBeats = clampNum(fldMahatmyam.value, 0, 12, CHANT_DEFAULTS.mahatmyamBeats);
    if (fldTheme) chantSettings.theme = (fldTheme.value === 'light') ? 'light' : 'dark';

    // Per-section BPM: a value present → store internal = BPM*4; blank → clear override.
    chantSettings.sectionBpm = {};
    for (var id in sectionBpmInputs) {
      if (!Object.prototype.hasOwnProperty.call(sectionBpmInputs, id)) continue;
      var raw = sectionBpmInputs[id].value;
      if (raw !== '' && raw !== null && !isNaN(parseFloat(raw))) {
        var spm = clampNum(raw, 10, 150, 95);
        chantSettings.sectionBpm[id] = Math.round(spm) * 4;
      }
    }

    saveChantSettings();
    applyChantSettings();

    // If an EXPLICIT per-section override exists for the current chapter, re-apply it
    // immediately. With no override, leave the running tempo untouched — never pull
    // from DATA_DEFAULT_BPM here (that map is for panel pre-fill hints only), so a
    // live BPM nudge survives saving an unrelated setting.
    var curId = dataLayer.getCurrentChapterId();
    if (curId !== null) {
      var override = chantSettings.sectionBpm[String(curId)];
      if (typeof override === 'number') {
        animator.setBpm(override);
        currentChapterBpm = animator.getState().bpm;
        closerSlowApplied = false;
        currentPageBpmDrop = 0;
        updateSpmDisplay();
      }
    }

    // Re-render the current page so changed line-end pauses take effect immediately
    // (the renderer encodes pauses into dataset at render time) — but do it WITHOUT
    // resetting the pointer. Settings can be changed mid-session: the animation keeps
    // its position and resumes if it was playing. This mirrors the display-mode switch,
    // which preserves state via animator.getState()/restore() instead of the hard
    // animator.reset() inside showPage(). The projector keeps its current render (pause
    // tweaks don't change syllable indices, so it stays in sync as the operator drives
    // the ongoing animation); verse-zoom/theme were already pushed live by
    // applyChantSettings() above.
    if (dataLayer.getCurrentChapterId() !== null && dataLayer.getPage(currentPage)) {
      var savedAnimState = animator.getState();
      renderer.invalidatePrefetch();
      renderer.renderPage(dataLayer.getPage(currentPage));
      animator.restore(savedAnimState);
      var reNextIdx = currentPage + 1;
      if (reNextIdx < dataLayer.getPageCount()) {
        renderer.prefetchPage(reNextIdx, dataLayer.getCurrentChapterId());
      }
    }

    closeSettings();
  }

  function resetSettings() {
    try { window.localStorage.removeItem('gitaChantSettings'); } catch (e) {}
    chantSettings = loadChantSettings(); // no stored key now → CHANT_DEFAULTS
    applyChantSettings();
    refreshSettingsInputs();
  }

  buildSectionBpmRows();
  document.getElementById('btn-settings').addEventListener('click', openSettings);
  document.getElementById('btn-settings-save').addEventListener('click', saveSettings);
  document.getElementById('btn-settings-reset').addEventListener('click', resetSettings);
  document.getElementById('btn-settings-close').addEventListener('click', closeSettings);
  settingsOverlay.addEventListener('click', function(e) {
    if (e.target === settingsOverlay) closeSettings(); // click backdrop to dismiss
  });

  // --- Init ---
  applyChantSettings();              // push pace config + theme before the first render
  loadChapter('datta_stavam', true); // start with blank projector until Play
})();
