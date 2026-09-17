// tests for Query Selector related
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import $ from 'jquery';

describe('query selector', () => {
  describe('basic', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <ul id='query-selector-test1' class='list'>
          <li data-role='red' class='item-i red item'>I</li>
          <li data-role='blue' class='item-ii blue item'>II</li>
          <li>III</li>
          <li>
            <ul id='nested-ul'>
              <li data-role='red' class='item-i-i red item'>III.I</li>
              <li data-role='blue' class='item-i-ii blue item'>III.II</li>
            </ul>
          </li>
        </ul>
      `;
    });

    afterEach(() => {
      const el = document.querySelector('#query-selector-test1');
      el.parentNode.removeChild(el);
    });

    it('1.0 Query by selector', () => {
      const $els = $('li.item[data-role="red"]');
      const els = document.querySelectorAll('li.item[data-role="red"]');

      expect($els.length).to.equal(2);
      [].forEach.call($els, ($el, i) => {
        expect($el).to.equal(els[i]);
      });
    });

    it('1.1 Query by class', () => {
      const $els = $('.item');
      const els = document.getElementsByClassName('item');

      [].forEach.call($els, ($el, i) => {
        expect($el).to.equal(els[i]);
      });
    });

    it('1.2 Query by id', () => {
      expect($('#nested-ul')[0]).to.equal(document.getElementById('nested-ul'));
    });

    it('1.3 Query by attribute', () => {
      const $els = $('[data-role="blue"]');
      const els = document.querySelectorAll('[data-role="blue"]');

      expect($els.length).to.equal(2);
      [].forEach.call($els, ($el, i) => {
        expect($el).to.equal(els[i]);
      });
    });

    it('1.4 Query in descendants', () => {
      const $els = $('#query-selector-test1').find('.item');
      const els = document.getElementById('query-selector-test1').querySelectorAll('.item');

      expect($els.length).to.equal(4);
      [].forEach.call($els, ($el, i) => {
        expect($el).to.equal(els[i]);
      });
    });
  });
  describe('traversing', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <ul id='siblings'>
          <li class='x'>a</li>
          <li>b</li>
          <!-- comment -->
          <li id='middle' class='x'>c</li>
          <li class='x'>d</li>
          text
          <li>e</li>
          <li class='x'>f</li>
        </ul>
        <p>cost (approx) $5</p>
      `;
    });

    const names = (els) => Array.from(els).map((el) => el.textContent);
    const isX = (el) => el.classList.contains('x');

    it('1.5 All previous siblings', () => {
      function getPreviousSiblings(elem, filter) {
        const sibs = [];
        while ((elem = elem.previousElementSibling)) {
          if (!filter || filter(elem)) sibs.push(elem);
        }
        return sibs;
      }

      const el = document.getElementById('middle');
      expect(names(getPreviousSiblings(el))).toEqual(names($(el).prevAll()));
      expect(names(getPreviousSiblings(el, isX))).toEqual(names($(el).prevAll('.x')));
    });

    it('1.5 All next siblings', () => {
      function getNextSiblings(elem, filter) {
        const sibs = [];
        while ((elem = elem.nextElementSibling)) {
          if (!filter || filter(elem)) sibs.push(elem);
        }
        return sibs;
      }

      const el = document.getElementById('middle');
      expect(names(getNextSiblings(el))).toEqual(names($(el).nextAll()));
      expect(names(getNextSiblings(el, isX))).toEqual(names($(el).nextAll('.x')));
    });

    it('1.12 Selector containing string, with regex special characters', () => {
      function contains(selector, text) {
        const elements = document.querySelectorAll(selector);
        return Array.from(elements).filter((element) =>
          element.textContent.includes(text)
        );
      }

      expect(contains('p', '(approx')).toHaveLength(1);
      expect(contains('p', 'missing')).toHaveLength(0);
      expect(names(contains('li', 'c'))).toEqual(['c']);
    });
  });
});