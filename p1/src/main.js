import axios from "axios";

// ساخت یک نمونه axios با آدرس پایه API
const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});

// نمایش لودینگ در هر درخواست
api.interceptors.request.use((config) => {
  showLoading();
  return config;
}, (error) => {
  hideLoading();
  return Promise.reject(error);
});

// مخفی کردن لودینگ بعد از دریافت پاسخ
api.interceptors.response.use((response) => {
  hideLoading();
  return response;
}, (error) => {
  hideLoading();
  return Promise.reject(error);
});

// DOM Elements
const searchInput = document.getElementById("searchInput");
const loadingEl = document.getElementById("loading");
const resultsEl = document.getElementById("results");
const noResultsEl = document.getElementById("noResults");
const userCardsEl = document.getElementById("userCards");

let allUsers = [];

function showLoading() {
  loadingEl.classList.remove("hidden");
}

function hideLoading() {
  loadingEl.classList.add("hidden");
}

function hideSections() {
  noResultsEl.classList.add("hidden");
  resultsEl.classList.add("hidden");
}

function showNoResults() {
  noResultsEl.classList.remove("hidden");
}

function createUserCard(user) {
  const card = document.createElement("div");
  card.className = "bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300";
  card.innerHTML = `
    <div class="flex items-start space-x-4 space-x-reverse">
      <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
        <span class="text-white font-bold text-xl">${user.name.charAt(0)}</span>
      </div>
      <div class="flex-1">
        <h3 class="text-xl font-bold text-gray-800 mb-1">${user.name}</h3>
        <p class="text-blue-600 font-medium mb-3">@${user.username}</p>
        <div class="grid md:grid-cols-2 gap-4 text-sm">
          <div class="space-y-2">
            <div class="text-gray-600">${user.email}</div>
            <div class="text-gray-600">${user.phone}</div>
            <div class="text-gray-600">${user.website}</div>
          </div>
          <div class="space-y-2">
            <div class="text-gray-600">${user.address.street}, ${user.address.city}</div>
            <div class="text-gray-600">${user.company.name}</div>
          </div>
        </div>
      </div>
    </div>
  `;
  return card;
}

function renderResults(users) {
  userCardsEl.innerHTML = "";
  users.forEach(user => {
    const card = createUserCard(user);
    userCardsEl.appendChild(card);
  });
  resultsEl.classList.remove("hidden");
}

function searchUsers(term) {
  hideSections();

  const filtered = allUsers.filter(user =>
    user.name.toLowerCase().includes(term.toLowerCase()) ||
    user.username.toLowerCase().includes(term.toLowerCase())
  );

  if (filtered.length === 0) {
    showNoResults();
  } else {
    renderResults(filtered);
  }
}

function updateURLWithQuery(name) {
  const params = new URLSearchParams(window.location.search);
  params.set("name", name);
  history.pushState({}, "", "?" + params.toString());
}

async function init() {
  try {
    const response = await api.get("/users");
    allUsers = response.data;

    // اگر در آدرس، name وجود داشت، اتوماتیک سرچ کن
    const params = new URLSearchParams(window.location.search);
    const nameParam = params.get("name");
    if (nameParam) {
      searchInput.value = nameParam;
      searchUsers(nameParam);
    }
  } catch (err) {
    console.error("خطا در دریافت داده‌ها", err);
  }
}

searchInput.addEventListener("input", (e) => {
  const value = e.target.value.trim();
  if (value.length === 0) {
    hideSections();
    return;
  }

  updateURLWithQuery(value);
  searchUsers(value);
});

window.addEventListener("load", init);
