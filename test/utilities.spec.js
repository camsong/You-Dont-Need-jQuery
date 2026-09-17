// tests for Utilities related
import { describe, it, expect } from 'vitest';
import $ from 'jquery';

describe('utilities', () => {
  it('6.1 inArray returns the index, like jQuery', () => {
    const array = ['a', 'b', 'c'];

    expect(array.indexOf('b')).toBe($.inArray('b', array));
    expect(array.indexOf('z')).toBe($.inArray('z', array));
    expect(array.includes('b')).toBe($.inArray('b', array) > -1);
  });

  it('6.1 isPlainObject', () => {
    function isPlainObject(obj) {
      if (Object.prototype.toString.call(obj) !== '[object Object]') {
        return false;
      }

      const proto = Object.getPrototypeOf(obj);
      return proto === null || proto === Object.prototype;
    }

    class Foo {}
    const cases = [
      {}, new Object(), Object.create(null), { a: 1 },
      null, undefined, [], 1, 'str', new Foo(), new Date(), window, document.body, () => {},
    ];

    cases.forEach((value) => {
      expect(isPlainObject(value)).toBe($.isPlainObject(value));
    });
  });

  it('6.1 merge', () => {
    const jqueryFirst = [1, 2];
    $.merge(jqueryFirst, [2, 3]);

    const nativeFirst = [1, 2];
    nativeFirst.push(...[2, 3]);

    expect(nativeFirst).toEqual(jqueryFirst);
  });

  it('6.4 parseHTML keeps text nodes, like jQuery', () => {
    function parseHTML(string) {
      const context = document.implementation.createHTMLDocument();

      const base = context.createElement('base');
      base.href = document.location.href;
      context.head.appendChild(base);

      context.body.innerHTML = string;
      return Array.from(context.body.childNodes);
    }

    const html = 'text <b>bold</b> more';
    const native = parseHTML(html);
    const jquery = $.parseHTML(html);

    expect(native.map((node) => node.nodeName)).toEqual(jquery.map((node) => node.nodeName));
  });

  it('6.5 exists', () => {
    document.body.innerHTML = `<div class='here'></div>`;

    expect(Boolean(document.querySelector('.here'))).toBe(Boolean($('.here').length));
    expect(Boolean(document.querySelector('.missing'))).toBe(Boolean($('.missing').length));
  });
  it('6.1 extend', () => {
    const object1 = { a: 1, nested: { x: 1 } };
    const object2 = { b: 2 };

    expect(Object.assign({}, object1, object2)).toEqual($.extend({}, object1, object2));
    expect({ ...object1, ...object2 }).toEqual($.extend({}, object1, object2));

    const deep = structuredClone(object1);
    expect(deep).toEqual($.extend(true, {}, object1));
    expect(deep.nested).not.toBe(object1.nested);
  });

  it('6.1 isWindow', () => {
    function isWindow(obj) {
      return obj != null && obj === obj.window;
    }

    expect(isWindow(window)).toBe(true);
    [null, undefined, {}, document].forEach((value) => {
      expect(isWindow(value)).toBe(false);
    });
  });
});
