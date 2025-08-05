import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

function showCategory(categoryId) {
  // مخفی کردن همه بخش‌ها
  document.querySelectorAll('.category-section').forEach(section => {
    section.classList.add('hidden');
  });

  // غیرفعال کردن همه دکمه‌ها
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.remove('bg-blue-600', 'text-white');
    btn.classList.add('text-blue-600');
  });

  // نمایش بخش انتخاب شده
  const targetSection = document.getElementById(categoryId);
  if (targetSection) {
    targetSection.classList.remove('hidden');
  }

  // فعال کردن دکمه
  const activeButton = document.querySelector(`[data-category="${categoryId}"]`);
  if (activeButton) {
    activeButton.classList.add('bg-blue-600', 'text-white');
    activeButton.classList.remove('text-blue-600');
  }

  // تغییر URL
  history.pushState({ category: categoryId }, '', `#${categoryId}`);
}

// اتصال کلیک به دکمه‌ها
document.querySelectorAll('.category-btn').forEach(button => {
  button.addEventListener('click', function (e) {
    e.preventDefault();
    const category = this.getAttribute('data-category');
    showCategory(category);
  });
});

// راه‌اندازی اولیه صفحه
function initializePage() {
  const hash = window.location.hash.substring(1);
  const category = hash || 'electronics';
  showCategory(category);
}

window.addEventListener('load', initializePage);

// کنترل دکمه‌های مرورگر (Back/Forward)
window.addEventListener('popstate', () => {
  const hash = window.location.hash.substring(1);
  const category = hash || 'electronics';
  showCategory(category);
});
