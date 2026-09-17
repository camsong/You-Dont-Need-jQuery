// tests for DOM Manipulation related
import { describe, it, expect, beforeEach } from 'vitest';
import $ from 'jquery';

describe('dom manipulation', () => {
  let parent;

  beforeEach(() => {
    document.body.innerHTML = `<div id='parent'><span>first</span></div>`;
    parent = document.getElementById('parent');
  });

  it('3.4 Append: ES6 append inserts strings as text, not HTML', () => {
    parent.append('<b>Hello World</b>');
    expect(parent.lastChild.nodeType).toBe(Node.TEXT_NODE);

    parent.insertAdjacentHTML('beforeend', '<b>Hello World</b>');
    expect(parent.lastChild.nodeName).toBe('B');
  });

  it('3.5 Prepend: ES6 prepend inserts strings as text, not HTML', () => {
    parent.prepend('<b>Hello World</b>');
    expect(parent.firstChild.nodeType).toBe(Node.TEXT_NODE);

    parent.insertAdjacentHTML('afterbegin', '<b>Hello World</b>');
    expect(parent.firstChild.nodeName).toBe('B');
  });

  it('3.9 clone is deep, like jQuery', () => {
    const native = parent.cloneNode(true);
    const jquery = $(parent).clone()[0];

    expect(native.outerHTML).toBe(jquery.outerHTML);
    expect(native.childNodes).toHaveLength(1);
  });

  it('3.10 empty', () => {
    parent.innerHTML = '';
    expect(parent.childNodes).toHaveLength(0);
  });
});
