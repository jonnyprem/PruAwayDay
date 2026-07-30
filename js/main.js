(() => {
  'use strict';

  /* ---------------- Mobile nav ---------------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('main-nav');
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------------- Countdown timer ---------------- */
  // Departure: 7 August 2026, 5:30 AM Indochina Time (UTC+7)
  const EVENT_START = new Date('2026-08-07T05:30:00+07:00').getTime();
  const EVENT_END = new Date('2026-08-09T18:00:00+07:00').getTime();
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMins = document.getElementById('cd-mins');
  const cdSecs = document.getElementById('cd-secs');
  const caption = document.getElementById('countdownCaption');

  function pad(n) { return String(n).padStart(2, '0'); }

  function tickCountdown() {
    const now = Date.now();
    let target = EVENT_START;
    let label = 'Counting down to departure — 5:30 AM, Chip Mong Tower';

    if (now >= EVENT_START && now <= EVENT_END) {
      target = EVENT_END;
      label = 'Away Day 2026 is happening now — safe travels, team!';
    } else if (now > EVENT_END) {
      cdDays.textContent = '00';
      cdHours.textContent = '00';
      cdMins.textContent = '00';
      cdSecs.textContent = '00';
      caption.textContent = 'Away Day 2026 has concluded. See you next time!';
      return;
    }

    const diff = Math.max(0, target - now);
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    cdDays.textContent = pad(days);
    cdHours.textContent = pad(hours);
    cdMins.textContent = pad(mins);
    cdSecs.textContent = pad(secs);
    caption.textContent = label;
  }
  tickCountdown();
  setInterval(tickCountdown, 1000);

  /* ---------------- Scroll reveal ---------------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------------- Roadmap scroll fill ---------------- */
  const roadmap = document.getElementById('roadmap');
  const roadmapFill = document.getElementById('roadmapFill');
  function updateRoadmapFill() {
    const rect = roadmap.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = rect.height;
    const scrolled = Math.min(Math.max(vh * 0.6 - rect.top, 0), total);
    const pct = total > 0 ? (scrolled / total) * 100 : 0;
    roadmapFill.style.height = pct + '%';
  }
  window.addEventListener('scroll', updateRoadmapFill, { passive: true });
  window.addEventListener('resize', updateRoadmapFill);
  updateRoadmapFill();

  /* ---------------- Day tabs ---------------- */
  const dayTabs = document.querySelectorAll('.day-tab');
  const dayPanels = document.querySelectorAll('.day-panel');
  dayTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const day = tab.dataset.day;
      dayTabs.forEach(t => {
        t.classList.toggle('is-active', t === tab);
        t.setAttribute('aria-selected', String(t === tab));
      });
      dayPanels.forEach(p => {
        const match = p.dataset.dayPanel === day;
        p.classList.toggle('is-active', match);
        p.hidden = !match;
      });
    });
  });

  // Auto-select the current day if the event is live
  (function autoSelectDay() {
    const now = Date.now();
    const day1 = new Date('2026-08-07T00:00:00+07:00').getTime();
    const day2 = new Date('2026-08-08T00:00:00+07:00').getTime();
    const day3 = new Date('2026-08-09T00:00:00+07:00').getTime();
    const day4 = new Date('2026-08-10T00:00:00+07:00').getTime();
    let activeDay = null;
    if (now >= day1 && now < day2) activeDay = '1';
    else if (now >= day2 && now < day3) activeDay = '2';
    else if (now >= day3 && now < day4) activeDay = '3';
    if (activeDay) {
      const tab = document.getElementById(`day-${activeDay}-tab`);
      if (tab) tab.click();
    }
  })();

  /* ---------------- Choice cards (Day 1 experience) ---------------- */
  const choiceCards = document.querySelectorAll('.choice-card');
  const choiceConfirm = document.getElementById('choiceConfirm');
  const CHOICE_KEY = 'awayday2026_choice';

  function applyChoice(value) {
    choiceCards.forEach(card => {
      card.classList.toggle('is-selected', card.dataset.choice === value);
    });
    const labels = { museum: 'Siem Reap Museum', sunset: 'Phnom Krom Sunset Experience' };
    choiceConfirm.textContent = `You've selected: ${labels[value]}. Saved on this device.`;
  }

  const savedChoice = localStorage.getItem(CHOICE_KEY);
  if (savedChoice) applyChoice(savedChoice);

  choiceCards.forEach(card => {
    card.addEventListener('click', () => {
      const value = card.dataset.choice;
      localStorage.setItem(CHOICE_KEY, value);
      applyChoice(value);
    });
  });

  /* ---------------- Live announcements ---------------- */
  const ANNOUNCEMENTS = [
    { time: 'Aug 7, 5:15 AM', title: 'Buses are boarding', body: 'Please proceed to your assigned bus at Chip Mong Tower. Departure is at 6:00 AM sharp.', badge: 'NEW' },
    { time: 'Aug 3', title: 'Photo Hunt teams posted', body: 'Team lists for the Photo Hunt Challenge have been shared in the event WhatsApp group.' },
    { time: 'Jul 28', title: 'Packing checklist released', body: 'Comfortable shoes, sun protection, and a light jacket for the evening are recommended.' },
    { time: 'Jul 20', title: 'Bus assignments coming soon', body: 'Final bus groupings will be published here one week before departure.' },
  ];
  const tickerTrack = document.getElementById('tickerTrack');
  ANNOUNCEMENTS.slice(0, 3).forEach(a => {
    const span = document.createElement('span');
    span.textContent = `📢 ${a.title} — ${a.body}`;
    tickerTrack.appendChild(span);
  });

  /* ---------------- Gallery (placeholder tiles, ready for real photos) ---------------- */
  const GALLERY_ITEMS = [
    { label: 'Day 1 · Welcome Dinner', color: '#E4002B' },
    { label: 'Day 1 · Sunset Cruise', color: '#C9A227' },
    { label: 'Day 1 · Museum Visit', color: '#17171A' },
    { label: 'Day 2 · Preah Khan Temple', color: '#3A3A3E' },
    { label: 'Day 2 · Photo Hunt', color: '#E4002B' },
    { label: 'Day 2 · Neak Pean Temple', color: '#C9A227' },
    { label: 'Day 2 · Gala Dinner', color: '#17171A' },
    { label: 'Day 3 · Journey Home', color: '#3A3A3E' },
  ];
  const galleryGrid = document.getElementById('galleryGrid');
  const lightbox = document.getElementById('lightbox');
  const lightboxBody = document.getElementById('lightboxBody');
  const lightboxClose = document.getElementById('lightboxClose');

  GALLERY_ITEMS.forEach((item) => {
    const btn = document.createElement('button');
    btn.className = 'gallery-item';
    btn.style.background = item.color;
    btn.innerHTML = `<span>${item.label}</span>`;
    btn.setAttribute('aria-label', `View ${item.label}`);
    btn.addEventListener('click', () => {
      lightboxBody.style.background = item.color;
      lightboxBody.textContent = item.label;
      lightbox.hidden = false;
      lightboxClose.focus();
    });
    galleryGrid.appendChild(btn);
  });

  function closeLightbox() { lightbox.hidden = true; }
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !lightbox.hidden) closeLightbox(); });

  /* ---------------- Room list ---------------- */
  const ROOM_LIST = [
    ['Heng Sok', 'Delux Double room'],
    ['Sophat Min', 'Delux Double room'],
    ['Vannak Suon', 'Delux Double room'],
    ['Ketekoun Sourn', 'Delux Twin room'],
    ['Chheangmeng Thong', ''],
    ['Sreyleap Heng', 'Delux Double room'],
    ['Chanboromey Pen', 'Delux Double room'],
    ['Daly Som', ''],
    ['Ratna Khoem', ''],
    ['Nita Aing', 'Delux Double room'],
    ['Dane Vong', ''],
    ['Sreymom Ouch', ''],
    ['Sokkhim Ek', 'Delux Double room'],
    ['Chanransey Oeun', ''],
    ['Sreypov Nhil', ''],
    ['Titsophea May', 'Delux Double room'],
    ['Chanlyda Sim', ''],
    ['Sopheara Ol', ''],
    ['Goda Phan', 'Delux Twin room'],
    ['Vanndy Choun', ''],
    ['Kaset Song', ''],
    ['Sonita Norn', 'Delux Double room'],
    ['Reaksmey', ''],
    ['Boramey Chan', ''],
    ['Bunnay Mao', 'Delux Twin room'],
    ['Vannal Sok', ''],
    ['Sovannratana Ouk', ''],
    ['Sovan Noup', ''],
    ['Han Kimhak', 'Delux Triple Room'],
    ['Yaoly Sok', ''],
    ['Kimsour Tep', ''],
    ['Youra Leangseng', ''],
    ['Chhaya Mao', ''],
    ['Sang Chea', 'Delux Triple Room'],
    ['Hengheng Nay', ''],
    ['Daly Kao', ''],
    ['Sovanminea Seng', ''],
    ['Layhak Tann', ''],
    ['Kimho Duong', 'Delux Double room'],
    ['Kourngmeng Sok', ''],
    ['Lymeng Chhim', 'Delux Triple Room'],
    ['Norinreaksmey Phalla', ''],
    ['Virakbuth Seng', ''],
    ['Kunavath Ly', ''],
    ['Bunchhean', ''],
    ['Vannavudh Chrun', ''],
    ['Chanvichheka Ty', 'Delux Double room'],
    ['Danuch Ro', ''],
    ['Voleak Van', ''],
    ['Dalin Heng', 'Delux Twin room'],
    ['Socheata Say', ''],
    ['Chanpisey Chhorn', ''],
    ['Solyta Teng', 'Delux Double room'],
    ['Sikeang Sot', ''],
    ['Sokleap Chhun', ''],
    ['Phalla Srey', 'Delux Double room'],
    ['Sopheak Lao', ''],
    ['Borasy', 'Delux Twin room'],
    ['Lay Sreylux', ''],
    ['Socheata Tann', ''],
    ['Sopheakrath Hoeng', ''],
    ['Malen Sok', 'Delux Double room'],
    ['Vichet Lay', ''],
    ['Rovi Rina', 'Delux Twin room'],
    ['SEREYROTHANA POK', ''],
    ['Sreynit Chan', ''],
    ['AeeAee SO', ''],
    ['Sineth Ra', 'Delux + Extra'],
    ['Phasonita Pen', ''],
    ['CW-Ny Kaknika', ''],
    ['CHANTRA HUON', ''],
    ['Sreynath Phan', 'Delux + Extra'],
    ['Raksmey Sai', ''],
    ['CW-Lymeng Lim', ''],
    ['CW-Dychannyka Kim', ''],
    ['Chakrya Chhon', 'Delux + Extra'],
    ['Sreyvith Mouy', ''],
    ['Chhannrasmie Prak', ''],
    ['CW-Yang Ponlok', ''],
    ['Siya Hai', 'Delux + Extra'],
    ['Sony Phan', ''],
    ['CW-Chhivgech Song', ''],
    ['Socheata Nhem', ''],
    ['Seanghuy Eung', 'Delux Twin room'],
    ['Phaneth Chum', ''],
    ['Chum Oudom', ''],
    ['Chinh Oeurt', ''],
    ['Sovannara Lonn', 'Delux Twin room'],
    ['Bora Im', ''],
    ['Sithean Hean', ''],
    ['Panha Pech', ''],
    ['Leh Lors', 'Delux Twin room'],
    ['Monivan Y', ''],
    ['Chanpiseth Chap', ''],
    ['Tola Seang', ''],
    ['Thymother Thun', 'Delux Triple Room'],
    ['Monnyvirak Chhea', ''],
    ['Chhinlong Horn', ''],
    ['chhengryaphismongkol um', ''],
    ['Sam Ok Mot', ''],
    ['Leangheng Phouk', 'Dek Wat'],
    ['Leapheng Prem', ''],
    ['Smey', ''],
    ['Dani Satt', ''],
    ['Bopha Horn', 'Delux Double room'],
    ['Soseneh Sou', ''],
    ['Lihout Hok', 'Delux + Extra'],
    ['Sopen Vith', ''],
    ['CW-Pheang phearen', ''],
    ['Moy Visal', ''],
  ];

  /* ---------------- Bus list ---------------- */
  const BUS_LIST = [
    ['Heng Sok', 'Sophat Min', 'Vannak Suon'],
    ['Chanboromey Pen', 'Chheangmeng Thong', 'Sreyleap Heng'],
    ['Daly Som', 'Sokkhim Ek', 'Ketekoun Sourn'],
    ['Ratna Khoem', 'Chanransey Oeun', 'Nita Aing'],
    ['Titsophea May', 'Sreypov Nhil', 'Dane Vong'],
    ['Chanlyda Sim', 'Goda Phan', 'Sreymom Ouch'],
    ['Sopheara Ol', 'Vanndy Choun', 'Kaset Song'],
    ['Reaksmey', 'Han Kimhak', 'Sonita Norn'],
    ['Boramey Chan', 'Yaoly Sok', 'Sang Chea'],
    ['Bunnay Mao', 'Kimsour Tep', 'Hengheng Nay'],
    ['Vannal Sok', 'Youra Leangseng', 'Daly Kao'],
    ['Sovannratana Ouk', 'Chhaya Mao', 'Sovanminea Seng'],
    ['Sovan Noup', 'Kimho Duong', 'Layhak Tann'],
    ['Lymeng Chhim', 'Kourngmeng Sok', 'Chanvichheka Ty'],
    ['Norinreaksmey Phalla', 'Kunavath Ly', 'Danuch Ro'],
    ['Virakbuth Seng', 'Bunchhean', 'Voleak Van'],
    ['Socheata Say', 'Vannavudh Chrun', 'Solyta Teng'],
    ['Chanpisey Chhorn', 'Dalin Heng', 'Sikeang Sot'],
    ['Borasy', 'Phalla Srey', 'Sokleap Chhun'],
    ['Lay Sreylux', 'Sopheak Lao', 'Malen Sok'],
    ['Rovi Rina', 'Socheata Tann', 'Vichet Lay'],
    ['SEREYROTHANA POK', 'Sopheakrath Hoeng', 'Sreynath Phan'],
    ['Sreynit Chan', 'Sineth Ra', 'Raksmey Sai'],
    ['AeeAee SO', 'Phasonita Pen', 'CW-Lymeng Lim'],
    ['Chakrya Chhon', 'CW-Ny Kaknika', 'CW-Dychannyka Kim'],
    ['Sreyvith Mouy', 'CHANTRA HUON', 'Seanghuy Eung'],
    ['Chhannrasmie Prak', 'Siya Hai', 'Phaneth Chum'],
    ['CW-Yang Ponlok', 'Sony Phan', 'Chum Oudom'],
    ['Bora Im', 'CW-Chhivgech Song', 'Chinh Oeurt'],
    ['Sithean Hean', 'Socheata Nhem', 'Sovannara Lonn'],
    ['Leh Lors', 'Chanpiseth Chap', 'Panha Pech'],
    ['Monivan Y', 'Tola Seang', 'Bopha Horn'],
    ['Thymother Thun', 'chhengryaphismongkol um', 'Soseneh Sou'],
    ['Monnyvirak Chhea', 'Sam Ok Mot', 'CW-Pheang phearen'],
    ['Chhinlong Horn', 'Sopen Vith', 'Moy Visal'],
    ['Lihout Hok', 'Leangheng Phouk', 'Leapheng Prem'],
    ['Smey', 'Dani Satt', ''],
  ];

  const roomTableBody = document.querySelector('#roomTable tbody');
  const busTableBody = document.querySelector('#busTable tbody');

  // A blank Room cell means that person shares the room with the group above —
  // fold those rows into one merged cell instead of repeating the room name.
  let carriedRoom = '';
  let groupId = -1;
  const roomRows = ROOM_LIST.map(([name, room], i) => {
    const isGroupStart = room !== '';
    if (isGroupStart) { groupId += 1; carriedRoom = room; }
    const next = ROOM_LIST[i + 1];
    const isGroupEnd = !next || next[1] !== '';
    return { name, resolvedRoom: carriedRoom || 'TBC', isGroupStart, isGroupEnd, groupId };
  });
  const groupSizes = {};
  roomRows.forEach(r => { groupSizes[r.groupId] = (groupSizes[r.groupId] || 0) + 1; });

  roomRows.forEach((r, i) => {
    const tr = document.createElement('tr');
    tr.dataset.names = r.name.toLowerCase();
    tr.dataset.roomResolved = r.resolvedRoom;
    tr.dataset.roomStart = r.isGroupStart ? '1' : '0';
    if (!r.isGroupEnd) tr.classList.add('room-group-mid');
    if (groupSizes[r.groupId] > 1) tr.classList.add('room-shared');
    tr.innerHTML = `<td>${i + 1}</td><td>${r.name}</td><td class="room-cell">${r.isGroupStart ? r.resolvedRoom : ''}</td>`;
    roomTableBody.appendChild(tr);
  });

  BUS_LIST.forEach(([b1, b2, b3], i) => {
    const tr = document.createElement('tr');
    tr.dataset.names = [b1, b2, b3].join(' ').toLowerCase();
    tr.innerHTML = `<td>${i + 1}</td><td>${b1 || ''}</td><td>${b2 || ''}</td><td>${b3 || ''}</td>`;
    busTableBody.appendChild(tr);
  });

  const assignmentSearch = document.getElementById('assignmentSearch');
  assignmentSearch.addEventListener('input', () => {
    const q = assignmentSearch.value.trim().toLowerCase();
    const searching = q.length > 0;
    document.querySelectorAll('#busTable tbody tr, #roomTable tbody tr').forEach(tr => {
      const matches = searching && tr.dataset.names.includes(q);
      tr.classList.toggle('is-match', matches);
      tr.classList.toggle('is-hidden', searching && !matches);
    });
    document.querySelectorAll('#roomTable tbody tr').forEach(tr => {
      const cell = tr.querySelector('.room-cell');
      cell.textContent = searching || tr.dataset.roomStart === '1' ? tr.dataset.roomResolved : '';
    });
  });

})();
