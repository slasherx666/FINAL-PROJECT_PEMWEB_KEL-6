# MyBudgetGue - Personal Finance & Gamified Budget Tracking Web App
### *Mobile Web Edition (Sunglow & Radiant White Palette)*

Aplikasi web mobile modern berbasis **HTML5 Semantic**, **Tailwind CSS (via CDN)**, dan **Vanilla JavaScript murni** (tanpa PHP) untuk mencatat keuangan pribadi, memantau batas anggaran harian/bulanan, serta meningkatkan kedisiplinan finansial lewat fitur **Gamifikasi** dan **Voice Recognition (Web Speech API)**.

Desain tata letak (*layout & placement*) mengikuti struktur referensi mobile aplikasi dengan tema warna **Sunglow & Radiant White** yang bersih, terang, dan berkelas.

---

## 📱 Halaman-Halaman Utama (Terstruktur & Khusus)

1. [**`dashboard.html`**](file:///C:/Users/T14/FINAL-PROJECT_PEMWEB_KEL-6/dashboard.html):
   * Sapaan pengguna (*"Halo, Dorasaki!"*), tanggal Indonesia, dan status poin.
   * **Streak Harian** (penghitung hari beruntun konsisten mencatat).
   * **2 Kartu Aksi Cepat**: *Catat via Suara* (Web Speech API) & *Catat Manual*.
   * **3 Kotak Ringkasan Finansial**: Total Saldo, Pemasukan Bulan Ini, dan Pengeluaran Bulan Ini.
   * **2 Kotak Batas Anggaran**: Budget Harian dan Budget Bulanan.
   * **Transaksi Terbaru** dengan tombol *Lihat Semua >*.
   * Tombol *+ Catat Transaksi Baru*.
   * **Drawer Menu Samping**: Tertutup saat aplikasi pertama kali dibuka (dapat dibuka via tombol menu).

2. [**`transaksi.html`**](file:///C:/Users/T14/FINAL-PROJECT_PEMWEB_KEL-6/transaksi.html):
   * Header: `< Riwayat Transaksi` & tombol `+ Tambah`.
   * Ringkasan **Total Masuk** & **Total Keluar**.
   * Tab filter: **Semua | Masuk | Keluar**.
   * Daftar transaksi interaktif dengan fitur hapus.

3. [**`tambah-transaksi.html`**](file:///C:/Users/T14/FINAL-PROJECT_PEMWEB_KEL-6/tambah-transaksi.html):
   * Header: `< Catat Transaksi`.
   * Kartu **Catat dengan Suara** berbasis **Web Speech API** lengkap dengan pengenal suara otomatis dan tombol preset cepat.
   * Tab jenis: **💸 Pengeluaran | 💰 Pemasukan**.
   * Input nominal besar (**JUMLAH**).
   * **Grid 8 Icon Kategori** (Belanja, Hiburan, Kesehatan, Makanan & Minuman, Pendidikan, Tagihan, Transportasi, dll.).
   * Input deskripsi, tanggal, dan catatan opsional.
   * Tombol *Simpan Transaksi (+10 Poin)*.

4. [**`profil.html`**](file:///C:/Users/T14/FINAL-PROJECT_PEMWEB_KEL-6/profil.html):
   * Avatar pengguna, nama (*Dorasaki*), dan tanggal bergabung.
   * 3 Statistik: **Streak**, **Poin**, dan **Lencana**.
   * **Koleksi 8 Lencana Resmi** (Pemula Streak, Penabung Pemula, Pencatat Rajin, Disiplin Bulanan, Pejuang Streak, Pencatat Master, Penabung Hebat, Legenda Streak).
   * Panduan **Cara Mendapat Poin**.

5. [**`pengaturan.html`**](file:///C:/Users/T14/FINAL-PROJECT_PEMWEB_KEL-6/pengaturan.html):
   * **Batas Pengeluaran**: Input batas harian (Rp) & batas bulanan (Rp).
   * **Target Tabungan**: Input nominal target (Rp) & tabungan saat ini (Rp).
   * **Notifikasi Pengingat**: Saklar pengingat harian, pemilih waktu (WIB), push notification, dan email.
   * Tombol *Simpan Pengaturan*.

6. [**`auth.html`**](file:///C:/Users/T14/FINAL-PROJECT_PEMWEB_KEL-6/auth.html):
   * Formulir autentikasi modern dengan tab beralih antara **Masuk** dan **Daftar**.

---

## 📁 Struktur Direktori Standar (Hackathon / Production Grade)

```text
FINAL-PROJECT_PEMWEB_KEL-6/
│
├── .gitignore                  # Wajib: Mengabaikan cache OS, log, dan file sensitif
├── .editorconfig               # Wajib: Standarisasi format indentasi dan encoding tim
├── README.md                   # Wajib: Dokumentasi dan panduan teknis
├── index.html                  # Entry point (auto redirect ke dashboard)
│
├── dashboard.html              # Halaman Dashboard Utama Mobile
├── transaksi.html              # Halaman Riwayat Transaksi
├── tambah-transaksi.html       # Halaman Input Transaksi Manual & Suara
├── profil.html                 # Halaman Profil Pengguna & 8 Lencana
├── pengaturan.html             # Halaman Pengaturan Batas & Notifikasi
├── auth.html                   # Halaman Masuk & Daftar Akun
│
├── assets/                     # Berkas statis frontend
│   ├── css/
│   │   └── style.css           # Styling kustom Sunglow & White palette
│   ├── js/
│   │   └── app.js              # State controller, Web Speech API, LocalStorage
│   └── img/
│       └── logo.svg            # Logo vektor MyBudgetGue
│
├── data/                       # Berkas seed data
│   └── seed-transactions.json  # Data sampel transaksi awal JSON
│
└── docs/                       # Dokumentasi arsitektur dan perlombaan
    ├── ARCHITECTURE.md         # Diagram alur data & modul sistem
    └── HACKATHON-GUIDE.md      # Panduan struktur folder untuk juri / hackathon
```

---

## 🚀 Cara Menjalankan
Buka berkas [**`dashboard.html`**](file:///C:/Users/T14/FINAL-PROJECT_PEMWEB_KEL-6/dashboard.html) atau [**`index.html`**](file:///C:/Users/T14/FINAL-PROJECT_PEMWEB_KEL-6/index.html) langsung di peramban web Anda (Chrome, Edge, Safari, Firefox).
