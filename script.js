
const events = [
  {
    id: 1,
    title: "Soundwave Music Festival",
    category: "Festival",
    date: "21 NOV 2026",
    location: "Jakarta, Indonesia",
    price: 150000,
    image: "photo-1459749411175-04bf5292ceea"
  },
  {
    id: 2,
    title: "Night of Live Music",
    category: "Konser",
    date: "28 NOV 2026",
    location: "Bandung, Indonesia",
    price: 200000,
    image: "photo-1501386761578-eac5c94b800a"
  },
  {
    id: 3,
    title: "Creative Future Summit",
    category: "Seminar",
    date: "05 DES 2026",
    location: "Jakarta, Indonesia",
    price: 100000,
    image: "photo-1540575467063-178a50c2df87"
  },
  {
    id: 4,
    title: "Electric Music Night",
    category: "Konser",
    date: "12 DES 2026",
    location: "Surabaya, Indonesia",
    price: 175000,
    image: "photo-1470229722913-7c0e2dbbafd3"
  },
  {
    id: 5,
    title: "Art & Culture Festival",
    category: "Festival",
    date: "19 DES 2026",
    location: "Yogyakarta, Indonesia",
    price: 75000,
    image: "photo-1492684223066-81342ee5ff30"
  },
  {
    id: 6,
    title: "Digital Business Class",
    category: "Seminar",
    date: "09 JAN 2027",
    location: "Jakarta, Indonesia",
    price: 125000,
    image: "photo-1511578314322-379afb476865"
  }
];

const rupiah = amount =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(amount);

const grid = document.getElementById("eventGrid");
const searchInput = document.getElementById("searchInput");
const eventCount = document.getElementById("eventCount");
const emptyMessage = document.getElementById("emptyMessage");

const modal = document.getElementById("bookingModal");
const bookingForm = document.getElementById("bookingForm");
const bookingFormArea = document.getElementById("bookingFormArea");
const ticketResult = document.getElementById("ticketResult");

const quantityInput = document.getElementById("ticketQuantity");
const totalPrice = document.getElementById("totalPrice");

let selectedCategory = "Semua";
let selectedEvent = null;

// Menampilkan daftar acara
function renderEvents() {
  const keyword = searchInput.value.trim().toLowerCase();

  const filtered = events.filter(event => {
    const matchesCategory =
      selectedCategory === "Semua" ||
      event.category === selectedCategory;

    const searchable =
      `${event.title} ${event.category} ${event.location}`.toLowerCase();

    return matchesCategory && searchable.includes(keyword);
  });

  eventCount.textContent = `${filtered.length} acara`;
  emptyMessage.hidden = filtered.length !== 0;

  grid.innerHTML = filtered.map(event => `
    <article class="event-card">
      <div class="event-image">
        <img
          src="https://images.unsplash.com/${event.image}?auto=format&fit=crop&w=700&q=80"
          alt="${event.title}"
          loading="lazy">
        <span class="category-badge">${event.category}</span>
      </div>

      <div class="event-body">
        <span class="event-date">${event.date}</span>
        <h3>${event.title}</h3>
        <p class="event-location">📍 ${event.location}</p>

        <div class="event-footer">
          <div class="event-price">
            ${rupiah(event.price)}
            <small>per tiket</small>
          </div>

          <button class="buy-button" data-buy="${event.id}">
            Beli Tiket ↗
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

// Menghitung total harga tiket
function updateTotal() {
  if (!selectedEvent) return;

  totalPrice.textContent = rupiah(
    selectedEvent.price * Number(quantityInput.value)
  );
}

// Membuka formulir pemesanan
function openBooking(eventId) {
  selectedEvent = events.find(event => event.id === eventId);
  if (!selectedEvent) return;

  bookingForm.reset();
  bookingFormArea.hidden = false;
  ticketResult.hidden = true;

  document.getElementById("bookingTitle").textContent =
    selectedEvent.title;

  document.getElementById("bookingDescription").textContent =
    `${selectedEvent.date} • ${selectedEvent.location} • ${rupiah(selectedEvent.price)} per tiket`;

  updateTotal();

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

// Menutup formulir
function closeBooking() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

// Filter kategori acara
document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(item => {
      item.classList.remove("active");
    });

    button.classList.add("active");
    selectedCategory = button.dataset.category;
    renderEvents();
  });
});

// Pencarian acara
searchInput.addEventListener("input", renderEvents);

// Tombol beli tiket
grid.addEventListener("click", event => {
  const button = event.target.closest("[data-buy]");

  if (button) {
    openBooking(Number(button.dataset.buy));
  }
});

// Perubahan jumlah tiket
quantityInput.addEventListener("change", updateTotal);

// Membuat konfirmasi pesanan demo
bookingForm.addEventListener("submit", event => {
  event.preventDefault();

  if (!selectedEvent || !bookingForm.reportValidity()) return;

  const name = document.getElementById("customerName").value.trim();
  const email = document.getElementById("customerEmail").value.trim();
  const quantity = Number(quantityInput.value);

  if (!name || !email || quantity < 1 || quantity > 5) return;

  const orderId = "DEMO-" + Date.now().toString().slice(-8);
  const total = selectedEvent.price * quantity;

  document.getElementById("resultEvent").textContent =
    selectedEvent.title;

  document.getElementById("resultName").textContent =
    `Nama: ${name}`;

  document.getElementById("resultQuantity").textContent =
    `Jumlah: ${quantity} tiket`;

  document.getElementById("resultOrder").textContent =
    `Nomor pesanan demo: ${orderId}`;

  document.getElementById("resultTotal").textContent =
    rupiah(total);

  bookingFormArea.hidden = true;
  ticketResult.hidden = false;
});

// Tombol tutup modal
document.getElementById("closeModal")
  .addEventListener("click", closeBooking);

document.getElementById("finishBooking")
  .addEventListener("click", closeBooking);

// Tutup modal dengan klik di luar formulir
modal.addEventListener("click", event => {
  if (event.target === modal) closeBooking();
});

// Tutup modal menggunakan tombol Escape
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && modal.classList.contains("open")) {
    closeBooking();
  }
});

// Tahun otomatis pada footer
document.getElementById("year").textContent =
  new Date().getFullYear();

// Jalankan website
renderEvents();
