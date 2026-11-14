# MyBudgetGue - Personal Finance & Gamified Budget Tracking Web App
### *Mobile Web Edition (Sunglow & Radiant White Palette)*
**Official Repository:** [https://github.com/slasherx666/MyBudgetGue.git](https://github.com/slasherx666/MyBudgetGue.git)

Aplikasi web mobile modern berbasis **HTML5 Semantic**, **Tailwind CSS (via CDN)**, dan **Vanilla JavaScript murni** (tanpa backend / tanpa PHP) untuk mencatat keuangan pribadi, memantau batas anggaran harian/bulanan, serta meningkatkan kedisiplinan finansial lewat fitur **Gamifikasi**, **Laporan Analitik Otomatis**, dan **Voice Recognition (Web Speech API)**.

Desain tata letak (*layout & placement*) mengikuti standar web mobile dengan palet warna **Sunglow Golden & Radiant White** yang bersih, terang, dan berkelas.

---

## 🌟 4 Fitur Utama Unggulan

1. **Pencatatan Instan (Shortcut) Transaksi Mikro:**
   * Tombol cepat 1-ketuk (*1-tap action*) untuk 6 pos belanja harian: ☕ Kopi (Rp 15k), 🅿️ Parkir (Rp 2k), ⛽ Bensin (Rp 20k), 🍛 Makan (Rp 25k), 🧃 Snack (Rp 10k), dan 📱 Pulsa (Rp 25k).
2. **Sistem Peringatan Visual Batas Pengeluaran:**
   * Indikator cerdas 3 tingkat: 🟢 **Aman** (<70%), 🟡 **Waspada** (70-90%), dan 🔴 **Kritis / Overbudget** (>90%) dengan banner dinamis, dot pulse, dan progress bar.
3. **Laporan Analitik Pengeluaran Otomatis (Mingguan & Bulanan):**
   * Visual bar chart interaktif, perbandingan pengeluaran mingguan/bulanan, 3 kartu metrik ringkasan, dan teks diagnosis evaluasi keuangan cerdas (*Smart Diagnostics*).
4. **Sistem Gamifikasi Finansial Lengkap:**
   * Daily Streak dengan animasi api (`🔥 flame`), akumulasi poin XP (+10 XP per transaksi), dan galeri koleksi **8 Lencana Virtual resmi**.

---

## 📱 Halaman-Halaman Utama (Terstruktur & Khusus)

1. [**`dashboard.html`**](dashboard.html):
   * Sapaan pengguna (*"Halo, Nama Pengguna!"*), tanggal Indonesia, dan status poin.
   * **Streak Harian** (penghitung hari beruntun konsisten mencatat).
   * **Banner Peringatan Visual** (Hijau, Kuning, Merah).
   * **Chip Shortcut Transaksi Mikro** (1-tap recording).
   * **Widget Laporan Analitik Otomatis** (Toggle Mingguan/Bulanan & Bar Chart).
   * **3 Kotak Ringkasan Finansial**: Total Saldo, Pemasukan Bulan Ini, dan Pengeluaran Bulan Ini.
   * **2 Kotak Batas Anggaran**: Budget Harian dan Budget Bulanan.
   * **Transaksi Terbaru** dengan tombol *Lihat Semua >*.
   * **Drawer Menu Samping**: Tertutup secara default saat dibuka pertama kali.

2. [**`transaksi.html`**](transaksi.html):
   * Header: `< Riwayat Transaksi` & tombol `+ Tambah`.
   * Ringkasan **Total Masuk** & **Total Keluar**.
   * Tab filter: **Semua | Masuk | Keluar**.
   * Chip Shortcut Transaksi Mikro.
   * Daftar transaksi interaktif dengan aksi hapus instan.

3. [**`tambah-transaksi.html`**](tambah-transaksi.html):
   * Header: `< Catat Transaksi`.
   * Kartu **Catat dengan Suara** berbasis **Web Speech API** Bahasa Indonesia (`id-ID`) lengkap dengan tombol preset suara.
   * Tab jenis: **💸 Pengeluaran | 💰 Pemasukan**.
   * Input nominal besar (**JUMLAH**) dan format Rupiah otomatis.
   * **Grid 8 Icon Kategori** (Belanja, Hiburan, Kesehatan, Makanan & Minuman, Pendidikan, Tagihan, Transportasi, Lainnya).
   * Chip Shortcut Transaksi Mikro.
   * Tombol *Simpan Transaksi (+10 Poin)*.

4. [**`analitik.html`**](analitik.html):
   * Halaman khusus laporan analitik pengeluaran otomatis.
   * Saklar periode: **Mingguan (7 Hari)** vs **Bulanan (Bulan Berjalan)**.
   * 3 Ringkasan Metrik: Total Pengeluaran, Rata-rata Harian, dan Top Kategori.
   * **Evaluasi Keuangan Otomatis (*Smart Financial Diagnostics*)**.
   * Grafik batang interaktif (*Interactive Bar Chart*).
   * Rincian alokasi pengeluaran per kategori.

5. [**`profil.html`**](profil.html):
   * Avatar pengguna, nama (*Dorasaki*), dan tanggal bergabung.
   * 3 Statistik: **Streak**, **Poin**, dan **Lencana**.
   * **Koleksi 8 Lencana Resmi** (Pemula Streak, Penabung Pemula, Pencatat Rajin, Disiplin Bulanan, Pejuang Streak, Pencatat Master, Penabung Hebat, Legenda Streak).
   * Panduan **Cara Mendapat Poin XP**.

6. [**`pengaturan.html`**](pengaturan.html):
   * **Batas Pengeluaran**: Input batas harian (Rp) & batas bulanan (Rp).
   * **Target Tabungan**: Input nominal target (Rp) & tabungan saat ini (Rp).
   * **Notifikasi Pengingat**: Saklar pengingat harian, pemilih waktu (WIB), push notification, dan email.
   * Tombol *Simpan Pengaturan*.

7. [**`auth.html`**](auth.html):
   * Formulir autentikasi modern dengan tab beralih antara **Masuk** dan **Daftar**.

---

## 📁 Struktur Direktori Proyek

```text
MyBudgetGue/
│
├── .gitignore                  # Wajib: Mengabaikan cache OS, log, dan file sensitif
├── .editorconfig               # Wajib: Standarisasi format indentasi (2 spasi, UTF-8)
├── README.md                   # Wajib: Dokumentasi dan panduan teknis repositori
├── index.html                  # Entry point (auto redirect ke dashboard.html)
│
├── dashboard.html              # Halaman Dashboard Utama Mobile
├── transaksi.html              # Halaman Riwayat Transaksi & Filter
├── tambah-transaksi.html       # Halaman Input Transaksi Manual, Voice & Shortcut
├── analitik.html               # Halaman Laporan Analitik Otomatis Mingguan & Bulanan
├── profil.html                 # Halaman Profil Pengguna, Daily Streak & 8 Lencana
├── pengaturan.html             # Halaman Pengaturan Batas & Target Tabungan
├── auth.html                   # Halaman Masuk & Registrasi Akun
│
├── assets/                     # Berkas statis frontend
│   ├── css/
│   │   └── style.css           # Styling kustom Sunglow & White palette, animasi flame & pulse
│   ├── js/
│   │   └── app.js              # Central State Controller, Web Speech API, Storage Engine
│   └── img/
│       └── logo.svg            # Logo vektor resolusi tinggi
│
├── data/                       # Berkas seed data pengujian
│   └── seed-transactions.json  # Data sampel transaksi awal JSON
│
└── docs/                       # Folder dokumentasi komprehensif
    └── laporan_MBG.md          # Dokumen Master Laporan Akademik & Arsitektur Tunggal
```

---

## 🚀 Cara Menjalankan
Buka berkas [**`dashboard.html`**](dashboard.html) atau [**`index.html`**](index.html) langsung di peramban web modern Anda (Google Chrome direkomendasikan untuk Web Speech API).
