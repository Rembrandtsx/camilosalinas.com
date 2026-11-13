// Keep hidden slides, project details, and the WebGL player out of the initial request queue.
const loadMedia = (root) => {
  const elements = [...root.querySelectorAll('[data-src], [data-bg]')];
  if (root.matches('[data-src], [data-bg]')) elements.unshift(root);
  elements.forEach((element) => {
    if (element.dataset.bg) {
      element.style.backgroundImage = 'url("' + element.dataset.bg + '")';
      delete element.dataset.bg;
    }
    if (element.dataset.src) {
      if (element.dataset.srcset) {
        element.srcset = element.dataset.srcset;
        delete element.dataset.srcset;
      }
      element.src = element.dataset.src;
      delete element.dataset.src;
      if (element.tagName === "VIDEO") syncVideo(element);
    }
  });
};

const observeMedia = (elements, activate) => {
  if (!('IntersectionObserver' in window)) {
    elements.forEach(activate);
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      activate(entry.target);
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '400px' });
  elements.forEach((element) => observer.observe(element));
};
observeMedia(document.querySelectorAll('[data-bg], iframe[data-src]'), loadMedia);
observeMedia(document.querySelectorAll('.slides'), (slides) => {
  loadMedia(slides.querySelector('.slide--current'));
});

// Autoplay only the active slide or open article while its video is on screen.
function syncVideo(video) {
  const slide = video.closest('.slide');
  const article = video.closest('.content__article');
  const active = (!slide || slide.classList.contains('slide--current')) && (!article || article.classList.contains('content__article--open'));
  if (!document.hidden && video.dataset.inView === 'true' && active && video.hasAttribute('src')) {
    video.play().catch(() => {}); // Autoplay may be disabled by the browser or user's preferences.
  } else video.pause();
}
const syncVideos = (root) => root.querySelectorAll('video').forEach(syncVideo);
const pauseMedia = (root) => root.querySelectorAll('video').forEach((video) => video.pause());
if ('IntersectionObserver' in window) {
  const videos = new IntersectionObserver((entries) => entries.forEach(({ target, isIntersecting }) => {
    target.dataset.inView = String(isIntersecting);
    syncVideo(target);
  }));
  document.querySelectorAll('video').forEach((video) => videos.observe(video));
} else document.querySelectorAll('video').forEach((video) => { video.dataset.inView = 'true'; });
document.addEventListener('visibilitychange', () => syncVideos(document));
