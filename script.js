// ====== DATA MENU ======
const NOMOR_WA = "6283892856996";; // ganti dengan nomor WhatsApp usaha (format 62...)

const menu = [
  { id: 1, nama: "Ubi Ungu Panggang", kategori: "ubi", harga: 12000, emoji: "🍠", warna: "#e1bee7", desc: "Ubi ungu dipanggang perlahan, manis alami dan legit." },
  { id: 2, nama: "Ubi Madu Cilembu", kategori: "ubi", harga: 15000, emoji: "🍠", warna: "#ffe0b2", desc: "Ubi madu dengan sirup alami yang karamel saat dipanggang." },
  { id: 3, nama: "Ubi Goreng Crispy", kategori: "ubi", harga: 10000, emoji: "🍟", warna: "#fff9c4", desc: "Irisan ubi garing di luar, lembut di dalam, bumbu rempah." },
  { id: 4, nama: "Singkong Keju Vegan", kategori: "ubi", harga: 13000, emoji: "🥔", warna: "#f5f5dc", desc: "Singkong goreng dengan taburan keju nabati gurih." },
  { id: 5, nama: "Kolak Ubi Santan", kategori: "ubi", harga: 11000, emoji: "🥣", warna: "#ffccbc", desc: "Ubi, pisang, dan santan dengan gula aren hangat." },
  { id: 6, nama: "Ubi Ungu Brownies", kategori: "ubi", harga: 18000, emoji: "🧁", warna: "#d1c4e9", desc: "Brownies kukus dari ubi ungu tanpa telur dan susu." },
  { id: 7, nama: "Salad Sayur Segar", kategori: "salad", harga: 20000, emoji: "🥗", warna: "#c8e6c9", desc: "Selada, tomat, timun, wortel dengan dressing lemon." },
  { id: 8, nama: "Salad Tahu Tempe", kategori: "salad", harga: 24000, emoji: "🥬", warna: "#dcedc8", desc: "Sayur segar plus tahu dan tempe panggang, tinggi protein." },
  { id: 9, nama: "Salad Alpukat Wijen", kategori: "salad", harga: 26000, emoji: "🥑", warna: "#c5e1a5", desc: "Alpukat krim, edamame, dan dressing wijen khas rumahan." },
  { id: 10, nama: "Gado-Gado Vegan", kategori: "salad", harga: 22000, emoji: "🥜", warna: "#ffe0b2", desc: "Sayur rebus, tahu, lontong, siram saus kacang pedas manis." },
  { id: 11, nama: "Salad Buah Segar", kategori: "salad", harga: 18000, emoji: "🍓", warna: "#f8bbd0", desc: "Buah musiman dengan yoghurt kedelai dan madu." },
  { id: 12, nama: "Salad Pelangi Quinoa", kategori: "salad", harga: 28000, emoji: "🌈", warna: "#b2dfdb", desc: "Quinoa, bit, jagung, paprika, dan biji bunga matahari." }
];

// Nama file foto otomatis dari nama menu, contoh: "Ubi Ungu Panggang" -> img/ubi-ungu-panggang.jpg
// Kalau fotonya belum ada, tampilan otomatis memakai emoji.
menu.forEach((m) => {
  m.gambar = "img/" + m.nama.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + ".jpg";
});

let keranjang = JSON.parse(localStorage.getItem("keranjang_kebunhijau") || "[]");

// ====== HELPER ======
const rupiah = (n) => "Rp" + n.toLocaleString("id-ID");
const $ = (s) => document.querySelector(s);

function toast(pesan) {
  $("#toastMsg").textContent = pesan;
  bootstrap.Toast.getOrCreateInstance($("#toastNotif"), { delay: 1800 }).show();
}

// ====== RENDER MENU ======
function renderMenu(filter = "semua") {
  const grid = $("#menuGrid");
  const data = filter === "semua" ? menu : menu.filter((m) => m.kategori === filter);

  grid.innerHTML = data.map((m, i) => `
    <div class="col-sm-6 col-lg-4 col-xl-3 menu-item" style="animation-delay:${i * 60}ms">
      <div class="menu-card">
        <div class="menu-img" style="background:${m.warna}">
          <span class="menu-label">${m.kategori === "ubi" ? "Ubi-ubian" : "Salad"}</span>
          <img src="${m.gambar}" alt="${m.nama}" loading="lazy"
               onerror="this.outerHTML='<span class=&quot;menu-emoji&quot;>${m.emoji}</span>'">
        </div>
        <div class="menu-body">
          <h5>${m.nama}</h5>
          <p>${m.desc}</p>
          <div class="menu-foot">
            <span class="menu-price">${rupiah(m.harga)}</span>
            <button class="btn-add" data-id="${m.id}" aria-label="Tambah ${m.nama}"><i class="bi bi-plus-lg"></i></button>
          </div>
        </div>
      </div>
    </div>`).join("");
}

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderMenu(btn.dataset.filter);
  });
});

$("#menuGrid").addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-add");
  if (btn) tambahKeranjang(Number(btn.dataset.id));
});

// ====== KERANJANG ======
function simpan() {
  localStorage.setItem("keranjang_kebunhijau", JSON.stringify(keranjang));
}

function tambahKeranjang(id) {
  const item = keranjang.find((k) => k.id === id);
  if (item) item.qty++;
  else keranjang.push({ id, qty: 1 });
  simpan();
  renderKeranjang();
  toast(menu.find((m) => m.id === id).nama + " ditambahkan 🌿");
}

function ubahQty(id, delta) {
  const item = keranjang.find((k) => k.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) keranjang = keranjang.filter((k) => k.id !== id);
  simpan();
  renderKeranjang();
}

function renderKeranjang() {
  const wadah = $("#cartItems");
  const jumlah = keranjang.reduce((a, k) => a + k.qty, 0);
  const total = keranjang.reduce((a, k) => a + k.qty * menu.find((m) => m.id === k.id).harga, 0);

  $("#cartCount").textContent = jumlah;
  $("#cartTotal").textContent = rupiah(total);

  if (!keranjang.length) {
    wadah.innerHTML = `<div class="cart-empty"><span>🧺</span>Keranjang masih kosong.<br>Yuk pilih menu favoritmu!</div>`;
    return;
  }

  wadah.innerHTML = keranjang.map((k) => {
    const m = menu.find((x) => x.id === k.id);
    return `
      <div class="cart-row">
        <div class="cart-emoji">${m.emoji}</div>
        <div class="cart-info">
          <h6>${m.nama}</h6>
          <small>${rupiah(m.harga)}</small>
        </div>
        <div class="qty">
          <button data-aksi="kurang" data-id="${m.id}">−</button>
          <span>${k.qty}</span>
          <button data-aksi="tambah" data-id="${m.id}">+</button>
        </div>
      </div>`;
  }).join("");
}

$("#cartItems").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-aksi]");
  if (!btn) return;
  ubahQty(Number(btn.dataset.id), btn.dataset.aksi === "tambah" ? 1 : -1);
});

$("#btnClear").addEventListener("click", () => {
  keranjang = [];
  simpan();
  renderKeranjang();
});

$("#btnCheckout").addEventListener("click", () => {
  if (!keranjang.length) return toast("Keranjang masih kosong");
  let total = 0;
  const baris = keranjang.map((k, i) => {
    const m = menu.find((x) => x.id === k.id);
    total += m.harga * k.qty;
    return `${i + 1}. ${m.nama} x${k.qty} = ${rupiah(m.harga * k.qty)}`;
  });
  const teks = `Halo Kebun Hijau, saya mau pesan:\n\n${baris.join("\n")}\n\nTotal: ${rupiah(total)}\n\nTerima kasih!`;
  window.open(`https://wa.me/${NOMOR_WA}?text=${encodeURIComponent(teks)}`, "_blank");
});

// ====== FORM KONTAK ======
$("#formKontak").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }
  const teks = `Halo Kebun Hijau,\nNama: ${$("#nama").value}\nWA: ${$("#hp").value}\n\n${$("#pesan").value}`;
  window.open(`https://wa.me/${NOMOR_WA}?text=${encodeURIComponent(teks)}`, "_blank");
  form.reset();
  form.classList.remove("was-validated");
  toast("Terima kasih! Pesanmu dikirim 💚");
});

// ====== NAVBAR, SCROLL, REVEAL ======
const navbar = $("#navbar");
const toTop = $("#toTop");
const navLinks = document.querySelectorAll(".nav-link");
const sections = [...navLinks].map((l) => document.querySelector(l.getAttribute("href")));

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
  toTop.classList.toggle("show", window.scrollY > 500);

  const pos = window.scrollY + 120;
  sections.forEach((s, i) => {
    if (s && s.offsetTop <= pos && s.offsetTop + s.offsetHeight > pos) {
      navLinks.forEach((l) => l.classList.remove("active"));
      navLinks[i].classList.add("active");
    }
  });
});

toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// tutup menu mobile setelah klik link
navLinks.forEach((l) => l.addEventListener("click", () => {
  const nav = $("#navMenu");
  if (nav.classList.contains("show")) bootstrap.Collapse.getOrCreateInstance(nav).hide();
}));

// animasi muncul saat di-scroll
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) {
      en.target.classList.add("visible");
      revealObs.unobserve(en.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll("[data-reveal]").forEach((el) => revealObs.observe(el));

// animasi hitung angka
const countObs = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    const el = en.target;
    const target = Number(el.dataset.count);
    let now = 0;
    const step = Math.max(1, Math.ceil(target / 60));
    const timer = setInterval(() => {
      now = Math.min(target, now + step);
      el.textContent = now.toLocaleString("id-ID") + (target === 2500 ? "+" : "");
      if (now >= target) clearInterval(timer);
    }, 25);
    countObs.unobserve(el);
  });
});
document.querySelectorAll("[data-count]").forEach((el) => countObs.observe(el));

// ====== INIT ======
$("#tahun").textContent = new Date().getFullYear();
renderMenu();
renderKeranjang();