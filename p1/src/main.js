// main.js
// این اسکریپت مدیریت جستجوی کاربران و نمایش نتایج با لودینگ را انجام می‌دهد

document.addEventListener("DOMContentLoaded", () => {
  // المان‌های HTML مورد نیاز را انتخاب می‌کنیم
  const searchInput = document.getElementById("searchInput"); // فیلد جستجو
  const loadingEl = document.getElementById("loading"); // بخش لودینگ
  const noResultsEl = document.getElementById("noResults"); // پیام "نتیجه‌ای یافت نشد"
  const resultsEl = document.getElementById("results"); // بخش نمایش نتایج
  const userCardsEl = document.getElementById("userCards"); // محل قرارگیری کارت‌های کاربر

  // متغیرها
  let allUsers = []; // ذخیره تمام کاربران دریافت‌شده از API
  let searchTimeout; // برای جلوگیری از جستجوی مکرر هنگام تایپ

  // ===== توابع کمکی =====
  const showLoading = () => loadingEl.classList.remove("hidden"); // نمایش لودینگ
  const hideLoading = () => loadingEl.classList.add("hidden"); // مخفی کردن لودینگ

  // مخفی کردن تمام بخش‌های نتایج و لودینگ
  const hideSections = () => {
    hideLoading();
    noResultsEl.classList.add("hidden");
    resultsEl.classList.add("hidden");
  };

  // نمایش پیام "نتیجه‌ای یافت نشد"
  const showNoResults = () => noResultsEl.classList.remove("hidden");

  // ساخت کارت HTML برای هر کاربر
  const createUserCard = (user) => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300";
    card.innerHTML = `
      <div class="flex items-start space-x-4 space-x-reverse">
        <!-- تصویر پروفایل به صورت حرف اول نام -->
        <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span class="text-white font-bold text-xl">${user.name.charAt(0)}</span>
        </div>
        <!-- اطلاعات کاربر -->
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
  };

  // رندر نتایج جستجو در صفحه
  const renderResults = (users) => {
    userCardsEl.innerHTML = ""; // پاک کردن نتایج قبلی
    users.forEach((user) => userCardsEl.appendChild(createUserCard(user))); // افزودن کارت‌ها
    resultsEl.classList.remove("hidden"); // نمایش بخش نتایج
  };

  // جستجو بین کاربران
  const searchUsers = (term) => {
    hideSections(); // ابتدا همه چیز رو مخفی می‌کنیم
    showLoading(); // لودینگ را نشان می‌دهیم

    // شبیه‌سازی تاخیر شبکه
    setTimeout(() => {
      // فیلتر کردن کاربران بر اساس نام یا نام کاربری
      const filtered = allUsers.filter(user =>
        user.name.toLowerCase().includes(term.toLowerCase()) ||
        user.username.toLowerCase().includes(term.toLowerCase())
      );

      hideLoading(); // لودینگ را مخفی می‌کنیم
      filtered.length ? renderResults(filtered) : showNoResults(); // نمایش نتایج یا پیام عدم وجود
    }, 500);
  };

  // دریافت تمام کاربران از API هنگام بارگذاری صفحه
  const init = async () => {
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      allUsers = await res.json();
    } catch (err) {
      console.error("خطا در دریافت کاربران", err);
    }
  };

  // هندل کردن رویداد تایپ در فیلد جستجو
  searchInput.addEventListener("input", (e) => {
    const value = e.target.value.trim(); // حذف فاصله‌ها
    clearTimeout(searchTimeout); // جلوگیری از جستجوی مکرر
    if (!value) {
      hideSections(); // اگر چیزی وارد نشد، همه چیز رو مخفی کن
      return;
    }
    // تاخیر قبل از جستجو برای بهینه‌سازی
    searchTimeout = setTimeout(() => searchUsers(value), 300);
  });

  // شروع اجرای اسکریپت
  init();
});
