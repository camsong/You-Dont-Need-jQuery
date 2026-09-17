// tests for Animation related
// jsdom has no Web Animations API, so el.animate is stubbed to check the
// keyframes passed and the state left behind when the animation finishes.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('animation', () => {
  let el;

  beforeEach(() => {
    Element.prototype.animate = vi.fn(() => ({ finished: Promise.resolve() }));
    el = document.createElement('div');
    document.body.append(el);
  });

  afterEach(() => {
    delete Element.prototype.animate;
  });

  function fadeIn(el, ms = 400) {
    el.style.display = '';
    return el.animate([{ opacity: 0 }, { opacity: 1 }], ms).finished;
  }

  function fadeOut(el, ms = 400) {
    return el.animate([{ opacity: 1 }, { opacity: 0 }], ms).finished.then(() => {
      el.style.display = 'none';
    });
  }

  it('8.3 fadeOut hides the element when finished', async () => {
    await fadeOut(el, 3000);

    expect(el.animate).toHaveBeenCalledWith([{ opacity: 1 }, { opacity: 0 }], 3000);
    expect(el.style.display).toBe('none');
  });

  it('8.3 fadeIn shows the element', async () => {
    el.style.display = 'none';
    await fadeIn(el);

    expect(el.animate).toHaveBeenCalledWith([{ opacity: 0 }, { opacity: 1 }], 400);
    expect(el.style.display).toBe('');
  });

  it('8.5 fadeToggle picks the direction from display', async () => {
    el.style.display = 'none';
    const toggle = () => (getComputedStyle(el).display === 'none' ? fadeIn(el) : fadeOut(el));

    await toggle();
    expect(el.style.display).toBe('');

    await toggle();
    expect(el.style.display).toBe('none');
  });
});
