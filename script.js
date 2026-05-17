// script.js - Aplikasi Waktu Solat Malaysia
// Menggunakan data JSON statik dari repositori GitHub (waktu solat & kalendar hijrah)

(function() {
    const namaWaktu = ['Imsak', 'Subuh', 'Syuruk', 'Dhuha', 'Zohor', 'Asar', 'Maghrib', 'Isyak'];
    const $ = (id) => document.getElementById(id.replace(/^#/, ''));
    
    // API Kalendar Hijrah 2026
    const HIJRI_API_URL = "https://raw.githubusercontent.com/pengurusanemediamasjidkampungs-dotcom/API-Kalendar-Hijrah-2026/main/hijri_2026.json";
    let hijriDataCache = null;  // cache data hijrah untuk penggunaan seterusnya

    // Helper untuk mendapatkan waktu solat dengan fallback key
    const getPrayerTime = (waktu, fallbacks) => {
        for (const key of fallbacks) {
            if (waktu?.[key]?.['24h']) {
                const [hours, minutes] = waktu[key]['24h'].split(':').map(Number);
                const now = new Date();
                return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
            }
        }
        return null;
    };
    
    let waktuArray = [];
    let countdownInterval = null;
    let isDataLoaded = false;
    let currentZoneData = null;
    let currentTheme = 'default';

    const themes = {
        default: { dynamic: true },
        beige:   { center: '#C4A882', edge: '#8B6914' },
        blue:    { center: '#1e3a5f', edge: '#0d1b2a' },
        teal:    { center: '#1a6b5a', edge: '#0d3d33' },
        gold:    { center: '#8B7535', edge: '#4A3F1A' },
        maroon:  { center: '#5E1A3A', edge: '#2D0D1C' },
    };

    // Senarai negeri dan zon yang tersedia (dari repositori)
    const availableZones = {
        "Selangor": {
            repo: "https://raw.githubusercontent.com/pengurusanemediamasjidkampungs-dotcom/API-TAKWIM-SOLAT-SELANGOR-2026/main/",
            zones: [
                { code: "SGR01", name: "Gombak, Petaling, Sepang, Hulu Langat, Hulu Selangor, S.Alam" },
                { code: "SGR02", name: "Kuala Selangor, Sabak Bernam" },
                { code: "SGR03", name: "Klang, Kuala Langat" }
            ]
        },
        "Johor": {
            repo: "https://raw.githubusercontent.com/pengurusanemediamasjidkampungs-dotcom/API-TAKWIM-SOLAT-JOHOR-2026/main/",
            zones: [
                { code: "JHR01", name: "Pulau Aur dan Pulau Pemanggil" },
                { code: "JHR02", name: "Johor Bahru, Kota Tinggi, Mersing, Kulai" },
                { code: "JHR03", name: "Kluang, Pontian" },
                { code: "JHR04", name: "Batu Pahat, Muar, Segamat, Gemas Johor, Tangkak" }
            ]
        }
    };

    // Populate dropdown negeri (hanya negeri yang ada zon)
    function populateNegeri() {
        const negeriSelect = $('#negeriSelect');
        if (!negeriSelect) return;
        negeriSelect.innerHTML = '<option value="">-- Pilih Negeri --</option>';
        for (const negeri in availableZones) {
            const option = document.createElement('option');
            option.value = negeri;
            option.textContent = negeri;
            negeriSelect.appendChild(option);
        }
        negeriSelect.disabled = false;
    }

    // Apabila negeri berubah, populate dropdown zon
    function onNegeriChange() {
        const negeriNama = $('#negeriSelect').value;
        const zonSelect = $('#zonSelect');
        if (!zonSelect) return;
        
        if (!negeriNama) {
            zonSelect.innerHTML = '<option value="">-- Pilih Zon --</option>';
            zonSelect.disabled = true;
            const infoLokasi = $('#infoLokasi');
            if (infoLokasi) infoLokasi.innerHTML = '📍 Lokasi terkini: -';
            const lokasiDisplay = $('#lokasiDisplay');
            if (lokasiDisplay) lokasiDisplay.innerText = 'Belum dipilih';
            return;
        }
        const zones = availableZones[negeriNama].zones;
        zonSelect.innerHTML = '<option value="">-- Pilih Zon --</option>';
        zones.forEach(z => {
            const opt = document.createElement('option');
            opt.value = z.code;
            opt.textContent = `${z.code} - ${z.name}`;
            zonSelect.appendChild(opt);
        });
        zonSelect.disabled = false;
        const infoLokasi = $('#infoLokasi');
        if (infoLokasi) infoLokasi.innerHTML = `🏙️ Negeri: ${negeriNama} | Pilih zon untuk jadual solat.`;
    }

    // Fungsi untuk memuat data hijrah dari API (dengan cache)
    async function loadHijriData() {
        if (hijriDataCache) return hijriDataCache;
        try {
            const response = await fetch(HIJRI_API_URL);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            hijriDataCache = data;
            return hijriDataCache;
        } catch (err) {
            console.error("Gagal memuat data hijrah:", err);
            return null;
        }
    }

    // Kemaskini tarikh hijrah menggunakan API kalendar
    async function kemaskiniTarikhHijrah() {
        const hijriSpan = $('#dt-hijri');
        if (!hijriSpan) return;
        
        // Dapatkan tarikh hari ini dalam format YYYY-MM-DD
        const todayStr = new Date().toISOString().split('T')[0];
        
        // Cuba dari data zon dahulu (jika ada)
        if (currentZoneData && currentZoneData.jadual) {
            const todayPrayer = currentZoneData.jadual.find(item => item.tarikh === todayStr);
            if (todayPrayer && todayPrayer.hijri && todayPrayer.hijri.includes(' ')) {
                hijriSpan.innerText = todayPrayer.hijri;
                return;
            }
        }
        
        // Jika tiada dalam zon, gunakan API kalendar hijrah
        const hijriData = await loadHijriData();
        if (hijriData) {
            const entry = hijriData.find(item => item.gregorian === todayStr);
            if (entry && entry.hijri && entry.hijri.formatted) {
                hijriSpan.innerText = entry.hijri.formatted;
                return;
            }
        }
        
        // Fallback terakhir: kira sendiri secara kasar
        try {
            let sekarang = new Date();
            let hijriFormatter = new Intl.DateTimeFormat('en-US-u-ca-islamic', { day: 'numeric', month: 'numeric', year: 'numeric' });
            let parts = hijriFormatter.format(sekarang).split(' ')[0].split('/');
            let bulanHijrah = ['Muharram','Safar','Rabiulawal','Rabiulakhir','Jamadilawal','Jamadilakhir','Rejab','Syaaban','Ramadan','Syawal','Zulkaedah','Zulhijjah'];
            let tarikhHijri = `${parseInt(parts[1])} ${bulanHijrah[parseInt(parts[0])-1]} ${parts[2]}H`;
            hijriSpan.innerText = tarikhHijri.toUpperCase();
        } catch(e) { 
            hijriSpan.innerText = "TIDAK TERSEDIA"; 
        }
    }

    // Apabila zon berubah, muatkan data dari GitHub
    async function onZonChange() {
        const negeriNama = $('#negeriSelect').value;
        const zonCode = $('#zonSelect').value;
        if (!negeriNama || !zonCode) return;

        const repo = availableZones[negeriNama].repo;
        const url = `${repo}${zonCode}.json`;
        
        const infoLokasi = $('#infoLokasi');
        const lokasiDisplay = $('#lokasiDisplay');
        const appTitle = $('#appTitle');
        
        if (infoLokasi) infoLokasi.innerHTML = `⏳ Memuat data untuk ${negeriNama} - ${zonCode}...`;
        if (lokasiDisplay) lokasiDisplay.innerHTML = `${negeriNama} : ${zonCode}`;
        const zona = availableZones[negeriNama].zones.find(z => z.code === zonCode);
        if (appTitle) appTitle.innerText = `${negeriNama} - ${zonCode} ${zona?.name || ''}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            currentZoneData = data;
            isDataLoaded = true;
            
            const todayStr = new Date().toISOString().split('T')[0];
            const todayPrayer = data.jadual.find(item => item.tarikh === todayStr);
            if (todayPrayer) {
                const w = todayPrayer.waktu;
                const syuruk = getPrayerTime(w, ['syuruk', 'syuruq']);
                const dhuha = getPrayerTime(w, ['dhuha']) || (syuruk ? new Date(syuruk.getTime() + 30 * 60 * 1000) : null);
                waktuArray = [
                    getPrayerTime(w, ['imsak']),
                    getPrayerTime(w, ['subuh']),
                    syuruk,
                    dhuha,
                    getPrayerTime(w, ['zohor']),
                    getPrayerTime(w, ['asar']),
                    getPrayerTime(w, ['maghrib']),
                    getPrayerTime(w, ['isyak', 'isya']),
                ];
                setTarikhMasihi();
                await kemaskiniTarikhHijrah();  // gunakan API hijrah
                refreshUI();
                if (infoLokasi) infoLokasi.innerHTML = `📍 Lokasi: ${negeriNama}, ${zonCode} - ${data.daerah}`;
                if (lokasiDisplay) lokasiDisplay.innerHTML = `${negeriNama} : ${data.daerah}`;
            } else {
                throw new Error("Tiada jadual untuk hari ini");
            }
        } catch (err) {
            console.error(err);
            const cdw = $('#cd-w');
            const cdt = $('#cd-t');
            const gr = $('#gr');
            if (cdw) cdw.innerText = "RALAT DATA";
            if (cdt) cdt.innerText = "--:--:--";
            if (gr) gr.innerHTML = '<div class="item" style="grid-column:1/-1">Gagal memuat jadual. Pastikan zon wujud atau sambungan internet.</div>';
            if (infoLokasi) infoLokasi.innerHTML = `❌ Ralat: ${err.message}`;
        }
    }

    // Fungsi tarikh masihi
    function setTarikhMasihi() {
        try {
            let now = new Date();
            let options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
            const dt = $('#dt');
            if (dt) dt.innerText = now.toLocaleDateString('ms-MY', options).toUpperCase();
        } catch(e) { 
            const dt = $('#dt');
            if (dt) dt.innerText = "SELASA, 19 MEI 2026"; 
        }
    }

    function setTheme(themeName) {
        currentTheme = themeName;
        const theme = themes[themeName];
        const root = document.documentElement;
        if (!theme || theme.dynamic) {
            root.style.removeProperty('--dynamic-bg-center');
            root.style.removeProperty('--dynamic-bg-edge');
            kemaskiniLatarBelakang();
        } else {
            root.style.setProperty('--dynamic-bg-center', theme.center);
            root.style.setProperty('--dynamic-bg-edge', theme.edge);
        }
        document.querySelectorAll('.theme-btn').forEach(b =>
            b.classList.toggle('active', b.dataset.theme === themeName)
        );
    }

    function kemaskiniLatarBelakang() {
        const theme = themes[currentTheme];
        if (theme && !theme.dynamic) return;
        if (!waktuArray.length) return;
        let sekarang = new Date().getTime();
        let subuh = waktuArray[1]?.getTime() || 0;
        let syuruk = waktuArray[2]?.getTime() || 0;
        let asar = waktuArray[5]?.getTime() || 0;
        let maghrib = waktuArray[6]?.getTime() || 0;
        let root = document.documentElement;
        if (sekarang >= subuh && sekarang < syuruk) {
            root.style.setProperty('--dynamic-bg-center', '#0a5c44');
            root.style.setProperty('--dynamic-bg-edge', '#021a11');
        } else if (sekarang >= syuruk && sekarang < asar) {
            root.style.setProperty('--dynamic-bg-center', '#107c5b');
            root.style.setProperty('--dynamic-bg-edge', '#052b1e');
        } else if (sekarang >= asar && sekarang < maghrib) {
            root.style.setProperty('--dynamic-bg-center', '#146141');
            root.style.setProperty('--dynamic-bg-edge', '#071c12');
        } else {
            root.style.setProperty('--dynamic-bg-center', '#053b29');
            root.style.setProperty('--dynamic-bg-edge', '#02120c');
        }
    }

    function startCountdown(targetDate) {
        if (countdownInterval) clearInterval(countdownInterval);
        countdownInterval = setInterval(() => {
            let diff = Math.floor((targetDate - new Date()) / 1000);
            if (diff <= 0) { 
                window.location.reload(); 
                return; 
            }
            let jam = Math.floor(diff / 3600);
            let minit = Math.floor((diff % 3600) / 60);
            let saat = diff % 60;
            const cd_t = $('#cd-t');
            if (cd_t) cd_t.innerText = `${String(jam).padStart(2,'0')}:${String(minit).padStart(2,'0')}:${String(saat).padStart(2,'0')}`;
        }, 1000);
    }

    function formatTimeForGrid(date) {
        if (!date || isNaN(date.getTime())) return '--:--';
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }

    function refreshUI() {
        if (!waktuArray.length) return;
        let sekarang = new Date();
        let nextIndex = -1;
        for (let i=0; i<waktuArray.length; i++) {
            if (waktuArray[i] && waktuArray[i] > sekarang) { nextIndex = i; break; }
        }
        let gridHtml = '';
        for (let i=0; i<namaWaktu.length; i++) {
            let aktif = (i === nextIndex);
            gridHtml += `<div class="item ${aktif ? 'a' : ''}"><span class="n">${namaWaktu[i]}</span><span class="t">${formatTimeForGrid(waktuArray[i])}</span></div>`;
        }
        const gr = $('#gr');
        if (gr) gr.innerHTML = gridHtml;
        const cd_w = $('#cd-w');
        if (nextIndex !== -1) {
            if (cd_w) cd_w.innerText = namaWaktu[nextIndex].toUpperCase();
            startCountdown(waktuArray[nextIndex]);
        } else {
            if (cd_w) cd_w.innerText = "MENANTI IMSAK ESOK";
            if (countdownInterval) clearInterval(countdownInterval);
            const cd_t = $('#cd-t');
            if (cd_t) cd_t.innerText = "00:00:00";
        }
        kemaskiniLatarBelakang();
    }

    // Kongsi WhatsApp (format kemas dengan _*bold+italic*_)
    window.kongsiWhatsApp = async function() {
        if (!isDataLoaded || !currentZoneData) { alert("Sila pilih zon terlebih dahulu."); return; }
        const todayStr = new Date().toISOString().split('T')[0];
        const today = currentZoneData.jadual.find(item => item.tarikh === todayStr);
        if (!today) { alert("Tiada data untuk hari ini."); return; }
        
        let lokasi = `${currentZoneData.negeri} - ${currentZoneData.daerah}`;
        let tarikh = $('#dt')?.innerText || '';
        
        // Dapatkan hijri yang lengkap dari API kalendar
        let hijriText = '';
        const hijriData = await loadHijriData();
        const entry = hijriData?.find(item => item.gregorian === todayStr);
        if (entry?.hijri?.formatted) {
            hijriText = entry.hijri.formatted;
        } else if (today.hijri && today.hijri.includes('H')) {
            hijriText = today.hijri;
        } else {
            hijriText = $('#dt-hijri')?.innerText || '';
        }
        
        // Kira Dhuha jika tiada dalam data
        let dhuha12h = '';
        if (today.waktu.dhuha && today.waktu.dhuha['12h']) {
            dhuha12h = today.waktu.dhuha['12h'];
        } else {
            const syuruk = today.waktu.syuruk || today.waktu.syuruq;
            if (syuruk && syuruk['24h']) {
                const [hours, minutes] = syuruk['24h'].split(':').map(Number);
                const syurukDate = new Date();
                syurukDate.setHours(hours, minutes, 0);
                const dhuhaDate = new Date(syurukDate.getTime() + 30 * 60 * 1000);
                let dhuhaHours = dhuhaDate.getHours();
                let dhuhaMinutes = dhuhaDate.getMinutes();
                const dhuhaAmPm = dhuhaHours >= 12 ? 'PM' : 'AM';
                let dhuha12 = dhuhaHours % 12;
                if (dhuha12 === 0) dhuha12 = 12;
                dhuha12h = `${dhuha12}:${dhuhaMinutes.toString().padStart(2,'0')} ${dhuhaAmPm}`;
            } else {
                dhuha12h = '--:--';
            }
        }
        
        let w = today.waktu;
        let syuruk = w.syuruk || w.syuruq;
        let isyak = w.isyak || w.isya;
        
        let mesej = `_*Waktu Solat Malaysia*_ 🕌\n\n`;
        mesej += `📍 _*${lokasi}*_\n`;
        mesej += `📅 _*${tarikh}*_\n`;
        mesej += `🌟 _*${hijriText}*_\n\n`;
        mesej += `_*Imsak: ${w.imsak['12h']}*_\n`;
        mesej += `_*Subuh: ${w.subuh['12h']}*_\n`;
        mesej += `_*Syuruk: ${syuruk['12h']}*_\n`;
        mesej += `_*Dhuha: ${dhuha12h}*_\n`;
        mesej += `_*Zohor: ${w.zohor['12h']}*_\n`;
        mesej += `_*Asar: ${w.asar['12h']}*_\n`;
        mesej += `_*Maghrib: ${w.maghrib['12h']}*_\n`;
        mesej += `_*Isyak: ${isyak['12h']}*_\n\n`;
        mesej += `🌐 _*Waktu Solat Harian Anda :*_\n> ${window.location.href}`;
        
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(mesej)}`, '_blank');
    };

    // Muat turun poster (grid + info, tanpa dropdown)
    window.muatTurunGambar = async function() {
        if (!isDataLoaded) { alert("Tunggu data siap."); return; }
        const btn = document.getElementById('downloadPosterBtn');
        if (!btn) return;
        btn.disabled = true;
        btn.classList.add('loading');
        const box = document.querySelector('.box');
        if (!box) return;
        const bg = getComputedStyle(document.documentElement).getPropertyValue('--dynamic-bg-center').trim();

        const hide = [
            document.querySelector('.ticker-wrap'),
            document.querySelector('.location-panel'),
        ];
        const saved = hide.map(el => el ? el.style.display : null);
        hide.forEach(el => { if (el) el.style.display = 'none'; });

        const savedBg = box.style.background;
        const savedBorder = box.style.border;
        box.style.background = bg || '#053b29';
        box.style.border = '2px solid #d4af37';

        try {
            const canvas = await html2canvas(box, { scale: 2, useCORS: true, backgroundColor: bg });
            hide.forEach((el, i) => { if (el) el.style.display = saved[i]; });
            box.style.background = savedBg;
            box.style.border = savedBorder;
            btn.disabled = false;
            btn.classList.remove('loading');

            const dim = Math.max(canvas.width, canvas.height);
            const square = document.createElement('canvas');
            square.width = dim;
            square.height = dim;
            const ctx = square.getContext('2d');
            ctx.fillStyle = bg || '#053b29';
            ctx.fillRect(0, 0, dim, dim);
            ctx.drawImage(canvas, (dim - canvas.width) / 2, (dim - canvas.height) / 2);

            let link = document.createElement('a');
            link.download = `WaktuSolat_${currentZoneData?.negeri || 'Malaysia'}_${new Date().toISOString().split('T')[0]}.jpg`;
            link.href = square.toDataURL('image/jpeg', 0.92);
            link.click();
        } catch(e) {
            console.error(e);
            hide.forEach((el, i) => { if (el) el.style.display = saved[i]; });
            box.style.background = savedBg;
            box.style.border = savedBorder;
            btn.disabled = false;
            btn.classList.remove('loading');
            alert("Ralat menghasilkan poster.");
        }
    };

    function initParticles() {
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                particles: { number: { value: 35 }, color: { value: "#d4af37" }, shape: { type: "circle" },
                opacity: { value: 0.4, random: true }, size: { value: 2, random: true }, move: { enable: true, speed: 0.6, direction: "top" } },
                interactivity: { events: { onhover: { enable: true, mode: "bubble" }, onclick: { enable: true, mode: "repulse" } } }
            });
        }
    }

    function bindEvents() {
        const negeriSelect = $('#negeriSelect');
        const zonSelect = $('#zonSelect');
        const shareBtn = $('#shareWaBtn');
        const downloadBtn = $('#downloadPosterBtn');
        
        if (negeriSelect) negeriSelect.addEventListener('change', onNegeriChange);
        if (zonSelect) zonSelect.addEventListener('change', onZonChange);
        if (shareBtn) shareBtn.addEventListener('click', window.kongsiWhatsApp);
        if (downloadBtn) downloadBtn.addEventListener('click', window.muatTurunGambar);
        document.querySelectorAll('.theme-btn').forEach(btn =>
            btn.addEventListener('click', () => setTheme(btn.dataset.theme))
        );
    }

    // Indikator offline / online
    function updateOnlineStatus() {
        const infoLokasi = $('#infoLokasi');
        if (!infoLokasi) return;
        if (!navigator.onLine) {
            if (!infoLokasi.dataset.lastHtml)
                infoLokasi.dataset.lastHtml = infoLokasi.innerHTML;
            infoLokasi.innerHTML = '✈️ Mod Luar Talian — data mungkin tidak terkini';
        } else {
            if (infoLokasi.dataset.lastHtml) {
                infoLokasi.innerHTML = infoLokasi.dataset.lastHtml;
                delete infoLokasi.dataset.lastHtml;
            }
        }
    }
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    window.addEventListener('DOMContentLoaded', () => {
        setTarikhMasihi();
        bindEvents();
        initParticles();
        populateNegeri();
        updateOnlineStatus();
        // Pra-muat data hijrah untuk cache (tidak wajib, tetapi baik untuk prestasi)
        loadHijriData().catch(console.warn);
    });
})();