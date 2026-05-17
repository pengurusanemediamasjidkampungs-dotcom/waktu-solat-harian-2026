// script.js - Aplikasi Waktu Solat Malaysia
// Menggunakan data JSON statik dari repositori GitHub

(function() {
    const namaWaktu = ['Imsak', 'Subuh', 'Syuruk', 'Dhuha', 'Zohor', 'Asar', 'Maghrib', 'Isyak'];
    const $ = (id) => document.getElementById(id);
    
    let waktuArray = [];
    let countdownInterval = null;
    let isDataLoaded = false;
    let currentZoneData = null;

    // Senarai negeri dan zon yang tersedia (dari repositori)
    const availableZones = {
        "Johor": {
            repo: "https://raw.githubusercontent.com/pengurusanemediamasjidkampungs-dotcom/API-TAKWIM-SOLAT-JOHOR-2026/main/",
            zones: [
                { code: "JHR01", name: "PULAU AUR - PULAU PEMANGGIL" },
                { code: "JHR02", name: "JOHOR BAHRU - KOTA TINGGI - MERSING - KULAI" },
                { code: "JHR03", name: "KLUANG - PONTIAN" },
                { code: "JHR04", name: "BATU PAHAT - MUAR - SEGAMAT - GEMAS JOHOR - TANGKAK" }
            ]
        },
        "Selangor": {
            repo: "https://raw.githubusercontent.com/pengurusanemediamasjidkampungs-dotcom/API-TAKWIM-SOLAT-SELANGOR-2026/main/",
            zones: [
                { code: "SGR01", name: "Hulu Selangor, Gombak, Petaling, Hulu Langat, Sepang" },
                { code: "SGR02", name: "Klang, Kuala Langat, Kuala Selangor, Sabak Bernam" },
                { code: "SGR03", name: "Kuala Lumpur, Putrajaya" }
            ]
        }
        // Negeri lain boleh ditambah kemudian
    };

    // Populate dropdown negeri (hanya negeri yang ada zon)
    function populateNegeri() {
        const negeriSelect = $('#negeriSelect');
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
        const bandarSelect = $('#bandarSelect'); // kita akan guna zonSelect sahaja, bandarSelect boleh sembunyi atau guna sebagai alternative
        if (!negeriNama) {
            zonSelect.innerHTML = '<option value="">-- Pilih Zon --</option>';
            zonSelect.disabled = true;
            $('#infoLokasi').innerHTML = '📍 Lokasi terkini: -';
            $('#lokasiDisplay').innerText = 'Belum dipilih';
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
        $('#infoLokasi').innerHTML = `🏙️ Negeri: ${negeriNama} | Pilih zon untuk jadual solat.`;
    }

    // Apabila zon berubah, muatkan data dari GitHub
    async function onZonChange() {
        const negeriNama = $('#negeriSelect').value;
        const zonCode = $('#zonSelect').value;
        if (!negeriNama || !zonCode) return;

        const repo = availableZones[negeriNama].repo;
        const url = `${repo}${zonCode}.json`;
        
        $('#infoLokasi').innerHTML = `⏳ Memuat data untuk ${negeriNama} - ${zonCode}...`;
        $('#lokasiDisplay').innerHTML = `${negeriNama} : ${zonCode}`;
        $('#appTitle').innerText = zonCode.toUpperCase();

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            currentZoneData = data;
            isDataLoaded = true;
            
            // Dapatkan tarikh hari ini
            const todayStr = new Date().toISOString().split('T')[0];
            const todayPrayer = data.jadual.find(item => item.tarikh === todayStr);
            if (todayPrayer) {
                // Tukar kepada format waktuArray untuk keserasian dengan fungsi sedia ada
                const makeTime = (timeObj) => {
                    // timeObj = { "12h": "5:56 AM", "24h": "05:56" }
                    const [hours, minutes] = timeObj['24h'].split(':').map(Number);
                    const now = new Date();
                    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
                };
                waktuArray = [
                    makeTime(todayPrayer.waktu.imsak),
                    makeTime(todayPrayer.waktu.subuh),
                    makeTime(todayPrayer.waktu.syuruk),
                    makeTime(todayPrayer.waktu.dhuha || todayPrayer.waktu.syuruq), // fallback
                    makeTime(todayPrayer.waktu.zohor),
                    makeTime(todayPrayer.waktu.asar),
                    makeTime(todayPrayer.waktu.maghrib),
                    makeTime(todayPrayer.waktu.isya)
                ];
                setTarikhMasihi();
                kemaskiniTarikhHijrah(); // kita boleh dapatkan hijri dari data jika ada
                refreshUI();
                $('#infoLokasi').innerHTML = `📍 Lokasi: ${negeriNama}, ${zonCode} - ${data.daerah}`;
                $('#lokasiDisplay').innerHTML = `${negeriNama} : ${data.daerah}`;
            } else {
                throw new Error("Tiada jadual untuk hari ini");
            }
        } catch (err) {
            console.error(err);
            $('cd-w').innerText = "RALAT DATA";
            $('cd-t').innerText = "--:--:--";
            $('gr').innerHTML = '<div class="item" style="grid-column:1/-1">Gagal memuat jadual. Pastikan zon wujud atau sambungan internet.</div>';
            $('#infoLokasi').innerHTML = `❌ Ralat: ${err.message}`;
        }
    }

    // Fungsi tarikh masihi
    function setTarikhMasihi() {
        try {
            let now = new Date();
            let options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
            $('dt').innerText = now.toLocaleDateString('ms-MY', options).toUpperCase();
        } catch(e) { $('dt').innerText = "SELASA, 19 MEI 2026"; }
    }

    // Tarikh hijri - cuba dapatkan dari data zon yang dimuat jika ada, atau kira sendiri
    function kemaskiniTarikhHijrah() {
        if (currentZoneData && currentZoneData.jadual) {
            const todayStr = new Date().toISOString().split('T')[0];
            const today = currentZoneData.jadual.find(item => item.tarikh === todayStr);
            if (today && today.hijri) {
                $('dt-hijri').innerText = today.hijri;
                return;
            }
        }
        // Fallback: kira sendiri (simple)
        try {
            let sekarang = new Date();
            let hijriFormatter = new Intl.DateTimeFormat('en-US-u-ca-islamic', { day: 'numeric', month: 'numeric', year: 'numeric' });
            let parts = hijriFormatter.format(sekarang).split(' ')[0].split('/');
            let bulanHijrah = ['Muharram','Safar','Rabiulawal','Rabiulakhir','Jamadilawal','Jamadilakhir','Rejab','Syaaban','Ramadan','Syawal','Zulkaedah','Zulhijjah'];
            let tarikhHijri = `${parseInt(parts[1])} ${bulanHijrah[parseInt(parts[0])-1]} ${parts[2]}H`;
            $('dt-hijri').innerText = tarikhHijri.toUpperCase();
        } catch(e) { $('dt-hijri').innerText = "TIDAK TERSEDIA"; }
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
            if (diff <= 0) { window.location.reload(); return; }
            let jam = Math.floor(diff / 3600);
            let minit = Math.floor((diff % 3600) / 60);
            let saat = diff % 60;
            $('cd-t').innerText = `${String(jam).padStart(2,'0')}:${String(minit).padStart(2,'0')}:${String(saat).padStart(2,'0')}`;
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
        $('gr').innerHTML = gridHtml;
        if (nextIndex !== -1) {
            $('cd-w').innerText = namaWaktu[nextIndex].toUpperCase();
            startCountdown(waktuArray[nextIndex]);
        } else {
            $('cd-w').innerText = "MENANTI IMSAK ESOK";
            if (countdownInterval) clearInterval(countdownInterval);
            $('cd-t').innerText = "00:00:00";
        }
        kemaskiniLatarBelakang();
    }

    function formatTime(date) {
        if (!date || isNaN(date.getTime())) return '--:--';
        return date.toLocaleTimeString('ms-MY', { hour:'2-digit', minute:'2-digit', hour12:false });
    }

    // Kongsi WhatsApp (gunakan data dari currentZoneData untuk paparan yang lebih tepat)
    window.kongsiWhatsApp = function() {
        if (!isDataLoaded || !currentZoneData) { alert("Sila pilih zon terlebih dahulu."); return; }
        const todayStr = new Date().toISOString().split('T')[0];
        const today = currentZoneData.jadual.find(item => item.tarikh === todayStr);
        if (!today) { alert("Tiada data untuk hari ini."); return; }
        let lokasi = `${currentZoneData.negeri} - ${currentZoneData.daerah}`;
        let tarikh = $('#dt').innerText;
        let hijri = today.hijri || $('#dt-hijri').innerText;
        let waktu12h = today.waktu;
        let mesej = `🕌 *Waktu Solat Malaysia* 🕌\n📍 ${lokasi}\n📅 ${tarikh}\n🌟 ${hijri}\n\n`;
        mesej += `Imsak: ${waktu12h.imsak['12h']}\nSubuh: ${waktu12h.subuh['12h']}\nSyuruk: ${waktu12h.syuruk['12h']}\n`;
        mesej += `Dhuha: ${(waktu12h.dhuha || waktu12h.syuruq)['12h']}\nZohor: ${waktu12h.zohor['12h']}\nAsar: ${waktu12h.asar['12h']}\n`;
        mesej += `Maghrib: ${waktu12h.maghrib['12h']}\nIsyak: ${waktu12h.isya['12h']}\n\n`;
        mesej += `🌐 Sumber: ${window.location.href}`;
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(mesej)}`, '_blank');
    };

    // Muat turun poster (menggunakan elemen box semasa)
    window.muatTurunGambar = async function() {
        if (!isDataLoaded) { alert("Tunggu data siap."); return; }
        const btn = document.querySelector('.btn-fb');
        const asal = btn.innerHTML;
        btn.innerHTML = "MENGHASILKAN POSTER...";
        btn.disabled = true;
        const box = document.querySelector('.box');
        const bg = getComputedStyle(document.documentElement).getPropertyValue('--dynamic-bg-center').trim();
        const btnWa = document.querySelector('.btn-wa');
        const cdBox = document.querySelector('.cd-box');
        const ticker = document.querySelector('.ticker-wrap');
        if (btnWa) btnWa.style.display = 'none';
        btn.style.display = 'none';
        if (cdBox) cdBox.style.display = 'none';
        if (ticker) ticker.style.display = 'none';
        box.style.background = bg || '#053b29';
        box.style.border = '2px solid #d4af37';
        try {
            const canvas = await html2canvas(box, { scale: 2, useCORS: true, backgroundColor: bg });
            if (btnWa) btnWa.style.display = 'flex';
            btn.style.display = 'flex';
            if (cdBox) cdBox.style.display = 'block';
            if (ticker) ticker.style.display = 'block';
            box.style.background = '';
            box.style.border = '';
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
            box.style.background = '';
            box.style.border = '';
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
        $('#negeriSelect').addEventListener('change', onNegeriChange);
        $('#zonSelect').addEventListener('change', onZonChange);
        $('#shareWaBtn').addEventListener('click', window.kongsiWhatsApp);
        $('#downloadPosterBtn').addEventListener('click', window.muatTurunGambar);
    }

    window.addEventListener('DOMContentLoaded', () => {
        setTarikhMasihi();
        bindEvents();
        initParticles();
        populateNegeri();
    });
})();