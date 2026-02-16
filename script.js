/* ========================================
   DESA BANYUKUNING - JAVASCRIPT
   ======================================== */

document.addEventListener('DOMContentLoaded', function () {

  // --- NAVBAR SCROLL ---
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    function handleScroll() {
      if (window.scrollY > 50) {
        navbar.classList.remove('transparent');
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.add('transparent');
        navbar.classList.remove('scrolled');
      }
    }
    // Check if on home page (has hero)
    if (document.querySelector('.hero')) {
      navbar.classList.add('transparent');
      window.addEventListener('scroll', handleScroll);
    } else {
      navbar.classList.add('scrolled');
    }
  }

  // --- MOBILE NAV ---
  const navToggle = document.querySelector('.navbar-toggle');
  const mobileNav = document.querySelector('.navbar-mobile');
  const mobileClose = document.querySelector('.mobile-close');

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => mobileNav.classList.add('open'));
    if (mobileClose) mobileClose.addEventListener('click', () => mobileNav.classList.remove('open'));
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileNav.classList.remove('open'));
    });
  }

  // --- HERO SLIDER ---
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === index);
    });
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });
    currentSlide = index;
  }

  function nextSlide() {
    showSlide((currentSlide + 1) % slides.length);
  }

  if (slides.length > 0) {
    showSlide(0);
    slideInterval = setInterval(nextSlide, 5000);

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        clearInterval(slideInterval);
        showSlide(i);
        slideInterval = setInterval(nextSlide, 5000);
      });
    });
  }

  // --- DATE & TIME ---
  const dateDisplay = document.getElementById('dateDisplay');
  const timeDisplay = document.getElementById('timeDisplay');

  function updateDateTime() {
    const now = new Date();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    if (dateDisplay) {
      dateDisplay.textContent = days[now.getDay()] + ', ' + now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear();
    }
    if (timeDisplay) {
      timeDisplay.textContent = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';
    }
  }

  if (dateDisplay || timeDisplay) {
    updateDateTime();
    setInterval(updateDateTime, 1000);
  }

  // --- PRAYER SCHEDULE (Aladhan API) ---
  async function fetchPrayerTimes() {
    try {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const yyyy = today.getFullYear();
      const res = await fetch(`https://api.aladhan.com/v1/timingsByCity/${dd}-${mm}-${yyyy}?city=Semarang&country=Indonesia&method=20`);
      const data = await res.json();
      const timings = data.data.timings;

      const prayerMap = {
        'subuh': timings.Fajr,
        'dzuhur': timings.Dhuhr,
        'ashar': timings.Asr,
        'maghrib': timings.Maghrib,
        'isya': timings.Isha,
      };

      Object.keys(prayerMap).forEach(key => {
        const el = document.getElementById('prayer-' + key);
        if (el) el.textContent = prayerMap[key];
      });

      // Highlight current prayer
      highlightCurrentPrayer(prayerMap);
    } catch (err) {
      console.log('Prayer API error:', err);
    }
  }

  function highlightCurrentPrayer(prayerMap) {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const entries = Object.entries(prayerMap);
    let currentPrayer = entries[entries.length - 1][0]; // default isya

    for (let i = 0; i < entries.length; i++) {
      const [, time] = entries[i];
      const [h, m] = time.split(':').map(Number);
      const prayerMinutes = h * 60 + m;
      if (currentMinutes < prayerMinutes) {
        currentPrayer = i > 0 ? entries[i - 1][0] : entries[entries.length - 1][0];
        break;
      }
      if (i === entries.length - 1) {
        currentPrayer = entries[i][0];
      }
    }

    document.querySelectorAll('.prayer-item').forEach(el => {
      el.classList.remove('current');
    });
    const currentEl = document.getElementById('item-' + currentPrayer);
    if (currentEl) currentEl.classList.add('current');
  }

  if (document.querySelector('.prayer-card')) {
    fetchPrayerTimes();
  }

  // --- COUNTER ANIMATION ---
  function animateCounter(element, target, suffix) {
    let current = 0;
    const increment = target / 80;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.innerHTML = Math.floor(current).toLocaleString('id-ID') + (suffix ? '<span class="counter-suffix">' + suffix + '</span>' : '');
    }, 20);
  }

  const counterSection = document.querySelector('.counter-section');
  let counterAnimated = false;

  if (counterSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !counterAnimated) {
          counterAnimated = true;
          document.querySelectorAll('.counter-number').forEach(el => {
            const target = parseInt(el.getAttribute('data-target'));
            const suffix = el.getAttribute('data-suffix') || '';
            animateCounter(el, target, suffix);
          });
        }
      });
    }, { threshold: 0.3 });

    observer.observe(counterSection);
  }

  // --- FADE UP ANIMATION ---
  const fadeElements = document.querySelectorAll('.fade-up');
  if (fadeElements.length > 0) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => fadeObserver.observe(el));
  }

  // --- BERITA MODAL ---
  window.openBeritaModal = function (id) {
    const data = beritaData[id];
    if (!data) return;
    document.getElementById('modalTitle').textContent = data.title;
    document.getElementById('modalImg').src = data.img;
    document.getElementById('modalImg').alt = data.title;
    document.getElementById('modalDate').textContent = data.date;
    document.getElementById('modalContent').innerHTML = data.content;
    document.querySelector('.modal-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeModal = function () {
    document.querySelector('.modal-overlay')?.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.querySelector('.modal-overlay')?.addEventListener('click', function (e) {
    if (e.target === this) window.closeModal();
  });

  // --- GALERI LIGHTBOX ---
  window.openLightbox = function (src, caption) {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    document.getElementById('lightboxImg').src = src;
    document.getElementById('lightboxCaption').textContent = caption;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeLightbox = function () {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.getElementById('lightbox')?.addEventListener('click', function (e) {
    if (e.target === this) window.closeLightbox();
  });

  // --- PENGADUAN FORM -> WHATSAPP ---
  const pengaduanForm = document.getElementById('pengaduanForm');
  if (pengaduanForm) {
    pengaduanForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const nama = document.getElementById('nama').value;
      const nik = document.getElementById('nik').value;
      const kategori = document.getElementById('kategori').value;
      const pesan = document.getElementById('pesan').value;

      const text = `*PENGADUAN DESA BANYUKUNING*%0A%0A*Nama:* ${encodeURIComponent(nama)}%0A*NIK:* ${encodeURIComponent(nik)}%0A*Kategori:* ${encodeURIComponent(kategori)}%0A*Isi Pengaduan:*%0A${encodeURIComponent(pesan)}`;
      const waNumber = '6282100000000';
      window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank');
    });
  }

  // --- ACTIVE NAV LINK ---
  const currentPage = window.location.pathname.split('/').pop() || 'beranda.html';
  document.querySelectorAll('.navbar-menu a, .navbar-mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'beranda.html') || (currentPage === 'index.html' && href === 'beranda.html')) {
      link.classList.add('active');
    }
  });

});

// --- BERITA DATA ---
const beritaData = {
  1: {
    title: 'Kisah Sukses Adi Tia Prabowo Membangun Usaha Kopi di Tengah Pandemi',
    img: 'images/berita1.png',
    date: '15 Februari 2026',
    content: '<p>Berawal dari ketidakpastian di tengah pandemi, Adi Tia Prabowo yang biasa dipanggil Bowo justru menemukan kepastian dalam secangkir kopi. Ketika banyak orang merasa ragu melangkah, ia memilih berani mengambil jalan baru. Perjalanannya di dunia kopi bukanlah sesuatu yang sudah direncanakan dari awal. Sebelum memulai bisnis kopi, Bowo pernah bekerja di sebuah pabrik. Namun, ketika pandemi menghantam dan kondisi menjadi tidak pasti, dia mulai merenungkan masa depannya lagi. Dari percakapan santai dengan teman-teman yang sudah lebih dulu berkecimpung di dunia kopi, timbul ide untuk memanfaatkan potensi lokal di daerahnya sekaligus meningkatkan penjualan kopi setempat.</p><p style="margin-top:12px">Ketertarikannya pada kopi sudah mulai tumbuh sejak tahun 2019, ketika ia mengikuti pelatihan barista di Soropadan. Dari situlah pengetahuannya tentang kopi semakin dalam. Dengan memanfaatkan kebun kopi yang merupakan warisan keluarga, Bowo melihat adanya kesempatan besar yang sebelumnya belum dimanfaatkan secara maksimal. Ia mulai belajar perlahan, memahami setiap tahap mulai dari awal hingga akhir, dan akhirnya pada tahun 2023 ia memulai produksi kopi dengan merek yang ia kembangkan sendiri. Perjalanan yang dimulai dari belajar ini menunjukkan bahwa kesabaran dan proses merupakan hal utama dalam membangun usaha yang kuat. </p><p style="margin-top:12px">Dalam perjalanannya, Bowo mengakui tantangan terbesarnya sebenarnya cukup sederhana, yaitu bangun pagi untuk merawat kebun dan mengelola produksinya. Meski terdengar mudah, tetap konsisten adalah ujian yang sebenarnya dalam berwirausaha. Untuk soal produksi dan distribusi, dia merasa bersyukur karena tidak menghadapi hambatan yang signifikan. Ia memutuskan untuk mencari konsumen secara mandiri dan membangun pasar sendiri. Akibatnya, banyak pelanggan akhirnya memutuskan untuk menjadi pelanggan tetap ini adalah pencapaian yang sangat berkesan baginya karena menunjukkan bahwa produknya benar-benar diterima dengan baik.</p>'
  },
  2: {
    title: 'Warga Dusun Mendongan Melakukan Tradisi Nyadran',
    img: 'images/berita2.jpeg',
    date: '13 Februari 2026',
    content: '<p>Tradisi Nyadran kembali digelar oleh warga Dusun Mendongan pada Jumat, 13 Februari 2026, sebagai wujud pelestarian nilai-nilai budaya dan kearifan lokal yang telah diwariskan secara turun-temurun. Kegiatan ini menjadi agenda rutin masyarakat yang tidak hanya sarat makna spiritual, tetapi juga memperkuat rasa kebersamaan antarwarga. Sejak pagi hari, masyarakat telah berkumpul dengan penuh antusias untuk mengikuti seluruh rangkaian acara yang telah dipersiapkan bersama.</p><p style="margin-top:12px">Nyadran merupakan tradisi yang identik dengan doa bersama dan ziarah ke makam leluhur sebagai bentuk penghormatan kepada para pendahulu. Dalam pelaksanaannya, warga membawa berbagai hidangan hasil bumi dan makanan tradisional yang kemudian didoakan bersama. Suasana khidmat terasa saat tokoh agama memimpin doa, memohon keselamatan, keberkahan, serta kesejahteraan bagi seluruh masyarakat Dusun Mendongan dan Desa Banyukuning pada umumnya.</p><p style="margin-top:12px">Kegiatan ini melibatkan seluruh lapisan masyarakat, mulai dari anak-anak, pemuda, hingga para sesepuh dusun. Kehadiran tokoh masyarakat serta perwakilan dari dusun lain turut menambah semarak acara. Partisipasi aktif warga menunjukkan tingginya kesadaran kolektif untuk menjaga dan melestarikan tradisi yang menjadi identitas budaya desa.</p><p style="margin-top:12px">Selain sebagai bentuk penghormatan kepada leluhur, tradisi Nyadran juga menjadi sarana mempererat tali silaturahmi. Momen kebersamaan saat mempersiapkan acara, membawa hidangan, hingga makan bersama mencerminkan semangat gotong royong yang masih kuat di tengah masyarakat. Nilai-nilai kebersamaan inilah yang menjadi fondasi penting dalam membangun kehidupan sosial yang harmonis.</p><p style="margin-top:12px">Melalui penyelenggaraan Nyadran, warga Dusun Mendongan berharap tradisi ini dapat terus diwariskan kepada generasi muda agar tidak tergerus perkembangan zaman. Pemerintah Desa Banyukuning pun mendukung penuh kegiatan tersebut sebagai bagian dari upaya menjaga warisan budaya lokal. Dengan semangat kebersamaan dan kekeluargaan, Nyadran diharapkan tetap menjadi tradisi yang hidup dan memberi makna bagi masyarakat di masa mendatang.</p>'

  },
  3: {
    title: 'Pelatihan Pembuatan Lilin Aromaterapi untuk Warga Desa',
    img: 'images/berita3.jpeg',
    date: '26 Januari 2026',
    content: '<p>Mahasiswa Kuliah Kerja Nyata dari Universitas Negeri Semarang (KKN UNNES) dan Universitas Sebelas Maret (KKN UNS) berkolaborasi menyelenggarakan pelatihan pembuatan lilin aromaterapi berbahan dasar minyak jelantah bagi warga Desa Banyukuning. Kegiatan ini dilaksanakan sebagai bentuk pengabdian kepada masyarakat sekaligus upaya mendorong pemanfaatan limbah rumah tangga menjadi produk bernilai guna dan bernilai ekonomi. Antusiasme peserta terlihat sejak awal kegiatan, yang dipusatkan di balai desa dengan suasana penuh semangat dan kebersamaan.</p><p style="margin-top:12px">Pelatihan tersebut diikuti oleh 50 ibu-ibu PKK Desa Banyukuning. Para peserta mendapatkan materi mengenai pentingnya pengelolaan minyak jelantah agar tidak dibuang sembarangan yang dapat mencemari lingkungan. Selain itu, tim KKN juga menjelaskan potensi minyak jelantah sebagai bahan baku alternatif dalam pembuatan produk kreatif, salah satunya lilin aromaterapi yang memiliki nilai jual dan daya tarik pasar.</p><p style="margin-top:12px">Dalam sesi praktik, peserta diajarkan langkah demi langkah proses pembuatan lilin aromaterapi, mulai dari penyaringan minyak jelantah, proses pencampuran bahan, hingga penambahan aroma dan pewarna. Tim KKN mendampingi secara langsung setiap kelompok agar hasil yang diperoleh sesuai dengan standar yang telah dicontohkan. Kegiatan praktik ini menjadi bagian yang paling diminati karena para peserta dapat langsung mencoba dan melihat hasil karya mereka.</p><p style="margin-top:12px">Selain meningkatkan keterampilan, pelatihan ini juga membuka wawasan mengenai peluang usaha rumahan berbasis daur ulang. Lilin aromaterapi yang dihasilkan tidak hanya dapat digunakan untuk kebutuhan pribadi, tetapi juga berpotensi dipasarkan sebagai produk UMKM desa. Dengan kemasan yang menarik dan aroma yang beragam, produk ini dinilai memiliki peluang untuk menambah pendapatan keluarga.</p><p style="margin-top:12px">Melalui kegiatan ini, diharapkan ibu-ibu PKK Desa Banyukuning mampu mempraktikkan kembali keterampilan yang telah diperoleh di rumah masing-masing. Kolaborasi antara mahasiswa KKN UNNES dan KKN UNS ini menjadi contoh sinergi positif antara perguruan tinggi dan masyarakat desa dalam mendukung pemberdayaan ekonomi sekaligus menjaga kelestarian lingkungan. Ke depan, kegiatan serupa diharapkan dapat terus berlanjut guna meningkatkan kemandirian dan kreativitas warga desa.</p>'
  },
  4: {
    title: 'Gotong Royong Bersih Saluran Air Sebelum Ramadhan',
    img: 'images/berita4.jpeg',
    date: '31 Januari 2026',
    content: '<p>Dalam rangka menyambut Bulan Ramadhan 1447 H, seluruh warga Desa Banyukuning melaksanakan kegiatan gotong royong bersih saluran air pada 31 Januari 2026. Kegiatan ini menjadi agenda bersama sebagai bentuk persiapan menyambut bulan suci dengan lingkungan yang bersih, sehat, dan nyaman. Sejak pagi hari, masyarakat telah berkumpul di titik-titik yang telah ditentukan untuk memulai kerja bakti secara serentak.</p><p style="margin-top:12px">Gotong royong tersebut diikuti oleh warga dari seluruh dusun di Desa Banyukuning. Partisipasi masyarakat dari berbagai kalangan, mulai dari pemuda, bapak-bapak, hingga tokoh masyarakat, menunjukkan semangat kebersamaan yang masih terjaga dengan baik. Dengan membawa peralatan seperti cangkul, sekop, dan sabit, warga bekerja sama membersihkan area lingkungan secara bergantian.</p><p style="margin-top:12px">Adapun kegiatan yang dilakukan meliputi pembersihan jalan desa, pengangkatan sampah di selokan, serta normalisasi aliran kali yang mulai tersumbat oleh lumpur dan sampah. Fokus utama kegiatan ini adalah memastikan saluran air kembali lancar guna mencegah genangan maupun potensi banjir saat musim hujan. Lingkungan yang bersih juga diharapkan dapat menciptakan suasana ibadah yang lebih khusyuk selama Ramadhan.</p><p style="margin-top:12px">Selain berdampak pada kebersihan lingkungan, kegiatan ini juga menjadi sarana mempererat tali silaturahmi antarwarga. Suasana kebersamaan tampak saat warga saling membantu dan berbincang di sela-sela kerja bakti. Nilai gotong royong yang menjadi ciri khas masyarakat desa kembali terasa kuat melalui kegiatan sederhana namun penuh makna ini.</p><p style="margin-top:12px">Pemerintah Desa Banyukuning menyampaikan apresiasi atas partisipasi aktif seluruh warga dalam kegiatan tersebut. Diharapkan, semangat kebersihan dan kebersamaan ini tidak hanya dilakukan menjelang Ramadhan, tetapi juga menjadi kebiasaan rutin demi terciptanya lingkungan desa yang sehat, tertata, dan harmonis sepanjang waktu.</p>'
  },
  5: {
    title: 'Posyandu Lansia dan Balita Rutin Bulan Ini',
    img: 'images/berita5.jpeg',
    date: '10 Februari 2026',
    content: '<p>Kegiatan Posyandu Lansia dan Balita rutin bulan Februari 2026 telah dilaksanakan secara serentak di setiap dusun di Desa Banyukuning. Pelaksanaan posyandu ini menjadi bagian dari komitmen pemerintah desa dalam meningkatkan derajat kesehatan masyarakat, khususnya bagi kelompok rentan seperti lansia dan balita. Sejak pagi hari, warga tampak antusias menghadiri kegiatan yang digelar di balai dusun masing-masing.</p><p style="margin-top:12px">Petugas kesehatan dari Puskesmas setempat hadir untuk memberikan pelayanan medis secara langsung kepada masyarakat. Bagi para lansia, dilakukan pemeriksaan tekanan darah dan pengecekan kadar gula darah guna memantau kondisi kesehatan secara berkala. Selain itu, para lansia juga mendapatkan kesempatan untuk berkonsultasi terkait keluhan kesehatan yang dirasakan, sehingga dapat dilakukan penanganan atau rujukan lebih lanjut apabila diperlukan.</p><p style="margin-top:12px">Sementara itu, pelayanan untuk balita difokuskan pada pemantauan tumbuh kembang anak. Kegiatan meliputi penimbangan berat badan, pengukuran tinggi badan, serta pencatatan hasil pemeriksaan pada buku KIA. Langkah ini penting untuk memastikan pertumbuhan balita sesuai dengan standar kesehatan serta mendeteksi secara dini apabila terdapat risiko stunting atau masalah gizi lainnya.</p><p style="margin-top:12px">Selain pemeriksaan rutin, balita juga mendapatkan pemberian vitamin A sebagai upaya meningkatkan daya tahan tubuh dan menjaga kesehatan mata. Para orang tua turut diberikan edukasi mengenai pola asuh, asupan gizi seimbang, serta pentingnya menjaga kebersihan lingkungan demi mendukung tumbuh kembang anak secara optimal. Edukasi ini diharapkan dapat diterapkan dalam kehidupan sehari-hari di rumah.</p><p style="margin-top:12px">Dengan terselenggaranya Posyandu Lansia dan Balita secara rutin, diharapkan kualitas kesehatan masyarakat Desa Banyukuning terus meningkat. Pemerintah desa bersama tenaga kesehatan berkomitmen untuk terus menghadirkan pelayanan yang mudah dijangkau dan bermanfaat bagi seluruh warga. Partisipasi aktif masyarakat menjadi kunci keberhasilan program kesehatan ini demi terciptanya generasi yang sehat dan lansia yang tetap produktif.</p>'

  },
  6: {
    title: 'Kesenian Tradisional Desa Banyukuning',
    img: 'images/berita6.jpeg',
    date: '13 Februari 2026',
    content: '<p>Kesenian tradisional kembali memeriahkan Desa Banyukuning melalui pagelaran Reog dan Kuda Lumping yang dilaksanakan di Dusun Mendongan pada 13 Februari 2026. Acara ini menjadi salah satu bentuk pelestarian budaya daerah yang masih dijaga dan diwariskan secara turun-temurun oleh masyarakat. Sejak sore hari, warga dari berbagai dusun telah memadati lokasi pertunjukan untuk menyaksikan atraksi seni yang sarat nilai tradisi tersebut.</p><p style="margin-top:12px">Pertunjukan Reog yang dikenal dengan topeng besar dan atraksi penuh energi berhasil memukau para penonton. Gerakan para penari yang dinamis, iringan musik gamelan yang khas, serta kostum yang mencolok menciptakan suasana meriah dan penuh semangat. Tidak hanya sebagai hiburan, kesenian ini juga mengandung makna filosofis tentang keberanian, kekuatan, dan kebersamaan dalam kehidupan bermasyarakat.</p><p style="margin-top:12px">Selain Reog, pertunjukan Kuda Lumping turut menjadi daya tarik utama dalam acara tersebut. Para penari dengan kostum kuda anyaman menampilkan gerakan atraktif yang berpadu dengan alunan musik tradisional. Atraksi yang ditampilkan memancing antusiasme warga, terutama anak-anak dan remaja yang terlihat begitu menikmati setiap rangkaian pertunjukan.</p><p style="margin-top:12px">Kegiatan ini juga menjadi ajang mempererat tali silaturahmi antarwarga Desa Banyukuning. Kehadiran tokoh masyarakat, pemuda, serta para sesepuh dusun menunjukkan dukungan penuh terhadap pelestarian seni budaya lokal. Semangat gotong royong dalam mempersiapkan acara turut mencerminkan kekompakan dan kepedulian masyarakat terhadap warisan budaya leluhur.</p><p style="margin-top:12px">Melalui penyelenggaraan kesenian Reog dan Kuda Lumping di Dusun Mendongan, diharapkan generasi muda semakin mengenal dan mencintai budaya daerahnya sendiri. Pemerintah desa bersama masyarakat berkomitmen untuk terus mengadakan kegiatan serupa agar kesenian tradisional tetap hidup dan menjadi identitas yang membanggakan bagi Desa Banyukuning.</p>'
  }
};

