const galleryItems = [...document.querySelectorAll('.gallery-item')];
const filters = [...document.querySelectorAll('.filter')];

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const caption = document.getElementById('lightboxCaption');
const counter = document.getElementById('lightboxCount');
const galleryCount = document.getElementById('galleryCount');

const closeBtn = document.getElementById('closeBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let visibleItems = [...galleryItems];
let currentIndex = 0;
let lastFocusedElement = null;

// Category filters
filters.forEach(button => {
  button.addEventListener('click', () => {
    filters.forEach(filter => filter.classList.remove('active'));
    button.classList.add('active');

    const category = button.dataset.category;

    galleryItems.forEach(item => {
      item.hidden =
        category !== 'all' && item.dataset.category !== category;
    });

    visibleItems = galleryItems.filter(item => !item.hidden);

    galleryCount.textContent =
      `Showing ${visibleItems.length} image${visibleItems.length !== 1 ? 's' : ''}`;
  });
});

// Open the lightbox
function openLightbox(index) {
  if (!visibleItems.length) return;

  currentIndex = index;
  lastFocusedElement = document.activeElement;

  updateLightbox();

  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  closeBtn.focus();
}

// Update the current image
function updateLightbox() {
  const item = visibleItems[currentIndex];
  const img = item.querySelector('img');
  const title = item.querySelector('h3');
  const category = item.querySelector('.image-info span');

  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  caption.textContent = `${title.textContent} — ${category.textContent}`;
  counter.textContent = `${currentIndex + 1} / ${visibleItems.length}`;
}

// Close the lightbox
function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  if (lastFocusedElement) lastFocusedElement.focus();
}

// Next and previous images
function showNext() {
  currentIndex = (currentIndex + 1) % visibleItems.length;
  updateLightbox();
}

function showPrev() {
  currentIndex =
    (currentIndex - 1 + visibleItems.length) % visibleItems.length;
  updateLightbox();
}

// Make each gallery image clickable
galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const index = visibleItems.indexOf(item);
    if (index !== -1) openLightbox(index);
  });

  item.setAttribute('tabindex', '0');
  item.setAttribute('role', 'button');

  item.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const index = visibleItems.indexOf(item);
      if (index !== -1) openLightbox(index);
    }
  });
});

closeBtn.addEventListener('click', closeLightbox);
nextBtn.addEventListener('click', showNext);
prevBtn.addEventListener('click', showPrev);

// Close when clicking the dark background
lightbox.addEventListener('click', event => {
  if (event.target === lightbox) closeLightbox();
});

// Keyboard navigation
document.addEventListener('keydown', event => {
  if (!lightbox.classList.contains('open')) return;

  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowRight') showNext();
  if (event.key === 'ArrowLeft') showPrev();
});