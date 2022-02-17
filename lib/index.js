Splitting();

const frameEl = document.querySelectorAll(".frame");

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
    this.DOM.navigation.prev.addEventListener("click", () => this.onClickPrevEv());
    this.DOM.navigation.next.addEventListener("click", () => this.onClickNextEv());
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
            x: (pos) => `${this.positions.x[this.reverseDirection(direction)][pos]}%`,
            y: (pos) => `${this.positions.y[this.reverseDirection(direction)][pos]}%`,
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
class MagneticFx {
  constructor(el) {
    // DOM elements
    this.DOM = { el: el };
    // amounts the button will translate/scale
    this.renderedStyles = {
      tx: { previous: 0, current: 0, amt: 0.1 },
      ty: { previous: 0, current: 0, amt: 0.1 },
    };
    // calculate size/position
    this.calculateSizePosition();
    // init events
    this.initEvents();
  }
  calculateSizePosition() {
    // current scroll
    this.scrollVal = { x: window.scrollX, y: window.scrollY };
    // size/position
    this.rect = this.DOM.el.getBoundingClientRect();
  }
  initEvents() {
    window.addEventListener("resize", () => this.calculateSizePosition());

    this.DOM.el.addEventListener("mouseenter", () => {
      // start the render loop animation (rAF)
      this.loopRender();
    });
    this.DOM.el.addEventListener("mouseleave", () => {
      // stop the render loop animation (rAF)
      this.stopRendering();
      this.renderedStyles["tx"].previous = this.renderedStyles["ty"].previous = 0;
    });
  }
  // start the render loop animation (rAF)
  loopRender() {
    if (!this.requestId) {
      this.requestId = requestAnimationFrame(() => this.render());
    }
  }
  // stop the render loop animation (rAF)
  stopRendering() {
    if (this.requestId) {
      window.cancelAnimationFrame(this.requestId);
      this.requestId = undefined;
    }
  }
  render() {
    this.requestId = undefined;

    const scrollDiff = {
      x: this.scrollVal.x - window.scrollX,
      y: this.scrollVal.y - window.scrollY,
    };

    // new values for the translations and scale
    this.renderedStyles["tx"].current =
      (mousepos.x - (scrollDiff.x + this.rect.left + this.rect.width / 2)) * 0.3;
    this.renderedStyles["ty"].current =
      (mousepos.y - (scrollDiff.y + this.rect.top + this.rect.height / 2)) * 0.3;

    for (const key in this.renderedStyles) {
      this.renderedStyles[key].previous = lerp(
        this.renderedStyles[key].previous,
        this.renderedStyles[key].current,
        this.renderedStyles[key].amt
      );
    }

    gsap.set(this.DOM.el, {
      x: this.renderedStyles["tx"].previous,
      y: this.renderedStyles["ty"].previous,
    });

    this.loopRender();
  }
}

class Item {
  constructor(el, itemsArr) {
    this.DOM = { el: el };
    this.itemsArr = itemsArr;
    // left/right(invert) align
    this.invert = this.DOM.el.classList.contains("item--invert");

    // image
    this.DOM.imgWrap = this.DOM.el.querySelector(".item__imgwrap");
    this.DOM.img = this.DOM.imgWrap.querySelector(".item__img");

    // circle hover effect
    this.DOM.enterAction = this.DOM.el.querySelector(".item__enter");
    this.DOM.enterActionSVGCircle = this.DOM.enterAction.querySelector("circle");
    // need to set the circle transform origin
    gsap.set(this.DOM.enterActionSVGCircle, { transformOrigin: "50% 50%" });
    // the circle magnetic functionality
    this.magneticFx = new MagneticFx(this.DOM.enterAction);

    // create the heading texts structure for the characters sliding animation (split the text into characters)
    this.editHeadingLayout();

    // excerpt element
    this.DOM.excerpt = this.DOM.el.querySelector(".item__excerpt");
    // excerpt link ("Read more")
    this.DOM.excerptLink = this.DOM.excerpt.querySelector(".item__excerpt-link");
    // excerpt link href contains the content element's id
    this.contentId = this.DOM.excerptLink.href.substring(
      this.DOM.excerptLink.href.lastIndexOf("#")
    );

    // meta texts under each image
    this.DOM.metaContent = [...this.DOM.el.querySelectorAll(".item__meta > .item__meta-row")];

    // content element and split the texts into chars/lines
    this.editContentLayout();

    // back arrow button
    this.DOM.backCtrl = document.querySelector(".content__back");

    this.initEvents();
  }
  editHeadingLayout() {
    this.DOM.heading = this.DOM.el.querySelector(".heading--item");
    this.DOM.itemHeadingChars = [...this.DOM.heading.querySelectorAll(".char")];
    wrapElements(this.DOM.itemHeadingChars, "span", "char-wrap");
  }
  editContentLayout() {
    this.DOM.contentEl = document.querySelector(this.contentId);

    this.DOM.contentElHeading = this.DOM.contentEl.querySelector(".heading");
    this.DOM.contentHeadingChars = [...this.DOM.contentElHeading.querySelectorAll(".char")];
    wrapElements(this.DOM.contentHeadingChars, "span", "char-wrap");

    this.DOM.contentElText = [...this.DOM.contentEl.querySelectorAll(".content__text > *")];
  }
  initEvents() {
    this.DOM.enterAction.addEventListener("mouseenter", () => this.onMouseEnter());
    this.DOM.enterAction.addEventListener("mouseleave", () => this.onMouseLeave());
    this.DOM.enterAction.addEventListener("click", () => this.open());
    // same for the "read more" link
    this.DOM.excerptLink.addEventListener("mouseenter", () => this.onMouseEnter());
    this.DOM.excerptLink.addEventListener("mouseleave", () => this.onMouseLeave());
    this.DOM.excerptLink.addEventListener("click", () => this.open());

    this.DOM.backCtrl.addEventListener("click", () => this.close());
  }
  onMouseEnter() {
    if (this.timelineHoverOut) this.timelineHoverOut.kill();
    this.timelineHoverIn = gsap
      .timeline()
      .addLabel("start", 0)
      .to(
        this.DOM.enterActionSVGCircle,
        {
          duration: 0.8,
          ease: "power3",
          scale: 1.1,
        },
        "start"
      )
      .to(
        this.DOM.imgWrap,
        {
          duration: 0.8,
          ease: "power3",
          scale: 0.95,
        },
        "start"
      )
      .to(
        this.DOM.img,
        {
          duration: 0.8,
          ease: "power3",
          scale: 1.1,
        },
        "start"
      )
      .to(
        this.DOM.itemHeadingChars,
        {
          duration: 0.2,
          ease: "quad.in",
          x: this.invert ? "103%" : "-103%",
        },
        "start"
      )
      .set(
        this.DOM.heading,
        {
          x: this.invert ? "20%" : "-20%",
        },
        "start+=0.2"
      )
      .to(
        this.DOM.itemHeadingChars,
        {
          duration: 0.7,
          ease: "expo",
          startAt: { x: this.invert ? "-103%" : "103%" },
          x: "0%",
        },
        "start+=0.2"
      );
  }
  onMouseLeave() {
    if (this.isContentOpen) return;

    if (this.timelineHoverIn) this.timelineHoverIn.kill();

    this.timelineHoverOut = gsap
      .timeline()
      .addLabel("start", 0)
      .to(
        this.DOM.enterAction,
        {
          duration: 0.8,
          ease: "power3",
          x: 0,
          y: 0,
        },
        "start"
      )
      .to(
        this.DOM.enterActionSVGCircle,
        {
          duration: 0.8,
          ease: "power3",
          scale: 1,
        },
        "start"
      )
      .to(
        [this.DOM.imgWrap, this.DOM.img],
        {
          duration: 0.8,
          ease: "power3",
          scale: 1,
        },
        "start"
      )
      .to(
        this.DOM.itemHeadingChars,
        {
          duration: 0.2,
          ease: "quad.in",
          x: this.invert ? "-103%" : "103%",
        },
        "start"
      )
      .set(
        this.DOM.heading,
        {
          x: "0%",
        },
        "start+=0.2"
      )
      .to(
        this.DOM.itemHeadingChars,
        {
          duration: 0.7,
          ease: "expo",
          startAt: { x: this.invert ? "103%" : "-103%" },
          x: "0%",
        },
        "start+=0.2"
      );
  }
  open() {
    // stop the magnetic effect
    this.magneticFx.stopRendering();

    if (this.timelineHoverIn) this.timelineHoverIn.kill();
    if (this.timelineHoverClose) this.timelineHoverClose.kill();

    this.isContentOpen = true;

    // scroll related
    let root = document.getElementsByTagName("html")[0];
    root.classList.add("oh");
    this.DOM.contentEl.classList.add("content__article--open");

    // circle element size and position
    const enterActionRect = this.DOM.enterAction.getBoundingClientRect();

    this.timelineHoverOpen = gsap
      .timeline()
      .addLabel("start", 0)
      // set up some content elements before the animation starts
      // the content heading chars will translate on the x-axis so we set the initial position to the right/left depending on the item's position in the grid
      .set(
        this.DOM.contentHeadingChars,
        {
          x: this.invert ? "-103%" : "103%",
        },
        "start"
      )
      // same for the content text. These will translate on the y-axis and also fade in
      .set(
        this.DOM.contentElText,
        {
          opacity: 0,
          y: "20%",
        },
        "start"
      )
      // also set up the initial style for the back button
      .set(
        this.DOM.backCtrl,
        {
          scale: 0.8,
          opacity: 0,
        },
        "start"
      )
      // hide all other items
      .to(
        [frameEl, this.itemsArr.filter((item) => item != this).map((item) => item.DOM.el)],
        {
          duration: 0.6,
          ease: "power3",
          opacity: 0,
        },
        "start"
      )
      // animate circle button position
      .to(
        this.DOM.enterAction,
        {
          duration: 0.8,
          ease: "power2",
          x: winsize.width / 2 - enterActionRect.left - enterActionRect.width / 2,
          y: -enterActionRect.top - enterActionRect.height / 2,
        },
        "start"
      )
      // and also its scale and opacity
      .to(
        this.DOM.enterActionSVGCircle,
        {
          duration: 2,
          ease: "power2",
          scale: 2.3,
          opacity: 0,
          onComplete: () =>
            gsap.set(this.DOM.enterAction, {
              x: 0,
              y: 0,
            }),
        },
        "start"
      )
      // excerpt text moves up and fades out
      .to(
        [this.DOM.excerpt, this.DOM.metaContent],
        {
          duration: 0.5,
          ease: "power4.in",
          y: (i) => (i ? "-100%" : "-8%"),
          opacity: 0,
          stagger: {
            from: "center",
            amount: 0.06,
          },
        },
        "start"
      )
      // image scales down and fades out
      .to(
        this.DOM.imgWrap,
        {
          duration: 0.5,
          ease: "power3.inOut",
          scale: 0.9,
          opacity: 0,
        },
        "start"
      )
      // animate out the heading chars
      .to(
        this.DOM.itemHeadingChars,
        {
          duration: 0.3,
          ease: "quad.in",
          x: this.invert ? "103%" : "-103%",
        },
        "start"
      )
      // animate in the content chars
      .to(
        this.DOM.contentHeadingChars,
        {
          duration: 1.3,
          ease: "expo",
          x: "0%",
          stagger: this.invert ? -0.03 : 0.03,
        },
        "start+=0.4"
      )
      // content text moves up and fades in
      .to(
        this.DOM.contentElText,
        {
          duration: 1.3,
          ease: "expo",
          y: "0%",
          opacity: 1,
          stagger: 0.03,
        },
        "start+=0.7"
      )
      // animate back button in
      .to(
        this.DOM.backCtrl,
        {
          duration: 1.3,
          ease: "expo",
          scale: 1,
          opacity: 1,
        },
        "start+=1"
      );
  }
  close() {
    if (this.timelineHoverOpen) this.timelineHoverOpen.kill();

    this.isContentOpen = false;

    this.timelineHoverClose = gsap
      .timeline()
      .addLabel("start", 0)
      .set(
        this.DOM.enterAction,
        {
          x: 0,
          y: 0,
        },
        "start"
      )
      .to(
        this.DOM.backCtrl,
        {
          duration: 0.3,
          ease: "quad.in",
          scale: 0.9,
          opacity: 0,
        },
        "start"
      )
      .set(
        this.DOM.enterActionSVGCircle,
        {
          scale: 0.5,
          opacity: 0,
        },
        "start+=0.4"
      )
      .to(
        this.DOM.enterActionSVGCircle,
        {
          duration: 1,
          ease: "expo",
          scale: 1,
          opacity: 1,
          onComplete: () => {
            // scroll related
            this.DOM.contentEl.classList.remove("content__article--open");
            let root = document.getElementsByTagName("html")[0];
            root.classList.remove("oh");
            // scroll content element to the top
            this.DOM.contentEl.scrollTop = 0;
          },
        },
        "start+=0.4"
      )
      .to(
        this.DOM.contentHeadingChars,
        {
          duration: 0.3,
          ease: "quad.in",
          x: this.invert ? "-103%" : "103%",
        },
        "start"
      )
      .to(
        this.DOM.itemHeadingChars,
        {
          duration: 1.3,
          ease: "expo",
          x: "0%",
          stagger: this.invert ? 0.01 : -0.01,
        },
        "start+=0.4"
      )
      .to(
        this.DOM.contentElText,
        {
          duration: 0.5,
          ease: "power4.in",
          opacity: 0,
          y: "20%",
        },
        "start"
      )
      .to(
        this.DOM.imgWrap,
        {
          duration: 0.8,
          ease: "power3",
          scale: 1,
          opacity: 1,
        },
        "start+=0.4"
      )
      .to(
        [this.DOM.excerpt, this.DOM.metaContent],
        {
          duration: 1.3,
          ease: "expo",
          y: "0%",
          opacity: 1,
          stagger: {
            from: "center",
            amount: 0.06,
          },
        },
        "start+=0.4"
      )
      .to(
        [frameEl, this.itemsArr.filter((item) => item != this).map((item) => item.DOM.el)],
        {
          duration: 0.6,
          ease: "power3",
          opacity: 1,
        },
        "start+=0.4"
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

  let itemsArr = [];
  [...document.querySelectorAll(".items > .item")].forEach((item) =>
    itemsArr.push(new Item(item, itemsArr))
  );
  // mouse cursor hovers
  [...document.querySelectorAll("a"), ...document.querySelectorAll(".slides__nav")].forEach(
    (link) => {
      link.addEventListener("mouseenter", () => cursor.enter());
      link.addEventListener("mouseleave", () => cursor.leave());
    }
  );
});
