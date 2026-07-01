'use strict';

(function() {
  var pageReady = false; // true once render-page has completed
  var pendingUpdates = []; // queued syllable-updates that arrived before page was ready

  // render-page: load chapter and render a specific page
  window.electronAPI.on('render-page', function(data) {
    pageReady = false;
    dataLayer.fetchChapter(data.chapter).then(function() {
      if (data.displayMode) {
        renderer.setMode(data.displayMode);
      }
      var page = dataLayer.getPage(data.pageIndex);
      if (page) {
        renderer.renderPage(page);
      }
      pageReady = true;
      // Flush any syllable updates that arrived during fetch
      for (var i = 0; i < pendingUpdates.length; i++) {
        applySyllableUpdate(pendingUpdates[i]);
      }
      pendingUpdates = [];
    }).catch(function(err) {
      console.error('[projector] render-page fetch failed:', err);
      pageReady = true; // unblock so future updates aren't stuck
      pendingUpdates = [];
    });
  });

  // --- Pointer positioning ---
  var pointer = document.getElementById('pointer');
  var lastPointerLine = -1; // track which line the pointer is on for line-change detection

  function positionPointerAbove(el, beatMs, durationMs) {
    var rect = el.getBoundingClientRect();
    var newTop = (rect.top - 40) + 'px';
    var isEnglish = renderer.getMode() === 'english';

    if (isEnglish && durationMs) {
      // English mode: snap to left edge of element, sweep to right over full duration
      pointer.style.transition = 'none';
      pointer.style.left = (rect.left - 18) + 'px';
      pointer.style.top = newTop;
      pointer.style.display = 'block';
      pointer.offsetWidth; // force reflow — commits snap before sweep starts
      pointer.style.transition = 'left ' + (durationMs / 1000) + 's linear';
      pointer.style.left = (rect.right - 18) + 'px';
      lastPointerLine = rect.top;
      return;
    }

    // Asterisk mode — ahead-prediction model:
    //   1. Snap to center of THIS syllable (clean start, no cross-line carry-over)
    //   2. Immediately glide toward center of NEXT same-line syllable over this syllable's full duration
    //      (so the pointer arrives at the next syllable exactly when it becomes active)
    //   3. If this is the last syllable on its line, glide to the right edge instead
    pointer.style.transition = 'none';
    pointer.style.left = (rect.left + rect.width / 2 - 18) + 'px';
    pointer.style.top = newTop;
    pointer.style.display = 'block';
    pointer.offsetWidth; // force reflow — commits snap, clears any in-progress glide
    lastPointerLine = rect.top;

    // Find the next non-marker syllable on the SAME display line
    var elems = renderer.getSyllableElements();
    var idx = parseInt(el.dataset.index, 10);
    var nextSameLineEl = null;
    if (!isNaN(idx)) {
      for (var ni = idx + 1; ni < elems.length; ni++) {
        if (!elems[ni].classList.contains('verse-marker')) {
          var nr = elems[ni].getBoundingClientRect();
          if (Math.abs(nr.top - rect.top) < 15) {
            nextSameLineEl = elems[ni];
          }
          break; // stop at first non-marker regardless of line
        }
        // skip markers, keep searching
      }
    }

    var glideMs = durationMs || beatMs || 200;
    if (nextSameLineEl) {
      // Glide toward center of next syllable on this line
      var nr = nextSameLineEl.getBoundingClientRect();
      pointer.style.transition = 'left ' + (glideMs / 1000) + 's linear';
      pointer.style.left = (nr.left + nr.width / 2 - 18) + 'px';
    } else {
      // Last syllable on this line: glide to its right edge to signal line completion
      pointer.style.transition = 'left ' + (glideMs / 1000) + 's linear';
      pointer.style.left = (rect.right - 18) + 'px';
    }
  }

  function hidePointer() {
    pointer.style.display = 'none';
    lastPointerLine = -1;
  }

  // syllable-update: highlight individual syllables
  function applySyllableUpdate(data) {
    var elems = renderer.getSyllableElements();
    if (data.index >= 0 && data.index < elems.length) {
      if (data.state === 'active') {
        elems[data.index].classList.add('active');
        positionPointerAbove(elems[data.index], data.beatMs, data.durationMs);
      } else if (data.state === 'done') {
        elems[data.index].classList.remove('active');
        elems[data.index].classList.add('done');
      }
    }
  }

  window.electronAPI.on('syllable-update', function(data) {
    if (!pageReady) {
      pendingUpdates.push(data);
      return;
    }
    applySyllableUpdate(data);
  });

  // animation-reset: clear all highlights
  window.electronAPI.on('animation-reset', function() {
    var elems = renderer.getSyllableElements();
    for (var i = 0; i < elems.length; i++) {
      elems[i].classList.remove('active');
      elems[i].classList.remove('done');
    }
    hidePointer();
  });

  // countdown: show/hide countdown overlay
  // number > 0: show with digit; number = 0: hide; number < 0: blank black screen (pre-countdown)
  window.electronAPI.on('countdown', function(data) {
    var overlay = document.getElementById('countdown-overlay');
    var numberEl = overlay.querySelector('.countdown-number');
    if (data.number > 0) {
      numberEl.textContent = data.number;
      overlay.style.display = 'flex';
    } else if (data.number === 0) {
      overlay.style.display = 'none';
    } else {
      // Blank screen before countdown — hide chapter content behind opaque overlay
      numberEl.textContent = '';
      overlay.style.display = 'flex';
    }
  });

  // display-mode: switch asterisk/english
  window.electronAPI.on('display-mode', function(data) {
    renderer.setMode(data.mode);
    hidePointer(); // reset pointer state so next active syllable snaps cleanly
  });

  // verse-zoom: operator-controlled verse text zoom (#34)
  window.electronAPI.on('verse-zoom', function(data) {
    document.documentElement.style.setProperty('--verse-zoom', String(data.scale || 1));
  });

  // theme: operator-controlled dark/light projector theme (#37)
  window.electronAPI.on('theme', function(data) {
    if (data && data.theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  });

  // spm-change: pace indicator watermark
  window.electronAPI.on('spm-change', function(data) {
    var el = document.getElementById('pace-indicator');
    if (data.indicator) {
      el.textContent = data.indicator;
      el.style.display = 'block';
    } else {
      el.style.display = 'none';
    }
  });

  // show-instruction: display instruction overlay
  window.electronAPI.on('show-instruction', function(data) {
    var overlay = document.getElementById('instruction-overlay');
    var content = overlay.querySelector('.instruction-content');
    while (content.firstChild) content.removeChild(content.firstChild);

    if (data.image) {
      var img = document.createElement('img');
      img.className = 'instruction-image';
      img.src = data.image;
      img.alt = data.text || '';
      content.appendChild(img);
    }
    if (data.text) {
      var div = document.createElement('div');
      div.className = 'instruction-text';
      if (data.color) div.style.color = data.color;
      div.textContent = data.text;
      content.appendChild(div);
    }
    overlay.style.display = 'flex';
  });

  // dismiss-instruction: hide overlay
  window.electronAPI.on('dismiss-instruction', function() {
    document.getElementById('instruction-overlay').style.display = 'none';
  });
})();
