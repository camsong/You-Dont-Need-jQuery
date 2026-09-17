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
  it('3.1 remove', () => {
    const child = parent.firstElementChild;
    child.remove();
    expect(parent.contains(child)).toBe(false);
  });

  it('3.6 / 3.7 before and after', () => {
    const child = parent.firstElementChild;
    const before = document.createElement('i');
    const after = document.createElement('u');

    child.before(before);
    child.after(after);

    expect([...parent.children].map((el) => el.nodeName)).toEqual(['I', 'SPAN', 'U']);
  });

  it('3.10 empty with replaceChildren', () => {
    parent.replaceChildren();
    const jquery = $('<div><span>first</span></div>').empty()[0];

    expect(parent.childNodes).toHaveLength(jquery.childNodes.length);
  });

  it('3.11 wrap', () => {
    document.body.innerHTML = `<p><span class='inner'>a</span><span class='inner'>b</span></p>`;
    const expected = $(`<p><span class='inner'>a</span><span class='inner'>b</span></p>`);
    expected.find('.inner').wrap('<div class="wrapper"></div>');

    document.querySelectorAll('.inner').forEach((el) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'wrapper';
      el.before(wrapper);
      wrapper.append(el);
    });

    expect(document.body.innerHTML).toBe(expected[0].outerHTML);
  });

  it('3.12 unwrap', () => {
    const html = `<section><div><span class='inner'>a</span><span class='inner'>b</span> text</div><div><b class='inner'>c</b></div></section>`;
    const expected = $(html);
    expected.find('.inner').unwrap();

    document.body.innerHTML = html;
    new Set([...document.querySelectorAll('.inner')].map((el) => el.parentElement))
      .forEach((parent) => {
        if (parent !== document.body) {
          parent.replaceWith(...parent.childNodes);
        }
      });

    expect(document.body.innerHTML).toBe(expected[0].outerHTML);
  });

  it('3.13 replaceWith', () => {
    document.body.innerHTML = `<p><span class='inner'>a</span><span class='inner'>b</span></p>`;
    const expected = $(`<p><span class='inner'>a</span><span class='inner'>b</span></p>`);
    expected.find('.inner').replaceWith('<div class="outer"></div>');

    document.querySelectorAll('.inner').forEach((el) => {
      const outer = document.createElement('div');
      outer.className = 'outer';
      el.replaceWith(outer);
    });

    expect(document.body.innerHTML).toBe(expected[0].outerHTML);
  });

  it('3.14 simple parse', () => {
    function parse(html) {
      const template = document.createElement('template');
      template.innerHTML = html;
      return template.content;
    }

    const html = '<ol><li>a</li></ol><ol><li>b</li></ol>';
    const fragment = parse(html);
    const jquery = $(html);

    expect([...fragment.children].map((el) => el.outerHTML)).toEqual(jquery.toArray().map((el) => el.outerHTML));
  });
});
