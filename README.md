# 🎯 Quiz Master - React Quiz Application

Aplikasi kuis interaktif yang dibangun dengan React.js sebagai bagian dari Challenge Frontend React.

## ✨ Fitur Utama

### 1. 🔐 Autentikasi Login
- Halaman login dengan validasi nama pengguna
- Penyimpanan data pengguna di localStorage
- Protected routes untuk keamanan

### 2. 📚 Integrasi Open Trivia Database
- Fetch soal dari [Open Trivia Database](https://opentdb.com/)
- Pilihan kategori (25+ kategori tersedia)
- Tingkat kesulitan (Easy, Medium, Hard)
- Tipe soal (Multiple Choice, True/False)
- Jumlah soal yang dapat dikustomisasi (5-25 soal)

### 3. ⏱️ Timer Kuis
- Timer countdown yang dapat dikustomisasi (5-30 menit)
- Indikator visual dengan perubahan warna
- Auto-submit saat waktu habis

### 4. 📝 Tampilan Soal
- Satu soal per halaman
- Otomatis pindah ke soal berikutnya setelah memilih jawaban
- Progress bar untuk melacak kemajuan
- Counter soal yang sudah dijawab dan tersisa

### 5. 📊 Hasil Pengerjaan
- Tampilan jumlah jawaban benar, salah, dan tidak dijawab
- Persentase skor dengan visualisasi circle progress
- Review detail untuk setiap soal
- Perbandingan jawaban user dengan jawaban yang benar

### 6. 💾 Resume Kuis (Bonus Feature)
- Auto-save progress ke localStorage
- Opsi untuk melanjutkan kuis yang belum selesai
- Data tersimpan meski browser ditutup

### 7. 🌓 Light & Dark Theme
- Toggle theme yang smooth dan responsive
- Preferensi theme tersimpan di localStorage
- Desain modern untuk kedua tema

### 8. 🎨 UI/UX Modern
- Desain yang menarik dan intuitif
- Animasi smooth dan interaktif
- Responsive untuk semua ukuran layar
- Color scheme yang eye-friendly

## 🚀 Cara Menjalankan

### Prerequisites
- Node.js (v14 atau lebih baru)
- npm atau yarn

### Instalasi

1. Clone atau download repository ini
```bash
cd kuismagangdot
```

2. Install dependencies
```bash
npm install
```

3. Jalankan aplikasi
```bash
npm start
```

4. Buka browser dan akses `http://localhost:3000`

## 📁 Struktur Proyek

```
kuismagangdot/
├── public/
│   └── index.html
├── src/
│   ├── context/
│   │   ├── AuthContext.js      # Manajemen autentikasi
│   │   ├── ThemeContext.js     # Manajemen tema
│   │   └── QuizContext.js      # Manajemen state kuis
│   ├── pages/
│   │   ├── Login.js            # Halaman login
│   │   ├── Login.css
│   │   ├── QuizSetup.js        # Halaman konfigurasi kuis
│   │   ├── QuizSetup.css
│   │   ├── Quiz.js             # Halaman pengerjaan kuis
│   │   ├── Quiz.css
│   │   ├── Results.js          # Halaman hasil
│   │   └── Results.css
│   ├── App.js                  # Main component dengan routing
│   ├── App.css                 # Global styles
│   ├── index.js                # Entry point
│   └── index.css               # Base styles
├── package.json
└── README.md
```

## 🎮 Cara Menggunakan

1. **Login**
   - Masukkan nama Anda (minimal 3 karakter)
   - Klik "Start Quiz Journey"

2. **Konfigurasi Kuis**
   - Pilih jumlah soal (5-25)
   - Pilih batas waktu (5-30 menit)
   - Pilih kategori (opsional)
   - Pilih tingkat kesulitan (opsional)
   - Pilih tipe soal (opsional)
   - Klik "Start Quiz"

3. **Mengerjakan Kuis**
   - Baca soal dengan teliti
   - Pilih jawaban dari pilihan yang tersedia
   - Otomatis berpindah ke soal berikutnya
   - Perhatikan timer di pojok kanan atas

4. **Melihat Hasil**
   - Lihat skor dan statistik Anda
   - Review jawaban yang salah
   - Klik "Take Another Quiz" untuk mencoba lagi

## 🎨 Tema

Aplikasi mendukung dua tema:
- **Light Theme**: Tema terang dengan warna yang cerah dan bersih
- **Dark Theme**: Tema gelap yang nyaman untuk mata

Toggle tema dapat diakses di semua halaman melalui tombol bulan/matahari.

## 💡 Fitur Unggulan

### LocalStorage Implementation
- **Auto-save Progress**: Semua progress kuis tersimpan otomatis
- **Resume Capability**: Lanjutkan kuis yang belum selesai
- **User Persistence**: Data user tersimpan antar sesi
- **Theme Preference**: Pilihan tema tersimpan

### Responsive Design
- Mobile-friendly (320px - 768px)
- Tablet-friendly (768px - 1024px)
- Desktop-optimized (1024px+)

### Accessibility
- Semantic HTML
- ARIA labels untuk screen readers
- Keyboard navigation support
- High contrast colors

## 🛠️ Teknologi yang Digunakan

- **React 18.2** - Library UI
- **React Router DOM 6.20** - Routing
- **Context API** - State management
- **CSS3** - Styling dengan custom properties
- **LocalStorage API** - Data persistence
- **Open Trivia Database API** - Sumber soal kuis

## 📝 Build untuk Production

```bash
npm run build
```

Build files akan tersimpan di folder `build/` dan siap untuk di-deploy.

## 🌐 Deploy

Aplikasi ini dapat di-deploy ke:
- Vercel
- Netlify
- GitHub Pages
- Heroku
- Dan platform hosting lainnya

## 📹 Video Demo

Untuk membuat video demo menggunakan Loom:
1. Kunjungi [www.loom.com](https://www.loom.com)
2. Install Loom extension/aplikasi
3. Record video dengan menampilkan:
   - Demo seluruh fitur aplikasi
   - Penjelasan implementasi setiap kriteria
   - Open camera untuk presentasi
4. Share link video

## 👨‍💻 Developer

Created with ❤️ for Frontend React Challenge

## 📄 License

MIT License - bebas digunakan untuk keperluan pembelajaran dan pengembangan.

---

**Catatan**: Pastikan koneksi internet stabil saat menggunakan aplikasi karena soal diambil dari API eksternal.
