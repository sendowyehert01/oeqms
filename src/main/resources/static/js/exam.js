document.querySelectorAll('.switch-tabs button').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.switch-tabs button').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
    document.getElementById(btn.dataset.screen).classList.add('active');
  });
});

const topActionLabels = {
  dashboard: '+ Create exam',
  exams: 'Save draft',
  testbank: '+ New question',
  analytics: 'Export report'
};

function goPage(name) {
  document.querySelectorAll('.topnav nav a').forEach((a) => a.classList.toggle('current', a.dataset.page === name));
  document.querySelectorAll('.page').forEach((p) => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');

  const topBtn = document.getElementById('topAction');
  topBtn.textContent = topActionLabels[name];
  topBtn.onclick = name === 'dashboard'
    ? () => goPage('exams')
    : name === 'testbank'
      ? toggleNewQ
      : null;
}

document.querySelectorAll('.topnav nav a').forEach((a) => {
  a.addEventListener('click', () => goPage(a.dataset.page));
});

let currentStep = 1;
function goStep(n) {
  currentStep = n;
  document.querySelectorAll('.step-item').forEach((el) => {
    const s = parseInt(el.dataset.step, 10);
    el.classList.remove('current', 'done');
    if (s === n) {
      el.classList.add('current');
    } else if (s < n) {
      el.classList.add('done');
    }
  });

  document.querySelectorAll('.step-content').forEach((el) => {
    el.classList.toggle('active', parseInt(el.dataset.step, 10) === n);
  });

  if (n === 4) {
    updateSummary();
  }
}

const bank = [
  { id: 1, text: 'What is the OSI model?', type: 'MCQ', diff: 'Easy', pts: 5 },
  { id: 2, text: 'Explain TCP/IP handshake', type: 'Essay', diff: 'Hard', pts: 10 },
  { id: 3, text: 'Calculate the subnet mask for a /26 network', type: 'Short answer', diff: 'Hard', pts: 10 },
  { id: 4, text: 'What port does HTTPS use by default?', type: 'MCQ', diff: 'Easy', pts: 3 },
  { id: 5, text: 'Describe the difference between a hub, switch and router', type: 'Essay', diff: 'Medium', pts: 8 }
];

let nextId = 6;
let selectedIds = new Set([1, 2]);

function tagClassForDiff(d) {
  return d === 'Easy' ? 'tag-green' : d === 'Hard' ? 'tag-rust' : 'tag-amber';
}

function renderBank() {
  const list = document.getElementById('bankList');
  if (!list) return;

  list.innerHTML = bank.map((q) => `
    <div class="qbank-row">
      <span class="qtext">Q${q.id} · ${q.text}</span>
      <span class="tag tag-blue">${q.type}</span>
      <span class="tag ${tagClassForDiff(q.diff)}">${q.diff}</span>
      <button class="add-btn ${selectedIds.has(q.id) ? 'added' : ''}" onclick="toggleSelect(${q.id})">${selectedIds.has(q.id) ? '✓ Added' : '+ Add'}</button>
    </div>
  `).join('');
}

function renderSelected() {
  const listEl = document.getElementById('selectedList');
  const subEl = document.getElementById('selectedSub');
  if (!listEl || !subEl) return;

  const chosen = bank.filter((q) => selectedIds.has(q.id));
  const totalPts = chosen.reduce((sum, q) => sum + q.pts, 0);

  subEl.textContent = `${chosen.length} question${chosen.length !== 1 ? 's' : ''} · ${totalPts} pts`;
  listEl.innerHTML = chosen.length
    ? chosen.map((q) => `
        <div class="selected-row">
          <span class="stext">Q${q.id} · ${q.text}</span>
          <button class="icon-btn" title="Remove" onclick="toggleSelect(${q.id})">✕</button>
        </div>
      `).join('')
    : '<div class="empty-note">No questions added yet</div>';
}

function toggleSelect(id) {
  selectedIds.has(id) ? selectedIds.delete(id) : selectedIds.add(id);
  renderBank();
  renderSelected();
}

function renderTestbank() {
  const list = document.getElementById('tbList');
  if (!list) return;

  list.innerHTML = bank.map((q) => `
    <div class="qbank-row">
      <span class="qtext">Q${q.id} · ${q.text}</span>
      <span class="tag tag-blue">${q.type}</span>
      <span class="tag ${tagClassForDiff(q.diff)}">${q.diff}</span>
      <button class="add-btn btn-sm" onclick="alert('Editing is not wired up in this prototype.')">Edit</button>
      <button class="icon-btn" title="Delete" onclick="deleteQuestion(${q.id})">✕</button>
    </div>
  `).join('');
}

function deleteQuestion(id) {
  const idx = bank.findIndex((q) => q.id === id);
  if (idx > -1) bank.splice(idx, 1);
  selectedIds.delete(id);
  renderTestbank();
  renderBank();
  renderSelected();
}

function toggleNewQ() {
  const panel = document.getElementById('newqPanel');
  if (panel) panel.classList.toggle('show');
}

function saveNewQuestion() {
  const text = document.getElementById('nq-text').value.trim();
  if (!text) {
    alert('Add question text first.');
    return;
  }

  const type = document.getElementById('nq-type').value;
  const diff = document.getElementById('nq-diff').value;

  bank.push({
    id: nextId++,
    text,
    type,
    diff,
    pts: diff === 'Hard' ? 10 : diff === 'Medium' ? 8 : 5
  });

  document.getElementById('nq-text').value = '';
  document.getElementById('nq-topic').value = '';
  toggleNewQ();
  renderTestbank();
  renderBank();
}

function toggleSwitch(el) {
  el.classList.toggle('on');
}

function updateSummary() {
  const titleEl = document.getElementById('f-title');
  const courseEl = document.getElementById('f-course');
  const durationEl = document.getElementById('f-duration');

  if (titleEl) document.getElementById('sum-title').textContent = titleEl.value;
  if (courseEl) document.getElementById('sum-course').textContent = courseEl.value + ' · Oct 14, 9:00–11:00 AM';

  const chosen = bank.filter((q) => selectedIds.has(q.id));
  document.getElementById('sum-count').textContent = chosen.length;
  document.getElementById('sum-pts').textContent = chosen.reduce((sum, q) => sum + q.pts, 0);
  document.getElementById('sum-dur').textContent = (durationEl ? durationEl.value : '60') + ' min';
}

function publishExam() {
  const banner = document.getElementById('publishBanner');
  const btn = document.getElementById('publishBtn');

  if (banner) banner.classList.add('show');
  if (btn) {
    btn.textContent = '✓ Published';
    btn.disabled = true;
  }
}

function selectOpt(el) {
  document.querySelectorAll('#options .opt').forEach((o) => o.classList.remove('selected'));
  el.classList.add('selected');
}

let secs = 38 * 60 + 12;
setInterval(() => {
  if (secs <= 0) return;
  secs--;
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  const timerDisplay = document.getElementById('timerDisplay');
  if (timerDisplay) {
    timerDisplay.textContent = m + ':' + String(s).padStart(2, '0');
  }
}, 1000);

renderBank();
renderSelected();
renderTestbank();
