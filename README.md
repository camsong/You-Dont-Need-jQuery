## You (Might) Don't Need jQuery

Frontend environments evolve rapidly nowadays and modern browsers have already implemented a great deal of DOM/BOM APIs which are good enough for production use. We don't have to learn jQuery from scratch for DOM manipulation or event handling. In the meantime, thanks to the spread of frontend libraries such as React, Angular and Vue, manipulating the DOM directly becomes anti-pattern, so that jQuery usage has never been less important. This project summarizes most of the alternatives in native JavaScript implementation to jQuery methods.

Snippets target current evergreen browsers (Chrome, Edge, Firefox, Safari). Internet Explorer is no longer supported by Microsoft, so IE-specific fallbacks have been removed. If you still need them, see the [last IE-compatible version](https://github.com/camsong/You-Dont-Need-jQuery/tree/c4e00b3).

ℹ️ Notice: 
1. jQuery is still a great library and has many valid use cases. Don’t migrate away if you don’t want to!
2. The alternatives are not completely equivalent in all scenarios, and it is recommended that you test it before using it.

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
* `document.querySelectorAll` returns all matched elements as a static NodeList. It supports `forEach`, and can be converted to Array using `Array.from(document.querySelectorAll(selector))` or any of the methods outlined in [makeArray](#makeArray)
* If there are no elements matched, jQuery returns an empty jQuery object and `document.querySelectorAll` returns an empty NodeList, whereas `document.querySelector` returns `null`.

> Notice: `document.getElementById`, `document.getElementsByClassName` and `document.getElementsByTagName` are slightly faster than `querySelector*`, but `getElementsBy*` return a *live* HTMLCollection that changes as the DOM changes. Prefer `querySelector*` unless you have measured a bottleneck.

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

    // Native
    [...el.parentNode.children].filter((child) =>
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
      const sibs = [];
      while ((elem = elem.previousElementSibling)) {
        if (!filter || filter(elem)) sibs.push(elem);
      }
      return sibs;
    }
    ```

  + All next siblings

    ```js
    // jQuery (optional selector filter)
    $el.nextAll($filter);

    // Native (optional filter function)
    function getNextSiblings(elem, filter) {
      const sibs = [];
      while ((elem = elem.nextElementSibling)) {
        if (!filter || filter(elem)) sibs.push(elem);
      }
      return sibs;
    }
    ```

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

  // Native
  el.closest(selector);
  ```

- [1.7](#1.7) <a name='1.7'></a> Parents Until

  Get the ancestors of each element in the current set of matched elements, up to but not including the element matched by the selector, DOM node, or jQuery object.

  ```js
  // jQuery
  $el.parentsUntil(selector, filter);

  // Native
  function parentsUntil(el, selector, filter) {
    const result = [];

    // match start from parent
    el = el.parentElement;
    while (el && !el.matches(selector)) {
      if (!filter || el.matches(filter)) {
        result.push(el);
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
    [...document.querySelectorAll('.radio')].indexOf(e.currentTarget);
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

    // Native
    el.dataset.foo;

    // or
    el.getAttribute('data-foo');
    ```

- [1.12](#1.12) <a name='1.12'></a> Selector containing string (case-sensitive)

    ```js
    // jQuery
    $("selector:contains('text')");

    // Native
    function contains(selector, text) {
      const elements = document.querySelectorAll(selector);
      return Array.from(elements).filter((element) =>
        element.textContent.includes(text)
      );
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
    // NOTE: returns the resolved value, e.g. 'rgb(255, 0, 17)' rather than '#f01'
    getComputedStyle(el).color;
    ```

  + Set style

    ```js
    // jQuery
    $el.css({ color: '#f01' });

    // Native
    el.style.color = '#f01';
    ```

  + Set multiple styles

    ```js
    // jQuery
    $el.css({ color: '#f01', 'border-color': '#f02' });

    // Native
    Object.assign(el.style, { color: '#f01', borderColor: '#f02' });
    ```

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
    // jQuery
    $(window).height();

    // without scrollbar, behaves like jQuery
    window.document.documentElement.clientHeight;

    // with scrollbar
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

    // accurate to integer (when `border-box`, it's `height - border`; when `content-box`, it's `height + padding`)
    el.clientHeight;

    // accurate to decimal (when `border-box`, it's `height`; when `content-box`, it's `height + padding + border`)
    el.getBoundingClientRect().height;
    ```

- [2.3](#2.3) <a name='2.3'></a> Position & Offset

  + Position

    Get the current coordinates of the element relative to the offset parent.

    ```js
    // jQuery
    $el.position();

    // Native
    const position = { left: el.offsetLeft, top: el.offsetTop };
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
        top: box.top + window.scrollY,
        left: box.left + window.scrollX
      };
    }
    ```

- [2.4](#2.4) <a name='2.4'></a> Scroll Top

  Get the current vertical position of the scroll bar for the element.

  ```js
  // jQuery
  $(window).scrollTop();

  // Native
  window.scrollY;
  ```

**[⬆ back to top](#table-of-contents)**

## DOM Manipulation

- [3.1](#3.1) <a name='3.1'></a> Remove

  Remove the element from the DOM.

  ```js
  // jQuery
  $el.remove();

  // Native
  el.remove();
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

  // Native (Element or text): strings are inserted as plain text, not parsed as HTML
  parent.append(newEl | 'Hello World');

  // Native (HTML string)
  parent.insertAdjacentHTML('beforeend', '<div id="container">Hello World</div>');
  ```

- [3.5](#3.5) <a name='3.5'></a> Prepend

  ```js
  // jQuery: unified syntax for DOMString and Node objects
  $parent.prepend(newEl | '<div id="container">Hello World</div>');

  // Native (Element or text): strings are inserted as plain text, not parsed as HTML
  parent.prepend(newEl | 'Hello World');

  // Native (HTML string)
  parent.insertAdjacentHTML('afterbegin', '<div id="container">Hello World</div>');
  ```

- [3.6](#3.6) <a name='3.6'></a> insertBefore

  Insert a new node before the selected elements

  ```js
  // jQuery
  $newEl.insertBefore(selector);

  const el = document.querySelector(selector);

  // Native (Element)
  el.before(newEl);

  // Native (HTML string)
  el.insertAdjacentHTML('beforebegin', '<div id="container">Hello World</div>');
  ```

- [3.7](#3.7) <a name='3.7'></a> insertAfter

  Insert a new node after the selected elements

  ```js
  // jQuery
  $newEl.insertAfter(selector);

  const el = document.querySelector(selector);

  // Native (Element)
  el.after(newEl);

  // Native (HTML string)
  el.insertAdjacentHTML('afterend', '<div id="container">Hello World</div>');
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
  // jQuery. Pass `true` to also copy event handlers and data.
  $el.clone();

  // Native. Pass `true` for a deep copy; event listeners are never copied.
  el.cloneNode(true);
  ```

- [3.10](#3.10) <a name='3.10'></a> empty

  Remove all child nodes

  ```js
  // jQuery
  $el.empty();

  // Native
  el.replaceChildren();
  ```

- [3.11](#3.11) <a name='3.11'></a> wrap

  Wrap an HTML structure around each element

  ```js
  // jQuery
  $('.inner').wrap('<div class="wrapper"></div>');

  // Native
  document.querySelectorAll('.inner').forEach((el) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper';
    el.before(wrapper);
    wrapper.append(el);
  });
  ```

- [3.12](#3.12) <a name='3.12'></a> unwrap

  Remove the parents of the set of matched elements from the DOM

  ```js
  // jQuery
  $('.inner').unwrap();

  // Native
  new Set([...document.querySelectorAll('.inner')].map((el) => el.parentElement))
    .forEach((parent) => {
      if (parent !== document.body) {
        parent.replaceWith(...parent.childNodes);
      }
    });
  ```

- [3.13](#3.13) <a name='3.13'></a> replaceWith

  Replace each element in the set of matched elements with the provided new content

  ```js
  // jQuery
  $('.inner').replaceWith('<div class="outer"></div>');

  // Native
  document.querySelectorAll('.inner').forEach((el) => {
    const outer = document.createElement('div');
    outer.className = 'outer';
    el.replaceWith(outer);
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
  function parse(html) {
    const template = document.createElement('template');
    template.innerHTML = html;
    return template.content;
  }

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

[Fetch API](https://fetch.spec.whatwg.org/) is the standard replacement for XMLHttpRequest and works in all modern browsers. Unlike `$.ajax`, `fetch` does **not** reject on HTTP error status such as 404 or 500; check `response.ok` yourself. For JSONP, try [fetch-jsonp](https://github.com/camsong/fetch-jsonp).

- [4.0](#4.0) <a name='4.0'></a> Request JSON

  ```js
  // jQuery
  $.getJSON(url).done(handleData).fail(handleError);

  // Native
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    })
    .then(handleData)
    .catch(handleError);
  ```

- [4.0.1](#4.0.1) <a name='4.0.1'></a> Post JSON

  ```js
  // jQuery
  $.ajax({
    url,
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(data),
  });

  // Native
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  ```

- [4.0.2](#4.0.2) <a name='4.0.2'></a> Abort and timeout

  ```js
  // jQuery
  const jqXHR = $.ajax({ url, timeout: 5000 });
  jqXHR.abort();

  // Native
  const controller = new AbortController();
  fetch(url, { signal: controller.signal });
  controller.abort();

  // Native (timeout)
  fetch(url, { signal: AbortSignal.timeout(5000) });
  ```

- [4.1](#4.1) <a name='4.1'></a> Load data from the server and place the returned HTML into the matched element.

  ```js
  // jQuery
  $(selector).load(url, completeCallback)

  // Native
  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      document.querySelector(selector).innerHTML = html;
    })
    .then(completeCallback);
  ```

**[⬆ back to top](#table-of-contents)**

## Events


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

  // Or load your script with `<script defer>` or `<script type="module">`,
  // which runs after the document has been parsed.
  ```

- [5.1](#5.1) <a name='5.1'></a> Bind an event with on

  ```js
  // jQuery
  $el.on(eventName, eventHandler);

  // Native
  el.addEventListener(eventName, eventHandler);
  ```

- [5.1.1](#5.1.1) <a name='5.1.1'></a> Bind an event once with one

  ```js
  // jQuery
  $el.one(eventName, eventHandler);

  // Native
  el.addEventListener(eventName, eventHandler, { once: true });
  ```

- [5.1.2](#5.1.2) <a name='5.1.2'></a> Event delegation

  ```js
  // jQuery
  $el.on(eventName, selector, eventHandler);

  // Native
  el.addEventListener(eventName, (event) => {
    const target = event.target.closest(selector);
    if (target && el.contains(target)) {
      eventHandler.call(target, event);
    }
  });
  ```

- [5.2](#5.2) <a name='5.2'></a> Unbind an event with off

  ```js
  // jQuery
  $el.off(eventName, eventHandler);

  // Native
  el.removeEventListener(eventName, eventHandler);

  // Native: remove several listeners at once, like jQuery namespaces
  const controller = new AbortController();
  el.addEventListener('click', onClick, { signal: controller.signal });
  el.addEventListener('keydown', onKeydown, { signal: controller.signal });
  controller.abort();
  ```

- [5.3](#5.3) <a name='5.3'></a> Trigger

  ```js
  // jQuery
  $(el).trigger('custom-event', {key1: 'data'});

  // Native. jQuery events bubble, native ones don't unless `bubbles: true`.
  // Read the data from `event.detail` in the handler.
  const event = new CustomEvent('custom-event', {
    bubbles: true,
    cancelable: true,
    detail: { key1: 'data' },
  });

  el.dispatchEvent(event);
  ```

**[⬆ back to top](#table-of-contents)**

## Utilities

Most of jQuery utilities are also found in the native API. Other advanced functions could be chosen from better utilities libraries, focusing on consistency and performance. [Lodash](https://lodash.com) and [es-toolkit](https://es-toolkit.dev) are recommended replacements.

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
    return obj != null && obj === obj.window;
  }
  ```

  + inArray

  Search for a specified value within an array and return its index (or -1 if not found).

  ```js
  // jQuery
  $.inArray(item, array);

  // Native
  array.indexOf(item);
  ```

  Test if a specified value is found within an array.

  ```js
  // jQuery
  $.inArray(item, array) > -1;

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
  function isNumeric(n) {
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
    if (Object.prototype.toString.call(obj) !== '[object Object]') {
      return false;
    }

    const proto = Object.getPrototypeOf(obj);
    return proto === null || proto === Object.prototype;
  }
  ```

  + extend

  Merge the contents of two or more objects together into a new object, without modifying either argument.
  Like `$.extend` without `deep`, `Object.assign` and spread only make a shallow copy.

  ```js
  // jQuery
  $.extend({}, object1, object2);

  // Native
  Object.assign({}, object1, object2);

  // Native (spread)
  ({ ...object1, ...object2 });
  ```

  Deep copy a single object:

  ```js
  // jQuery
  $.extend(true, {}, object);

  // Native. Functions and DOM nodes cannot be cloned
  structuredClone(object);
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
  // jQuery (return `false` to break)
  $.each(array, (index, value) => {
  });

  // Native (use `for...of` or `some` if you need to break early)
  array.forEach((value, index) => {
  });

  // Native, for objects
  Object.entries(obj).forEach(([key, value]) => {
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
  // jQuery, modifies array1, doesn't remove duplicate items
  $.merge(array1, array2);

  // Native, modifies array1, doesn't remove duplicate items
  array1.push(...array2);

  // Native, returns a new array, doesn't remove duplicate items
  function merge(...args) {
    return [].concat(...args);
  }

  // Set version, returns a new array, does remove duplicate items
  function merge(...args) {
    return Array.from(new Set([].concat(...args)));
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

- [6.3](#6.3) <a name='6.3'></a> globalEval

  Execute some JavaScript code globally.

  ```js
  // jQuery
  $.globalEval(code);

  // Native
  function globalEval(code) {
    const script = document.createElement('script');
    script.text = code;

    document.head.appendChild(script).parentNode.removeChild(script);
  }

  // Use eval, but context of eval is current, context of $.globalEval is global.
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
    return Array.from(context.body.childNodes);
  }
  ```

- [6.5](#6.5) <a name='6.5'></a> exists

  Check if an element exists in the DOM

  ```js
  // jQuery
  if ($('selector').length) {
    // exists
  }

  // Native
  if (document.querySelector('selector')) {
    // exists
  }
  ```

**[⬆ back to top](#table-of-contents)**

## Promises

A promise represents the eventual result of an asynchronous operation. jQuery has its own way to handle promises. Native JavaScript implements a thin and minimal API to handle promises according to the [Promises/A+](https://promisesaplus.com/) specification, and `async`/`await` makes them read like synchronous code.

- [7.1](#7.1) <a name='7.1'></a> done, fail, always

  `done` is called when promise is resolved, `fail` is called when promise is rejected, `always` is called when promise is either resolved or rejected.

  ```js
  // jQuery
  $promise.done(doneCallback).fail(failCallback).always(alwaysCallback)

  // Native
  promise.then(doneCallback, failCallback).finally(alwaysCallback);

  // Native (async/await)
  try {
    doneCallback(await promise);
  } catch (error) {
    failCallback(error);
  } finally {
    alwaysCallback();
  }
  ```

- [7.2](#7.2) <a name='7.2'></a> when

  `when` is used to handle multiple promises. It will resolve when all promises are resolved, and reject if either one is rejected.

  ```js
  // jQuery
  $.when($promise1, $promise2).done((promise1Result, promise2Result) => {
  });

  // Native
  Promise.all([promise1, promise2]).then(([promise1Result, promise2Result]) => {});

  // Native (async/await)
  const [promise1Result, promise2Result] = await Promise.all([promise1, promise2]);
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
  function asyncFunc() {
    const { promise, resolve, reject } = Promise.withResolvers();
    setTimeout(() => {
      if (true) {
        resolve('some_value_computed_asynchronously');
      } else {
        reject('failed');
      }
    }, 1000);

    return promise;
  }
  ```

**[⬆ back to top](#table-of-contents)**

## Animation

The [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) (`el.animate()`) is the closest native match to jQuery effects: it takes a duration in milliseconds, runs off the main thread where possible, and returns an `Animation` whose `finished` promise resolves when it ends.

- [8.1](#8.1) <a name='8.1'></a> Show & Hide

  ```js
  // jQuery
  $el.show();
  $el.hide();

  // Native
  el.style.display = ''; // or 'block', 'inline', ... if a stylesheet hides it
  el.style.display = 'none';

  // Native (if the element is not styled with `display` elsewhere)
  el.hidden = false;
  el.hidden = true;
  ```

- [8.2](#8.2) <a name='8.2'></a> Toggle

  Display or hide the element.

  ```js
  // jQuery
  $el.toggle();

  // Native
  if (getComputedStyle(el).display === 'none') {
    el.style.display = ''; // or 'block', 'inline', ...
  } else {
    el.style.display = 'none';
  }
  ```

- [8.3](#8.3) <a name='8.3'></a> FadeIn & FadeOut

  ```js
  // jQuery
  $el.fadeIn(3000);
  $el.fadeOut(3000);

  // Native fadeIn
  function fadeIn(el, ms = 400) {
    el.style.display = '';
    return el.animate([{ opacity: 0 }, { opacity: 1 }], ms).finished;
  }

  // Native fadeOut
  function fadeOut(el, ms = 400) {
    return el.animate([{ opacity: 1 }, { opacity: 0 }], ms).finished.then(() => {
      el.style.display = 'none';
    });
  }
  ```

- [8.4](#8.4) <a name='8.4'></a> FadeTo

  Adjust the opacity of the element.

  ```js
  // jQuery
  $el.fadeTo('slow',0.15);
  // Native ('slow' equals 600 milliseconds in jQuery)
  el.animate([{ opacity: 0.15 }], { duration: 600, fill: 'forwards' });
  ```

- [8.5](#8.5) <a name='8.5'></a> FadeToggle

  Display or hide the element by animating their opacity.

  ```js
  // jQuery
  $el.fadeToggle();

  // Native, using fadeIn and fadeOut from 8.3
  if (getComputedStyle(el).display === 'none') {
    fadeIn(el);
  } else {
    fadeOut(el);
  }
  ```

- [8.6](#8.6) <a name='8.6'></a> SlideUp & SlideDown

  ```js
  // jQuery
  $el.slideUp();
  $el.slideDown();

  // Native slideUp
  function slideUp(el, ms = 400) {
    el.style.overflow = 'hidden';
    return el.animate([{ height: `${el.offsetHeight}px` }, { height: '0px' }], ms).finished.then(() => {
      el.style.display = 'none';
      el.style.overflow = '';
    });
  }

  // Native slideDown
  function slideDown(el, ms = 400) {
    el.style.display = '';
    el.style.overflow = 'hidden';
    return el.animate([{ height: '0px' }, { height: `${el.scrollHeight}px` }], ms).finished.then(() => {
      el.style.overflow = '';
    });
  }
  ```

- [8.7](#8.7) <a name='8.7'></a> SlideToggle

  Display or hide the element with a sliding motion.

  ```js
  // jQuery
  $el.slideToggle();

  // Native, using slideUp and slideDown from 8.6
  if (getComputedStyle(el).display === 'none') {
    slideDown(el);
  } else {
    slideUp(el);
  }
  ```

- [8.8](#8.8) <a name='8.8'></a> Animate

  Perform a custom animation of a set of CSS properties.

  ```js
  // jQuery
  $el.animate({ params }, speed);

  // Native (speed in milliseconds)
  el.animate([params], { duration: speed, fill: 'forwards' });
  ```

## Alternatives

* [You Might Not Need jQuery](https://youmightnotneedjquery.com/) - Examples of how to do common event, element, ajax etc with plain javascript.
* [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) - Reference for every DOM API used here.
* [Baseline](https://web.dev/baseline) - Check which web platform features are safe to use across browsers.

## Browser Support

![Chrome][chrome-image] | ![Edge][edge-image] | ![Firefox][firefox-image] | ![Safari][safari-image] | ![Opera][opera-image]
--- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ |

A few snippets use newer APIs: `Promise.withResolvers()` (2024), `el.replaceChildren()` (2020) and `AbortSignal.timeout()` (2022). Check [Baseline](https://web.dev/baseline) if you support older browsers.

# License

MIT

[chrome-image]: https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png
[firefox-image]: https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png
[edge-image]: https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png
[opera-image]: https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png
[safari-image]: https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png
