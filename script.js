// script.js - Aplikasi Waktu Solat Malaysia
// Menggunakan data JSON statik dari repositori GitHub

(function() {
    const namaWaktu = ['Imsak', 'Subuh', 'Syuruk', 'Dhuha', 'Zohor', 'Asar', 'Maghrib', 'Isyak'];
    const $ = (id) => document.getElementById(id.replace(/^#/, ''));

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
                waktuArray = [
                    getPrayerTime(w, ['imsak']),
                    getPrayerTime(w, ['subuh']),
                    getPrayerTime(w, ['syuruk', 'syuruq']),
                    getPrayerTime(w, ['dhuha']),
                    getPrayerTime(w, ['zohor']),
                    getPrayerTime(w, ['asar']),
                    getPrayerTime(w, ['maghrib']),
                    getPrayerTime(w, ['isyak', 'isya']),
                ];
                setTarikhMasihi();
                kemaskiniTarikhHijrah(); 
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

    function kemaskiniTarikhHijrah() {
        const hijriSpan = $('#dt-hijri');
        if (!hijriSpan) return;
        
        if (currentZoneData && currentZoneData.jadual) {
            const todayStr = new Date().toISOString().split('T')[0];
            const today = currentZoneData.jadual.find(item => item.tarikh === todayStr);
            if (today && today.hijri) {
                hijriSpan.innerText = today.hijri;
                return;
            }
        }
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

    function kemaskiniLatarBelakang() {
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
            gridHtml += `<div class="item ${aktif ? 'a' : ''}"><span class="n">${namaWaktu[i]}</span><span class="t">${formatTime(waktuArray[i])}</span></div>`;
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

    function formatTime(date) {
        if (!date || isNaN(date.getTime())) return '--:--';
        return date.toLocaleTimeString('ms-MY', { hour:'2-digit', minute:'2-digit', hour12:false });
    }

    window.kongsiWhatsApp = function() {
        if (!isDataLoaded || !currentZoneData) { alert("Sila pilih zon terlebih dahulu."); return; }
        const todayStr = new Date().toISOString().split('T')[0];
        const today = currentZoneData.jadual.find(item => item.tarikh === todayStr);
        if (!today) { alert("Tiada data untuk hari ini."); return; }
        let lokasi = `${currentZoneData.negeri} - ${currentZoneData.daerah}`;
        let tarikh = $('#dt')?.innerText || '';
        let hijri = today.hijri || $('#dt-hijri')?.innerText || '';
        let w = today.waktu;
        let syuruk = w.syuruk || w.syuruq;
        let dhuha = w.dhuha;
        let isyak = w.isyak || w.isya;
        let mesej = `🕌 *Waktu Solat Malaysia* 🕌\n📍 ${lokasi}\n📅 ${tarikh}\n🌟 ${hijri}\n\n`;
        mesej += `Imsak: ${w.imsak['12h']}\nSubuh: ${w.subuh['12h']}\nSyuruk: ${syuruk['12h']}\n`;
        mesej += `Dhuha: ${dhuha ? dhuha['12h'] : '--:--'}\nZohor: ${w.zohor['12h']}\nAsar: ${w.asar['12h']}\n`;
        mesej += `Maghrib: ${w.maghrib['12h']}\nIsyak: ${isyak['12h']}\n\n`;
        mesej += `🌐 Sumber: ${window.location.href}`;
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(mesej)}`, '_blank');
    };

    window.muatTurunGambar = async function() {
        if (!isDataLoaded) { alert("Tunggu data siap."); return; }
        const btn = document.querySelector('.btn-fb');
        if (!btn) return;
        const asal = btn.innerHTML;
        btn.innerHTML = "MENGHASILKAN POSTER...";
        btn.disabled = true;
        const box = document.querySelector('.box');
        if (!box) return;
        const bg = getComputedStyle(document.documentElement).getPropertyValue('--dynamic-bg-center').trim();
        const btnWa = document.querySelector('.btn-wa');
        const cdBox = document.querySelector('.cd-box');
        const ticker = document.querySelector('.ticker-wrap');
        if (btnWa) btnWa.style.display = 'none';
        btn.style.display = 'none';
        if (cdBox) cdBox.style.display = 'none';
        if (ticker) ticker.style.display = 'none';
        const originalBg = box.style.background;
        const originalBorder = box.style.border;
        box.style.background = bg || '#053b29';
        box.style.border = '2px solid #d4af37';
        try {
            const canvas = await html2canvas(box, { scale: 2, useCORS: true, backgroundColor: bg });
            if (btnWa) btnWa.style.display = 'flex';
            btn.style.display = 'flex';
            if (cdBox) cdBox.style.display = 'block';
            if (ticker) ticker.style.display = 'block';
            box.style.background = originalBg;
            box.style.border = originalBorder;
            btn.disabled = false;
            btn.innerHTML = asal;
            let link = document.createElement('a');
            link.download = `WaktuSolat_${currentZoneData?.negeri || 'Malaysia'}_${new Date().toISOString().split('T')[0]}.png`;
            link.href = canvas.toDataURL();
            link.click();
        } catch(e) {
            console.error(e);
            if (btnWa) btnWa.style.display = 'flex';
            btn.style.display = 'flex';
            if (cdBox) cdBox.style.display = 'block';
            if (ticker) ticker.style.display = 'block';
            box.style.background = originalBg;
            box.style.border = originalBorder;
            btn.disabled = false;
            btn.innerHTML = asal;
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
    }

    window.addEventListener('DOMContentLoaded', () => {
        setTarikhMasihi();
        bindEvents();
        initParticles();
        populateNegeri();
    });
})();