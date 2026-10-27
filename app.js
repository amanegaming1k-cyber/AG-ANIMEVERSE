
"use strict";

/*
  AG ANIMEVERSE — Full Streaming UI
  Demo content only. Replace sample entries with authorized content.
  Shared Website/APK data requires a configured backend.
*/

const animeData = [
  {id:1,title:"Shadow Awakening",category:"Action",type:"Series",year:"2026",rating:"9.2",symbol:"影",tone:"#24235d",glow:"#9273ff",description:"A mysterious warrior discovers hidden powers and enters a world of legendary battles.",group:"trending",videoUrl:""},
  {id:2,title:"Eternal Hearts",category:"Romance",type:"Series",year:"2026",rating:"8.9",symbol:"♡",tone:"#51294c",glow:"#f477bd",description:"Two strangers meet and discover a heartwarming story about friendship and love.",group:"trending",videoUrl:""},
  {id:3,title:"Dragon Realm",category:"Fantasy",type:"Series",year:"2026",rating:"9.0",symbol:"龍",tone:"#183e60",glow:"#48c8ff",description:"A magical realm filled with dragons, ancient mysteries and extraordinary adventures.",group:"trending",videoUrl:""},
  {id:4,title:"Beyond Horizon",category:"Adventure",type:"Series",year:"2026",rating:"8.7",symbol:"旅",tone:"#174b3d",glow:"#53e9b4",description:"A group of explorers sets out to find a forgotten world beyond the horizon.",group:"trending",videoUrl:""},
  {id:5,title:"Crimson Warrior",category:"Action",type:"Movie",year:"2026",rating:"9.1",symbol:"剣",tone:"#632b36",glow:"#ff6c78",description:"A warrior must protect a kingdom from a threat hidden in its past.",group:"movies",videoUrl:""},
  {id:6,title:"Moonlight Promise",category:"Romance",type:"Series",year:"2025",rating:"8.8",symbol:"月",tone:"#34305d",glow:"#a49cff",description:"A quiet encounter beneath the moon changes two lives forever.",group:"progress",videoUrl:""},
  {id:7,title:"Mystic Academy",category:"Fantasy",type:"Series",year:"2026",rating:"8.6",symbol:"魔",tone:"#44245d",glow:"#c77aff",description:"Students at a mysterious academy uncover secrets hidden within its walls.",group:"progress",videoUrl:""},
  {id:8,title:"Lost Kingdom",category:"Adventure",type:"Movie",year:"2025",rating:"8.5",symbol:"王",tone:"#5b4726",glow:"#ffd36b",description:"An unlikely team searches for a legendary lost kingdom.",group:"movies",videoUrl:""},
  {id:9,title:"Silent Storm",category:"Action",type:"Series",year:"2025",rating:"8.9",symbol:"嵐",tone:"#214154",glow:"#61d9ff",description:"A young hero confronts a secret organisation threatening the world.",group:"progress",videoUrl:""},
  {id:10,title:"Starlight Diary",category:"Romance",type:"Movie",year:"2026",rating:"8.7",symbol:"星",tone:"#593653",glow:"#ff91d6",description:"A tender coming-of-age story about dreams, friendship and new beginnings.",group:"movies",videoUrl:""},
  {id:11,title:"Arcane Legacy",category:"Fantasy",type:"Series",year:"2025",rating:"9.0",symbol:"術",tone:"#34416b",glow:"#7eabff",description:"An ancient legacy awakens in a world shaped by magic.",group:"trending",videoUrl:""},
  {id:12,title:"Wild Frontier",category:"Adventure",type:"Series",year:"2026",rating:"8.4",symbol:"道",tone:"#355337",glow:"#9ee66c",description:"An adventurous journey through distant lands and unexpected challenges.",group:"progress",videoUrl:""}
];

const heroSlides = [
  {
    title:"YOUR NEXT<br><span>ANIME WORLD</span>",
    description:"Discover extraordinary worlds, unforgettable characters and stories that stay with you.",
    category:"FEATURED ANIME",
    symbol:"影",
    colors:["#253c78","#7440a0"]
  },
  {
    title:"DISCOVER<br><span>NEW WORLDS</span>",
    description:"Find your next adventure across action, romance, fantasy and more.",
    category:"EXPLORE THE UNKNOWN",
    symbol:"星",
    colors:["#174c68","#6241a4"]
  },
  {
    title:"YOUR STORY<br><span>STARTS HERE</span>",
    description:"Explore the universe of anime and discover stories made for every mood.",
    category:"WELCOME TO AG",
    symbol:"龍",
    colors:["#263c60","#7d3e74"]
  }
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

let selectedCategory = "All";
let currentSearch = "";
let activeAnime = null;
let currentSlide = 0;
let toastTimer;

const rows = {
  trending: $("#trendingRow"),
  progress: $("#progressRow"),
  movies: $("#moviesRow")
};

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#39;"
  })[char]);
}

function makePoster(anime) {
  return `
    <article class="poster-card" tabindex="0" role="button"
      aria-label="View ${escapeHTML(anime.title)}"
      data-anime-id="${anime.id}">
      <div class="poster-art"
        style="--tone:${anime.tone};--glow:${anime.glow}">
        <span class="poster-symbol" aria-hidden="true">${escapeHTML(anime.symbol)}</span>
        <span class="poster-badge">${escapeHTML(anime.category)}</span>
        <span class="poster-play" aria-hidden="true">▶</span>
      </div>
      <div class="poster-caption">
        <h3>${escapeHTML(anime.title)}</h3>
        <p>★ ${escapeHTML(anime.rating)} &nbsp;·&nbsp; ${escapeHTML(anime.year)} · ${escapeHTML(anime.type)}</p>
      </div>
    </article>`;
}

function filteredAnime(group = null) {
  return animeData.filter(anime => {
    const matchesCategory =
      selectedCategory === "All" || anime.category === selectedCategory;

    const query = currentSearch.toLowerCase();
    const matchesSearch =
      !query ||
      `${anime.title} ${anime.category} ${anime.type} ${anime.year}`
        .toLowerCase().includes(query);

    const matchesGroup = !group || anime.group === group;

    return matchesCategory && matchesSearch && matchesGroup;
  });
}

function renderRows() {
  Object.entries(rows).forEach(([group, element]) => {
    element.innerHTML = filteredAnime(group).map(makePoster).join("");
  });

  const searchSection = $("#searchResultsSection");
  const searching = currentSearch.length > 0;

  searchSection.hidden = !searching;

  if (searching) {
    const results = filteredAnime();
    $("#searchResults").innerHTML = results.map(makePoster).join("");
    $("#noResults").hidden = results.length > 0;
  }

  $$(".content-section").forEach(section => {
    if (section.id === "searchResultsSection") return;
    section.hidden = searching;
  });
}

function setCategory(category) {
  selectedCategory = category;

  $$(".category-tile").forEach(button => {
    button.classList.toggle(
      "selected",
      button.dataset.category === category
    );
  });

  renderRows();

  if (currentSearch) {
    $("#searchResultsSection").scrollIntoView({behavior:"smooth"});
  }
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function showAnimeDetails(id) {
  const anime = animeData.find(item => item.id === Number(id));
  if (!anime) return;

  activeAnime = anime;

  $("#modalArt").style.setProperty("--tone", anime.tone);
  $("#modalArt").style.setProperty("--glow", anime.glow);
  $("#modalSymbol").textContent = anime.symbol;
  $("#modalTitle").textContent = anime.title;
  $("#modalCategory").textContent = `${anime.category} · ${anime.type}`;
  $("#modalMeta").textContent = `★ ${anime.rating}  ·  ${anime.year}`;
  $("#modalDescription").textContent = anime.description;

  $("#playerBox").hidden = true;
  $("#videoPlayer").pause();
  $("#videoPlayer").removeAttribute("src");
  $("#playerNote").textContent = anime.videoUrl
    ? "Select Play Video to open the configured video."
    : "Preview mode: add an authorized video URL in app.js to enable playback.";

  $("#playBtn").textContent = anime.videoUrl
    ? "▶ Play Video"
    : "▶ Video not configured";

  $("#animeModal").classList.add("open");
  $("#animeModal").setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  $("#modalClose").focus();
}

function closeModal() {
  $("#videoPlayer").pause();
  $("#videoPlayer").removeAttribute("src");
  $("#playerBox").hidden = true;

  $("#animeModal").classList.remove("open");
  $("#animeModal").setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function playAnime() {
  if (!activeAnime) return;

  if (!activeAnime.videoUrl) {
    showToast("Video URL is not configured yet.");
    return;
  }

  let url;

  try {
    url = new URL(activeAnime.videoUrl);
  } catch {
    showToast("The video URL is invalid.");
    return;
  }

  if (url.protocol !== "https:") {
    showToast("Please use a secure HTTPS video URL.");
    return;
  }

  const player = $("#videoPlayer");
  player.src = url.href;
  $("#playerBox").hidden = false;
  $("#playerNote").textContent = "If playback fails, check whether the host supports direct video playback.";
  player.play().catch(() => {
    showToast("Tap the video player to start playback.");
  });
}

function updateHero(index) {
  currentSlide = index;
  const slide = heroSlides[index];

  $("#heroTitle").innerHTML = slide.title;
  $("#heroDescription").textContent = slide.description;
  $(".hero-label").textContent = slide.category;

  $("#heroBg").style.background =
    `radial-gradient(ellipse at 75% 30%, ${slide.colors[1]} 0, transparent 35%),
     radial-gradient(ellipse at 75% 55%, ${slide.colors[0]} 0, transparent 55%),
     linear-gradient(120deg,#111827,${slide.colors[0]})`;

  $$(".dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

// Poster interactions
document.addEventListener("click", event => {
  const card = event.target.closest("[data-anime-id]");
  if (card) showAnimeDetails(card.dataset.animeId);

  const categoryButton = event.target.closest("[data-category]");
  if (categoryButton) setCategory(categoryButton.dataset.category);

  if (event.target.closest("[data-show-all]")) {
    currentSearch = "";
    $("#searchInput").value = "";
    selectedCategory = "All";
    setCategory("All");
    $("#trending").scrollIntoView({behavior:"smooth"});
  }
});

document.addEventListener("keydown", event => {
  const card = event.target.closest("[data-anime-id]");

  if (card && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    showAnimeDetails(card.dataset.animeId);
  }

  if (event.key === "Escape") closeModal();
});

// Search
function runSearch(event) {
  if (event) event.preventDefault();

  currentSearch = $("#searchInput").value.trim();
  renderRows();

  if (currentSearch) {
    $("#searchResultsSection").scrollIntoView({behavior:"smooth"});
  }
}

$("#searchForm").addEventListener("submit", runSearch);

$("#searchInput").addEventListener("input", () => {
  currentSearch = $("#searchInput").value.trim();
  renderRows();
});

// Hero actions
$("#heroExplore").addEventListener("click", () => {
  $("#trending").scrollIntoView({behavior:"smooth"});
});

$("#heroInfo").addEventListener("click", () => {
  const featured = animeData[0];
  showAnimeDetails(featured.id);
});

$("#heroDots").addEventListener("click", event => {
  const button = event.target.closest("[data-slide]");
  if (button) updateHero(Number(button.dataset.slide));
});

$("#browseBtn").addEventListener("click", () => {
  currentSearch = "";
  $("#searchInput").value = "";
  selectedCategory = "All";
  renderRows();
  $("#trending").scrollIntoView({behavior:"smooth"});
});

// Modal
$("#modalClose").addEventListener("click", closeModal);
$("#modalBackdrop").addEventListener("click", closeModal);
$("#playBtn").addEventListener("click", playAnime);

// Mobile navigation
$("#menuBtn").addEventListener("click", () => {
  const nav = $("#desktopNav");
  nav.classList.toggle("open");
});

$("#desktopNav").addEventListener("click", event => {
  if (event.target.closest("a")) {
    $("#desktopNav").classList.remove("open");
  }
});

$("#mobileSearch").addEventListener("click", () => {
  $("#searchInput").focus();
  window.scrollTo({top:0, behavior:"smooth"});
});

function showProfileNotice() {
  showToast("Profile and sign-in will be available after backend setup.");
}

$("#profileBtn").addEventListener("click", showProfileNotice);
$("#mobileProfile").addEventListener("click", showProfileNotice);

// Initialise
$("#year").textContent = new Date().getFullYear();

Object.values(rows).forEach(row => {
  row.innerHTML = "";
});

renderRows();
updateHero(0);
