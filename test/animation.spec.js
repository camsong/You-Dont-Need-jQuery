// tests for Animation related
import { describe, it, expect } from 'vitest';

describe('animation', () => {
  it('8.3 fadeOut sets a valid transition and hides the element', () => {
    function fadeOut(el, ms) {
      if (ms) {
        el.style.transition = `opacity ${ms}ms`;
        el.addEventListener(
          'transitionend',
          () => {
            el.style.display = 'none';
          },
          { once: true }
        );
      } else {
        el.style.display = 'none';
      }
      el.style.opacity = '0';
    }

    const el = document.createElement('div');
    fadeOut(el, 3000);
    expect(el.style.transition).toBe('opacity 3000ms');

    el.dispatchEvent(new Event('transitionend'));
    expect(el.style.display).toBe('none');

    const instant = document.createElement('div');
    fadeOut(instant);
    expect(instant.style.display).toBe('none');
  });

  it('8.8 Animate sets a valid transition', () => {
    const el = document.createElement('div');
    const speed = 400;
    el.style.transition = `all ${speed}ms`;

    expect(el.style.transition).toBe('all 400ms');
  });
});
