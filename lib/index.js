Splitting();

class Slide {
  constructor(el) {
    this.DOM = { el: el };
    this.DOM.chars = this.DOM.el.querySelectorAll(".word > .char, .whitespace");
    this.DOM.imgs = this.DOM.el.querySelectorAll(".slide__img");
  }
}

class Slideshow {
  constructor(el) {
    this.DOM = { el: el };

    // Navigation buttons
    this.DOM.navigation = {
      prev: this.DOM.el.querySelector(".slides__nav--prev"),
      next: this.DOM.el.querySelector(".slides__nav--next"),
    };
    // Initialize the Slide instances and store that in an array
    this.slides = [];
    [...this.DOM.el.querySelectorAll(".slide")].forEach((slide) =>
      this.slides.push(new Slide(slide))
    );

    // Index of the current slide
    this.current = 0;
    // Total slides
    this.slidesTotal = this.slides.length;
    // positions (in percentages) for the images movement for both directions
    // example: the second image (top right one) will translate in the y-axis -150% when clicking the next button but when clicking the prev button it will instead translate in the x-axis 150%
    this.positions = {
      x: {
        next: [-150, 0, 0, 150],
        prev: [0, 150, -150, 0],
      },
      y: {
        next: [0, -150, 150, 0],
        prev: [-150, 0, 0, 150],
      },
    };
    this.initEvents();
  }
  initEvents() {
    this.onClickPrevEv = () => this.navigate("prev");
    this.onClickNextEv = () => this.navigate("next");
    this.DOM.navigation.prev.addEventListener("click", () =>
      this.onClickPrevEv()
    );
    this.DOM.navigation.next.addEventListener("click", () =>
      this.onClickNextEv()
    );
  }
  navigate(direction) {
    if (this.isAnimating) {
      return false;
    }

    const currentSlide = this.slides[this.current];
    this.current =
      direction === "next"
        ? this.current < this.slidesTotal - 1
          ? ++this.current
          : 0
        : this.current > 0
        ? --this.current
        : this.slidesTotal - 1;
    const nextSlide = this.slides[this.current];

    gsap
      .timeline({
        defaults: { duration: 0.8, ease: "power4.inOut" },
        onStart: () => (this.isAnimating = true),
        onComplete: () => {
          // Remove "current" class
          currentSlide.DOM.el.classList.remove("slide--current");
          this.isAnimating = false;
        },
      })
      .addLabel("start", 0)
      // Animate current title out (stagger the characters)
      .to(
        currentSlide.DOM.chars,
        {
          y: direction === "next" ? "100%" : "-100%",
          rotation: direction === "next" ? 3 : -3,
          stagger: direction === "next" ? -0.015 : 0.015,
        },
        "start"
      )
      // Animate current images out
      .to(
        currentSlide.DOM.imgs,
        {
          x: (pos) => `${this.positions.x[direction][pos]}%`,
          y: (pos) => `${this.positions.y[direction][pos]}%`,
          opacity: 0,
        },
        "start"
      )
      .addLabel("upcoming", 0.4)
      .add(() => {
        // Set up upcoming images and text default style:
        gsap.set(nextSlide.DOM.imgs, { opacity: 0 });
        gsap.set(nextSlide.DOM.chars, {
          y: direction === "next" ? "-100%" : "100%",
          rotation: direction === "next" ? 3 : -3,
        });
        // Add "current" class
        nextSlide.DOM.el.classList.add("slide--current");
      }, "upcoming")
      // Animate upcoming title in (stagger the characters)
      .to(
        nextSlide.DOM.chars,
        {
          y: "0%",
          rotation: 0,
          ease: "power4",
          stagger: direction === "next" ? -0.015 : 0.015,
        },
        "upcoming"
      )
      // Animate upcoming images in
      .to(
        nextSlide.DOM.imgs,
        {
          startAt: {
            x: (pos) =>
              `${this.positions.x[this.reverseDirection(direction)][pos]}%`,
            y: (pos) =>
              `${this.positions.y[this.reverseDirection(direction)][pos]}%`,
          },
          x: "0%",
          y: "0%",
          opacity: 0.6,
          ease: "power4",
        },
        "upcoming"
      );
  }
  reverseDirection(direction) {
    return direction === "next" ? "prev" : "next";
  }
}

// Calculate the viewport size
let winsize = calcWinsize();
window.addEventListener("resize", () => (winsize = calcWinsize()));

// Track the mouse position
let mousepos = { x: winsize.width / 2, y: winsize.height / 2 };
window.addEventListener("mousemove", (ev) => (mousepos = mousePosition(ev)));

class GridItem {
  constructor(el) {
    this.DOM = { el: el };
    this.move();
  }
  // Move the items when moving the cursor
  move() {
    // amounts to move in each axis
    let translationVals = { tx: 0, ty: 0 };
    // get random start and end movement boundaries
    const xstart = getRandomNumber(15, 60);
    const ystart = getRandomNumber(15, 60);

    // infinite loop
    const render = () => {
      // Calculate the amount to move.
      // Using linear interpolation to smooth things out.
      // Translation values will be in the range of [-start, start] for a cursor movement from 0 to the window's width/height
      translationVals.tx = lerp(
        translationVals.tx,
        map(mousepos.x, 0, winsize.width, -xstart, xstart),
        0.07
      );
      translationVals.ty = lerp(
        translationVals.ty,
        map(mousepos.y, 0, winsize.height, -ystart, ystart),
        0.07
      );

      gsap.set(this.DOM.el, { x: translationVals.tx, y: translationVals.ty });
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }
}

class Grid {
  constructor(el) {
    this.DOM = { el: el };
    this.gridItems = [];
    this.items = [...this.DOM.el.querySelectorAll(".grid__item")];
    this.items.forEach((item) => this.gridItems.push(new GridItem(item)));

    this.showItems();
  }
  // Initial animation to scale up and fade in the items
  showItems() {
    gsap
      .timeline()
      .set(this.items, { scale: 0.7, opacity: 0 }, 0)
      .to(
        this.items,
        {
          duration: 2,
          ease: "Expo.easeOut",
          scale: 1,
          stagger: { amount: 0.6, grid: "auto", from: "center" },
        },
        0
      )
      .to(
        this.items,
        {
          duration: 3,
          ease: "Power1.easeOut",
          opacity: 0.6,
          stagger: { amount: 0.6, grid: "auto", from: "center" },
        },
        0
      );
  }
}

// Preload  images and fonts
Promise.all([
  preloadImages(".slide__img"),
  preloadImages(".grid__item-img, .bigimg"),
  preloadFonts("ldj8uhs"),
]).then(() => {
  // Remove loader (loading class)
  document.body.classList.remove("loading");

  // Initialize custom cursor
  const cursor = new Cursor(document.querySelector(".cursor"));

  // Initialize the slideshow
  new Slideshow(document.querySelector(".slides"));

  const grid = new Grid(document.querySelector(".grid"));
  // mouse cursor hovers
  [
    ...document.querySelectorAll("a"),
    ...document.querySelectorAll(".slides__nav"),
  ].forEach((link) => {
    link.addEventListener("mouseenter", () => cursor.enter());
    link.addEventListener("mouseleave", () => cursor.leave());
  });
});
