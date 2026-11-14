/**
 * MyBudgetGue - Core JavaScript Application
 * Arsitektur Frontend: Web Mobile Edition (Sunglow & Radiant White)
 * Fitur Utama Lengkap:
 * 1. Pencatatan Instan (Shortcut) untuk Transaksi Mikro
 * 2. Sistem Peringatan Visual Batas Pengeluaran (Indikator Hijau, Kuning, Merah)
 * 3. Laporan Analitik Pengeluaran Otomatis (Mingguan / Bulanan)
 * 4. Sistem Gamifikasi (Daily Streak, Poin, dan 8 Lencana)
 */

// ==========================================================================
// CONSTANTS & STORAGE KEYS
// ==========================================================================
const STORAGE_KEY_TRANSACTIONS = 'mybudgetgue_transactions';
const STORAGE_KEY_SETTINGS = 'mybudgetgue_settings';
const STORAGE_KEY_USER_PROFILE = 'mybudgetgue_user_profile';

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

const DEFAULT_USER_PROFILE = {
  username: 'Dorasaki',
  namaLengkap: 'Dorasaki Finansial',
  tanggalBergabung: '14 Nov 2026',
  streak: 5,
  poin: 120,
  unlockedBadges: ['badge-streak-7'],
  voiceUsedCount: 1
};

// 8 Lencana Resmi
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

// Presets Shortcut Transaksi Mikro
const MICRO_SHORTCUTS = [
  { id: 'sc-kopi', name: 'Kopi', nominal: 15000, kategori: 'Makanan & Minuman', icon: '☕' },
  { id: 'sc-parkir', name: 'Parkir', nominal: 2000, kategori: 'Transportasi', icon: '🅿️' },
  { id: 'sc-bensin', name: 'Bensin', nominal: 20000, kategori: 'Transportasi', icon: '⛽' },
  { id: 'sc-makan', name: 'Makan', nominal: 25000, kategori: 'Makanan & Minuman', icon: '🍛' },
  { id: 'sc-snack', name: 'Snack', nominal: 10000, kategori: 'Makanan & Minuman', icon: '🧃' },
  { id: 'sc-pulsa', name: 'Pulsa', nominal: 25000, kategori: 'Tagihan', icon: '📱' }
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
  },
  {
    id: 'tx-4',
    tipe: 'pengeluaran',
    kategori: 'Tagihan',
    nominal: 350000,
    tanggal: '2026-11-10',
    keterangan: 'Tagihan Listrik & WiFi'
  },
  {
    id: 'tx-5',
    tipe: 'pengeluaran',
    kategori: 'Belanja',
    nominal: 200000,
    tanggal: '2026-11-08',
    keterangan: 'Belanja Keperluan Harian'
  },
  {
    id: 'tx-6',
    tipe: 'pemasukan',
    kategori: 'Freelance',
    nominal: 1200000,
    tanggal: '2026-11-05',
    keterangan: 'Proyek Desain Web'
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
// 1. SHORTCUT TRANSAKSI MIKRO (PENCATATAN INSTAN 1-KLIK)
// ==========================================================================
function recordMicroShortcut(shortcutId) {
  const sc = MICRO_SHORTCUTS.find((item) => item.id === shortcutId);
  if (!sc) return;

  const newTx = {
    id: 'tx-micro-' + Date.now(),
    tipe: 'pengeluaran',
    nominal: sc.nominal,
    kategori: sc.kategori,
    keterangan: `${sc.icon} ${sc.name} (Shortcut Mikro)`,
    tanggal: new Date().toISOString().split('T')[0],
    catatan: 'Dicatat instan lewat Shortcut Transaksi Mikro'
  };

  const transactions = getTransactions();
  transactions.unshift(newTx);
  saveTransactions(transactions);

  // Gamifikasi: Tambah poin (+10 poin)
  addPoints(10, `Shortcut ${sc.name}`);

  // Update streak
  const profile = getUserProfile();
  profile.streak = (profile.streak || 0) + 1;
  saveUserProfile(profile);

  showToast(`Tercatat: ${sc.icon} ${sc.name} ${formatRupiah(sc.nominal)}! (+10 Poin)`, 'success');

  // Refresh reactive view
  if (document.getElementById('dashRecentTransactionsList')) initDashboardPage();
  if (document.getElementById('txListContainer')) initTransaksiPage();
  if (document.getElementById('analyticExpenseChart')) initAnalitikPage();
}

function renderMicroShortcuts(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = MICRO_SHORTCUTS.map(
    (sc) => `
    <button 
      type="button" 
      onclick="recordMicroShortcut('${sc.id}')"
      class="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white border border-amber-200/90 hover:border-amber-400 hover:bg-amber-50/80 active:scale-95 transition-all shadow-2xs cursor-pointer flex-shrink-0"
      title="Catat instan ${sc.name} ${formatRupiah(sc.nominal)}"
    >
      <span class="text-base">${sc.icon}</span>
      <div class="text-left">
        <span class="block text-[11px] font-bold text-slate-800 leading-tight">${sc.name}</span>
        <span class="block text-[10px] font-extrabold text-amber-700">${formatRupiah(sc.nominal)}</span>
      </div>
    </button>
  `
  ).join('');
}

// ==========================================================================
// 2. SISTEM PERINGATAN VISUAL BATAS PENGELUARAN (HIJAU, KUNING, MERAH)
// ==========================================================================
function calculateFinancialSummary() {
  const transactions = getTransactions();
  const settings = getSettings();

  let totalPemasukan = 0;
  let totalPengeluaran = 0;
  let pengeluaranBulanIni = 0;
  let pemasukanBulanIni = 0;
  let pengeluaranHariIni = 0;

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const todayStr = now.toISOString().split('T')[0];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const currentDay = now.getDate();
  const remainingDays = Math.max(1, daysInMonth - currentDay + 1);

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
      if (tx.tanggal === todayStr) {
        pengeluaranHariIni += nominal;
      }
    }
  });

  const totalSaldo = totalPemasukan - totalPengeluaran;
  const sisaAnggaranBulanan = settings.batasBulanan - pengeluaranBulanIni;
  const sisaAnggaranHarian = settings.batasHarian - pengeluaranHariIni;
  const persentaseBulanan = settings.batasBulanan > 0 ? (pengeluaranBulanIni / settings.batasBulanan) * 100 : 0;
  const persentaseHarian = settings.batasHarian > 0 ? (pengeluaranHariIni / settings.batasHarian) * 100 : 0;

  /**
   * Logika Peringatan Visual Tiga Tingkat:
   * 1. 🟢 AMAN (Hijau)       : < 70% dari batas bulanan
   * 2. 🟡 PERINGATAN (Kuning) : 70% s/d 90% dari batas bulanan
   * 3. 🔴 KRITIS (Merah)      : > 90% atau pengeluaran melebihi limit
   */
  let warningStatus = {
    level: 'safe',
    colorName: 'green',
    label: 'Aman',
    title: 'Status Anggaran: Aman',
    desc: `Pengeluaran bulan ini masih dalam batas aman (${persentaseBulanan.toFixed(1)}% terpakai).`,
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    bannerClass: 'bg-emerald-50/90 text-emerald-900 border-emerald-300',
    dotColor: '#10b981',
    progressBarColor: '#10b981'
  };

  if (persentaseBulanan > 90 || sisaAnggaranBulanan < 0) {
    warningStatus = {
      level: 'danger',
      colorName: 'red',
      label: 'Kritis / Terlampaui',
      title: '🚨 Peringatan: Batas Anggaran Terlampaui!',
      desc: `Pengeluaran telah mencapai ${persentaseBulanan.toFixed(1)}% dari batas limit bulanan. Segera kurangi pengeluaran!`,
      badgeClass: 'bg-rose-50 text-rose-800 border-rose-300',
      bannerClass: 'bg-rose-50/95 text-rose-900 border-rose-300 shadow-sm',
      dotColor: '#ef4444',
      progressBarColor: '#ef4444'
    };
  } else if (persentaseBulanan >= 70) {
    warningStatus = {
      level: 'warning',
      colorName: 'yellow',
      label: 'Mendekati Batas',
      title: '⚠️ Waspada: Mendekati Batas Anggaran',
      desc: `Pengeluaran telah mencapai ${persentaseBulanan.toFixed(1)}% dari kuota. Atur prioritas belanja!`,
      badgeClass: 'bg-amber-50 text-amber-900 border-amber-300',
      bannerClass: 'bg-amber-50/90 text-amber-900 border-amber-300',
      dotColor: '#f59e0b',
      progressBarColor: '#f59e0b'
    };
  }

  return {
    totalSaldo,
    totalPemasukan,
    totalPengeluaran,
    pemasukanBulanIni,
    pengeluaranBulanIni,
    pengeluaranHariIni,
    batasBulanan: settings.batasBulanan,
    batasHarian: settings.batasHarian,
    sisaAnggaranBulanan,
    sisaAnggaranHarian,
    remainingDays,
    persentaseBulanan,
    persentaseHarian,
    warningStatus
  };
}

// Render Banner Peringatan Visual di Dashboard
function renderVisualWarningBanner(summary) {
  const bannerContainer = document.getElementById('visualBudgetWarningBanner');
  if (!bannerContainer) return;

  const w = summary.warningStatus;
  bannerContainer.className = `p-3.5 rounded-2xl border ${w.bannerClass} transition-all duration-300 flex items-start gap-3 shadow-2xs`;
  bannerContainer.innerHTML = `
    <span class="w-2.5 h-2.5 rounded-full status-pulse-dot mt-1 flex-shrink-0" style="background-color: ${w.dotColor}"></span>
    <div class="flex-1 min-w-0">
      <div class="flex items-center justify-between gap-2">
        <h4 class="text-xs font-extrabold leading-tight">${w.title}</h4>
        <span class="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full ${w.badgeClass} flex-shrink-0">
          ${w.label}
        </span>
      </div>
      <p class="text-[11px] opacity-90 mt-0.5 leading-snug">${w.desc}</p>
      
      <!-- Progress Bar Visual -->
      <div class="mt-2.5 flex items-center gap-2">
        <div class="flex-1 bg-black/10 rounded-full h-1.5 overflow-hidden">
          <div class="h-full rounded-full transition-all duration-500" style="width: ${Math.min(summary.persentaseBulanan, 100)}%; background-color: ${w.progressBarColor};"></div>
        </div>
        <span class="text-[10px] font-extrabold">${summary.persentaseBulanan.toFixed(0)}%</span>
      </div>
    </div>
  `;
}

// ==========================================================================
// 3. LAPORAN ANALITIK PENGELUARAN OTOMATIS (MINGGUAN / BULANAN)
// ==========================================================================
let currentAnalyticPeriod = 'mingguan'; // 'mingguan' atau 'bulanan'

function calculateAnalyticsData(period = 'mingguan') {
  const transactions = getTransactions();
  const now = new Date();
  const expenses = transactions.filter((tx) => tx.tipe === 'pengeluaran');

  let filteredExpenses = [];
  let dayLabels = [];
  let dayAmounts = [0, 0, 0, 0, 0, 0, 0];

  if (period === 'mingguan') {
    // 7 hari terakhir
    dayLabels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    filteredExpenses = expenses.filter((tx) => new Date(tx.tanggal) >= sevenDaysAgo);

    // Hitung per hari
    filteredExpenses.forEach((tx) => {
      const d = new Date(tx.tanggal);
      const dayIndex = (d.getDay() + 6) % 7; // Ubah Minggu=0 jadi Senin=0
      dayAmounts[dayIndex] += parseFloat(tx.nominal) || 0;
    });
  } else {
    // Bulanan: Bulan berjalan
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    filteredExpenses = expenses.filter((tx) => {
      const d = new Date(tx.tanggal);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    // 4 Minggu representatif
    dayLabels = ['Mg 1', 'Mg 2', 'Mg 3', 'Mg 4'];
    dayAmounts = [0, 0, 0, 0];
    filteredExpenses.forEach((tx) => {
      const d = new Date(tx.tanggal).getDate();
      const weekIndex = Math.min(3, Math.floor((d - 1) / 7));
      dayAmounts[weekIndex] += parseFloat(tx.nominal) || 0;
    });
  }

  // Hitung total & kategori breakdown
  let totalPeriodExpense = 0;
  const categoryMap = {};

  filteredExpenses.forEach((tx) => {
    const nominal = parseFloat(tx.nominal) || 0;
    totalPeriodExpense += nominal;
    categoryMap[tx.kategori] = (categoryMap[tx.kategori] || 0) + nominal;
  });

  // Urutkan kategori terbesar
  const categoryBreakdown = Object.keys(categoryMap)
    .map((cat) => ({
      category: cat,
      amount: categoryMap[cat],
      percentage: totalPeriodExpense > 0 ? (categoryMap[cat] / totalPeriodExpense) * 100 : 0
    }))
    .sort((a, b) => b.amount - a.amount);

  const topCategory = categoryBreakdown[0] || { category: 'Belum ada data', amount: 0, percentage: 0 };
  const avgPerDay = period === 'mingguan' ? totalPeriodExpense / 7 : totalPeriodExpense / Math.max(1, now.getDate());

  return {
    period,
    totalPeriodExpense,
    avgPerDay,
    topCategory,
    categoryBreakdown,
    dayLabels,
    dayAmounts,
    maxDayAmount: Math.max(...dayAmounts, 1)
  };
}

// Render Kartu Analitik di Dashboard
function renderDashboardAnalyticsWidget(period = 'mingguan') {
  currentAnalyticPeriod = period;
  const container = document.getElementById('dashAnalyticsWidget');
  if (!container) return;

  const data = calculateAnalyticsData(period);

  container.innerHTML = `
    <div class="flex items-center justify-between pb-3 border-b border-slate-100">
      <div>
        <h3 class="text-xs font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
          <span>📊</span> Laporan Analitik Otomatis
        </h3>
        <p class="text-[10px] text-slate-400 font-medium mt-0.5">Ringkasan pengeluaran cerdas berbasis data</p>
      </div>

      <!-- Toggle Mingguan / Bulanan -->
      <div class="flex bg-slate-100 p-0.5 rounded-xl text-[10px] font-bold">
        <button 
          type="button" 
          onclick="renderDashboardAnalyticsWidget('mingguan')" 
          class="px-2 py-1 rounded-lg ${period === 'mingguan' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'} cursor-pointer"
        >
          Mingguan
        </button>
        <button 
          type="button" 
          onclick="renderDashboardAnalyticsWidget('bulanan')" 
          class="px-2 py-1 rounded-lg ${period === 'bulanan' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'} cursor-pointer"
        >
          Bulanan
        </button>
      </div>
    </div>

    <!-- Ringkasan Angka Analitik -->
    <div class="grid grid-cols-2 gap-2 pt-1">
      <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
        <span class="text-[10px] text-slate-400 font-medium block">Total ${period === 'mingguan' ? '7 Hari' : 'Bulan Ini'}</span>
        <strong class="text-xs font-extrabold text-slate-900 block truncate">${formatRupiah(data.totalPeriodExpense)}</strong>
      </div>
      <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
        <span class="text-[10px] text-slate-400 font-medium block">Kategori Terbesar</span>
        <strong class="text-xs font-extrabold text-amber-700 block truncate">${escapeHtml(data.topCategory.category)}</strong>
      </div>
    </div>

    <!-- Visual Bar Chart Mini -->
    <div class="pt-2">
      <div class="flex items-end justify-between gap-1.5 h-20 pt-4 px-1">
        ${data.dayAmounts
          .map((amt, idx) => {
            const heightPercent = Math.max(8, (amt / data.maxDayAmount) * 100);
            return `
            <div class="flex-1 flex flex-col items-center gap-1">
              <div class="w-full bg-slate-100 rounded-md overflow-hidden flex items-end h-14">
                <div 
                  class="w-full bg-gradient-to-t from-amber-500 to-amber-300 rounded-md transition-all duration-500 hover:from-amber-600 hover:to-amber-400" 
                  style="height: ${heightPercent}%;"
                  title="${data.dayLabels[idx]}: ${formatRupiah(amt)}"
                ></div>
              </div>
              <span class="text-[9px] font-bold text-slate-400">${data.dayLabels[idx]}</span>
            </div>
          `;
          })
          .join('')}
      </div>
    </div>

    <!-- Breakdown Top Kategori Pengeluaran -->
    <div class="pt-2 border-t border-slate-100 space-y-2">
      <span class="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">Distribusi Kategori:</span>
      ${
        data.categoryBreakdown.length === 0
          ? '<p class="text-xs text-slate-400 text-center py-2">Belum ada data pengeluaran di periode ini.</p>'
          : data.categoryBreakdown
              .slice(0, 3)
              .map(
                (c) => `
          <div class="space-y-1">
            <div class="flex items-center justify-between text-[11px] font-bold">
              <span class="text-slate-700">${escapeHtml(c.category)}</span>
              <span class="text-slate-900">${formatRupiah(c.amount)} (${c.percentage.toFixed(0)}%)</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div class="bg-amber-400 h-full rounded-full" style="width: ${c.percentage}%"></div>
            </div>
          </div>
        `
              )
              .join('')
      }
    </div>

    <div class="pt-1 text-center">
      <a href="analitik.html" class="text-[11px] font-bold text-amber-700 hover:underline">
        Buka Laporan Analitik Lengkap &rarr;
      </a>
    </div>
  `;
}

// Inisialisasi Halaman Khusus Analitik (`analitik.html`)
function initAnalitikPage(period = 'mingguan') {
  currentAnalyticPeriod = period;
  const data = calculateAnalyticsData(period);

  const elTotalExpense = document.getElementById('analyticTotalExpense');
  const elAvgDaily = document.getElementById('analyticAvgDaily');
  const elTopCategory = document.getElementById('analyticTopCategory');
  const elInsights = document.getElementById('analyticSmartInsights');
  const elBreakdownContainer = document.getElementById('analyticCategoryBreakdown');
  const elChartContainer = document.getElementById('analyticExpenseChart');

  if (elTotalExpense) elTotalExpense.textContent = formatRupiah(data.totalPeriodExpense);
  if (elAvgDaily) elAvgDaily.textContent = `${formatRupiah(data.avgPerDay)} / hari`;
  if (elTopCategory) elTopCategory.textContent = `${data.topCategory.category} (${data.topCategory.percentage.toFixed(0)}%)`;

  // Insight Otomatis Pintar
  if (elInsights) {
    if (data.totalPeriodExpense === 0) {
      elInsights.textContent = 'Belum ada data pengeluaran untuk dianalisis. Mulai catat transaksi untuk melihat rekomendasi otomatis.';
    } else {
      elInsights.textContent = `Pengeluaran terbesar Anda pada periode ini dialokasikan untuk ${data.topCategory.category} (${formatRupiah(
        data.topCategory.amount
      )}). Rata-rata pengeluaran harian Anda sebesar ${formatRupiah(data.avgPerDay)}. Pertahankan pola belanja terencana untuk menjaga status anggaran tetap Aman.`;
    }
  }

  // Bar Chart
  if (elChartContainer) {
    elChartContainer.innerHTML = data.dayAmounts
      .map((amt, idx) => {
        const heightPercent = Math.max(10, (amt / data.maxDayAmount) * 100);
        return `
        <div class="flex-1 flex flex-col items-center gap-1.5">
          <div class="w-full bg-slate-100 rounded-lg overflow-hidden flex items-end h-28">
            <div 
              class="w-full bg-gradient-to-t from-amber-500 to-amber-300 rounded-lg transition-all duration-500 hover:from-amber-600 hover:to-amber-400" 
              style="height: ${heightPercent}%;"
              title="${data.dayLabels[idx]}: ${formatRupiah(amt)}"
            ></div>
          </div>
          <span class="text-[10px] font-bold text-slate-500">${data.dayLabels[idx]}</span>
          <span class="text-[8px] text-slate-400 font-semibold truncate max-w-full">${amt > 0 ? (amt / 1000).toFixed(0) + 'k' : '0'}</span>
        </div>
      `;
      })
      .join('');
  }

  // Breakdown Lengkap
  if (elBreakdownContainer) {
    if (data.categoryBreakdown.length === 0) {
      elBreakdownContainer.innerHTML = '<p class="text-xs text-slate-400 text-center py-4">Belum ada pengeluaran tercatat.</p>';
    } else {
      elBreakdownContainer.innerHTML = data.categoryBreakdown
        .map(
          (c) => `
        <div class="p-3 bg-white rounded-2xl border border-slate-100 shadow-2xs space-y-1.5">
          <div class="flex items-center justify-between text-xs font-bold">
            <span class="text-slate-800">${escapeHtml(c.category)}</span>
            <span class="text-slate-900">${formatRupiah(c.amount)} <span class="text-slate-400 font-normal">(${c.percentage.toFixed(1)}%)</span></span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div class="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full" style="width: ${c.percentage}%"></div>
          </div>
        </div>
      `
        )
        .join('');
    }
  }
}

// ==========================================================================
// 4. GAMIFIKASI & BADGES LOGIC
// ==========================================================================
function checkBadgeUnlocks() {
  const profile = getUserProfile();
  const settings = getSettings();
  const transactions = getTransactions();
  const txCount = transactions.length;

  let unlocked = profile.unlockedBadges || [];
  let newlyUnlocked = [];

  if (profile.streak >= 7 && !unlocked.includes('badge-streak-7')) {
    unlocked.push('badge-streak-7');
    newlyUnlocked.push('Pemula Streak 💧');
  }

  const tabunganPersen = settings.targetTabungan > 0 ? (settings.tabunganSaatIni / settings.targetTabungan) * 100 : 0;
  if (tabunganPersen >= 50 && !unlocked.includes('badge-tabungan-50')) {
    unlocked.push('badge-tabungan-50');
    newlyUnlocked.push('Penabung Pemula 🐣');
  }

  if (txCount >= 50 && !unlocked.includes('badge-catat-50')) {
    unlocked.push('badge-catat-50');
    newlyUnlocked.push('Pencatat Rajin ✏️');
  }

  const summary = calculateFinancialSummary();
  if (summary.warningStatus.level === 'safe' && !unlocked.includes('badge-disiplin-bulan')) {
    unlocked.push('badge-disiplin-bulan');
    newlyUnlocked.push('Disiplin Bulanan 📊');
  }

  if (newlyUnlocked.length > 0) {
    profile.unlockedBadges = unlocked;
    saveUserProfile(profile);
    newlyUnlocked.forEach((title) => showToast(`Lencana Terbuka: ${title}!`, 'success'));
  }
}

// ==========================================================================
// TOAST NOTIFIKASI
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

// Drawer Toggle
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

  // 1. Render Shortcut Transaksi Mikro
  renderMicroShortcuts('dashMicroShortcutsList');

  // 2. Render Sistem Peringatan Visual Batas Pengeluaran
  renderVisualWarningBanner(summary);

  // 3. Render Laporan Analitik Otomatis Widget
  renderDashboardAnalyticsWidget(currentAnalyticPeriod);

  // 3 Kotak Ringkasan Finansial
  const elSaldo = document.getElementById('dashTotalSaldo');
  const elMasuk = document.getElementById('dashPemasukanBulanIni');
  const elKeluar = document.getElementById('dashPengeluaranBulanIni');

  if (elSaldo) elSaldo.textContent = formatRupiah(summary.totalSaldo);
  if (elMasuk) elMasuk.textContent = formatRupiah(summary.pemasukanBulanIni);
  if (elKeluar) elKeluar.textContent = formatRupiah(summary.pengeluaranBulanIni);

  // 2 Kartu Budget
  const elBudgetHarian = document.getElementById('dashBudgetHarian');
  const elBudgetBulanan = document.getElementById('dashBudgetBulanan');

  if (elBudgetHarian) {
    elBudgetHarian.textContent = summary.batasHarian > 0 ? `${formatRupiah(summary.batasHarian)} (Sisa: ${formatRupiah(summary.sisaAnggaranHarian)})` : '+ Atur batas harian';
  }
  if (elBudgetBulanan) {
    elBudgetBulanan.textContent = summary.batasBulanan > 0 ? `${formatRupiah(summary.batasBulanan)} (Sisa: ${formatRupiah(summary.sisaAnggaranBulanan)})` : '+ Atur batas bulanan';
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

  // Render Shortcuts juga di halaman transaksi
  renderMicroShortcuts('txMicroShortcutsList');

  // Render Status Peringatan Mini
  const bannerContainer = document.getElementById('txVisualWarningBanner');
  if (bannerContainer) {
    const w = summary.warningStatus;
    bannerContainer.className = `p-3 rounded-2xl border ${w.bannerClass} flex items-center justify-between text-xs`;
    bannerContainer.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full" style="background-color: ${w.dotColor}"></span>
        <span class="font-extrabold">${w.title}</span>
      </div>
      <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${w.badgeClass}">${w.label}</span>
    `;
  }

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
            <button onclick="handleDeleteTx('${tx.id}')" class="text-[10px] text-slate-400 hover:text-rose-600 transition-colors cursor-pointer">Hapus</button>
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
// TAMBAH TRANSAKSI INITIALIZER (Manual & Voice)
// ==========================================================================
let currentSelectedCategory = 'Belanja';
let currentTransactionType = 'pengeluaran';

function initTambahTransaksiPage() {
  const form = document.getElementById('addTransactionForm');
  const dateInput = document.getElementById('txTanggal');

  if (dateInput) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }

  // Render Shortcuts juga di form tambah transaksi
  renderMicroShortcuts('formMicroShortcutsList');

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('voice') === '1') {
    setTimeout(() => {
      startVoiceInPage();
    }, 400);
  }

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

      addPoints(10, 'Mencatat Transaksi');

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

// In-Page Web Speech Recognition
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
      if (statusEl) statusEl.textContent = '🔴 Mendengarkan suara Anda...';
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
// GLOBAL EVENT DISPATCHER
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  const hamburgerBtn = document.getElementById('hamburgerMenuBtn');
  const closeDrawerBtn = document.getElementById('closeSidebarDrawerBtn');
  const overlay = document.getElementById('mobileSidebarOverlay');

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', toggleMobileMenu);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeMobileMenu);
  if (overlay) overlay.addEventListener('click', closeMobileMenu);

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
  if (document.getElementById('analyticExpenseChart')) {
    initAnalitikPage('mingguan');
  }
});
