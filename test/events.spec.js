// tests for Events related
import { describe, it, expect } from 'vitest';

describe('events', () => {
  it('5.3 Trigger dispatches a bubbling CustomEvent with detail', () => {
    document.body.innerHTML = `<div id='outer'><div id='inner'></div></div>`;
    const el = document.getElementById('inner');
    let received;
    document.getElementById('outer').addEventListener('custom-event', (e) => {
      received = e.detail;
    });

    let event;
    if (typeof window.CustomEvent === 'function') {
      event = new CustomEvent('custom-event', { bubbles: true, cancelable: true, detail: { key1: 'data' } });
    } else {
      event = document.createEvent('CustomEvent');
      event.initCustomEvent('custom-event', true, true, { key1: 'data' });
    }

    el.dispatchEvent(event);

    expect(received).toEqual({ key1: 'data' });
  });
});
