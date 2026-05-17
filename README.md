<div align="center">
  <br>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="icons/icon-192.png">
    <img src="icons/icon-192.png" alt="Waktu Solat Malaysia" width="120" style="border-radius: 23px">
  </picture>
  <h1>🕌 Waktu Solat Malaysia 2026</h1>
  <p><strong>Aplikasi web jadual waktu solat harian Malaysia — PWA, offline-ready, responsif</strong></p>
  <p>
    <img src="https://img.shields.io/badge/JavaScript-61.2%25-%23F7DF1E?logo=javascript" alt="JavaScript">
    <img src="https://img.shields.io/badge/CSS-22.7%25-%231572B6?logo=css3" alt="CSS">
    <img src="https://img.shields.io/badge/HTML-16.1%25-%23E34F26?logo=html5" alt="HTML">
    <img src="https://img.shields.io/badge/PWA-ready-%235A0FC8?logo=pwa" alt="PWA">
    <br>
    <img src="https://img.shields.io/badge/status-aktif-brightgreen" alt="Status">
    <img src="https://img.shields.io/badge/tahun-2026-blue" alt="2026">
    <img src="https://img.shields.io/badge/offline-ready-success" alt="Offline">
  </p>
  <br>
</div>

---

## 📋 Senarai Kandungan

- [Tentang](#-tentang)
- [Ciri-Ciri](#-ciri-ciri)
- [Negeri & Zon](#-negeri--zon)
- [Cara Guna](#-cara-guna)
- [PWA (Progressive Web App)](#-pwa-progressive-web-app)
- [Multi-Orientasi](#-multi-orientasi)
- [Struktur Projek](#-struktur-projek)
- [Sumber Data](#-sumber-data)
- [Teknologi](#-teknologi)
- [Cara Menyumbang](#-cara-menyumbang)
- [Lesen](#-lesen)
- [Penafian](#-penafian)

---

## 📖 Tentang

**Waktu Solat Malaysia 2026** ialah aplikasi web satu halaman (SPA) yang memaparkan jadual waktu solat harian untuk negeri-negeri terpilih di Malaysia. Data diperolehi secara langsung dari repositori GitHub dalam format JSON yang bersumberkan data e-Solat JAKIM.

Aplikasi ini dibina sebagai **Progressive Web App (PWA)** — boleh dipasang di skrin utama telefon/desktop, berfungsi secara offline, dan menyokong pelbagai orientasi skrin (portrait & landscape). Ikon diinspirasikan dari [skill-icons](https://github.com/tandpfun/skill-icons).

---

## ✨ Ciri-Ciri

| Ciri | Penerangan |
|------|-----------|
| **Pilih Negeri & Zon** | Wheel spinner (↑↓) untuk negeri dan zon — tanpa dropdown select |
| **Jadual Harian** | Paparan grid waktu solat (Imsak, Subuh, Syuruk, Dhuha, Zohor, Asar, Maghrib, Isyak) |
| **Kiraan Dhuha Automatik** | Jika tiada data Dhuha, dikira secara automatik (Syuruk + 30 minit) |
| **Format 12 Jam** | Semua waktu dipaparkan dalam format AM/PM |
| **Tarikh Masihi & Hijrah** | Tarikh Masihi (Malaysia) dan tarikh Hijrah lengkap dari API Kalendar Hijrah |
| **Kiraan Masa Menunggu** | Countdown langsung ke waktu solat seterusnya |
| **Warna Latar Dinamik** | Latar belakang bertukar mengikut waktu (subuh, siang, asar, malam) |
| **12 Tema Warna** | Sedia Ada (dinamik), Beige Coffee, Royal Blue, Turquoise, Gold, Maroon Royal, Purple Royal, Pink Royal, Pearl Putih, Black Immersive, Nardo Grey, Red Royal |
| **Tema Pearl Teks Gelap** | Tema pearl putih automatik menukar teks ke warna gelap untuk kebolehbacaan |
| **Kongsi WhatsApp** | FAB hijau di sudut kanan bawah — kongsi jadual ke WhatsApp dengan format tebal & condong |
| **Muat Turun Poster JPG** | FAB biru di sudut kiri bawah — hasilkan poster 1080×2340 (19.5:9) menggunakan html2canvas |
| **Panel Tetapan** | FAB gear di sudut kanan atas — panel tidak telus dengan pautan Hubungi Pembangun & Sokong (dari `settings.json`) |
| **Particles.js** | Animasi latar zarah emas yang menenangkan |
| **PWA & Offline** | Boleh dipasang di skrin utama dan berfungsi tanpa internet (data zon terkini dicache) |
| **Multi-Orientasi** | Reka bentuk khusus untuk portrait dan landscape pada telefon, tablet, dan desktop |
| **Indikator Offline** | Paparan ✈️ Mod Luar Talian apabila tiada sambungan internet |
| **Safe Area Insets** | Patuh kepada notched devices (iPhone, dll.) — FAB juga mendapat jarak selamat |
| **Responsif** | Sesuai untuk semua saiz skrin dari 320px hingga desktop |
| **Font Nunito Sans** | Tipografi ringan (weight 300) — alternatif kepada Google Sans Light |

---

## 🗺️ Negeri & Zon

### Selangor
| Kod Zon | Kawasan |
|---------|---------|
| **SGR01** | Gombak, Petaling, Sepang, Hulu Langat, Hulu Selangor, Sungai Alam |
| **SGR02** | Kuala Selangor, Sabak Bernam |
| **SGR03** | Klang, Kuala Langat |

### Johor
| Kod Zon | Kawasan |
|---------|---------|
| **JHR01** | Pulau Aur dan Pulau Pemanggil |
| **JHR02** | Johor Bahru, Kota Tinggi, Mersing, Kulai |
| **JHR03** | Kluang, Pontian |
| **JHR04** | Batu Pahat, Muar, Segamat, Gemas Johor, Tangkak |

---

## 🚀 Cara Guna

### Secara Atas Talian (GitHub Pages / Hosting)
```
https://pengurusanemediamasjidkampungs-dotcom.github.io/waktu-solat-harian-2026/
```

### Secara Tempatan (Local)
1. **Clone repositori ini:**
   ```bash
   git clone https://github.com/pengurusanemediamasjidkampungs-dotcom/waktu-solat-harian-2026.git
   ```

2. **Buka fail `index.html`** terus di pelayar web (Chrome, Firefox, Edge, Safari).

   > **Nota:** Tiada keperluan pemasangan lanjut. Tiada npm, tiada build tool, tiada server. Service worker hanya aktif melalui HTTPS (atau localhost).

### Cara Penggunaan
1. Tekan butang **↑ / ↓** pada spinner **Negeri / Wilayah** untuk pilih negeri
2. Tekan butang **↑ / ↓** pada spinner **Zon Waktu Solat** untuk pilih zon
3. Jadual waktu solat akan dimuat secara automatik
4. Guna **FAB gear** (atas kanan) untuk panel tetapan — hubungi pembangun atau sokong projek
5. Guna **FAB biru** (kiri bawah) untuk muat turun poster JPG
6. Guna **FAB hijau** (kanan bawah) untuk kongsi ke WhatsApp
7. Pilih **tema warna** dari swatch bulat di bawah spinner

---

## 📲 PWA (Progressive Web App)

Aplikasi ini adalah **PWA sepenuhnya** dan boleh dipasang di skrin utama peranti anda.

### Cara Pasang
| Platform | Langkah |
|----------|---------|
| **Chrome Android** | Buka app → tekan "Add to Home Screen" pada menu atau banner install |
| **Samsung Internet** | Buka app → tekan "Install" pada menu |
| **Chrome Desktop** | Klik ikon install di bar URL (sebelah kanan) |
| **Safari iOS** | Buka app → tekan butang Share → "Add to Home Screen" |
| **Edge** | Buka app → tekan "Install" pada menu atau ikon di bar URL |

### Ciri PWA
- **Install prompt** — pengguna boleh memasang app seperti aplikasi native
- **Offline** — selepas lawatan pertama, app dan data zon terkini boleh diakses tanpa internet
- **Service worker** — 3 strategi cache berbeza:
  - **App shell** (HTML/CSS/JS/manifest/ikon) — cache-first
  - **Data API** (waktu solat & hijrah) — network-first, fallback ke cache
  - **CDN** (particles.js, html2canvas, fonts) — stale-while-revalidate
- **Indikator offline** — panel info memaparkan ✈️ Mod Luar Talian apabila tiada sambungan
- **Ikon gaya skill-icons** — dark rounded square + bulan sabit & bintang emas

---

## 🔄 Multi-Orientasi

App direka untuk kelihatan sempurna dalam **kedua-dua orientasi**:

| Orientasi | Ciri Reka Bentuk |
|-----------|-----------------|
| **Portrait** (vertical) | Susunan menegak penuh — sesuai untuk guna satu tangan |
| **Landscape kompak** (≤500px tinggi) | Layout flexbox dengan panel bersebelahan, grid 4 lajur, FAB & theme-picker disembunyikan |
| **Landscape sederhana** (501px–700px) | Padding lebih luas, font lebih besar untuk bacaan selesa |

CSS media queries digunakan untuk:
- Skrin rendah (`max-height: 500px`) — layout landskap kompak, FAB & theme-picker disembunyikan
- Skrin sederhana (`501px–700px`) — landskap dengan ruang lebih
- Safe area insets untuk peranti notched (iPhone, dll.) — FAB & box mendapat jarak selamat
- Mod standalone PWA — theme-picker disembunyikan untuk rupa lebih bersih

---

## 📁 Struktur Projek

```
waktu-solat-harian-2026/
├── index.html              # Halaman utama HTML
├── style.css               # Gaya & tema gelap (CSS)
├── script.js               # Logik aplikasi (JavaScript)
├── manifest.json           # PWA manifest (ikon, tema, orientasi)
├── service-worker.js       # Service worker (cache & offline)
├── settings.json           # Tetapan pautan (hubungi & sokong)
├── icons/
│   ├── icon-192.png        # Ikon PWA 192x192
│   └── icon-512.png        # Ikon PWA 512x512
└── README.md               # Dokumentasi
```

Aplikasi ini adalah **single-page application (SPA)** sepenuhnya tanpa framework — ringan, tanpa build tool, dan mudah dihost di mana-mana (GitHub Pages, Netlify, Vercel, atau hosting statik lain).

---

## 🔗 Sumber Data

Data waktu solat dan kalendar hijrah diperolehi dari repositori GitHub berikut:

| Repositori | Penerangan |
|------------|-----------|
| [API-TAKWIM-SOLAT-SELANGOR-2026](https://github.com/pengurusanemediamasjidkampungs-dotcom/API-TAKWIM-SOLAT-SELANGOR-2026) | Data waktu solat zon Selangor (JSON) |
| [API-TAKWIM-SOLAT-JOHOR-2026](https://github.com/pengurusanemediamasjidkampungs-dotcom/API-TAKWIM-SOLAT-JOHOR-2026) | Data waktu solat zon Johor (JSON) |
| [API-Kalendar-Hijrah-2026](https://github.com/pengurusanemediamasjidkampungs-dotcom/API-Kalendar-Hijrah-2026) | Data kalendar Hijrah harian (JSON) |

Data sumber asal adalah dari **e-Solat JAKIM**.

> ⚠️ *Nota: Hanya negeri Selangor dan Johor yang mempunyai repositori data pada masa ini.*

---

## 🛠️ Teknologi

| Teknologi | Tujuan |
|-----------|--------|
| **[Vanilla JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)** | Logik aplikasi tanpa framework |
| **HTML5** | Struktur halaman |
| **CSS3** | Gaya visual, tema, animasi, responsif, media queries orientasi |
| **[Particles.js](https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js)** | Animasi zarah emas latar |
| **[html2canvas](https://html2canvas.hertzen.com/)** | Penghasilan poster JPG 1080×2340 |
| **Service Worker API** | Cache offline & strategi rangkaian |
| **Web App Manifest** | PWA install prompt & konfigurasi |
| **GitHub Raw API** | Sumber data JSON dari repositori |
| **[skill-icons](https://github.com/tandpfun/skill-icons)** | Inspirasi reka bentuk ikon PWA |
| **System.Drawing (.NET)** | Penjanaan ikon PNG |
| **[Nunito Sans](https://fonts.google.com/specimen/Nunito+Sans)** | Font utama (weight 300) |
| **[Google Fonts](https://fonts.google.com/)** | Hosting font CDN |

---

## 🤝 Cara Menyumbang

Sumbangan dialu-alukan! Ikuti langkah berikut:

1. **Fork** repositori ini
2. **Buat branch baru** untuk ciri atau pembaikan anda:
   ```bash
   git checkout -b ciri-baharu
   ```
3. **Commit perubahan**:
   ```bash
   git commit -m "Tambah ciri baharu: ..."
   ```
4. **Push ke branch**:
   ```bash
   git push origin ciri-baharu
   ```
5. **Buka Pull Request** di GitHub

### Panduan Sumbangan
- Kekalkan konsistensi gaya kod sedia ada
- Uji perubahan di pelbagai saiz skrin dan orientasi
- Gunakan Bahasa Melayu untuk teks antara muka
- Pastikan PWA masih lulus ujian asas (service worker, manifest)

---

## 📄 Lesen

Hak cipta terpelihara © 2026. Sila hubungi pemilik repositori untuk kebenaran penggunaan.

---

## ⚠️ Penafian

- Data waktu solat adalah berdasarkan jadual **e-Solat JAKIM**.
- Sila rujuk pihak berkuasa agama tempatan untuk pengesahan waktu solat terutamanya di kawasan yang mempunyai perbezaan lokaliti.
- Aplikasi ini adalah untuk rujukan am dan tidak bertanggungjawab ke atas sebarang kesilapan atau ketinggalan data.
- Fungsi offline bergantung kepada cache service worker; data terkini memerlukan sambungan internet.
- Pembangun tidak bertanggungjawab terhadap sebarang masalah yang timbul daripada penggunaan aplikasi ini.
- Pautan dalam panel tetapan (hubungi & sokong) boleh diubahsuai melalui fail `settings.json`.

---

<div align="center">
  <p>Dibina dengan ❤️ untuk umat Islam di Malaysia</p>
  <p>
    <a href="https://github.com/pengurusanemediamasjidkampungs-dotcom/waktu-solat-harian-2026/issues">Laporkan Isu</a>
    ·
    <a href="https://github.com/pengurusanemediamasjidkampungs-dotcom/waktu-solat-harian-2026/discussions">Perbincangan</a>
  </p>
  <br>
</div>
