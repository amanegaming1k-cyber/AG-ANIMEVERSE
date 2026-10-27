
"use strict";

// AG ANIMEVERSE
// Add only videos and links that you own or are authorized to share.

const animeList = [
  {
    id: 1,
    title: "Shadow Awakening",
    category: "Action",
    year: "2026",
    type: "Series",
    symbol: "影",
    poster: "#5535a8",
    glow: "#a46bff",
    description: "A mysterious world of hidden powers, dangerous rivals, and unexpected adventures.",
    videoUrl: ""
  },
  {
    id: 2,
    title: "Eternal Hearts",
    category: "Romance",
    year: "2026",
    type: "Series",
    symbol: "♡",
    poster: "#843b80",
    glow: "#ff6cae",
    description: "A heartwarming story about friendship, feelings, and finding your own path.",
    videoUrl: ""
  },
  {
    id: 3,
    title: "Dragon Realm",
    category: "Fantasy",
    year: "2026",
    type: "Series",
    symbol: "龍",
    poster: "#275c80",
    glow: "#42c8ff",
    description: "Enter a magical realm where ancient secrets and extraordinary creatures await.",
    videoUrl: ""
  },
  {
    id: 4,
    title: "Beyond Horizon",
    category: "Adventure",
    year: "2026",
    type: "Series",
    symbol: "旅",
    poster: "#24775e",
    glow: "#54f5bd",
    description: "A journey across unknown lands in search of a legendary lost world.",
    videoUrl: ""
  },
  {
    id: 5,
    title: "Crimson Warrior",
    category: "Action",
    year: "2026",
    type: "Movie",
    symbol: "剣",
    poster: "#923d45",
    glow: "#ff6b70",
    description: "A determined warrior faces a powerful enemy in an epic battle for the future.",
    videoUrl: ""
  },
  {
    id: 6,
    title: "Moonlight Promise",
    category: "Romance",
    year: "2026",
    type: "Series",
    symbol: "月",
    poster: "#554d9b",
    glow: "#9d9aff",
    description: "Two people meet beneath the moonlight and discover a bond neither expected.",
    videoUrl: ""
  },
  {
    id: 7,
    title: "Mystic Academy",
    category: "Fantasy",
    year: "2026",
    type: "Series",
    symbol: "魔",
    poster: "#7746a3",
    glow: "#cb76ff",
    description: "Students at a mysterious academy discover secrets hidden within their school.",
    videoUrl: ""
  },
  {
    id: 8,
    title: "Lost Kingdom",
    category: "Adventure",
    year: "2026",
    type: "Movie",
    symbol: "王",
    poster: "#83612b",
    glow: "#ffc75e",
    description: "An unlikely team searches for a forgotten kingdom beyond the edge of the map.",
    videoUrl: ""
  }
];

const animeGrid = document.getElementById("animeGrid");
const searchInput = document.getElementById("searchInput");
const filters = document.getElementById("filters");
const emptyState = document.getElementById("emptyState");

const modal = document.getElementById("animeModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalClose = document.getElementById("modalClose");
const modalPoster = document.getElementById("modalPoster");
const modalTitle = document.getElementById("modalTitle");
const modalCategory = document.getElementById("modalCategory");
const modalDescription = document.getElementById("modalDescription");
const modalHint = document.getElementById("modalHint");
const watchLink = document.getElementById("watchLink");

let selectedCategory = "All";

function renderAnime() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  const filteredAnime = animeList.filter((anime) => {
    const matchesCategory =
      selectedCategory === "All" ||
      anime.category === selectedCategory;

    const searchableText =
      `${anime.title} ${anime.category} ${anime.type}`.toLowerCase();

    return matchesCategory && searchableText.includes(searchTerm);
  });

  animeGrid.innerHTML = filteredAnime.map((anime) => `
    <article class="anime-card">
      <div
        class="poster"
        style="--poster:${anime.poster};--glow:${anime.glow}"
        aria-label="${escapeHTML(anime.title)} poster"
      >
        <span class="poster-tag">${escapeHTML(anime.type)}</span>
        <span class="poster-symbol" aria-hidden="true">${escapeHTML(anime.symbol)}</span>
      </div>

      <div class="card-info">
        <h3>${escapeHTML(anime.title)}</h3>
        <div class="card-meta">
          ${escapeHTML(anime.category)} · ${escapeHTML(anime.year)}
        </div>
        <div class="card-bottom">
          <span class="card-meta">AG Collection</span>
          <button class="details-btn" data-anime-id="${anime.id}">
            Details ↗
          </button>
        </div>
      </div>
    </article>
  `).join("");

  emptyState.hidden = filteredAnime.length !== 0;
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function openAnimeDetails(id) {
  const anime = animeList.find((item) => item.id === Number(id));
  if (!anime) return;

  modalPoster.style.setProperty("--poster", anime.poster);
  modalPoster.style.setProperty("--glow", anime.glow);
  modalPoster.textContent = anime.symbol;

  modalTitle.textContent = anime.title;
  modalCategory.textContent = `${anime.category} · ${anime.type} · ${anime.year}`;
  modalDescription.textContent = anime.description;

  if (anime.videoUrl && isAllowedVideoURL(anime.videoUrl)) {
    watchLink.href = anime.videoUrl;
    watchLink.hidden = false;
    modalHint.textContent = "Open the authorized video source.";
  } else {
    watchLink.removeAttribute("href");
    watchLink.hidden = true;
    modalHint.textContent =
      "Video link not added yet. An authorized video link can be configured in app.js.";
  }

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  modalClose.focus();
}

function closeAnimeDetails() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function isAllowedVideoURL(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

// Search
searchInput.addEventListener("input", renderAnime);

// Category filters
filters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  selectedCategory = button.dataset.category;

  filters.querySelectorAll(".filter").forEach((filter) => {
    filter.classList.toggle("active", filter === button);
  });

  renderAnime();
});

// Open details
animeGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-anime-id]");
  if (button) openAnimeDetails(button.dataset.animeId);
});

// Close modal
modalClose.addEventListener("click", closeAnimeDetails);
modalBackdrop.addEventListener("click", closeAnimeDetails);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeAnimeDetails();
});

// Mobile navigation
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

// Current year
document.getElementById("year").textContent = new Date().getFullYear();

// Initial render
renderAnime();
