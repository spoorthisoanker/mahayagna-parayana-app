// shared.js — Extracted from index.html
// Contains: EMBEDDED_DHYANA, prosody, iastProsody, dataLayer, renderer, animator
// Used by both operator.html and projector.html
'use strict';

// ============================================================
// Embedded Data — Gita Dhyana Shlokas (Chapter 00)
// ============================================================
const EMBEDDED_DHYANA = {
  "name": "गीता  ध्यान  श्लोकाः",
  "chapterNum": "00",
  "defaultBpm": 300,
  "shloka": [
    {
      "shlokaNum": "",
      "entry": [
        {"startTime":"1.12327","endTime":"7.71510","swhtsp":"l","shlNbr":"00","sty":"fh","text":"ओं  श्री  परमात्मने नमः","iast":"ōṃ  śrī  paramātmanē namaḥ"},
        {"startTime":"8.22857","endTime":"13.4098","swhtsp":"","shlNbr":"00","sty":"th","text":"अथ गीता  ध्यान  श्लोकाः","iast":"atha gītā  dhyāna  ślōkāḥ"}
      ]
    },
    {
      "shlokaNum": "1",
      "meter": "tristubh",
      "entry": [
        {"startTime":"14.2367","endTime":"27.7249","swhtsp":"l","shlNbr":"00","sty":"","text":"ओं  पार्थाय  प्रतिबोधितां   भगवता","iast":"ōṃ  pārthāya  pratibōdhitāṃ   bhagavatā"},
        {"startTime":"14.2367","endTime":"27.7249","swhtsp":"l","shlNbr":"00","sty":"","cont":true,"text":"नारायणेन  स्वयं","iast":"nārāyaṇēna  svayaṃ"},
        {"startTime":"28.2384","endTime":"39.5845","swhtsp":"l","shlNbr":"00","sty":"","text":"व्यासेन  ग्रथितां  पुराणमुनिना","iast":"vyāsēna  grathitāṃ  purāṇamuninā"},
        {"startTime":"28.2384","endTime":"39.5845","swhtsp":"l","shlNbr":"00","sty":"","cont":true,"text":"मध्ये  महाभारतम् |","iast":"madhyē  mahābhāratam |"},
        {"startTime":"40.2547","endTime":"51.9404","swhtsp":"l","shlNbr":"00","sty":"","text":"अद्वैतामृतवर्षिणीं  भगवतीम्","iast":"advaitāmṛtavarṣiṇīṃ  bhagavatīm"},
        {"startTime":"40.2547","endTime":"51.9404","swhtsp":"l","shlNbr":"00","sty":"","cont":true,"text":"अष्टादशाध्यायिनीं","iast":"aṣṭādaśādhyāyinīṃ"},
        {"startTime":"52.5845","endTime":"63.9045","swhtsp":"l","shlNbr":"00","sty":"","text":"अम्ब  त्वाम्  अनुसन्दधामि","iast":"amba  tvām  anusandadhāmi"},
        {"startTime":"52.5845","endTime":"63.9045","swhtsp":"","shlNbr":"00","sty":"","cont":true,"text":"भगवद्गीते  भवद्वेषिणीम् ||","iast":"bhagavadgītē  bhavadvēṣiṇīm ||"}
      ]
    },
    {
      "shlokaNum": "2",
      "meter": "tristubh",
      "entry": [
        {"startTime":"64.4702","endTime":"77.0441","swhtsp":"l","shlNbr":"00","sty":"","text":"नमोऽस्तुते  व्यास  विशालबुद्धे","iast":"namō'stutē  vyāsa  viśālabuddhē"},
        {"startTime":"64.4702","endTime":"77.0441","swhtsp":"l","shlNbr":"00","sty":"","cont":true,"text":"फुल्लारविन्दायतपत्रनेत्र |","iast":"phullāravindāyatapatranētra |"},
        {"startTime":"77.6098","endTime":"89.9486","swhtsp":"l","shlNbr":"00","sty":"","text":"येन त्वया भारत तैलपूर्णः","iast":"yēna tvayā bhārata tailapūrṇaḥ"},
        {"startTime":"77.6098","endTime":"89.9486","swhtsp":"","shlNbr":"00","sty":"","cont":true,"text":"प्रज्वालितो ज्ञानमयः  प्रदीपः||","iast":"prajvālitō jñānamayaḥ  pradīpaḥ||"}
      ]
    },
    {
      "shlokaNum": "3",
      "meter": "anustubh",
      "entry": [
        {"startTime":"90.6188","endTime":"99.5878","swhtsp":"l","shlNbr":"00","sty":"","text":"प्रपन्नपारिजाताय","iast":"prapannapārijātāya"},
        {"startTime":"90.6188","endTime":"99.5878","swhtsp":"l","shlNbr":"00","sty":"","cont":true,"text":"तोत्रवेत्रैकपाणये |","iast":"tōtravētraikapāṇayē |"},
        {"startTime":"100.075","endTime":"109.802","swhtsp":"l","shlNbr":"00","sty":"","text":"ज्ञानमुद्राय  कृष्णाय","iast":"jñānamudrāya  kṛṣṇāya"},
        {"startTime":"100.075","endTime":"109.802","swhtsp":"","shlNbr":"00","sty":"","cont":true,"text":"गीतामृतदुहे  नमः ||","iast":"gītāmṛtaduhē  namaḥ ||"}
      ]
    },
    {
      "shlokaNum": "4",
      "meter": "anustubh",
      "entry": [
        {"startTime":"110.629","endTime":"119.519","swhtsp":"l","shlNbr":"00","sty":"","text":"वसुदेवसुतं  देवं","iast":"vasudēvasutaṃ  dēvaṃ"},
        {"startTime":"110.629","endTime":"119.519","swhtsp":"l","shlNbr":"00","sty":"","cont":true,"text":"कंसचाणूरमर्दनम् |","iast":"kaṃsacāṇūramardanam |"},
        {"startTime":"120.033","endTime":"130.203","swhtsp":"l","shlNbr":"00","sty":"","text":"देवकीपरमानन्दं","iast":"dēvakīparamānandaṃ"},
        {"startTime":"120.033","endTime":"130.203","swhtsp":"","shlNbr":"00","sty":"","cont":true,"text":"कृष्णं  वन्दे  जगद्गुरुम् ||","iast":"kṛṣṇaṃ  vandē  jagadgurum ||"}
      ]
    },
    {
      "shlokaNum": "5",
      "meter": "tristubh",
      "entry": [
        {"startTime":"130.926","endTime":"142.037","swhtsp":"l","shlNbr":"00","sty":"","text":"भीष्मद्रोणतटा  जयद्रथजला","iast":"bhīṣmadrōṇataṭā  jayadrathajalā"},
        {"startTime":"130.926","endTime":"142.037","swhtsp":"l","shlNbr":"00","sty":"","cont":true,"text":"गान्धारनीलोत्पला","iast":"gāndhāranīlōtpalā"},
        {"startTime":"142.55","endTime":"153.217","swhtsp":"l","shlNbr":"00","sty":"","text":"शल्यग्राहवती  कृपेण  वहनी","iast":"śalyagrāhavatī  kṛpēṇa  vahanī"},
        {"startTime":"142.55","endTime":"153.217","swhtsp":"l","shlNbr":"00","sty":"","cont":true,"text":"कर्णेन  वेलाकुला |","iast":"karṇēna  vēlākulā |"},
        {"startTime":"153.731","endTime":"163.536","swhtsp":"l","shlNbr":"00","sty":"","text":"अश्वत्थामविकर्णघोरमकरा","iast":"aśvatthāmavikarṇaghōramakarā"},
        {"startTime":"153.731","endTime":"163.536","swhtsp":"l","shlNbr":"00","sty":"","cont":true,"text":"दुर्योधनावर्तिनी","iast":"duryōdhanāvartinī"},
        {"startTime":"164.153","endTime":"175.108","swhtsp":"l","shlNbr":"00","sty":"","text":"सोत्तीर्णा  खलु  पाण्डवै   रणनदी","iast":"sōttīrṇā  khalu  pāṇḍavai   raṇanadī"},
        {"startTime":"164.153","endTime":"175.108","swhtsp":"","shlNbr":"00","sty":"","cont":true,"text":"कैवर्तकः  केशवः ||","iast":"kaivartakaḥ  kēśavaḥ ||"}
      ]
    },
    {
      "shlokaNum": "6",
      "meter": "tristubh",
      "entry": [
        {"startTime":"175.595","endTime":"185.635","swhtsp":"l","shlNbr":"00","sty":"","text":"पाराशर्यवचः  सरोजममलं","iast":"pārāśaryavacaḥ  sarōjamamalaṃ"},
        {"startTime":"175.595","endTime":"185.635","swhtsp":"l","shlNbr":"00","sty":"","cont":true,"text":"गीतार्थगन्धोत्कटं","iast":"gītārthagandhōtkaṭaṃ"},
        {"startTime":"186.488","endTime":"196.946","swhtsp":"l","shlNbr":"00","sty":"","text":"नानाख्यानककेसरं  हरिकथा","iast":"nānākhyānakakēsaraṃ  harikathā"},
        {"startTime":"186.488","endTime":"196.946","swhtsp":"l","shlNbr":"00","sty":"","cont":true,"text":"सम्बोधनाबोधितम् |","iast":"sambōdhanābōdhitam |"},
        {"startTime":"197.564","endTime":"207.735","swhtsp":"l","shlNbr":"00","sty":"","text":"लोके  सज्जनषट्पदैरहरहः","iast":"lōkē  sajjanaṣaṭpadairaharahaḥ"},
        {"startTime":"197.564","endTime":"207.735","swhtsp":"l","shlNbr":"00","sty":"","cont":true,"text":"पेपीयमानं  मुदा","iast":"pēpīyamānaṃ  mudā"},
        {"startTime":"208.248","endTime":"218.001","swhtsp":"l","shlNbr":"00","sty":"","text":"भूयाद्भारतपङ्कजं  कलिमल","iast":"bhūyādbhāratapaṅkajaṃ  kalimala"},
        {"startTime":"208.248","endTime":"218.001","swhtsp":"","shlNbr":"00","sty":"","cont":true,"text":"प्रध्वंसिनः   श्रेयसे ||","iast":"pradhvaṃsinaḥ   śrēyasē ||"}
      ]
    },
    {
      "shlokaNum": "7",
      "meter": "anustubh",
      "entry": [
        {"startTime":"218.723","endTime":"226.700","swhtsp":"l","shlNbr":"00","sty":"","text":"मूकं  करोति  वाचालं","iast":"mūkaṃ  karōti  vācālaṃ"},
        {"startTime":"218.723","endTime":"226.700","swhtsp":"l","shlNbr":"00","sty":"","cont":true,"text":"पङ्गुं  लङ्घयते  गिरिम् |","iast":"paṅguṃ  laṅghayatē  girim |"},
        {"startTime":"227.082","endTime":"235.529","swhtsp":"l","shlNbr":"00","sty":"","text":"यत्कृपा  तमहं  वन्दे","iast":"yatkṛpā  tamahaṃ  vandē"},
        {"startTime":"227.082","endTime":"235.529","swhtsp":"","shlNbr":"00","sty":"","cont":true,"text":"परमानन्दमाधवम् ||","iast":"paramānandamādhavam ||"}
      ]
    },
    {
      "shlokaNum": "8",
      "meter": "tristubh",
      "entry": [
        {"startTime":"236.251","endTime":"244.280","swhtsp":"l","shlNbr":"00","sty":"","text":"शान्ताकारं  भुजगशयनं","iast":"śāntākāraṃ  bhujagaśayanaṃ"},
        {"startTime":"236.251","endTime":"244.280","swhtsp":"l","shlNbr":"00","sty":"","cont":true,"text":"पद्मनाभं  सुरेशं","iast":"padmanābhaṃ  surēśaṃ"},
        {"startTime":"244.689","endTime":"252.509","swhtsp":"l","shlNbr":"00","sty":"","text":"विश्वाधारं  गगनसदृशं","iast":"viśvādhāraṃ  gaganasadṛśaṃ"},
        {"startTime":"244.689","endTime":"252.509","swhtsp":"l","shlNbr":"00","sty":"","cont":true,"text":"मेघवर्णं  शुभाङ्गम् |","iast":"mēghavarṇaṃ  śubhāṅgam |"},
        {"startTime":"253.022","endTime":"260.868","swhtsp":"l","shlNbr":"00","sty":"","text":"लक्ष्मीकान्तं   कमलनयनं","iast":"lakṣmīkāntaṃ   kamalanayanaṃ"},
        {"startTime":"253.022","endTime":"260.868","swhtsp":"l","shlNbr":"00","sty":"","cont":true,"text":"योगिहृद्ध्यानगम्यं","iast":"yōgihṛddhyānagamyaṃ"},
        {"startTime":"261.329","endTime":"268.678","swhtsp":"l","shlNbr":"00","sty":"","text":"वन्दे  विष्णुं  भवभयहरं","iast":"vandē  viṣṇuṃ  bhavabhayaharaṃ"},
        {"startTime":"261.329","endTime":"268.678","swhtsp":"","shlNbr":"00","sty":"","cont":true,"text":"सर्व लोकैकनाथम् ||","iast":"sarva lōkaikanātham ||"}
      ]
    },
    {
      "shlokaNum": "9",
      "meter": "tristubh",
      "entry": [
        {"startTime":"269.322","endTime":"279.284","swhtsp":"l","shlNbr":"00","sty":"","text":"यं  ब्रह्मावरुणेन्द्ररुद्रमरुतः","iast":"yaṃ  brahmāvaruṇēndrarudramarutaḥ"},
        {"startTime":"269.322","endTime":"279.284","swhtsp":"l","shlNbr":"00","sty":"","cont":true,"text":"स्तुन्वन्ति  दिव्यैः  स्तवैः","iast":"stunvanti  divyaiḥ  stavaiḥ"},
        {"startTime":"279.719","endTime":"289.994","swhtsp":"l","shlNbr":"00","sty":"","text":"वेदैः  साङ्गपदक्रमोपनिषदैः","iast":"vēdaiḥ  sāṅgapadakramōpaniṣadaiḥ"},
        {"startTime":"279.719","endTime":"289.994","swhtsp":"l","shlNbr":"00","sty":"","cont":true,"text":"गायन्ति   यं  सामगाः |","iast":"gāyanti   yaṃ  sāmagāḥ |"},
        {"startTime":"290.482","endTime":"300.025","swhtsp":"l","shlNbr":"00","sty":"","text":"ध्यानावस्थित  तद्गतेन  मनसा","iast":"dhyānāvasthita  tadgatēna  manasā"},
        {"startTime":"290.482","endTime":"300.025","swhtsp":"l","shlNbr":"00","sty":"","cont":true,"text":"पश्यन्ति  यं  योगिनः","iast":"paśyanti  yaṃ  yōginaḥ"},
        {"startTime":"300.434","endTime":"310.814","swhtsp":"l","shlNbr":"00","sty":"","text":"यस्यान्तं  न  विदुस्सुरासुरगणाः","iast":"yasyāntaṃ  na  vidussurāsuragaṇāḥ"},
        {"startTime":"300.434","endTime":"310.814","swhtsp":"","shlNbr":"00","sty":"","cont":true,"text":"देवाय  तस्मै  नमः ||","iast":"dēvāya  tasmai  namaḥ ||"}
      ]
    },
    {
      "shlokaNum": "10",
      "meter": "anustubh",
      "entry": [
        {"startTime":"311.38","endTime":"319.042","swhtsp":"l","shlNbr":"00","sty":"","text":"नारायणं  नमस्कृत्य","iast":"nārāyaṇaṃ  namaskṛtya"},
        {"startTime":"311.38","endTime":"319.042","swhtsp":"l","shlNbr":"00","sty":"","cont":true,"text":"नरञ्चैव  नरोत्तमम् |","iast":"narañcaiva  narōttamam |"},
        {"startTime":"319.478","endTime":"328.264","swhtsp":"l","shlNbr":"00","sty":"","text":"देवीं  सरस्वतीं  व्यासं","iast":"dēvīṃ  sarasvatīṃ  vyāsaṃ"},
        {"startTime":"319.478","endTime":"328.264","swhtsp":"","shlNbr":"00","sty":"","cont":true,"text":"ततो  जयमुदीरयेत् ||","iast":"tatō  jayamudīrayēt ||"}
      ]
    },
    {
      "shlokaNum": "11",
      "meter": "anustubh",
      "entry": [
        {"startTime":"328.829","endTime":"337.798","swhtsp":"l","shlNbr":"00","sty":"","text":"सच्चिदानन्दरूपाय","iast":"saccidānandarūpāya"},
        {"startTime":"328.829","endTime":"337.798","swhtsp":"l","shlNbr":"00","sty":"","cont":true,"text":"कृष्णायाक्लिष्टकारिणे |","iast":"kṛṣṇāyākliṣṭakāriṇē |"},
        {"startTime":"338.26","endTime":"347.072","swhtsp":"l","shlNbr":"00","sty":"","text":"नमो  वेदान्तवेद्याय","iast":"namō  vēdāntavēdyāya"},
        {"startTime":"338.26","endTime":"347.072","swhtsp":"","shlNbr":"00","sty":"","cont":true,"text":"गुरवे  बुद्धिसाक्षिणे||","iast":"guravē  buddhisākṣiṇē||"}
      ]
    },
    {
      "shlokaNum": "12",
      "meter": "anustubh",
      "entry": [
        {"startTime":"347.664","endTime":"357.129","swhtsp":"l","shlNbr":"00","sty":"","text":"सर्वोपनिषदो  गावः","iast":"sarvōpaniṣadō  gāvaḥ"},
        {"startTime":"347.664","endTime":"357.129","swhtsp":"l","shlNbr":"00","sty":"","cont":true,"text":"दोग्धा  गोपालनन्दनः |","iast":"dōgdhā  gōpālanandanaḥ |"},
        {"startTime":"357.695","endTime":"367.578","swhtsp":"l","shlNbr":"00","sty":"","text":"पार्थो  वत्सः  सुधीर्भोक्ता","iast":"pārthō  vatsaḥ  sudhīrbhōktā"},
        {"startTime":"357.695","endTime":"367.578","swhtsp":"","shlNbr":"00","sty":"","cont":true,"text":"दुग्धं  गीतामृतं  महत् ||","iast":"dugdhaṃ  gītāmṛtaṃ  mahat ||"}
      ]
    },
    {
      "shlokaNum": "13",
      "meter": "anustubh",
      "entry": [
        {"startTime":"368.353","endTime":"377.635","swhtsp":"l","shlNbr":"00","sty":"","text":"गीताशास्त्रमिदं  पुण्यं","iast":"gītāśāstramidaṃ  puṇyaṃ"},
        {"startTime":"368.353","endTime":"377.635","swhtsp":"l","shlNbr":"00","sty":"","cont":true,"text":"यः  पठेत्   प्रयतः  पुमान् |","iast":"yaḥ  paṭhēt   prayataḥ  pumān |"},
        {"startTime":"378.018","endTime":"386.856","swhtsp":"l","shlNbr":"00","sty":"","text":"विष्णोः   पदमवाप्नोति","iast":"viṣṇōḥ   padamavāpnōti"},
        {"startTime":"378.018","endTime":"386.856","swhtsp":"","shlNbr":"00","sty":"","cont":true,"text":"भयशोकादि  वर्जितः  ||","iast":"bhayaśōkādi  varjitaḥ  ||"}
      ]
    },
    {
      "shlokaNum": "14",
      "meter": "tristubh",
      "entry": [
        {"startTime":"387.5","endTime":"399.405","swhtsp":"l","shlNbr":"00","sty":"","text":"एकं  शास्त्रं  देवकीपुत्रगीतं","iast":"ēkaṃ  śāstraṃ  dēvakīputragītaṃ"},
        {"startTime":"387.5","endTime":"399.405","swhtsp":"l","shlNbr":"00","sty":"","cont":true,"text":"एको  देवो  देवकीपुत्र  एव |","iast":"ēkō  dēvō  dēvakīputra  ēva |"},
        {"startTime":"399.909","endTime":"410.706","swhtsp":"l","shlNbr":"00","sty":"","text":"एको  मन्त्रस्तस्य  नामानि  यानि","iast":"ēkō  mantrastasya  nāmāni  yāni"},
        {"startTime":"399.909","endTime":"410.706","swhtsp":"","shlNbr":"00","sty":"","cont":true,"text":"कर्माप्येकं  तस्य  देवस्य  सेवा ||","iast":"karmāpyēkaṃ  tasya  dēvasya  sēvā ||"}
      ]
    },
    {
      "shlokaNum": "15",
      "entry": [
        {"startTime":"411.22","endTime":"417.992","swhtsp":"l","shlNbr":"00","sty":"uh","text":"|| ओं   श्री कृष्णाय   परमात्मने  नमः ||","iast":"|| ōṃ   śrī kṛṣṇāya   paramātmanē  namaḥ ||"}
      ]
    }
  ]
};

// ============================================================
// Task 2: Sanskrit Prosody Engine
// ============================================================
const prosody = (function() {
  'use strict';

  // --- Unicode helpers for Devanagari ---
  function isConsonant(ch) {
    const c = ch.charCodeAt(0);
    return (c >= 0x0915 && c <= 0x0939) ||
           c === 0x0933 ||
           (c >= 0x0958 && c <= 0x095F);
  }

  function isVowel(ch) {
    const c = ch.charCodeAt(0);
    return (c >= 0x0904 && c <= 0x0914);
  }

  function isVowelSign(ch) {
    const c = ch.charCodeAt(0);
    return (c >= 0x093E && c <= 0x094C) ||
           (c >= 0x0962 && c <= 0x0963);
  }

  function isVirama(ch) {
    return ch === '\u094D';
  }

  function isAnusvara(ch) {
    return ch === '\u0902';
  }

  function isVisarga(ch) {
    return ch === '\u0903';
  }

  function isChandrabindu(ch) {
    return ch === '\u0901';
  }

  // Long vowels and their dependent (matra) forms
  const LONG_VOWELS = new Set(['आ', 'ई', 'ऊ', 'ॠ', 'ॡ', 'ए', 'ऐ', 'ओ', 'औ']);
  const LONG_VOWEL_SIGNS = new Set([
    '\u093E', // aa
    '\u0940', // ii
    '\u0942', // uu
    '\u0944', // RR
    '\u0963', // LL
    '\u0947', // e
    '\u0948', // ai
    '\u094B', // o
    '\u094C', // au
  ]);

  /**
   * splitSyllables(word) — Split a Devanagari word into syllable strings.
   *
   * Consonant: consume virama+consonant conjuncts, then vowel sign (or implicit 'a'),
   * then anusvara/visarga/chandrabindu = one syllable.
   * Standalone vowel: consume + anusvara/visarga = one syllable.
   * Skip non-Devanagari characters.
   */
  function splitSyllables(word) {
    const syllables = [];
    const chars = Array.from(word); // handle multi-code-unit chars properly
    let i = 0;

    while (i < chars.length) {
      const ch = chars[i];

      if (isConsonant(ch)) {
        // Start of a consonant-based syllable
        let syl = ch;
        i++;

        // Consume virama + consonant conjuncts
        while (i < chars.length && isVirama(chars[i])) {
          syl += chars[i]; // virama
          i++;
          if (i < chars.length && isConsonant(chars[i])) {
            syl += chars[i]; // next consonant in conjunct
            i++;
          }
        }

        // Consume vowel sign (matra) if present, otherwise implicit 'a'
        if (i < chars.length && isVowelSign(chars[i])) {
          syl += chars[i];
          i++;
        }

        // Consume anusvara, visarga, chandrabindu
        while (i < chars.length && (isAnusvara(chars[i]) || isVisarga(chars[i]) || isChandrabindu(chars[i]))) {
          syl += chars[i];
          i++;
        }

        syllables.push(syl);

      } else if (isVowel(ch)) {
        // Standalone vowel syllable
        let syl = ch;
        i++;

        // Consume anusvara, visarga, chandrabindu
        while (i < chars.length && (isAnusvara(chars[i]) || isVisarga(chars[i]) || isChandrabindu(chars[i]))) {
          syl += chars[i];
          i++;
        }

        syllables.push(syl);

      } else {
        // Skip non-Devanagari (spaces, punctuation, nukta, etc.)
        i++;
      }
    }

    return syllables;
  }

  /**
   * isGuru(syllable, nextSyllable) — Determine if a syllable is guru (heavy).
   *
   * Guru if:
   * - Contains a long vowel or long vowel sign
   * - Contains anusvara or visarga
   * - Next syllable starts with 2+ consonants (positional weight from conjunct)
   */
  function isGuru(syllable, nextSyllable) {
    const sylChars = Array.from(syllable);

    // Check for long vowel (independent form)
    for (const ch of sylChars) {
      if (LONG_VOWELS.has(ch)) return true;
    }

    // Check for long vowel sign (dependent matra)
    for (const ch of sylChars) {
      if (LONG_VOWEL_SIGNS.has(ch)) return true;
    }

    // Check for anusvara or visarga
    for (const ch of sylChars) {
      if (isAnusvara(ch) || isVisarga(ch)) return true;
    }

    // Check positional weight: next syllable starts with 2+ consonants
    if (nextSyllable) {
      const nextChars = Array.from(nextSyllable);
      let consonantCount = 0;
      for (const ch of nextChars) {
        if (isConsonant(ch)) {
          consonantCount++;
        } else if (isVirama(ch)) {
          // virama between consonants in conjunct — continue counting
          continue;
        } else {
          break;
        }
      }
      if (consonantCount >= 2) return true;
    }

    return false;
  }

  /**
   * analyzeLine(text) — Analyze a full line of Sanskrit text.
   *
   * Returns array of token objects:
   * { text, beats, isMarker, isGuru, wordEnd }
   *
   * Words "|" or "||" become markers with 2 or 4 beats.
   * Other words are split into syllables and classified.
   */
  function analyzeLine(text) {
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const tokens = [];

    for (let wi = 0; wi < words.length; wi++) {
      const word = words[wi];

      // Check for verse markers
      if (word === '|' || word === '||') {
        tokens.push({
          text: word,
          beats: word === '||' ? 4 : 2,
          isMarker: true,
          isGuru: false,
          wordEnd: true
        });
        continue;
      }

      const syllables = splitSyllables(word);

      for (let si = 0; si < syllables.length; si++) {
        const syl = syllables[si];
        // Next syllable: within same word or first syllable of next non-marker word
        let nextSyl = null;
        if (si + 1 < syllables.length) {
          nextSyl = syllables[si + 1];
        } else {
          // Look at the next word's first syllable
          for (let nw = wi + 1; nw < words.length; nw++) {
            if (words[nw] !== '|' && words[nw] !== '||') {
              const nextWordSyls = splitSyllables(words[nw]);
              if (nextWordSyls.length > 0) {
                nextSyl = nextWordSyls[0];
              }
              break;
            }
          }
        }

        const guru = isGuru(syl, nextSyl);
        tokens.push({
          text: syl,
          beats: guru ? 2 : 1,
          isMarker: false,
          isGuru: guru,
          wordEnd: si === syllables.length - 1
        });
      }
    }

    // Pāda-end guru rule: syllable immediately before a marker is always guru
    for (let ti = 1; ti < tokens.length; ti++) {
      if (tokens[ti].isMarker && !tokens[ti - 1].isMarker) {
        tokens[ti - 1].isGuru = true;
        tokens[ti - 1].beats = 2;
      }
    }

    return tokens;
  }

  return { splitSyllables, isGuru, analyzeLine };
})();

// ============================================================
// IAST/ISO 15919 Prosody Engine (for chapters without Devanagari)
// ============================================================
const iastProsody = (function() {
  'use strict';

  // Regex patterns for IAST character classification (case-insensitive matching)
  const VOWEL_RE = /^(ai|au|ā|ī|ū|ṝ|ḹ|ē|ō|a|i|u|ṛ|ḷ|e|o)/i;
  const CONSONANT_RE = /^(kh|gh|ch|jh|ṭh|ḍh|th|dh|ph|bh|k|g|ṅ|c|j|ñ|ṭ|ḍ|ṇ|t|d|n|p|b|m|y|r|l|v|ś|ṣ|s|h)/i;
  const ANUSVARA_RE = /^[ṁṃ]/;
  const VISARGA_RE = /^ḥ/;
  const LONG_VOWELS = new Set(['ā', 'ī', 'ū', 'ṝ', 'ḹ', 'ē', 'ō', 'ai', 'au', 'e', 'o']);

  function splitSyllables(word) {
    const syllables = [];
    let i = 0;
    const lower = word.toLowerCase();

    while (i < lower.length) {
      let m = lower.slice(i).match(CONSONANT_RE);
      if (m) {
        let syl = '';
        let sylLen = 0;
        // Consume consonant cluster
        while (i + sylLen < lower.length) {
          m = lower.slice(i + sylLen).match(CONSONANT_RE);
          if (!m) break;
          syl += word.slice(i + sylLen, i + sylLen + m[0].length);
          sylLen += m[0].length;
        }
        // Consume vowel
        m = lower.slice(i + sylLen).match(VOWEL_RE);
        if (m) {
          syl += word.slice(i + sylLen, i + sylLen + m[0].length);
          sylLen += m[0].length;
        }
        // Consume anusvara/visarga
        m = lower.slice(i + sylLen).match(ANUSVARA_RE) || lower.slice(i + sylLen).match(VISARGA_RE);
        if (m) {
          syl += word.slice(i + sylLen, i + sylLen + m[0].length);
          sylLen += m[0].length;
        }
        if (syl) syllables.push(syl);
        i += sylLen;
      } else {
        m = lower.slice(i).match(VOWEL_RE);
        if (m) {
          let syl = word.slice(i, i + m[0].length);
          let sylLen = m[0].length;
          let m2 = lower.slice(i + sylLen).match(ANUSVARA_RE) || lower.slice(i + sylLen).match(VISARGA_RE);
          if (m2) {
            syl += word.slice(i + sylLen, i + sylLen + m2[0].length);
            sylLen += m2[0].length;
          }
          syllables.push(syl);
          i += sylLen;
        } else {
          i++; // skip non-IAST character
        }
      }
    }
    return syllables;
  }

  function isGuru(syllable, nextSyllable) {
    const lower = syllable.toLowerCase();
    // Check for long vowel
    for (const v of LONG_VOWELS) {
      if (lower.includes(v)) return true;
    }
    // Check anusvara/visarga
    if (/[ṁṃḥ]/.test(lower)) return true;
    // Positional: next syllable starts with 2+ consonants
    if (nextSyllable) {
      const nextLower = nextSyllable.toLowerCase();
      let count = 0, j = 0;
      while (j < nextLower.length) {
        const cm = nextLower.slice(j).match(CONSONANT_RE);
        if (cm) { count++; j += cm[0].length; }
        else break;
      }
      if (count >= 2) return true;
    }
    return false;
  }

  function analyzeLine(text) {
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const tokens = [];

    for (let wi = 0; wi < words.length; wi++) {
      const word = words[wi];
      // Verse markers: |, ||, ||1||, etc.
      if (/^\|+$/.test(word) || /^\|\|\d+\|\|$/.test(word)) {
        tokens.push({ text: word, beats: word.includes('||') ? 4 : 2, isMarker: true, isGuru: false, wordEnd: true });
        continue;
      }
      const syllables = splitSyllables(word);
      for (let si = 0; si < syllables.length; si++) {
        let nextSyl = null;
        if (si + 1 < syllables.length) {
          nextSyl = syllables[si + 1];
        } else {
          for (let nw = wi + 1; nw < words.length; nw++) {
            if (!/^\|/.test(words[nw])) {
              const ns = splitSyllables(words[nw]);
              if (ns.length > 0) nextSyl = ns[0];
              break;
            }
          }
        }
        const guru = isGuru(syllables[si], nextSyl);
        tokens.push({ text: syllables[si], beats: guru ? 2 : 1, isMarker: false, isGuru: guru, wordEnd: si === syllables.length - 1 });
      }
    }
    // Pāda-end guru rule
    for (let ti = 1; ti < tokens.length; ti++) {
      if (tokens[ti].isMarker && !tokens[ti - 1].isMarker) {
        tokens[ti - 1].isGuru = true;
        tokens[ti - 1].beats = 2;
      }
    }
    return tokens;
  }

  return { splitSyllables, isGuru, analyzeLine };
})();

// ============================================================
// Task 3: Data Layer (lazy-load current + prefetch next)
// ============================================================
const dataLayer = (function() {
  'use strict';

  // Ordered list of all chapter IDs
  const CHAPTER_ORDER = [
    'datta_stavam', 'invocation_prayers', '0',
    '1','2','3','4','5','6','7','8','9',
    '10','11','12','13','14','15','16','17','18',
    'gita_mahatmyam', 'kshama_prarthana', 'gita_saram', 'gita_arati', 'purnam'
  ];

  let pages = [];
  let chapterName = '';
  let currentChapterId = null;
  const cache = {}; // chapterId -> parsed JSON data

  function groupIntoPages(shlokas) {
    const result = [];

    for (const shloka of shlokas) {
      const headerEntries = shloka.entry.filter(e => e.sty === 'fh' || e.sty === 'sh' || e.sty === 'th' || e.sty === 'uh');
      const regularEntries = shloka.entry.filter(e => e.sty !== 'fh' && e.sty !== 'sh' && e.sty !== 'th' && e.sty !== 'uh');

      for (const hdr of headerEntries) {
        result.push({
          shlokaNum: shloka.shlokaNum,
          lines: [{ text: hdr.text, iast: hdr.iast || '', swhtsp: hdr.swhtsp, sty: hdr.sty }],
          isHeader: true
        });
      }

      if (regularEntries.length > 0) {
        const page = {
          shlokaNum: shloka.shlokaNum,
          lines: regularEntries.map(e => ({ text: e.text, iast: e.iast || '', swhtsp: e.swhtsp, sty: e.sty, cont: e.cont, pauseBeats: e.pauseBeats })),
          isHeader: false,
          meter: shloka.meter
        };
        // Colophon ("|| ōṃ tatsaditi ...") — leading || distinguishes it from
        // verse 17.23, which also begins with "ōṃ tatsaditi".
        const first = (page.lines[0].iast || page.lines[0].text || '');
        page.isCloser = /^\s*\|\|.*tatsaditi/.test(first) || /^\s*\|\|.*तत्सदिति/.test(first);
        const repeat = Math.max(1, parseInt(shloka.repeat, 10) || 1);
        for (let r = 0; r < repeat; r++) {
          result.push(Object.assign({}, page, {
            repeatPass: r + 1,
            repeatTotal: repeat
          }));
        }
      }
    }

    return result;
  }

  function chapterUrl(id) {
    const num = parseInt(id, 10);
    if (!isNaN(num) && num >= 1 && num <= 18) {
      return '../data/chapter_' + String(num).padStart(2, '0') + '.json';
    }
    // Named chapters: datta_stavam, sadguru_stavam, gita_mahatmyam, kshama_prarthana
    return '../data/' + id + '.json';
  }

  async function loadChapterData(id) {
    if (cache[id]) return cache[id];

    if (id === '0' || id === 0) {
      cache['0'] = EMBEDDED_DHYANA;
      return EMBEDDED_DHYANA;
    }

    const url = chapterUrl(id);
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('HTTP ' + resp.status + ' loading ' + url);
    const data = await resp.json();
    cache[id] = data;
    return data;
  }

  function prefetch(id) {
    if (!cache[id]) {
      loadChapterData(id).catch(function() {});
    }
  }

  async function fetchChapter(id) {
    id = String(id);
    const data = await loadChapterData(id);
    currentChapterId = id;
    chapterName = data.name || '';
    pages = groupIntoPages(data.shloka || []);

    // Prefetch next chapter in background
    var idx = CHAPTER_ORDER.indexOf(id);
    if (idx >= 0 && idx < CHAPTER_ORDER.length - 1) {
      prefetch(CHAPTER_ORDER[idx + 1]);
    }

    return { name: chapterName, pageCount: pages.length, defaultBpm: data.defaultBpm || null };
  }

  function getPage(index) {
    if (index < 0 || index >= pages.length) return null;
    return pages[index];
  }

  function getPageCount() {
    return pages.length;
  }

  function getChapterName() {
    return chapterName;
  }

  function getCurrentChapterId() {
    return currentChapterId;
  }

  function getNextChapterId() {
    var idx = CHAPTER_ORDER.indexOf(currentChapterId);
    if (idx >= 0 && idx < CHAPTER_ORDER.length - 1) return CHAPTER_ORDER[idx + 1];
    return null;
  }

  function getPrevChapterId() {
    var idx = CHAPTER_ORDER.indexOf(currentChapterId);
    if (idx > 0) return CHAPTER_ORDER[idx - 1];
    return null;
  }

  return { fetchChapter, getPage, getPageCount, getChapterName, getCurrentChapterId, getNextChapterId, getPrevChapterId, CHAPTER_ORDER };
})();

// ============================================================
// Task 4: UI Renderer
// ============================================================
const renderer = (function() {
  'use strict';

  let currentMode = 'asterisk';
  let currentPageData = null;
  let syllableElements = [];

  // Configurable pace (mātrās). Operator settings override these via setPaceConfig;
  // the standalone web app uses these defaults.
  //   headerPauseBeats — pause after each header line (separate from verse lines, #36.1)
  //   anustubhBeats / tristubhBeats — meter-aware verse line-end pause (#20/#21; tristubh 4.5 per #36.2)
  //   uvacaBeats — line-end pause after a speaker-label line ("... uvāca -"). Default 2
  //     (one guru, #26); configurable in the operator settings so it can be raised to a
  //     triṣṭubh-style 4-mātrā break for experimentation.
  // A page line may also carry an explicit `pauseBeats` that overrides the meter default (#36.3).
  const paceConfig = { headerPauseBeats: 3, anustubhBeats: 3, tristubhBeats: 4.5, uvacaBeats: 2 };
  function setPaceConfig(cfg) {
    if (!cfg) return;
    if (typeof cfg.headerPauseBeats === 'number') paceConfig.headerPauseBeats = cfg.headerPauseBeats;
    if (typeof cfg.anustubhBeats === 'number') paceConfig.anustubhBeats = cfg.anustubhBeats;
    if (typeof cfg.tristubhBeats === 'number') paceConfig.tristubhBeats = cfg.tristubhBeats;
    if (typeof cfg.uvacaBeats === 'number') paceConfig.uvacaBeats = cfg.uvacaBeats;
  }

  // Sections whose title HEADER slide is a plain title (not chanted content): show the
  // romanized title as static text in BOTH display modes and move no pointer over it (#4).
  const STATIC_TITLE_SECTIONS = { gita_mahatmyam: true, gita_saram: true, gita_arati: true };

  // Double-buffer: render next page into the hidden buffer, swap on advance
  const buffers = [
    document.getElementById('verse-container-a'),
    document.getElementById('verse-container-b')
  ];
  let activeBuffer = 0; // index into buffers[]
  let backBuffer = null; // { index, chapterNum, elements } or null

  /**
   * renderInto(target, pageData) — Render a page into a specific buffer element.
   * Returns the syllable elements array.
   */
  function renderInto(target, pageData) {
    target.textContent = '';
    // Colophon (closer) pages are center-aligned; all other pages left-aligned.
    target.classList.toggle('centered', !!pageData.isCloser);
    const elements = [];

    for (const line of pageData.lines) {
      const lineDiv = document.createElement('div');
      lineDiv.className = 'verse-line' + (line.cont ? ' cont' : '');

      if (pageData.isHeader) {
        if (line.sty === 'fh') {
          lineDiv.style.color = '#FFD700';
          lineDiv.style.fontSize = '3vw';
        } else if (line.sty === 'sh') {
          lineDiv.style.color = '#fff';
          lineDiv.style.fontSize = '2.5vw';
        }

        const hHasDevanagari = /[\u0900-\u097F]/.test(line.text);
        const hAnalyzeText = hHasDevanagari ? line.text : (line.iast || line.text);
        const hAnalyzer = hHasDevanagari ? prosody : iastProsody;
        const hTokens = hAnalyzer.analyzeLine(hAnalyzeText);
        const hLineStart = elements.length;

        // Gita Mahātmyam / Sāram / Ārati title headers: static title, no pointer (#4).
        const staticTitle = STATIC_TITLE_SECTIONS[dataLayer.getCurrentChapterId()] === true;
        if (currentMode !== 'asterisk' || staticTitle) {
          // English mode (or a static title): one span per header line with the text.
          // A static title also carries dataset.noPointer so the hand never moves over it,
          // and it shows the romanized text even in asterisk mode.
          const displayText = line.iast || line.text;
          const totalBeats = hTokens.reduce((sum, t) => sum + t.beats, 0);
          const span = document.createElement('span');
          span.className = 'syllable';
          span.dataset.index = elements.length;
          span.dataset.beats = Math.max(1, totalBeats);
          if (staticTitle) span.dataset.noPointer = '1';
          span.textContent = displayText;
          elements.push(span);
          lineDiv.appendChild(span);
        } else {
          // Asterisk mode: one ✱ per syllable, all animated
          for (let ti = 0; ti < hTokens.length; ti++) {
            const token = hTokens[ti];
            const span = document.createElement('span');
            span.dataset.beats = token.beats;
            if (token.isMarker) {
              span.className = 'verse-marker';
              span.textContent = token.text;
              elements.push(span);
            } else {
              span.className = 'syllable';
              span.dataset.index = elements.length;
              span.textContent = '✱';
              elements.push(span);
            }
            lineDiv.appendChild(span);
          }
        }

        // Header lines get a configurable line-end pause (default 3 mātrās, #36.1).
        for (let i = elements.length - 1; i >= hLineStart; i--) {
          if (!elements[i].classList.contains('verse-marker')) {
            elements[i].dataset.lineEnd = '1';
            elements[i].dataset.lineEndPauseBeats = String(paceConfig.headerPauseBeats);
            break;
          }
        }

        target.appendChild(lineDiv);
        continue;
      }
      const lineStartIndex = elements.length;

      // Determine which prosody engine to use
      // If text is Devanagari (has Unicode 0900+ chars), use Devanagari prosody; otherwise IAST
      const hasDevanagari = /[\u0900-\u097F]/.test(line.text);
      const analyzeText = hasDevanagari ? line.text : (line.iast || line.text);
      const analyzer = hasDevanagari ? prosody : iastProsody;

      if (currentMode === 'english') {
        // English mode: show IAST text, one span per line with total beats
        const displayText = line.iast || line.text;
        const tokens = analyzer.analyzeLine(analyzeText);
        const totalBeats = tokens.reduce((sum, t) => sum + t.beats, 0);

        // Each data entry = one pāda (display line). Long pādas are NOT split
        // into two display lines — fitLines() shrinks them to fit. This matches
        // the reference deck (each pāda on one line) and the web build
        // (index.html), and fixes the "Dhyana line mixups" (feedback #10–19)
        // that came from breaking a pāda at the wrong mid-pāda point.
        {
          const span = document.createElement('span');
          span.className = 'syllable';
          span.dataset.index = elements.length;
          span.dataset.beats = totalBeats;
          span.textContent = displayText;
          elements.push(span);
          lineDiv.appendChild(span);
        }
      } else {
        // Asterisk mode: one asterisk per syllable. For EVEN pointer movement,
        // every syllable carries the line's AVERAGE beat value (not its own
        // guru/laghu weight), so the hand glides at a constant rate across all
        // asterisks while the line's total time \u2014 and thus the set tempo \u2014 is
        // preserved. Markers (dandas) keep their own beats for the line-end pause.
        const tokens = analyzer.analyzeLine(analyzeText);
        const sylToks = tokens.filter(t => !t.isMarker);
        const avgBeats = sylToks.length
          ? (sylToks.reduce((s, t) => s + t.beats, 0) / sylToks.length)
          : 1;

        for (let ti = 0; ti < tokens.length; ti++) {
          const token = tokens[ti];
          const span = document.createElement('span');

          if (token.isMarker) {
            span.dataset.beats = token.beats;
            span.className = 'verse-marker';
            span.textContent = token.text;
            elements.push(span);
          } else {
            span.dataset.beats = avgBeats;
            span.className = 'syllable';
            span.dataset.index = elements.length;
            span.textContent = '\u2731';
            elements.push(span);
          }

          lineDiv.appendChild(span);
        }
      }

      // Speaker labels ("arjuna uvāca -", "śrī bhagavānuvāca -", "sañjaya uvāca -")
      // pause 2 mātrās (one guru) at the line end before the verse begins.
      // Speaker labels end with a trailing dash — that distinguishes them from
      // verse lines that merely contain "uvāca" (e.g. "uvāca madhusūdanaḥ ||1||").
      var lblIast = line.iast || '', lblText = line.text || '';
      var isUvaca = (/uvāca/.test(lblIast) && /-\s*$/.test(lblIast)) ||
                    (/उवाच/.test(lblText) && /-\s*$/.test(lblText));
      for (let i = elements.length - 1; i >= lineStartIndex; i--) {
        if (!elements[i].classList.contains('verse-marker')) {
          elements[i].dataset.lineEnd = '1';
          if (isUvaca) {
            // Uvāca speaker-label line end: configurable pause (default 2 mātrās / one
            // guru, #26). Raise via operator settings (e.g. 4) to give it a triṣṭubh-
            // style break.
            elements[i].dataset.lineEndPauseBeats = String(paceConfig.uvacaBeats);
          } else if (typeof line.pauseBeats === 'number') {
            // Explicit per-line override (e.g. Samarpana repeated invocation, #36.3).
            elements[i].dataset.lineEndPauseBeats = String(line.pauseBeats);
          } else {
            // Meter-aware line-end pause (Issues #20/#21), configurable via the
            // operator settings: triṣṭubh (default 4.5) vs anuṣṭubh (default 3).
            // Dhyana (chapter '0') carries per-shloka meter too, so it uses the
            // same rule (no flat-3 special case).
            var lineEndBeats = (pageData.meter === 'tristubh' ? paceConfig.tristubhBeats : paceConfig.anustubhBeats);
            elements[i].dataset.lineEndPauseBeats = String(lineEndBeats);
          }
          break;
        }
      }

      target.appendChild(lineDiv);
    }

    return elements;
  }

  /**
   * fitLines(target) — Shrink any verse line too wide for the display so it
   * fits on a single display line (feedback #8, #9, #19).
   *
   * Overflow test: .verse-line has `white-space: normal` + `max-width`, so a
   * long line wraps to a second display line instead of overflowing — and
   * because both .verse-line and the verse container are shrink-to-fit flex
   * items, `scrollWidth > clientWidth` on the line itself never fires (they
   * grow together). The real wrap constraint is the #display parent's
   * content-box width. So: temporarily force `nowrap` (scrollWidth then
   * reports the full single-line text width) and compare it against the
   * parent's content width. Font size is reduced until the text fits (floor
   * MIN_FONT_PX), then wrapping is restored (graceful fallback if the floor
   * is hit).
   *
   * Runs synchronously at the end of the render path, BEFORE the animator
   * reads syllable positions via getBoundingClientRect.
   * Lines are recreated from scratch on every render, so no font-size reset
   * is needed (resetting would clobber the inline vw sizes on header lines).
   * Fitted sizes are recomputed on the next render; window resize is not
   * observed. Inside a hidden container all widths measure 0 — a no-op.
   */
  const MIN_FONT_PX = 18; // legibility floor for hall projection
  function fitLines(target) {
    const parent = target.parentElement;
    if (!parent) return;
    const parentStyle = getComputedStyle(parent);
    const avail = parent.clientWidth - parseFloat(parentStyle.paddingLeft) - parseFloat(parentStyle.paddingRight);
    if (!(avail > 0)) return; // hidden container — nothing to measure
    const lines = target.querySelectorAll('.verse-line');
    for (let i = 0; i < lines.length; i++) {
      const el = lines[i];
      el.style.whiteSpace = 'nowrap';
      // "- 1" guards against scrollWidth's integer rounding hiding a
      // sub-pixel overflow that would still wrap the last word
      if (el.scrollWidth > avail - 1) {
        // Multiplicative first estimate — converges in ~2 passes even from
        // large vw-based header sizes (no fixed iteration cap needed)
        let size = parseFloat(getComputedStyle(el).fontSize);
        size = Math.max(MIN_FONT_PX, Math.floor(size * (avail - 1) / el.scrollWidth));
        el.style.fontSize = size + 'px';
        // Step down 1px for any residual overflow (letter-spacing etc. do
        // not scale perfectly linearly); terminates at the floor
        while (el.scrollWidth > avail - 1 && size > MIN_FONT_PX) {
          size -= 1;
          el.style.fontSize = size + 'px';
        }
      }
      el.style.whiteSpace = '';
    }
  }

  /** Render page into the active (visible) buffer. */
  function renderPage(pageData) {
    currentPageData = pageData;
    syllableElements = renderInto(buffers[activeBuffer], pageData);
    backBuffer = null;
    fitLines(buffers[activeBuffer]);
  }

  /** Pre-render the next page into the hidden buffer. */
  function prefetchPage(pageIndex, chapterNum) {
    const pageData = dataLayer.getPage(pageIndex);
    if (!pageData) { backBuffer = null; return; }
    const hiddenIdx = 1 - activeBuffer;
    const elements = renderInto(buffers[hiddenIdx], pageData);
    backBuffer = { index: pageIndex, chapterNum: chapterNum, elements: elements, pageData: pageData };
  }

  /** Swap hidden buffer to visible. Returns true if the prefetched page matched. */
  function swapPrefetched(pageIndex, chapterNum) {
    if (!backBuffer) return false;
    if (backBuffer.index !== pageIndex || backBuffer.chapterNum !== chapterNum) return false;

    // Hide current, show prefetched — no DOM rebuild
    buffers[activeBuffer].style.display = 'none';
    activeBuffer = 1 - activeBuffer;
    buffers[activeBuffer].style.display = '';

    currentPageData = backBuffer.pageData;
    syllableElements = backBuffer.elements;
    backBuffer = null;
    // Prefetch rendered into a hidden buffer (widths measured 0 there) —
    // fit now that the buffer is visible, before the animator reads positions
    fitLines(buffers[activeBuffer]);
    return true;
  }

  /** Invalidate back buffer (e.g. on chapter change or mode switch). */
  function invalidatePrefetch() {
    backBuffer = null;
    buffers[1 - activeBuffer].textContent = '';
  }

  function setMode(mode) {
    currentMode = mode;

    // Update button states
    const buttons = document.querySelectorAll('.mode-btn');
    buttons.forEach(function(btn) {
      if (btn.dataset.mode === mode) {
        btn.classList.add('selected');
      } else {
        btn.classList.remove('selected');
      }
    });

    // Re-render if we have page data
    invalidatePrefetch();
    if (currentPageData) {
      renderPage(currentPageData);
    }
  }

  function getSyllableElements() {
    return syllableElements;
  }

  return {
    renderPage: renderPage,
    prefetchPage: prefetchPage,
    swapPrefetched: swapPrefetched,
    invalidatePrefetch: invalidatePrefetch,
    setMode: setMode,
    setPaceConfig: setPaceConfig,
    getSyllableElements: getSyllableElements,
    getMode: function() { return currentMode; }
  };
})();

// ============================================================
// Task 5: Animation Engine
// ============================================================
const animator = (function() {
  'use strict';

  let isPlaying = false;
  let currentIndex = -1;
  let timeoutId = null;
  let bpm = 380; // internal beats; displayed as whole notes (bpm/4), default 95
  // Fallback default when a line-end element carries no dataset.lineEndPauseBeats.
  // Line-end pauses are now data-driven (per-line dataset.lineEndPauseBeats set by
  // the renderer from chapter/meter), so this is only a safety net.
  const LINE_END_PAUSE_BEATS = 3;

  // Operator Settings panel hook — line-end pause is now data-driven, so this is
  // an inert stub kept for call-site compatibility.
  function setChantConfig(cfg) {}
  let onSyllableChange = null; // callback: function(index, state) where state is 'active' or 'done'
  let onAutoAdvance = null; // callback: called when animation reaches end of page

  const pointer = document.getElementById('pointer');
  const btnPlay = document.getElementById('btn-play');
  const btnPause = document.getElementById('btn-pause');

  function getBeatMs() {
    return 60000 / bpm;
  }

  function setBpm(newBpm) {
    bpm = Math.max(40, Math.min(600, newBpm));
  }

  function play() {
    isPlaying = true;
    if (btnPlay) btnPlay.disabled = true;
    if (btnPause) btnPause.disabled = false;
    advance();
  }

  function pause() {
    isPlaying = false;
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    if (btnPlay) btnPlay.disabled = false;
    if (btnPause) btnPause.disabled = true;
  }

  function reset() {
    pause();
    const elems = renderer.getSyllableElements();
    for (let i = 0; i < elems.length; i++) {
      elems[i].classList.remove('active');
      elems[i].classList.remove('done');
    }
    currentIndex = -1;
    hidePointer();
  }

  function advance() {
    if (!isPlaying) return;

    const elems = renderer.getSyllableElements();

    // Mark previous element as done
    if (currentIndex >= 0 && currentIndex < elems.length) {
      elems[currentIndex].classList.remove('active');
      elems[currentIndex].classList.add('done');
      if (onSyllableChange) onSyllableChange(currentIndex, 'done');
    }

    currentIndex++;

    // Past end — auto-advance to next page if available, otherwise stop
    if (currentIndex >= elems.length) {
      isPlaying = false;
      if (btnPlay) btnPlay.disabled = false;
      if (btnPause) btnPause.disabled = true;
      hidePointer();
      // Auto-advance to next page — notify via callback
      if (onAutoAdvance) {
        timeoutId = setTimeout(function() {
          onAutoAdvance();
        }, 0);
      }
      return;
    }

    // Skip verse markers (danda / double danda) — they are not pronounced
    // but add a natural pause between lines
    const el = elems[currentIndex];
    if (el.classList.contains('verse-marker')) {
      el.classList.add('done');
      currentIndex++;
      // No extra pause — the preceding syllable's line-end pause covers it
      return advance();
    }

    // Activate current element
    el.classList.add('active');
    if (onSyllableChange) onSyllableChange(currentIndex, 'active');

    // Per-element duration from its beat value. In asterisk mode each syllable
    // carries the line's AVERAGE beats (set at render time), so the hand glides
    // EVENLY across all asterisks while the line's total time (the set tempo) is
    // preserved. In English mode the single line-span carries the line's total
    // beats. parseFloat because averaged beats can be fractional.
    const beats = parseFloat(el.dataset.beats) || 1;
    const durationMs = beats * getBeatMs();

    // Find the next non-marker syllable
    var nextIdx = currentIndex + 1;
    while (nextIdx < elems.length && elems[nextIdx].classList.contains('verse-marker')) {
      nextIdx++;
    }

    if (el.dataset.splitEnd) {
      // splitEnd: advance to the next line with no inter-line pause — used by
      // multi-line headers (verse pādas are no longer split).
      positionPointerInstant(el);
      requestAnimationFrame(function() {
        var r = el.getBoundingClientRect();
        pointer.style.transition = 'left ' + (durationMs / 1000) + 's linear';
        pointer.style.left = (r.right - 18) + 'px';
      });
      timeoutId = setTimeout(function() {
        el.classList.remove('active');
        el.classList.add('done');
        if (onSyllableChange) onSyllableChange(currentIndex, 'done');
        currentIndex = nextIdx - 1;
        if (nextIdx < elems.length) {
          positionPointerInstant(elems[nextIdx]);
        }
        // No extra pause — immediately continue into the second half of the pada
        advance();
      }, durationMs);
    } else if (el.dataset.lineEnd) {
      // Line end (between padas): rest the pointer ON the last asterisk (where the
      // previous glide left it) — do NOT sweep past it to the line's right edge.
      // Then honour marker beats and the line-end pause.
      positionPointerInstant(el);
      timeoutId = setTimeout(function() {
        el.classList.remove('active');
        el.classList.add('done');
        if (onSyllableChange) onSyllableChange(currentIndex, 'done');
        // Mark skipped dandas as done and collect their beats (| = 2 beats, || = 4 beats)
        var markerBeats = 0;
        for (var i = currentIndex + 1; i < nextIdx; i++) {
          markerBeats += (parseInt(elems[i].dataset.beats, 10) || 0);
          elems[i].classList.add('done');
          if (onSyllableChange) onSyllableChange(i, 'done');
        }
        currentIndex = nextIdx - 1;
        if (nextIdx < elems.length) {
          positionPointerInstant(elems[nextIdx]);
        }
        // Line-end pause is data-driven: each line-end element carries
        // dataset.lineEndPauseBeats (3 for headers/anuṣṭubh/Dhyana, 4 for triṣṭubh).
        var lp = parseFloat(el.dataset.lineEndPauseBeats);
        var pauseMs = (lp > 0 ? lp : LINE_END_PAUSE_BEATS) * getBeatMs();
        timeoutId = setTimeout(advance, pauseMs);
      }, durationMs);
    } else if (nextIdx < elems.length) {
      // Glide pointer from current toward next syllable over the duration
      positionPointerInstant(el);
      requestAnimationFrame(function() {
        positionPointer(elems[nextIdx], durationMs);
      });
      timeoutId = setTimeout(advance, durationMs);
    } else {
      // Last syllable on the page
      positionPointerInstant(el);
      timeoutId = setTimeout(advance, durationMs);
    }
  }

  function positionPointer(el, transitionMs) {
    // Static-title header spans (#4) carry noPointer — never show the hand on them.
    if (el && el.dataset && el.dataset.noPointer) { hidePointer(); return; }
    const rect = el.getBoundingClientRect();
    if (transitionMs !== undefined) {
      pointer.style.transition = 'left ' + (transitionMs / 1000) + 's linear, top 0.15s ease-out';
    }
    pointer.style.display = 'block';
    pointer.style.left = (rect.left + rect.width / 2 - 18) + 'px';
    pointer.style.top = (rect.top - 40) + 'px';
  }

  function positionPointerInstant(el) {
    if (el && el.dataset && el.dataset.noPointer) { hidePointer(); return; }
    pointer.style.transition = 'none';
    const rect = el.getBoundingClientRect();
    pointer.style.display = 'block';
    pointer.style.left = (rect.left + rect.width / 2 - 18) + 'px';
    pointer.style.top = (rect.top - 40) + 'px';
    // Force reflow so 'none' takes effect before we re-enable transitions
    pointer.offsetWidth;
  }

  function hidePointer() {
    pointer.style.display = 'none';
  }

  function getState() {
    return { isPlaying: isPlaying, currentIndex: currentIndex, bpm: bpm };
  }

  function restore(state) {
    // Stop any running animation
    if (timeoutId) clearTimeout(timeoutId);
    isPlaying = false;

    const elems = renderer.getSyllableElements();
    currentIndex = Math.min(state.currentIndex, elems.length - 1);

    // Re-apply active/done classes to match previous state
    for (let i = 0; i < elems.length; i++) {
      if (i < currentIndex) {
        elems[i].classList.add('done');
      } else if (i === currentIndex && currentIndex >= 0) {
        elems[i].classList.add('active');
        positionPointerInstant(elems[i]);
      }
    }

    // Resume playing if it was playing
    if (state.isPlaying && currentIndex >= 0) {
      isPlaying = true;
      if (btnPlay) btnPlay.disabled = true;
      if (btnPause) btnPause.disabled = false;
      var beats = parseFloat(elems[currentIndex].dataset.beats) || 1;
      var lp = parseFloat(elems[currentIndex].dataset.lineEndPauseBeats);
      var lineEndPause = elems[currentIndex].dataset.lineEnd ? (lp > 0 ? lp : LINE_END_PAUSE_BEATS) : 0;
      timeoutId = setTimeout(advance, (beats + lineEndPause) * getBeatMs());
    } else if (currentIndex < 0) {
      hidePointer();
    }
  }

  return {
    play: play,
    pause: pause,
    reset: reset,
    setBpm: setBpm,
    getState: getState,
    restore: restore,
    getBeatMs: getBeatMs,
    setChantConfig: setChantConfig,
    setOnSyllableChange: function(cb) { onSyllableChange = cb; },
    setOnAutoAdvance: function(cb) { onAutoAdvance = cb; }
  };
})();
