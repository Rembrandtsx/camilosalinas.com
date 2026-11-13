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
    window.addEventListener('mousemove', (event) => {
      this.target.x = event.clientX - this.bounds.width / 2;
      this.target.y = event.clientY - this.bounds.height / 2;
      if (!this.started) {
        this.values.x = this.target.x;
        this.values.y = this.target.y;
        this.started = true;
      }
      this.start();
    }, { passive: true });
    const sync = () => {
      if (document.hidden || !this.motion.matches) {
        cancelAnimationFrame(this.frame);
        this.frame = null;
      } else if (this.started) this.start();
    };
    document.addEventListener('visibilitychange', sync);
    this.motion.addEventListener('change', sync);
  }
  enter() { this.target.scale = 1.8; this.target.opacity = 0.5; this.start(); }
  leave() { this.target.scale = 1; this.target.opacity = 1; this.start(); }
  start() {
    if (this.frame !== null || document.hidden || !this.motion.matches) return;
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
