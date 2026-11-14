# Arsitektur Frontend MyBudgetGue

Aplikasi MyBudgetGue dibangun dengan arsitektur **Client-side Single State Controller (LocalStorage Driven)** murni berbasis HTML5 Semantic, Tailwind CSS, dan Vanilla JavaScript tanpa backend server.

---

## 🏛️ Diagram Alur Data & State Flow

```mermaid
flowchart TD
    User([Pengguna]) --> UI[Mobile Web App Pages]
    UI --> Actions[User Actions: Form / Voice / Filter]
    Actions --> Controller[app.js Controller Engine]
    
    subgraph Data Layer
        Controller <--> LS_TX[(LocalStorage: mybudgetgue_transactions)]
        Controller <--> LS_PROF[(LocalStorage: mybudgetgue_user_profile)]
        Controller <--> LS_SET[(LocalStorage: mybudgetgue_settings)]
    end
    
    Controller --> Engine1[Financial Calculator: Saldo, Pemasukan, Pengeluaran, Budget]
    Controller --> Engine2[Web Speech API: SpeechRecognition Indonesian NLP Parser]
    Controller --> Engine3[Gamification Engine: Daily Streak, 8 Badges, XP Points]
    
    Engine1 --> ReRender[DOM Reactive Update]
    Engine2 --> ReRender
    Engine3 --> ReRender
```

---

## 🔑 Skema Kunci Penyimpanan (LocalStorage Keys)

1. `mybudgetgue_transactions`: Menyimpan array riwayat transaksi dengan struktur:
   * `id`: ID unik transaksi (`tx-173160...`)
   * `tipe`: `'pemasukan'` | `'pengeluaran'`
   * `nominal`: Angka nominal (float)
   * `kategori`: Kategori transaksi (Gaji, Makanan & Minuman, Transportasi, dll.)
   * `tanggal`: Format `YYYY-MM-DD`
   * `keterangan`: Catatan transaksi
2. `mybudgetgue_user_profile`: Menyimpan profil pengguna, streak harian, poin akumulatif, dan lencana yang telah terbuka.
3. `mybudgetgue_settings`: Menyimpan preferensi limit harian, limit bulanan, target tabungan, dan notifikasi pengingat.
