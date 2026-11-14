/**
 * MyBudgetGue - Core JavaScript Application
 * Arsitektur Frontend: Web Mobile Edition (Sunglow & Radiant White)
 * Mengelola state multi-halaman: Dashboard, Transaksi, Tambah Transaksi, Profil, Pengaturan, dan Auth.
 */

// ==========================================================================
// CONSTANTS & STORAGE KEYS
// ==========================================================================
const STORAGE_KEY_TRANSACTIONS = 'mybudgetgue_transactions';
const STORAGE_KEY_SETTINGS = 'mybudgetgue_settings';
const STORAGE_KEY_USER_PROFILE = 'mybudgetgue_user_profile';

// Nilai default pengaturan (Batas harian, bulanan, target tabungan, notifikasi)
const DEFAULT_SETTINGS = {
  batasHarian: 100000,
  batasBulanan: 3000000,
  targetTabungan: 10000000,
  tabunganSaatIni: 2500000,
  notifikasiAktif: true,
  waktuPengingat: '20:00',
  pushNotification: true,
  emailNotification: false
};

// Nilai default profil pengguna (Sesuai referensi Dorasaki)
const DEFAULT_USER_PROFILE = {
  username: 'Dorasaki',
  namaLengkap: 'Dorasaki Finansial',
  tanggalBergabung: '14 Nov 2026',
  streak: 0,
  poin: 0,
  unlockedBadges: [],
  voiceUsedCount: 0
};

// 8 Lencana Resmi sesuai referensi profil pengguna
const MASTER_BADGES = [
  {
    id: 'badge-streak-7',
    title: 'Pemula Streak',
    desc: 'Jaga streak 7 hari berturut-turut',
    icon: '💧',
    requiredStreak: 7,
    rewardPoin: 50
  },
  {
    id: 'badge-tabungan-50',
    title: 'Penabung Pemula',
    desc: 'Capai 50% target tabungan',
    icon: '🐣',
    rewardPoin: 50
  },
  {
    id: 'badge-catat-50',
    title: 'Pencatat Rajin',
    desc: 'Catat 50 transaksi',
    icon: '✏️',
    requiredTx: 50,
    rewardPoin: 50
  },
  {
    id: 'badge-disiplin-bulan',
    title: 'Disiplin Bulanan',
    desc: 'Tidak melebihi budget bulanan',
    icon: '📊',
    rewardPoin: 50
  },
  {
    id: 'badge-streak-30',
    title: 'Pejuang Streak',
    desc: 'Jaga streak 30 hari berturut-turut',
    icon: '⚡',
    requiredStreak: 30,
    rewardPoin: 100
  },
  {
    id: 'badge-catat-200',
    title: 'Pencatat Master',
    desc: 'Catat 200 transaksi',
    icon: '🎯',
    requiredTx: 200,
    rewardPoin: 100
  },
  {
    id: 'badge-tabungan-100',
    title: 'Penabung Hebat',
    desc: 'Capai 100% target tabungan',
    icon: '🏆',
    rewardPoin: 100
  },
  {
    id: 'badge-streak-100',
    title: 'Legenda Streak',
    desc: 'Jaga streak 100 hari berturut-turut',
    icon: '👑',
    requiredStreak: 100,
    rewardPoin: 200
  }
];

// Data awal transaksi
const SEED_TRANSACTIONS = [
  {
    id: 'tx-1',
    tipe: 'pemasukan',
    kategori: 'Gaji',
    nominal: 5000000,
    tanggal: '2026-11-01',
    keterangan: 'Gaji Bulanan'
  },
  {
    id: 'tx-2',
    tipe: 'pengeluaran',
    kategori: 'Makanan & Minuman',
    nominal: 45000,
    tanggal: '2026-11-14',
    keterangan: 'Makan siang kantor'
  },
  {
    id: 'tx-3',
    tipe: 'pengeluaran',
    kategori: 'Transportasi',
    nominal: 25000,
    tanggal: '2026-11-14',
    keterangan: 'Bensin motor'
  }
];

// ==========================================================================
// UTILITY & STORAGE FUNCTIONS
// ==========================================================================
function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(number || 0);
}

function formatDateIndo(dateStr) {
  if (!dateStr) return '-';
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(dateStr).toLocaleDateString('id-ID', options);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Get & Save Transaksi
function getTransactions() {
  const data = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(SEED_TRANSACTIONS));
    return [...SEED_TRANSACTIONS];
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function saveTransactions(transactions) {
  localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
}

// Get & Save Settings
function getSettings() {
  const data = localStorage.getItem(STORAGE_KEY_SETTINGS);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    return { ...DEFAULT_SETTINGS };
  }
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch (e) {
    return { ...DEFAULT_SETTINGS };
  }
}

function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
}

// Get & Save User Profile
function getUserProfile() {
  const data = localStorage.getItem(STORAGE_KEY_USER_PROFILE);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_USER_PROFILE, JSON.stringify(DEFAULT_USER_PROFILE));
    return { ...DEFAULT_USER_PROFILE };
  }
  try {
    return { ...DEFAULT_USER_PROFILE, ...JSON.parse(data) };
  } catch (e) {
    return { ...DEFAULT_USER_PROFILE };
  }
}

function saveUserProfile(profile) {
  localStorage.setItem(STORAGE_KEY_USER_PROFILE, JSON.stringify(profile));
}

function addPoints(amount, reason = '') {
  const profile = getUserProfile();
  profile.poin = (profile.poin || 0) + amount;
  saveUserProfile(profile);
  checkBadgeUnlocks();
  if (reason) {
    showToast(`+${amount} Poin: ${reason}! ⭐`, 'success');
  }
}

// ==========================================================================
// CALCULATIONS & FINANCIAL METRICS
// ==========================================================================
function calculateFinancialSummary() {
  const transactions = getTransactions();
  const settings = getSettings();

  let totalPemasukan = 0;
  let totalPengeluaran = 0;
  let pengeluaranBulanIni = 0;
  let pemasukanBulanIni = 0;

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  transactions.forEach((tx) => {
    const nominal = parseFloat(tx.nominal) || 0;
    const txDate = new Date(tx.tanggal);

    if (tx.tipe === 'pemasukan') {
      totalPemasukan += nominal;
      if (txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear) {
        pemasukanBulanIni += nominal;
      }
    } else if (tx.tipe === 'pengeluaran') {
      totalPengeluaran += nominal;
      if (txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear) {
        pengeluaranBulanIni += nominal;
      }
    }
  });

  const totalSaldo = totalPemasukan - totalPengeluaran;
  const sisaAnggaranBulanan = settings.batasBulanan - pengeluaranBulanIni;
  const persentaseBulanan = settings.batasBulanan > 0 ? (pengeluaranBulanIni / settings.batasBulanan) * 100 : 0;

  return {
    totalSaldo,
    totalPemasukan,
    totalPengeluaran,
    pemasukanBulanIni,
    pengeluaranBulanIni,
    batasBulanan: settings.batasBulanan,
    batasHarian: settings.batasHarian,
    sisaAnggaranBulanan,
    persentaseBulanan
  };
}

// Cek Buka Kunci Lencana
function checkBadgeUnlocks() {
  const profile = getUserProfile();
  const settings = getSettings();
  const transactions = getTransactions();
  const txCount = transactions.length;

  let unlocked = profile.unlockedBadges || [];
  let newlyUnlocked = [];

  // 1. Streak 7 hari
  if (profile.streak >= 7 && !unlocked.includes('badge-streak-7')) {
    unlocked.push('badge-streak-7');
    newlyUnlocked.push('Pemula Streak 💧');
  }

  // 2. Tabungan 50%
  const tabunganPersen = settings.targetTabungan > 0 ? (settings.tabunganSaatIni / settings.targetTabungan) * 100 : 0;
  if (tabunganPersen >= 50 && !unlocked.includes('badge-tabungan-50')) {
    unlocked.push('badge-tabungan-50');
    newlyUnlocked.push('Penabung Pemula 🐣');
  }

  // 3. Catat 50 transaksi
  if (txCount >= 50 && !unlocked.includes('badge-catat-50')) {
    unlocked.push('badge-catat-50');
    newlyUnlocked.push('Pencatat Rajin ✏️');
  }

  // 4. Tabungan 100%
  if (tabunganPersen >= 100 && !unlocked.includes('badge-tabungan-100')) {
    unlocked.push('badge-tabungan-100');
    newlyUnlocked.push('Penabung Hebat 🏆');
  }

  if (newlyUnlocked.length > 0) {
    profile.unlockedBadges = unlocked;
    saveUserProfile(profile);
    newlyUnlocked.forEach((title) => showToast(`Lencana Terbuka: ${title}!`, 'success'));
  }
}

// ==========================================================================
// TOAST NOTIFICATION
// ==========================================================================
function showToast(message, type = 'success') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-2 max-w-xs w-full px-4 pointer-events-none';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const bgClass = type === 'danger' ? 'bg-rose-600 text-white' : 'bg-slate-900 text-amber-300 border border-amber-400/40';
  toast.className = `${bgClass} px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold transition-all duration-300 opacity-0 translate-y-3 pointer-events-auto`;
  toast.innerHTML = `
    <span class="text-base">${type === 'danger' ? '⚠️' : '✨'}</span>
    <span class="flex-1">${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => toast.classList.remove('opacity-0', 'translate-y-3'), 10);
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// ==========================================================================
// MOBILE DRAWER TOGGLE (Closed by default)
// ==========================================================================
function toggleMobileMenu() {
  const drawer = document.getElementById('mobileSidebarDrawer');
  const overlay = document.getElementById('mobileSidebarOverlay');
  if (!drawer || !overlay) return;

  const isClosed = drawer.classList.contains('-translate-x-full');
  if (isClosed) {
    drawer.classList.remove('-translate-x-full');
    overlay.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  } else {
    drawer.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
}

function closeMobileMenu() {
  const drawer = document.getElementById('mobileSidebarDrawer');
  const overlay = document.getElementById('mobileSidebarOverlay');
  if (drawer && overlay) {
    drawer.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
}

// ==========================================================================
// DASHBOARD INITIALIZER
// ==========================================================================
function initDashboardPage() {
  const summary = calculateFinancialSummary();
  const profile = getUserProfile();

  // Header Elements
  const elUsername = document.getElementById('dashUsername');
  const elDate = document.getElementById('dashCurrentDate');
  const elPoin = document.getElementById('dashUserPoin');
  const elStreak = document.getElementById('dashStreakCount');

  if (elUsername) elUsername.textContent = profile.username;
  if (elDate) {
    const now = new Date();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    elDate.textContent = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  }
  if (elPoin) elPoin.textContent = `${profile.poin} poin`;
  if (elStreak) elStreak.textContent = `${profile.streak} hari`;

  // 3 Metric Cards
  const elSaldo = document.getElementById('dashTotalSaldo');
  const elMasuk = document.getElementById('dashPemasukanBulanIni');
  const elKeluar = document.getElementById('dashPengeluaranBulanIni');

  if (elSaldo) elSaldo.textContent = formatRupiah(summary.totalSaldo);
  if (elMasuk) elMasuk.textContent = formatRupiah(summary.pemasukanBulanIni);
  if (elKeluar) elKeluar.textContent = formatRupiah(summary.pengeluaranBulanIni);

  // 2 Budget Cards
  const elBudgetHarian = document.getElementById('dashBudgetHarian');
  const elBudgetBulanan = document.getElementById('dashBudgetBulanan');

  if (elBudgetHarian) {
    elBudgetHarian.textContent = summary.batasHarian > 0 ? formatRupiah(summary.batasHarian) : '+ Atur batas harian';
  }
  if (elBudgetBulanan) {
    elBudgetBulanan.textContent = summary.batasBulanan > 0 ? formatRupiah(summary.batasBulanan) : '+ Atur batas bulanan';
  }

  // Transaksi Terbaru
  renderDashboardRecentTransactions();
}

function renderDashboardRecentTransactions() {
  const container = document.getElementById('dashRecentTransactionsList');
  if (!container) return;

  const transactions = getTransactions();
  const recent = transactions.slice(0, 4);

  if (recent.length === 0) {
    container.innerHTML = `
      <div class="py-8 flex flex-col items-center justify-center text-center">
        <span class="text-3xl mb-2">📋</span>
        <p class="text-xs font-semibold text-slate-500">Belum ada transaksi</p>
        <a href="tambah-transaksi.html" class="text-xs text-amber-700 font-bold mt-1 hover:underline">+ Catat pertama kamu</a>
      </div>
    `;
    return;
  }

  container.innerHTML = recent
    .map((tx) => {
      const isIncome = tx.tipe === 'pemasukan';
      const sign = isIncome ? '+' : '-';
      const colorClass = isIncome ? 'text-emerald-700' : 'text-rose-700';
      const icon = isIncome ? '💰' : '💸';

      return `
        <div class="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-b-0 text-xs">
          <div class="flex items-center gap-2.5">
            <span class="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-sm shadow-2xs">${icon}</span>
            <div>
              <p class="font-bold text-slate-800 leading-tight">${escapeHtml(tx.keterangan || tx.kategori)}</p>
              <span class="text-[10px] text-slate-500">${formatDateIndo(tx.tanggal)} • ${escapeHtml(tx.kategori)}</span>
            </div>
          </div>
          <strong class="font-bold text-sm ${colorClass} whitespace-nowrap">${sign} ${formatRupiah(tx.nominal)}</strong>
        </div>
      `;
    })
    .join('');
}

// ==========================================================================
// RIWAYAT TRANSAKSI INITIALIZER
// ==========================================================================
function initTransaksiPage() {
  const summary = calculateFinancialSummary();
  const elTotalMasuk = document.getElementById('txTotalMasuk');
  const elTotalKeluar = document.getElementById('txTotalKeluar');

  if (elTotalMasuk) elTotalMasuk.textContent = formatRupiah(summary.totalPemasukan);
  if (elTotalKeluar) elTotalKeluar.textContent = formatRupiah(summary.totalPengeluaran);

  renderFilterTransactions('semua');
}

function renderFilterTransactions(filterType = 'semua') {
  const container = document.getElementById('txListContainer');
  if (!container) return;

  let transactions = getTransactions();
  if (filterType === 'masuk') {
    transactions = transactions.filter((tx) => tx.tipe === 'pemasukan');
  } else if (filterType === 'keluar') {
    transactions = transactions.filter((tx) => tx.tipe === 'pengeluaran');
  }

  if (transactions.length === 0) {
    container.innerHTML = `
      <div class="py-12 flex flex-col items-center justify-center text-center">
        <span class="text-4xl mb-2">📁</span>
        <p class="text-xs font-semibold text-slate-500">Tidak ada transaksi</p>
        <a href="tambah-transaksi.html" class="mt-3 btn-sunglow px-4 py-2 rounded-xl text-xs font-bold inline-block shadow-xs">
          + Catat Sekarang
        </a>
      </div>
    `;
    return;
  }

  container.innerHTML = transactions
    .map((tx) => {
      const isIncome = tx.tipe === 'pemasukan';
      const sign = isIncome ? '+' : '-';
      const colorClass = isIncome ? 'text-emerald-700' : 'text-rose-700';

      return `
        <div class="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-slate-100 shadow-2xs hover:border-amber-200 transition-all text-xs">
          <div class="flex items-center gap-3">
            <span class="w-9 h-9 rounded-xl ${isIncome ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'} flex items-center justify-center text-sm font-bold">
              ${isIncome ? '↓' : '↑'}
            </span>
            <div>
              <p class="font-bold text-slate-900">${escapeHtml(tx.keterangan || tx.kategori)}</p>
              <p class="text-[10px] text-slate-500">${formatDateIndo(tx.tanggal)} • <span class="text-amber-800 font-semibold">${escapeHtml(tx.kategori)}</span></p>
            </div>
          </div>
          <div class="text-right">
            <strong class="text-sm font-extrabold ${colorClass} block">${sign} ${formatRupiah(tx.nominal)}</strong>
            <button onclick="handleDeleteTx('${tx.id}')" class="text-[10px] text-slate-400 hover:text-rose-600 transition-colors">Hapus</button>
          </div>
        </div>
      `;
    })
    .join('');
}

function handleDeleteTx(id) {
  if (confirm('Hapus transaksi ini?')) {
    let txs = getTransactions().filter((tx) => tx.id !== id);
    saveTransactions(txs);
    showToast('Transaksi dihapus.', 'danger');
    initTransaksiPage();
  }
}

// ==========================================================================
// TAMBAH TRANSAKSI PAGE INITIALIZER (Manual & Voice)
// ==========================================================================
let currentSelectedCategory = 'Belanja';
let currentTransactionType = 'pengeluaran';

function initTambahTransaksiPage() {
  const form = document.getElementById('addTransactionForm');
  const dateInput = document.getElementById('txTanggal');

  if (dateInput) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }

  // Cek apakah dipanggil dengan URL parameter ?voice=1
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('voice') === '1') {
    setTimeout(() => {
      startVoiceInPage();
    }, 400);
  }

  // Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nominalInput = document.getElementById('txJumlah');
      const deskripsiInput = document.getElementById('txDeskripsi');
      const catatanInput = document.getElementById('txCatatan');

      const nominal = parseFloat(nominalInput?.value || 0);
      if (!nominal || nominal <= 0) {
        alert('Mohon masukkan nominal transaksi yang valid.');
        nominalInput?.focus();
        return;
      }

      const newTx = {
        id: 'tx-' + Date.now(),
        tipe: currentTransactionType,
        nominal: nominal,
        kategori: currentSelectedCategory || 'Lain-lain',
        keterangan: deskripsiInput?.value.trim() || currentSelectedCategory,
        tanggal: dateInput?.value || new Date().toISOString().split('T')[0],
        catatan: catatanInput?.value.trim() || ''
      };

      const transactions = getTransactions();
      transactions.unshift(newTx);
      saveTransactions(transactions);

      // Hadiah Poin (+10 Poin)
      addPoints(10, 'Mencatat Transaksi');

      // Update Streak jika hari ini belum tercatat
      const profile = getUserProfile();
      profile.streak = (profile.streak || 0) + 1;
      saveUserProfile(profile);

      showToast('Transaksi berhasil disimpan! (+10 Poin)', 'success');
      setTimeout(() => {
        window.location.href = 'transaksi.html';
      }, 800);
    });
  }
}

function setTransactionType(type) {
  currentTransactionType = type;
  const btnPengeluaran = document.getElementById('btnTypePengeluaran');
  const btnPemasukan = document.getElementById('btnTypePemasukan');
  const categoryContainer = document.getElementById('categoryIconGrid');

  if (type === 'pengeluaran') {
    if (btnPengeluaran) btnPengeluaran.className = 'flex-1 py-2 rounded-xl text-xs font-bold bg-rose-500 text-white shadow-xs';
    if (btnPemasukan) btnPemasukan.className = 'flex-1 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800';
    renderCategoryGrid('pengeluaran');
  } else {
    if (btnPengeluaran) btnPengeluaran.className = 'flex-1 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800';
    if (btnPemasukan) btnPemasukan.className = 'flex-1 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-white shadow-xs';
    renderCategoryGrid('pemasukan');
  }
}

function renderCategoryGrid(type) {
  const container = document.getElementById('categoryIconGrid');
  if (!container) return;

  const categories =
    type === 'pengeluaran'
      ? [
          { name: 'Belanja', icon: '🛍️' },
          { name: 'Hiburan', icon: '🎮' },
          { name: 'Kesehatan', icon: '🏥' },
          { name: 'Lain-lain Keluar', icon: '📦' },
          { name: 'Makanan & Minuman', icon: '🍜' },
          { name: 'Pendidikan', icon: '🎓' },
          { name: 'Tagihan', icon: '🧾' },
          { name: 'Transportasi', icon: '🚗' }
        ]
      : [
          { name: 'Gaji', icon: '💵' },
          { name: 'Freelance', icon: '💻' },
          { name: 'Investasi', icon: '📈' },
          { name: 'Bonus', icon: '🎁' },
          { name: 'Penjualan', icon: '🏷️' },
          { name: 'Hadiah', icon: '🎉' },
          { name: 'Dividen', icon: '🪙' },
          { name: 'Lain-lain Masuk', icon: '📥' }
        ];

  currentSelectedCategory = categories[0].name;

  container.innerHTML = categories
    .map(
      (cat, idx) => `
      <button 
        type="button" 
        onclick="selectCategory('${cat.name}', this)" 
        class="category-btn ${idx === 0 ? 'border-amber-400 bg-amber-50/80 ring-2 ring-amber-300' : 'border-slate-200 bg-white'} p-2.5 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all hover:border-amber-300 active:scale-95 shadow-2xs"
      >
        <span class="text-xl">${cat.icon}</span>
        <span class="text-[10px] font-bold text-slate-800 line-clamp-1">${cat.name}</span>
      </button>
    `
    )
    .join('');
}

function selectCategory(name, btnElement) {
  currentSelectedCategory = name;
  document.querySelectorAll('.category-btn').forEach((btn) => {
    btn.classList.remove('border-amber-400', 'bg-amber-50/80', 'ring-2', 'ring-amber-300');
    btn.classList.add('border-slate-200', 'bg-white');
  });
  if (btnElement) {
    btnElement.classList.add('border-amber-400', 'bg-amber-50/80', 'ring-2', 'ring-amber-300');
    btnElement.classList.remove('border-slate-200', 'bg-white');
  }
}

// In-Page Web Speech Recognition untuk Tambah Transaksi
let inPageRecognition = null;

function startVoiceInPage() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const statusEl = document.getElementById('voiceBoxStatus');
  const transcriptEl = document.getElementById('voiceBoxTranscript');

  if (!SpeechRecognition) {
    showToast('Browser tidak mendukung Speech API. Gunakan tombol simulasi di bawah.', 'danger');
    return;
  }

  if (!inPageRecognition) {
    inPageRecognition = new SpeechRecognition();
    inPageRecognition.lang = 'id-ID';
    inPageRecognition.interimResults = true;

    inPageRecognition.onstart = () => {
      if (statusEl) statusEl.textContent = '🔴 Mendengarkan suara Anda... Katakan contoh: "Makan siang tiga puluh lima ribu"';
    };

    inPageRecognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join('');
      if (transcriptEl) transcriptEl.textContent = `"${transcript}"`;

      if (event.results[0].isFinal) {
        applyVoiceToForm(transcript);
      }
    };

    inPageRecognition.onerror = (e) => {
      if (statusEl) statusEl.textContent = 'Izin mikrofon belum aktif atau selesai.';
    };

    inPageRecognition.onend = () => {
      if (statusEl) statusEl.textContent = 'Ketuk mikrofon untuk bicara';
    };
  }

  try {
    inPageRecognition.start();
  } catch (err) {
    console.warn(err);
  }
}

function applyVoiceToForm(text) {
  const raw = text.toLowerCase();
  const inputJumlah = document.getElementById('txJumlah');
  const inputDeskripsi = document.getElementById('txDeskripsi');

  // Deteksi nominal
  let nominal = 0;
  const jt = raw.match(/(\d+(?:[.,]\d+)?)\s*(?:juta|jt)/);
  if (jt) nominal = parseFloat(jt[1].replace(',', '.')) * 1000000;
  if (!nominal) {
    const rb = raw.match(/(\d+(?:[.,]\d+)?)\s*(?:ribu|rb|k)/);
    if (rb) nominal = parseFloat(rb[1].replace(',', '.')) * 1000;
  }
  if (!nominal) {
    const digits = raw.match(/\b\d+\b/);
    if (digits) nominal = parseFloat(digits[0]);
  }

  if (nominal && inputJumlah) inputJumlah.value = nominal;
  if (inputDeskripsi) inputDeskripsi.value = text.trim();

  // Deteksi tipe
  if (raw.includes('gaji') || raw.includes('pemasukan') || raw.includes('terima') || raw.includes('freelance') || raw.includes('bonus')) {
    setTransactionType('pemasukan');
  } else {
    setTransactionType('pengeluaran');
  }

  showToast('Suara berhasil dianalisis ke dalam formulir!', 'success');
}

// ==========================================================================
// PROFIL PAGE INITIALIZER
// ==========================================================================
function initProfilPage() {
  const profile = getUserProfile();
  const settings = getSettings();
  const transactions = getTransactions();

  const elUsername = document.getElementById('profileUsername');
  const elDate = document.getElementById('profileJoinDate');
  const elStreak = document.getElementById('profileStreak');
  const elPoin = document.getElementById('profilePoin');
  const elLencanaCount = document.getElementById('profileLencanaCount');
  const elBadgeTitle = document.getElementById('profileBadgeHeaderTitle');

  if (elUsername) elUsername.textContent = profile.username;
  if (elDate) elDate.textContent = `Bergabung sejak ${profile.tanggalBergabung}`;
  if (elStreak) elStreak.textContent = profile.streak;
  if (elPoin) elPoin.textContent = profile.poin;

  const unlockedCount = (profile.unlockedBadges || []).length;
  if (elLencanaCount) elLencanaCount.textContent = unlockedCount;
  if (elBadgeTitle) elBadgeTitle.textContent = `Koleksi Lencana (${unlockedCount}/8)`;

  // Render 8 Badges Grid
  const badgeContainer = document.getElementById('profileBadgeGrid');
  if (badgeContainer) {
    badgeContainer.innerHTML = MASTER_BADGES.map((b) => {
      const isUnlocked = (profile.unlockedBadges || []).includes(b.id);
      return `
        <div class="p-3 rounded-2xl border text-center ${isUnlocked ? 'badge-unlocked' : 'badge-locked'} flex flex-col items-center justify-between shadow-2xs">
          <span class="text-3xl mb-1">${b.icon}</span>
          <h5 class="text-xs font-bold text-slate-800 leading-tight">${b.title}</h5>
          <p class="text-[10px] text-slate-500 mt-0.5 line-clamp-2">${b.desc}</p>
          <span class="mt-2 text-[9px] font-bold ${isUnlocked ? 'text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full' : 'text-slate-400'}">
            ${isUnlocked ? '✓ Terbuka' : '🔒 Terkunci'}
          </span>
        </div>
      `;
    }).join('');
  }
}

// ==========================================================================
// PENGATURAN PAGE INITIALIZER
// ==========================================================================
function initPengaturanPage() {
  const settings = getSettings();

  const inpHarian = document.getElementById('setBatasHarian');
  const inpBulanan = document.getElementById('setBatasBulanan');
  const inpTarget = document.getElementById('setNominalTarget');
  const inpTabungan = document.getElementById('setTabunganSaatIni');

  const togNotif = document.getElementById('setNotifikasiAktif');
  const inpWaktu = document.getElementById('setWaktuPengingat');
  const togPush = document.getElementById('setPushNotification');
  const togEmail = document.getElementById('setEmailNotification');
  const form = document.getElementById('settingsForm');

  if (inpHarian) inpHarian.value = settings.batasHarian;
  if (inpBulanan) inpBulanan.value = settings.batasBulanan;
  if (inpTarget) inpTarget.value = settings.targetTabungan;
  if (inpTabungan) inpTabungan.value = settings.tabunganSaatIni;

  if (togNotif) togNotif.checked = settings.notifikasiAktif;
  if (inpWaktu) inpWaktu.value = settings.waktuPengingat;
  if (togPush) togPush.checked = settings.pushNotification;
  if (togEmail) togEmail.checked = settings.emailNotification;

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const newSettings = {
        batasHarian: parseFloat(inpHarian?.value || 0),
        batasBulanan: parseFloat(inpBulanan?.value || 0),
        targetTabungan: parseFloat(inpTarget?.value || 0),
        tabunganSaatIni: parseFloat(inpTabungan?.value || 0),
        notifikasiAktif: togNotif ? togNotif.checked : true,
        waktuPengingat: inpWaktu?.value || '20:00',
        pushNotification: togPush ? togPush.checked : true,
        emailNotification: togEmail ? togEmail.checked : false
      };

      saveSettings(newSettings);
      checkBadgeUnlocks();
      showToast('Pengaturan berhasil disimpan!', 'success');
    });
  }
}

// ==========================================================================
// GLOBAL INITIALIZATION DISPATCHER
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Mobile drawer listener
  const hamburgerBtn = document.getElementById('hamburgerMenuBtn');
  const closeDrawerBtn = document.getElementById('closeSidebarDrawerBtn');
  const overlay = document.getElementById('mobileSidebarOverlay');

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', toggleMobileMenu);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeMobileMenu);
  if (overlay) overlay.addEventListener('click', closeMobileMenu);

  // Router sederhana per halaman
  if (document.getElementById('dashRecentTransactionsList')) {
    initDashboardPage();
  }
  if (document.getElementById('txListContainer')) {
    initTransaksiPage();
  }
  if (document.getElementById('addTransactionForm')) {
    initTambahTransaksiPage();
  }
  if (document.getElementById('profileBadgeGrid')) {
    initProfilPage();
  }
  if (document.getElementById('settingsForm')) {
    initPengaturanPage();
  }
});
