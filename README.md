<div align="center">
  <br>
  <h1>🕌 Waktu Solat Malaysia 2026</h1>
  <p><strong>Aplikasi web jadual waktu solat harian Malaysia — pantas, mudah, dan responsif</strong></p>
  <p>
    <img src="https://img.shields.io/badge/JavaScript-61.2%25-%23F7DF1E?logo=javascript" alt="JavaScript">
    <img src="https://img.shields.io/badge/CSS-22.7%25-%231572B6?logo=css3" alt="CSS">
    <img src="https://img.shields.io/badge/HTML-16.1%25-%23E34F26?logo=html5" alt="HTML">
    <br>
    <img src="https://img.shields.io/badge/status-aktif-brightgreen" alt="Status">
    <img src="https://img.shields.io/badge/tahun-2026-blue" alt="2026">
  </p>
  <br>
</div>

---

## 📋 Senarai Kandungan

- [Tentang](#-tentang)
- [Ciri-Ciri](#-ciri-ciri)
- [Negeri & Zon](#-negeri--zon)
- [Tangkapan Skrin](#-tangkapan-skrin)
- [Cara Guna](#-cara-guna)
- [Struktur Projek](#-struktur-projek)
- [Sumber Data](#-sumber-data)
- [Teknologi](#-teknologi)
- [Cara Menyumbang](#-cara-menyumbang)
- [Lesen](#-lesen)
- [Penafian](#-penafian)

---

## 📖 Tentang

**Waktu Solat Malaysia 2026** ialah aplikasi web satu halaman (SPA) yang memaparkan jadual waktu solat harian untuk negeri-negeri terpilih di Malaysia. Data diperolehi secara langsung dari repositori GitHub dalam format JSON yang bersumberkan data e-Solat JAKIM.

Aplikasi ini dibina untuk memudahkan umat Islam di Malaysia mendapatkan waktu solat yang tepat mengikut zon masing-masing, dilengkapi dengan antara muka yang tenang, tema gelap, dan fitur-fitur interaktif seperti kongsi WhatsApp dan muat turun poster.

---

## ✨ Ciri-Ciri

| Ciri | Penerangan |
|------|-----------|
| **Pilih Negeri & Zon** | Dropdown negeri dan zon yang tersedia dengan data dari JAKIM |
| **Jadual Harian** | Paparan grid waktu solat (Imsak, Subuh, Syuruk, Dhuha, Zohor, Asar, Maghrib, Isyak) |
| **Kiraan Dhuha Automatik** | Jika tiada data Dhuha, dikira secara automatik (Syuruk + 30 minit) |
| **Format 12 Jam** | Semua waktu dipaparkan dalam format AM/PM untuk kemudahan pengguna |
| **Tarikh Masihi & Hijrah** | Tarikh Masihi (Malaysia) dan tarikh Hijrah lengkap dari API Kalendar Hijrah |
| **Kiraan Masa Menunggu** | Countdown langsung ke waktu solat seterusnya |
| **Warna Latar Dinamik** | Latar belakang bertukar mengikut waktu (subuh, siang, asar, malam) |
| **Kongsi WhatsApp** | Kongsi jadual hari ini ke WhatsApp dengan format kemas (tebal & condong) |
| **Muat Turun Poster** | Hasilkan poster jadual waktu solat dalam format PNG menggunakan html2canvas |
| **Particles.js** | Animasi latar zarah emas yang menenangkan |
| **Responsif** | Sesuai untuk telefon bimbit, tablet, dan desktop |

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

## 📸 Tangkapan Skrin

| Pandangan Desktop | Pandangan Mudah Alih |
|:---:|:---:|
| *(tambah skrin di sini)* | *(tambah skrin di sini)* |

---

## 🚀 Cara Guna

### Secara Atas Talian
Lawati terus laman web aplikasi ini di GitHub Pages (jika disediakan):
```
https://pengurusanemediamasjidkampungs-dotcom.github.io/waktu-solat-harian-2026/
```

### Secara Tempatan (Local)
1. **Clone repositori ini:**
   ```bash
   git clone https://github.com/pengurusanemediamasjidkampungs-dotcom/waktu-solat-harian-2026.git
   ```

2. **Buka fail `index.html`** terus di pelayar web (Chrome, Firefox, Edge, Safari).

   > **Nota:** Tiada keperluan pemasangan lanjut. Tiada npm, tiada build tool, tiada server. Just buka dan guna.

---

## 📁 Struktur Projek

```
waktu-solat-harian-2026/
├── index.html          # Halaman utama HTML
├── style.css           # Gaya & tema gelap (CSS)
├── script.js           # Logik aplikasi (JavaScript)
└── README.md           # Dokumentasi
```

Aplikasi ini adalah **single-page application (SPA)** sepenuhnya dalam satu folder — ringan dan mudah dihost di mana-mana (GitHub Pages, Netlify, Vercel, atau hosting statik lain).

---

## 🔗 Sumber Data

Data waktu solat dan kalendar hijrah diperolehi dari repositori GitHub berikut:

| Repositori | Penerangan |
|------------|-----------|
| [API-TAKWIM-SOLAT-SELANGOR-2026](https://github.com/pengurusanemediamasjidkampungs-dotcom/API-TAKWIM-SOLAT-SELANGOR-2026) | Data waktu solat zon Selangor (JSON) |
| [API-TAKWIM-SOLAT-JOHOR-2026](https://github.com/pengurusanemediamasjidkampungs-dotcom/API-TAKWIM-SOLAT-JOHOR-2026) | Data waktu solat zon Johor (JSON) |
| [API-Kalendar-Hijrah-2026](https://github.com/pengurusanemediamasjidkampungs-dotcom/API-Kalendar-Hijrah-2026) | Data kalendar Hijrah harian (JSON) |

Data sumber asal adalah dari **e-Solat JAKIM**.

> ⚠️ *Nota: Hanya negeri Selangor dan Johor yang mempunyai repositori data pada masa ini. Negeri lain akan ditambah apabila data tersedia.*

---

## 🛠️ Teknologi

| Teknologi | Tujuan |
|-----------|--------|
| **[Vanilla JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)** | Logik aplikasi tanpa framework |
| **HTML5** | Struktur halaman |
| **CSS3** | Gaya visual, tema gelap, animasi, responsif |
| **[Particles.js](https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js)** | Animasi zarah latar |
| **[html2canvas](https://html2canvas.hertzen.com/)** | Penghasilan poster PNG |
| **GitHub Raw API** | Sumber data JSON dari repositori |

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
- Uji perubahan di pelbagai saiz skrin
- Gunakan Bahasa Melayu untuk teks antara muka

---

## 📄 Lesen

Hak cipta terpelihara © 2026. Sila hubungi pemilik repositori untuk kebenaran penggunaan.

---

## ⚠️ Penafian

- Data waktu solat adalah berdasarkan jadual **e-Solat JAKIM**.
- Sila rujuk pihak berkuasa agama tempatan untuk pengesahan waktu solat terutamanya di kawasan yang mempunyai perbezaan lokaliti.
- Aplikasi ini adalah untuk rujukan am dan tidak bertanggungjawab ke atas sebarang kesilapan atau ketinggalan data.
- Pembangun tidak bertanggungjawab terhadap sebarang masalah yang timbul daripada penggunaan aplikasi ini.

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
