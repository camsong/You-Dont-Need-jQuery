## You (Might) Don't Need jQuery [![Build Status](https://travis-ci.org/oneuijs/You-Dont-Need-jQuery.svg)](https://travis-ci.org/oneuijs/You-Dont-Need-jQuery)

Frontend environments evolve rapidly nowadays and modern browsers have already implemented a great deal of DOM/BOM APIs which are good enough for production use. We don't have to learn jQuery from scratch for DOM manipulation or event handling. In the meantime, thanks to the spread of frontend libraries such as React, Angular and Vue, manipulating the DOM directly becomes anti-pattern, so that jQuery usage has never been less important. This project summarizes most of the alternatives in native Javascript implementation to jQuery methods, with IE 10+ support.

Note: jQuery is still a great library and has many valid use cases. Don’t migrate away if you don’t want to!

## Table of Contents

1. [Translations](#translations)
1. [Query Selector](#query-selector)
1. [CSS & Style](#css--style)
1. [DOM Manipulation](#dom-manipulation)
1. [Ajax](#ajax)
1. [Events](#events)
1. [Utilities](#utilities)
1. [Promises](#promises)
1. [Animation](#animation)
1. [Alternatives](#alternatives)
1. [Browser Support](#browser-support)

## Translations

* [한국어](./README.ko-KR.md)
* [正體中文](./README.zh-TW.md)
* [简体中文](./README.zh-CN.md)
* [Bahasa Melayu](./README-my.md)
* [Bahasa Indonesia](./README-id.md)
* [Português(PT-BR)](./README.pt-BR.md)
* [Tiếng Việt Nam](./README-vi.md)
* [Español](./README-es.md)
* [Русский](./README-ru.md)
* [Кыргызча](./README-kg.md)
* [Türkçe](./README-tr.md)
* [Italiano](./README-it.md)
* [Français](./README-fr.md)
* [日本語](./README-ja.md)
* [Polski](./README-pl.md)

## Query Selector

In place of common selectors like class, id or attribute we can use `document.querySelector` or `document.querySelectorAll` for substitution. The differences lie in:
* `document.querySelector` returns the first matched element
* `document.querySelectorAll` returns all matched elements as NodeList. It can be converted to Array using `Array.prototype.slice.call(document.querySelectorAll(selector));` or any of the methods outlined in [makeArray](#makeArray)
* If there are no elements matched, jQuery and `document.querySelectorAll` will return `[]`, whereas `document.querySelector` will return `null`.

> Notice: `document.querySelector` and `document.querySelectorAll` are quite **SLOW**, thus try to use `document.getElementById`, `document.getElementsByClassName` or `document.getElementsByTagName` if you want to get a performance bonus.

- [1.0](#1.0) <a name='1.0'></a> Query by selector

  ```js
  // jQuery
  $('selector');

  // Native
  document.querySelectorAll('selector');
  ```

- [1.1](#1.1) <a name='1.1'></a> Query by class

  ```js
  // jQuery
  $('.class');

  // Native
  document.querySelectorAll('.class');

  // or
  document.getElementsByClassName('class');
  ```

- [1.2](#1.2) <a name='1.2'></a> Query by id

  ```js
  // jQuery
  $('#id');

  // Native
  document.querySelector('#id');

  // or
  document.getElementById('id');
  ```

- [1.3](#1.3) <a name='1.3'></a> Query by attribute

  ```js
  // jQuery
  $('a[target=_blank]');

  // Native
  document.querySelectorAll('a[target=_blank]');
  ```

- [1.4](#1.4) <a name='1.4'></a> Query in descendants

  ```js
  // jQuery
  $el.find('li');

  // Native
  el.querySelectorAll('li');
  ```

- [1.5](#1.5) <a name='1.5'></a> Sibling/Previous/Next Elements

  + All siblings

    ```js
    // jQuery
    $el.siblings();

    // Native - latest, Edge13+
    [...el.parentNode.children].filter((child) =>
      child !== el
    );
    // Native (alternative) - latest, Edge13+
    Array.from(el.parentNode.children).filter((child) =>
      child !== el
    );
    // Native - IE10+
    Array.prototype.filter.call(el.parentNode.children, (child) =>
      child !== el
    );
    ```

  + Previous sibling

    ```js
    // jQuery
    $el.prev();

    // Native
    el.previousElementSibling;
    ```
  + Next sibling

    ```js
    // jQuery
    $el.next();

    // Native
    el.nextElementSibling;
    ```

  + All previous siblings

    ```js
    // jQuery (optional filter selector)
    $el.prevAll($filter);

    // Native (optional filter function)
    function getPreviousSiblings(elem, filter) {
      var sibs = [];
      while (elem = elem.previousSibling) {
          if (elem.nodeType === 3) continue; // ignore text nodes
          if (!filter || filter(elem)) sibs.push(elem);
      }
      return sibs;
    }

  + All next siblings

    ```js
    // jQuery (optional selector filter)
    $el.nextAll($filter);

    // Native (optional filter function)
    function getNextSiblings(elem, filter) {
            var sibs = [];
            var nextElem = elem.parentNode.firstChild;
            do {
                if (nextElem.nodeType === 3) continue; // ignore text nodes
                if (nextElem === elem) continue; // ignore elem of target
                if (nextElem === elem.nextElementSibling) {
                    if (!filter || filter(elem)) {
                        sibs.push(nextElem);
                        elem = nextElem;
                    }
                }
            } while(nextElem = nextElem.nextSibling)
            return sibs;
        }

An example of filter function:

```js
function exampleFilter(elem) {
  switch (elem.nodeName.toUpperCase()) {
    case 'DIV':
      return true;
    case 'SPAN':
      return true;
    default:
      return false;
  }
}
```

- [1.6](#1.6) <a name='1.6'></a> Closest

  Return the first matched element by provided selector, traversing from current element up through its ancestors in the DOM tree.

  ```js
  // jQuery
  $el.closest(selector);

  // Native - Only latest, NO IE
  el.closest(selector);

  // Native - IE10+
  function closest(el, selector) {
    const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;

    while (el) {
      if (matchesSelector.call(el, selector)) {
        return el;
      } else {
        el = el.parentElement;
      }
    }
    return null;
  }
  ```

- [1.7](#1.7) <a name='1.7'></a> Parents Until

  Get the ancestors of each element in the current set of matched elements, up to but not including the element matched by the selector, DOM node, or jQuery object.

  ```js
  // jQuery
  $el.parentsUntil(selector, filter);

  // Native
  function parentsUntil(el, selector, filter) {
    const result = [];
    const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;

    // match start from parent
    el = el.parentElement;
    while (el && !matchesSelector.call(el, selector)) {
      if (!filter) {
        result.push(el);
      } else {
        if (matchesSelector.call(el, filter)) {
          result.push(el);
        }
      }
      el = el.parentElement;
    }
    return result;
  }
  ```

- [1.8](#1.8) <a name='1.8'></a> Form

  + Input/Textarea

    ```js
    // jQuery
    $('#my-input').val();

    // Native
    document.querySelector('#my-input').value;
    ```

  + Get index of e.currentTarget between `.radio`

    ```js
    // jQuery
    $('.radio').index(e.currentTarget);

    // Native
    Array.from(document.querySelectorAll('.radio')).indexOf(e.currentTarget);
    or
    Array.prototype.indexOf.call(document.querySelectorAll('.radio'), e.currentTarget);
    ```

- [1.9](#1.9) <a name='1.9'></a> Iframe Contents

  `$('iframe').contents()` returns `contentDocument` for this specific iframe

  + Iframe contents

    ```js
    // jQuery
    $iframe.contents();

    // Native
    iframe.contentDocument;
    ```

  + Iframe Query

    ```js
    // jQuery
    $iframe.contents().find('.css');

    // Native
    iframe.contentDocument.querySelectorAll('.css');
    ```

- [1.10](#1.10) <a name='1.10'></a> Get body

  ```js
  // jQuery
  $('body');

  // Native
  document.body;
  ```

- [1.11](#1.11) <a name='1.11'></a> Attribute getter and setter

  + Get an attribute

    ```js
    // jQuery
    $el.attr('foo');

    // Native
    el.getAttribute('foo');
    ```
  + Set an attribute

    ```js
    // jQuery
    $el.attr('foo', 'bar');

    // Native
    el.setAttribute('foo', 'bar');
    ```

  + Get a `data-` attribute

    ```js
    // jQuery
    $el.data('foo');

    // Native (use `getAttribute`)
    el.getAttribute('data-foo');

    // Native (use `dataset` if only need to support IE 11+)
    el.dataset['foo'];
    ```

- [1.12](#1.12) <a name='1.12'></a> Selector containing string (case-sensitive)

    ```js
    // jQuery
    $("selector:contains('text')");

    // Native
    function contains(selector, text) {
      var elements = document.querySelectorAll(selector);
      return Array.from(elements).filter(function(element) {
        return RegExp(text).test(element.textContent);
      });
    }
    ```

**[⬆ back to top](#table-of-contents)**

## CSS & Style

- [2.1](#2.1) <a name='2.1'></a> CSS

  + Get style

    ```js
    // jQuery
    $el.css('color');

    // Native
    // NOTE: Known bug, will return 'auto' if style value is 'auto'
    const win = el.ownerDocument.defaultView;

    // null means not to return pseudo styles
    win.getComputedStyle(el, null).color;
    ```

  + Set style

    ```js
    // jQuery
    $el.css({ color: '#f01' });

    // Native
    el.style.color = '#f01';
    ```

  + Get/Set Styles

    Note that if you want to set multiple styles once, you could refer to [setStyles](https://github.com/oneuijs/oui-dom-utils/blob/master/src/index.js#L194) method in oui-dom-utils package.


  + Add class

    ```js
    // jQuery
    $el.addClass(className);

    // Native
    el.classList.add(className);
    ```

  + Remove class

    ```js
    // jQuery
    $el.removeClass(className);

    // Native
    el.classList.remove(className);
    ```

  + has class

    ```js
    // jQuery
    $el.hasClass(className);

    // Native
    el.classList.contains(className);
    ```

  + Toggle class

    ```js
    // jQuery
    $el.toggleClass(className);

    // Native
    el.classList.toggle(className);
    ```

- [2.2](#2.2) <a name='2.2'></a> Width & Height

  Width and Height are theoretically identical, take Height as example:

  + Window height

    ```js
    // window height
    $(window).height();

    // with scrollbar
    window.document.documentElement.clientHeight;

    // without scrollbar, behaves like jQuery
    window.innerHeight;
    ```

  + Document height

    ```js
    // jQuery
    $(document).height();

    // Native
    const body = document.body;
    const html = document.documentElement;
    const height = Math.max(
      body.offsetHeight,
      body.scrollHeight,
      html.clientHeight,
      html.offsetHeight,
      html.scrollHeight
    );
    ```

  + Element height

    ```js
    // jQuery
    $el.height();

    // Native
    function getHeight(el) {
      const styles = window.getComputedStyle(el);
      const height = el.offsetHeight;
      const borderTopWidth = parseFloat(styles.borderTopWidth);
      const borderBottomWidth = parseFloat(styles.borderBottomWidth);
      const paddingTop = parseFloat(styles.paddingTop);
      const paddingBottom = parseFloat(styles.paddingBottom);
      return height - borderBottomWidth - borderTopWidth - paddingTop - paddingBottom;
    }

    // accurate to integer（when `border-box`, it's `height - border`; when `content-box`, it's `height + padding`）
    el.clientHeight;

    // accurate to decimal（when `border-box`, it's `height`; when `content-box`, it's `height + padding + border`）
    el.getBoundingClientRect().height;
    ```

- [2.3](#2.3) <a name='2.3'></a> Position & Offset

  + Position

    Get the current coordinates of the element relative to the offset parent.

    ```js
    // jQuery
    $el.position();

    // Native
    { left: el.offsetLeft, top: el.offsetTop }
    ```

  + Offset

    Get the current coordinates of the element relative to the document.

    ```js
    // jQuery
    $el.offset();

    // Native
    function getOffset (el) {
      const box = el.getBoundingClientRect();

      return {
        top: box.top + window.pageYOffset - document.documentElement.clientTop,
        left: box.left + window.pageXOffset - document.documentElement.clientLeft
      };
    }
    ```

- [2.4](#2.4) <a name='2.4'></a> Scroll Top

  Get the current vertical position of the scroll bar for the element.

  ```js
  // jQuery
  $(window).scrollTop();

  // Native
  (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
  ```

**[⬆ back to top](#table-of-contents)**

## DOM Manipulation

- [3.1](#3.1) <a name='3.1'></a> Remove

  Remove the element from the DOM.

  ```js
  // jQuery
  $el.remove();

  // Native
  el.parentNode.removeChild(el);
  ```

- [3.2](#3.2) <a name='3.2'></a> Text

  + Get text

    Get the combined text contents of the element including their descendants,

    ```js
    // jQuery
    $el.text();

    // Native
    el.textContent;
    ```

  + Set text

    Set the content of the element to the specified text.

    ```js
    // jQuery
    $el.text(string);

    // Native
    el.textContent = string;
    ```

- [3.3](#3.3) <a name='3.3'></a> HTML

  + Get HTML

    ```js
    // jQuery
    $el.html();

    // Native
    el.innerHTML;
    ```

  + Set HTML

    ```js
    // jQuery
    $el.html(htmlString);

    // Native
    el.innerHTML = htmlString;
    ```

- [3.4](#3.4) <a name='3.4'></a> Append

  Append child element after the last child of parent element

  ```js
  // jQuery: unified syntax for DOMString and Node objects
  $parent.append(newEl | '<div id="container">Hello World</div>');

  // Native: different syntax
  parent.insertAdjacentHTML('beforeend', '<div id="container">Hello World</div>');
  parent.appendChild(newEl);

  // Native (ES6-way): unified syntax
  parent.append(newEl | '<div id="container">Hello World</div>');
  ```

- [3.5](#3.5) <a name='3.5'></a> Prepend

  ```js
  // jQuery: unified syntax for DOMString and Node objects
  $parent.prepend(newEl | '<div id="container">Hello World</div>');

  // Native: different syntax
  parent.insertAdjacentHTML('afterbegin', '<div id="container">Hello World</div>');
  parent.insertBefore(newEl, parent.firstChild);
  
  // Native (ES6-way): unified syntax
  parent.prepend(newEl | '<div id="container">Hello World</div>');
  ```

- [3.6](#3.6) <a name='3.6'></a> insertBefore

  Insert a new node before the selected elements

  ```js
  // jQuery
  $newEl.insertBefore(selector);

  // Native (HTML string)
  el.insertAdjacentHTML('beforebegin ', '<div id="container">Hello World</div>');

  // Native (Element)
  const el = document.querySelector(selector);
  if (el.parentNode) {
    el.parentNode.insertBefore(newEl, el);
  }
  ```

- [3.7](#3.7) <a name='3.7'></a> insertAfter

  Insert a new node after the selected elements

  ```js
  // jQuery
  $newEl.insertAfter(selector);

  // Native (HTML string)
  el.insertAdjacentHTML('afterend', '<div id="container">Hello World</div>');

  // Native (Element)
  const el = document.querySelector(selector);
  if (el.parentNode) {
    el.parentNode.insertBefore(newEl, el.nextSibling);
  }
  ```

- [3.8](#3.8) <a name='3.8'></a> is

  Return `true` if it matches the query selector

  ```js
  // jQuery - Notice `is` also works with a function, an existing jQuery object or a DOM element, which are not of concern here
  $el.is(selector);

  // Native
  el.matches(selector);
  ```
- [3.9](#3.9) <a name='3.9'></a> clone

  Create a deep copy of an element: it copies the matched element as well as all of its descendant elements and text nodes.

  ```js
  // jQuery. Sets parameter as `true` to indicate that event handlers should be copied along with the element.
  $el.clone();

  // Native
  el.cloneNode();

  ```

- [3.10](#3.10) <a name='3.10'></a> empty

  Remove all child nodes

  ```js
  // jQuery
  $el.empty();

  // Native
  el.innerHTML = null;
  ```

- [3.11](#3.11) <a name='3.11'></a> wrap

  Wrap an HTML structure around each element

  ```js
  // jQuery
  $('.inner').wrap('<div class="wrapper"></div>');

  // Native
  Array.from(document.querySelectorAll('.inner')).forEach((el) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper';
    el.parentNode.insertBefore(wrapper, el);
    el.parentNode.removeChild(el);
    wrapper.appendChild(el);
  });
  ```

- [3.12](#3.12) <a name='3.12'></a> unwrap

  Remove the parents of the set of matched elements from the DOM

  ```js
  // jQuery
  $('.inner').unwrap();

  // Native
  Array.from(document.querySelectorAll('.inner')).forEach((el) => {
    let elParentNode = el.parentNode;

    if(elParentNode !== document.body) {
        elParentNode.parentNode.insertBefore(el, elParentNode);
        elParentNode.parentNode.removeChild(elParentNode);
    }
  });
  ```

- [3.13](#3.13) <a name='3.13'></a> replaceWith

  Replace each element in the set of matched elements with the provided new content

  ```js
  // jQuery
  $('.inner').replaceWith('<div class="outer"></div>');

  // Native (alternative) - latest, Edge17+
  Array.from(document.querySelectorAll('.inner')).forEach((el) => {
    const outer = document.createElement('div');
    outer.className = 'outer';
    el.replaceWith(outer);
  });

  // Native
  Array.from(document.querySelectorAll('.inner')).forEach((el) => {
    const outer = document.createElement('div');
    outer.className = 'outer';
    el.parentNode.replaceChild(outer, el);
  });
  ```

- [3.14](#3.14) <a name='3.14'></a> simple parse

  Parse a string into HTML/SVG/XML

  ```js
  // jQuery
  $(`<ol>
    <li>a</li>
    <li>b</li>
  </ol>
  <ol>
    <li>c</li>
    <li>d</li>
  </ol>`);

  // Native
  range = document.createRange();
  parse = range.createContextualFragment.bind(range);

  parse(`<ol>
    <li>a</li>
    <li>b</li>
  </ol>
  <ol>
    <li>c</li>
    <li>d</li>
  </ol>`);
  ```


**[⬆ back to top](#table-of-contents)**

## Ajax

[Fetch API](https://fetch.spec.whatwg.org/) is the new standard to replace XMLHttpRequest to do ajax. It works on Chrome and Firefox, you can use polyfills to make it work on legacy browsers.

Try [github/fetch](http://github.com/github/fetch) on IE9+ or [fetch-ie8](https://github.com/camsong/fetch-ie8/) on IE8+, [fetch-jsonp](https://github.com/camsong/fetch-jsonp) to make JSONP requests.

- [4.1](#4.1) <a name='4.1'></a> Load data from the server and place the returned HTML into the matched element.

  ```js
  // jQuery
  $(selector).load(url, completeCallback)

  // Native
  fetch(url).then(data => data.text()).then(data => {
    document.querySelector(selector).innerHTML = data
  }).then(completeCallback)
  ```

**[⬆ back to top](#table-of-contents)**

## Events

For a complete replacement with namespace and delegation, refer to https://github.com/oneuijs/oui-dom-events

- [5.0](#5.0) <a name='5.0'></a> Document ready by `DOMContentLoaded`

  ```js
  // jQuery
  $(document).ready(eventHandler);

  // Native
  // Check if the DOMContentLoaded has already been completed
  if (document.readyState !== 'loading') {
    eventHandler();
  } else {
    document.addEventListener('DOMContentLoaded', eventHandler);
  }
  ```

- [5.1](#5.1) <a name='5.1'></a> Bind an event with on

  ```js
  // jQuery
  $el.on(eventName, eventHandler);

  // Native
  el.addEventListener(eventName, eventHandler);
  ```

- [5.2](#5.2) <a name='5.2'></a> Unbind an event with off

  ```js
  // jQuery
  $el.off(eventName, eventHandler);

  // Native
  el.removeEventListener(eventName, eventHandler);
  ```

- [5.3](#5.3) <a name='5.3'></a> Trigger

  ```js
  // jQuery
  $(el).trigger('custom-event', {key1: 'data'});

  // Native
  if (window.CustomEvent) {
    const event = new CustomEvent('custom-event', {detail: {key1: 'data'}});
  } else {
    const event = document.createEvent('CustomEvent');
    event.initCustomEvent('custom-event', true, true, {key1: 'data'});
  }

  el.dispatchEvent(event);
  ```

**[⬆ back to top](#table-of-contents)**

## Utilities

Most of jQuery utilities are also found in the native API. Other advanced functions could be chosen from better utilities libraries, focusing on consistency and performance. [Lodash](https://lodash.com) is a recommended replacement.

- [6.1](#6.1) <a name='6.1'></a> Basic utilities

  + isArray

  Determine whether the argument is an array.

  ```js
  // jQuery
  $.isArray(array);

  // Native
  Array.isArray(array);
  ```

  + isWindow

  Determine whether the argument is a window.

  ```js
  // jQuery
  $.isWindow(obj);

  // Native
  function isWindow(obj) {
    return obj !== null && obj !== undefined && obj === obj.window;
  }
  ```

  + inArray

  Search for a specified value within an array and return its index (or -1 if not found).

  ```js
  // jQuery
  $.inArray(item, array);

  // Native
  array.indexOf(item) > -1;

  // ES6-way
  array.includes(item);
  ```

  + isNumeric

  Determine if the argument passed is numerical.
  Use `typeof` to decide the type or the `type` example for better accuracy.

  ```js
  // jQuery
  $.isNumeric(item);

  // Native
  function isNumeric(value) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  ```

  + isFunction

  Determine if the argument passed is a JavaScript function object.

  ```js
  // jQuery
  $.isFunction(item);

  // Native
  function isFunction(item) {
    if (typeof item === 'function') {
      return true;
    }
    var type = Object.prototype.toString.call(item);
    return type === '[object Function]' || type === '[object GeneratorFunction]';
  }
  ```

  + isEmptyObject

  Check to see if an object is empty (contains no enumerable properties).

  ```js
  // jQuery
  $.isEmptyObject(obj);

  // Native
  function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
  }
  ```

  + isPlainObject

  Check to see if an object is a plain object (created using “{}” or “new Object”).

  ```js
  // jQuery
  $.isPlainObject(obj);

  // Native
  function isPlainObject(obj) {
    if (typeof (obj) !== 'object' || obj.nodeType || obj !== null && obj !== undefined && obj === obj.window) {
      return false;
    }

    if (obj.constructor &&
        !Object.prototype.hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf')) {
      return false;
    }

    return true;
  }
  ```

  + extend

  Merge the contents of two or more objects together into a new object, without modifying either argument.
  object.assign is part of ES6 API, and you could also use a [polyfill](https://github.com/ljharb/object.assign).

  ```js
  // jQuery
  $.extend({}, object1, object2);

  // Native
  Object.assign({}, object1, object2);
  ```

  + trim

  Remove the white-space from the beginning and end of a string.

  ```js
  // jQuery
  $.trim(string);

  // Native
  string.trim();
  ```

  + map

  Translate all items in an array or object to new array of items.

  ```js
  // jQuery
  $.map(array, (value, index) => {
  });

  // Native
  array.map((value, index) => {
  });
  ```

  + each

  A generic iterator function, which can be used to seamlessly iterate over both objects and arrays.

  ```js
  // jQuery
  $.each(array, (index, value) => {
  });

  // Native
  array.forEach((value, index) => {
  });
  ```

  + grep

  Finds the elements of an array which satisfy a filter function.

  ```js
  // jQuery
  $.grep(array, (value, index) => {
  });

  // Native
  array.filter((value, index) => {
  });
  ```

  + type

  Determine the internal JavaScript [Class] of an object.

  ```js
  // jQuery
  $.type(obj);

  // Native
  function type(item) {
    const reTypeOf = /(?:^\[object\s(.*?)\]$)/;
    return Object.prototype.toString.call(item)
      .replace(reTypeOf, '$1')
      .toLowerCase();
  }
  ```

  + merge

  Merge the contents of two arrays together into the first array.

  ```js
  // jQuery, doesn't remove duplicate items
  $.merge(array1, array2);

  // Native, doesn't remove duplicate items
  function merge(...args) {
    return [].concat(...args)
  }

  // ES6-way, doesn't remove duplicate items
  array1 = [...array1, ...array2]

  // Set version, does remove duplicate items
  function merge(...args) {
    return Array.from(new Set([].concat(...args)))
  }
  ```

  + now

  Return a number representing the current time.

  ```js
  // jQuery
  $.now();

  // Native
  Date.now();
  ```

  + proxy

  Takes a function and returns a new one that will always have a particular context.

  ```js
  // jQuery
  $.proxy(fn, context);

  // Native
  fn.bind(context);
  ```

  <a name="makeArray"></a>+ makeArray

  Convert an array-like object into a true JavaScript array.

  ```js
  // jQuery
  $.makeArray(arrayLike);

  // Native
  Array.prototype.slice.call(arrayLike);

  // ES6-way: Array.from() method
  Array.from(arrayLike);

  // ES6-way: spread operator
  [...arrayLike];
  ```

- [6.2](#6.2) <a name='6.2'></a> Contains

  Check to see if a DOM element is a descendant of another DOM element.

  ```js
  // jQuery
  $.contains(el, child);

  // Native
  el !== child && el.contains(child);
  ```

- [6.3](#6.3) <a name='6.3'></a> Globaleval

  Execute some JavaScript code globally.

  ```js
  // jQuery
  $.globaleval(code);

  // Native
  function Globaleval(code) {
    const script = document.createElement('script');
    script.text = code;

    document.head.appendChild(script).parentNode.removeChild(script);
  }

  // Use eval, but context of eval is current, context of $.Globaleval is global.
  eval(code);
  ```

- [6.4](#6.4) <a name='6.4'></a> parse

  + parseHTML

  Parses a string into an array of DOM nodes.

  ```js
  // jQuery
  $.parseHTML(htmlString);

  // Native
  function parseHTML(string) {
    const context = document.implementation.createHTMLDocument();

    // Set the base href for the created document so any parsed elements with URLs
    // are based on the document's URL
    const base = context.createElement('base');
    base.href = document.location.href;
    context.head.appendChild(base);

    context.body.innerHTML = string;
    return context.body.children;
  }
  ```
- [6.5](#6.4) <a name='6.5'></a> exists

+ exists

  Check if an element exists in the DOM 
  
  ```js
  // jQuery
  if ($('selector').length) {
     // exists
  }

  // Native
  var element =  document.getElementById('elementId');
  if (typeof(element) != 'undefined' && element != null) 
  {
     // exists
  }
  ```

**[⬆ back to top](#table-of-contents)**

## Promises

A promise represents the eventual result of an asynchronous operation. jQuery has its own way to handle promises. Native JavaScript implements a thin and minimal API to handle promises according to the [Promises/A+](http://promises-aplus.github.io/promises-spec/) specification.

- [7.1](#7.1) <a name='7.1'></a> done, fail, always

  `done` is called when promise is resolved, `fail` is called when promise is rejected, `always` is called when promise is either resolved or rejected.

  ```js
  // jQuery
  $promise.done(doneCallback).fail(failCallback).always(alwaysCallback)

  // Native
  promise.then(doneCallback, failCallback).then(alwaysCallback, alwaysCallback)
  ```

- [7.2](#7.2) <a name='7.2'></a> when

  `when` is used to handle multiple promises. It will resolve when all promises are resolved, and reject if either one is rejected.

  ```js
  // jQuery
  $.when($promise1, $promise2).done((promise1Result, promise2Result) => {
  });

  // Native
  Promise.all([$promise1, $promise2]).then([promise1Result, promise2Result] => {});
  ```

- [7.3](#7.3) <a name='7.3'></a> Deferred

  Deferred is a way to create promises.

  ```js
  // jQuery
  function asyncFunc() {
    const defer = new $.Deferred();
    setTimeout(() => {
      if(true) {
        defer.resolve('some_value_computed_asynchronously');
      } else {
        defer.reject('failed');
      }
    }, 1000);

    return defer.promise();
  }

  // Native
  function asyncFunc() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (true) {
          resolve('some_value_computed_asynchronously');
        } else {
          reject('failed');
        }
      }, 1000);
    });
  }

  // Deferred way
  function defer() {
    const deferred = {};
    const promise = new Promise((resolve, reject) => {
      deferred.resolve = resolve;
      deferred.reject = reject;
    });

    deferred.promise = () => {
      return promise;
    };

    return deferred;
  }

  function asyncFunc() {
    const defer = defer();
    setTimeout(() => {
      if(true) {
        defer.resolve('some_value_computed_asynchronously');
      } else {
        defer.reject('failed');
      }
    }, 1000);

    return defer.promise();
  }
  ```

**[⬆ back to top](#table-of-contents)**

## Animation

- [8.1](#8.1) <a name='8.1'></a> Show & Hide

  ```js
  // jQuery
  $el.show();
  $el.hide();

  // Native
  // More detail about show method, please refer to https://github.com/oneuijs/oui-dom-utils/blob/master/src/index.js#L363
  el.style.display = ''|'inline'|'inline-block'|'inline-table'|'block';
  el.style.display = 'none';
  ```

- [8.2](#8.2) <a name='8.2'></a> Toggle

  Display or hide the element.

  ```js
  // jQuery
  $el.toggle();

  // Native
  if (el.ownerDocument.defaultView.getComputedStyle(el, null).display === 'none') {
    el.style.display = ''|'inline'|'inline-block'|'inline-table'|'block';
  } else {
    el.style.display = 'none';
  }
  ```

- [8.3](#8.3) <a name='8.3'></a> FadeIn & FadeOut

  ```js
  // jQuery
  $el.fadeIn(3000);
  $el.fadeOut(3000);

  // Native fadeOut
  function fadeOut(el, ms) {
    if (ms) {
      el.style.transition = `opacity ${ms} ms`;
      el.addEventListener(
        'transitionend',
        function(event) {
          el.style.display = 'none';
        },
        false
      );
    }
    el.style.opacity = '0';
  }

  // Native fadeIn
  function fadeIn(elem, ms) {
    elem.style.opacity = 0;

    if (ms) {
      let opacity = 0;
      const timer = setInterval(function() {
        opacity += 50 / ms;
        if (opacity >= 1) {
          clearInterval(timer);
          opacity = 1;
        }
        elem.style.opacity = opacity;
      }, 50);
    } else {
      elem.style.opacity = 1;
    }
  }
  ```

- [8.4](#8.4) <a name='8.4'></a> FadeTo

  Adjust the opacity of the element.

  ```js
  // jQuery
  $el.fadeTo('slow',0.15);
  // Native
  el.style.transition = 'opacity 3s'; // assume 'slow' equals 3 seconds
  el.style.opacity = '0.15';
  ```

- [8.5](#8.5) <a name='8.5'></a> FadeToggle

  Display or hide the element by animating their opacity.

  ```js
  // jQuery
  $el.fadeToggle();

  // Native
  el.style.transition = 'opacity 3s';
  const { opacity } = el.ownerDocument.defaultView.getComputedStyle(el, null);
  if (opacity === '1') {
    el.style.opacity = '0';
  } else {
    el.style.opacity = '1';
  }
  ```

- [8.6](#8.6) <a name='8.6'></a> SlideUp & SlideDown

  ```js
  // jQuery
  $el.slideUp();
  $el.slideDown();

  // Native
  const originHeight = '100px';
  el.style.transition = 'height 3s';
  // slideUp
  el.style.height = '0px';
  // slideDown
  el.style.height = originHeight;
  ```

- [8.7](#8.7) <a name='8.7'></a> SlideToggle

  Display or hide the element with a sliding motion.

  ```js
  // jQuery
  $el.slideToggle();

  // Native
  const originHeight = '100px';
  el.style.transition = 'height 3s';
  const { height } = el.ownerDocument.defaultView.getComputedStyle(el, null);
  if (parseInt(height, 10) === 0) {
    el.style.height = originHeight;
  } else {
   el.style.height = '0px';
  }
  ```

- [8.8](#8.8) <a name='8.8'></a> Animate

  Perform a custom animation of a set of CSS properties.

  ```js
  // jQuery
  $el.animate({ params }, speed);

  // Native
  el.style.transition = 'all ' + speed;
  Object.keys(params).forEach((key) =>
    el.style[key] = params[key];
  )
  ```

## Alternatives

* [You Might Not Need jQuery](http://youmightnotneedjquery.com/) - Examples of how to do common event, element, ajax etc with plain javascript.
* [npm-dom](http://github.com/npm-dom) and [webmodules](http://github.com/webmodules) - Organizations you can find individual DOM modules on NPM

## Browser Support

![Chrome][chrome-image] | ![Firefox][firefox-image] | ![IE][ie-image] | ![Opera][opera-image] | ![Safari][safari-image]
--- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | 10+ ✔ | Latest ✔ | 6.1+ ✔ |

# License

MIT

[chrome-image]: https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png
[firefox-image]: https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png
[ie-image]: https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png
[opera-image]: https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png
[safari-image]: https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png
