// tests for Events related
import { describe, it, expect, beforeEach } from 'vitest';

describe('events', () => {
  let outer;
  let inner;

  beforeEach(() => {
    document.body.innerHTML = `<div id='outer'><ul><li><button id='inner'>go</button></li></ul></div>`;
    outer = document.getElementById('outer');
    inner = document.getElementById('inner');
  });

  it('5.1.1 one', () => {
    let count = 0;
    inner.addEventListener('click', () => count++, { once: true });

    inner.click();
    inner.click();

    expect(count).toBe(1);
  });

  it('5.1.2 event delegation', () => {
    const calls = [];
    const selector = 'li';
    const eventHandler = function (event) {
      calls.push([this.nodeName, event.type]);
    };

    outer.addEventListener('click', (event) => {
      const target = event.target.closest(selector);
      if (target && outer.contains(target)) {
        eventHandler.call(target, event);
      }
    });

    inner.click();
    outer.click();

    expect(calls).toEqual([['LI', 'click']]);
  });

  it('5.2 remove several listeners with AbortController', () => {
    let count = 0;
    const controller = new AbortController();
    inner.addEventListener('click', () => count++, { signal: controller.signal });
    inner.addEventListener('focus', () => count++, { signal: controller.signal });

    controller.abort();
    inner.click();
    inner.dispatchEvent(new Event('focus'));

    expect(count).toBe(0);
  });

  it('5.3 Trigger dispatches a bubbling CustomEvent with detail', () => {
    let received;
    outer.addEventListener('custom-event', (e) => {
      received = e.detail;
    });

    const event = new CustomEvent('custom-event', {
      bubbles: true,
      cancelable: true,
      detail: { key1: 'data' },
    });

    inner.dispatchEvent(event);

    expect(received).toEqual({ key1: 'data' });
  });
});
