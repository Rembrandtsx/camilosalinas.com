class Cursor {
  constructor(el) {
    this.el = el;
    this.el.style.opacity = 0;
    this.bounds = el.getBoundingClientRect();
    this.frame = null;
    this.started = false;
    this.values = { x: 0, y: 0, scale: 1, opacity: 1 };
    this.target = { ...this.values };
    this.motion = window.matchMedia('(any-pointer: fine) and (prefers-reduced-motion: no-preference)');
    this.visible = false;
    window.addEventListener('mousemove', (event) => this.move(event.clientX, event.clientY), { passive: true });
    document.documentElement.addEventListener('mouseleave', () => this.hide());
    window.addEventListener('blur', () => this.hide());
    document.querySelectorAll('iframe').forEach((frame) => {
      const connect = () => {
        try {
          const child = frame.contentWindow;
          // Accessing document verifies same-origin access before installing the listener.
          if (!child.document) return;
          child.addEventListener('mousemove', (event) => {
            const rect = frame.getBoundingClientRect();
            this.move(rect.left + event.clientX * rect.width / frame.clientWidth,
              rect.top + event.clientY * rect.height / frame.clientHeight);
            if (event.target.closest && event.target.closest('a, button, .mobileButton')) this.enter();
            else this.leave();
          }, { passive: true });
          child.document.documentElement.addEventListener('mouseleave', () => this.hide());
        } catch (_) {
          // A third-party iframe cannot forward its coordinates. Hide instead of freezing.
          frame.addEventListener('mouseenter', () => this.hide());
        }
      };
      frame.addEventListener('load', connect);
      connect();
      frame.addEventListener('mouseleave', (event) => {
        this.leave();
        this.move(event.clientX, event.clientY);
      });
    });
    const sync = () => {
      if (document.hidden || !this.motion.matches) {
        this.hide();
      } else if (this.started) this.start();
    };
    document.addEventListener('visibilitychange', sync);
    this.motion.addEventListener('change', sync);
  }
  move(x, y) {
    if (!this.motion.matches) return;
    this.target.x = x - this.bounds.width / 2;
    this.target.y = y - this.bounds.height / 2;
    if (!this.visible) {
      this.values.x = this.target.x;
      this.values.y = this.target.y;
    }
    this.started = true;
    this.visible = true;
    this.start();
  }
  hide() {
    this.visible = false;
    cancelAnimationFrame(this.frame);
    this.frame = null;
    this.el.style.opacity = 0;
  }
  enter() { this.target.scale = 1.8; this.target.opacity = 0.5; this.start(); }
  leave() { this.target.scale = 1; this.target.opacity = 1; this.start(); }
  start() {
    if (this.frame !== null || !this.visible || document.hidden || !this.motion.matches) return;
    this.frame = requestAnimationFrame(() => this.render());
  }
  render() {
    this.frame = null;
    let moving = false;
    for (const key of Object.keys(this.values)) {
      this.values[key] = lerp(this.values[key], this.target[key], 0.2);
      if (Math.abs(this.values[key] - this.target[key]) > 0.001) moving = true;
    }
    this.el.style.transform = 'translate(' + this.values.x + 'px, ' + this.values.y + 'px) scale(' + this.values.scale + ')';
    this.el.style.opacity = this.values.opacity;
    if (moving) this.start();
  }
}
