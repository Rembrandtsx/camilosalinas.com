// Linear interpolation
const lerp = (a, b, n) => (1 - n) * a + n * b;

const map = (x, a, b, c, d) => ((x - a) * (d - c)) / (b - a) + c;

// Gets the mouse position
const getMousePos = (e) => {
  let posx = 0;
  let posy = 0;
  if (!e) e = window.event;
  if (e.pageX || e.pageY) {
    posx = e.pageX;
    posy = e.pageY;
  } else if (e.clientX || e.clientY) {
    posx = e.clientX + body.scrollLeft + document.documentElement.scrollLeft;
    posy = e.clientY + body.scrollTop + document.documentElement.scrollTop;
  }

  return { x: posx, y: posy };
};
const mousePosition = (e) => {
  return {
    x: e.clientX,
    y: e.clientY,
  };
};

const calcWinsize = () => {
  return { width: window.innerWidth, height: window.innerHeight };
};
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
// Preload images
const preloadImages = (selector = "img") => {
  return new Promise((resolve) => {
    imagesLoaded(document.querySelectorAll(selector), resolve);
  });
};

// Preload images
const preloadFonts = (id) => {
  return new Promise((resolve) => {
    WebFont.load({
      typekit: {
        id: id,
      },
      active: resolve,
    });
  });
};

const distance = (x1, y1, x2, y2) => {
  var a = x1 - x2;
  var b = y1 - y2;

  return Math.hypot(a, b);
};

// Generate a random float.
const getRandomFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(2);

const wrapElements = (elems, wrapType, wrapClass) => {
  elems.forEach((char) => {
    // add a wrap for every char (overflow hidden)
    const wrapEl = document.createElement(wrapType);
    wrapEl.classList = wrapClass;
    char.parentNode.appendChild(wrapEl);
    wrapEl.appendChild(char);
  });
};
