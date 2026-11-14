# Panduan Standar Struktur Proyek Hackathon / Lomba Web Development

Dokumen ini berisi panduan komprehensif mengenai struktur folder dan berkas yang lazim serta wajib ada pada proyek lomba/hackathon bertaraf profesional.

---

## 📁 Rekomendasi Struktur Direktori Standar (Production & Hackathon Grade)

```text
FINAL-PROJECT_PEMWEB_KEL-6/
│
├── .gitignore                  # Wajib: Mengabaikan cache OS, node_modules, log, file sensitif
├── .editorconfig               # Wajib: Standarisasi format tab, spasi, dan newline tim
├── README.md                   # Wajib: Pitching, arsitektur, cara menjalankan, dan fitur utama
├── index.html                  # Wajib: Entry point utama aplikasi
│
├── dashboard.html              # Halaman Dashboard Finansial Utama
├── transaksi.html              # Halaman Riwayat Transaksi & Filter
├── tambah-transaksi.html       # Halaman Input Transaksi Manual & Voice Recognition
├── profil.html                 # Halaman Profil Pengguna, Streak & Koleksi 8 Lencana
├── pengaturan.html             # Halaman Pengaturan Batas, Target Tabungan & Notifikasi
├── auth.html                   # Halaman Masuk & Registrasi Akun
│
├── assets/                     # Berkas statis frontend
│   ├── css/
│   │   └── style.css           # Styling kustom, palet warna, animasi
│   ├── js/
│   │   └── app.js              # State controller, Web Speech API, LocalStorage
│   └── img/
│       └── logo.svg            # Asset logo vektor resolusi tinggi
│
├── data/                       # Berkas mock/seed data awal
│   └── seed-transactions.json  # Sampel data transaksi JSON untuk inisialisasi
│
└── docs/                       # Dokumentasi arsitektur & panduan teknis
    ├── ARCHITECTURE.md         # Diagram alur data & struktur modul
    └── HACKATHON-GUIDE.md      # Panduan ini
```

---

## 📌 Mengapa Berkas & Folder Tersebut Sangat Penting?

### 1. `.gitignore`
* **Fungsi**: Mencegah file sampah OS (`.DS_Store`, `Thumbs.db`), folder dependencies lokal (`node_modules`), file environment rahasia (`.env`), dan log debugging ter-push ke GitHub repository.
* **Nilai Tambah Juri**: Menunjukkan bahwa peserta memahami standar kebersihan repository Git.

### 2. `.editorconfig`
* **Fungsi**: Memastikan semua anggota tim atau siapa pun yang mengkloning proyek memiliki konfigurasi teks yang seragam (misal indentasi 2 spasi dan UTF-8) tanpa merusak git diff.

### 3. Folder `data/`
* **Fungsi**: Menyimpan seed data / skema data dalam format JSON. Jika juri ingin mereset atau menguji data dari nol, data sampel siap digunakan.

### 4. Folder `docs/`
* **Fungsi**: Tempat berkas arsitektur teknis, diagram alur data, dan user guide. Di hackathon, tim yang menyediakan dokumentasi rapi di folder `docs/` selalu mendapat nilai arsitektur perangkat lunak yang tinggi.

### 5. `README.md` yang Rapi
* Harus memuat:
  * Nama Proyek & Tagline
  * Demo/Screenshot UI
  * Fitur Unggulan (Inovasi, contoh: Web Speech API & Gamifikasi)
  * Panduan Instalasi / Menjalankan
  * Teknologi yang Digunakan
