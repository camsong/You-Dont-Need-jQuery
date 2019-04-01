## You Don't Need jQuery [![Build Status](https://travis-ci.org/oneuijs/You-Dont-Need-jQuery.svg)](https://travis-ci.org/oneuijs/You-Dont-Need-jQuery)

當今的前端環境發展迅速，現代瀏覽器已經提供了夠好用的 DOM/BOM API，我們不需要為了 DOM 操作或事件處理而從頭開始學 jQuery。同時，由於 React、Angular 和 Vue 等前端框架的普及，直接操作 DOM 變成了反模式，jQuery 的使用性大幅減少。本專案概述了大部份 Javascript 替代 jQuery 的方式，支援 IE 10 以上。

## 目錄

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

常見的 class、id、屬性等選擇器，我們可以使用 `document.querySelector` 或 `document.querySelectorAll` 替代。差別是
* `document.querySelector` 返回第一個匹配的 Element
* `document.querySelectorAll` 返回所有匹配的 Element 組成的 NodeList。它可以通過 `[].slice.call()` 轉換成 Array 使用
* 如果匹配不到任何 Element，jQuery 和 `document.querySelectorAll` 將會返回 `[]`，但 `document.querySelector` 會返回 `null`。

> 注意：`document.querySelector` 和 `document.querySelectorAll` 效能**很差**。如果想提高效能，盡量使用 `document.getElementById`、`document.getElementsByClassName` 或 `document.getElementsByTagName`。

- [1.0](#1.0) <a name='1.0'></a> 選擇器查詢

  ```js
  // jQuery
  $('selector');

  // Native
  document.querySelectorAll('selector');
  ```

- [1.1](#1.1) <a name='1.1'></a> class 查詢

  ```js
  // jQuery
  $('.class');

  // Native
  document.querySelectorAll('.class');

  // or
  document.getElementsByClassName('class');
  ```

- [1.2](#1.2) <a name='1.2'></a> id 查詢

  ```js
  // jQuery
  $('#id');

  // Native
  document.querySelector('#id');

  // or
  document.getElementById('id');
  ```

- [1.3](#1.3) <a name='1.3'></a> 屬性查詢

  ```js
  // jQuery
  $('a[target=_blank]');

  // Native
  document.querySelectorAll('a[target=_blank]');
  ```

- [1.4](#1.4) <a name='1.4'></a> 後代查詢

  ```js
  // jQuery
  $el.find('li');

  // Native
  el.querySelectorAll('li');
  ```

- [1.5](#1.5) <a name='1.5'></a> 同層相鄰及前後元素

  + 同層相鄰

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

  + 同層前一個元素

    ```js
    // jQuery
    $el.prev();

    // Native
    el.previousElementSibling;

    ```

  + 同層後一個元素

    ```js
    // next
    $el.next();

    // Native
    el.nextElementSibling;
    ```
    
  + 所有同層裡之前的元素

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

  + 所有同層裡之後的元素

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
   
一個篩選函式範例：

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

  Closest 返回匹配選擇器的第一個父元素，從當前元素開始沿 DOM 樹向上遍尋。

  ```js
  // jQuery
  $el.closest(queryString);

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

  獲取當前每一個匹配元素的祖先們，不包含匹配元素本身，DOM node 或 jQuery 物件。

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

- [1.8](#1.8) <a name='1.8'></a> Form 表單

  + Input / Textarea 輸入欄位

    ```js
    // jQuery
    $('#my-input').val();

    // Native
    document.querySelector('#my-input').value;
    ```

  + 獲取 e.currentTarget 在 `.radio` 中的索引值

    ```js
    // jQuery
    $('.radio').index(e.currentTarget);

    // Native
    Array.prototype.indexOf.call(document.querySelectorAll('.radio'), e.currentTarget);
    ```

- [1.9](#1.9) <a name='1.9'></a> Iframe Contents

  `$('iframe').contents()` 在 jQuery 返回的是 iframe 内的 `document`

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

- [1.10](#1.10) <a name='1.10'></a> 獲取 body

  ```js
  // jQuery
  $('body');

  // Native
  document.body;
  ```

- [1.11](#1.11) <a name='1.11'></a> 獲取或設置屬性

  + 獲取屬性

    ```js
    // jQuery
    $el.attr('foo');

    // Native
    el.getAttribute('foo');
    ```
  + 設置屬性

    ```js
    // jQuery, note that this works in memory without change the DOM
    $el.attr('foo', 'bar');

    // Native
    el.setAttribute('foo', 'bar');
    ```

  + 獲取 `data-` 屬性

    ```js
    // jQuery
    $el.data('foo');

    // Native (use `getAttribute`)
    el.getAttribute('data-foo');

    // Native (use `dataset` if only need to support IE 11+)
    el.dataset['foo'];
    ```

**[⬆ 回到頂部](#目錄)**

## CSS & Style

- [2.1](#2.1) <a name='2.1'></a> CSS

  + 獲取樣式

    ```js
    // jQuery
    $el.css("color");

    // Native
    // NOTE: Known bug, will return 'auto' if style value is 'auto'
    const win = el.ownerDocument.defaultView;

    // null means not to return pseudo styles
    win.getComputedStyle(el, null).color;
    ```

  + 設置樣式

    ```js
    // jQuery
    $el.css({ color: "#ff0011" });

    // Native
    el.style.color = '#ff0011';
    ```

  + 獲取 / 設置樣式

    注意：如果想一次設置多個樣式，可以參考 oui-dom-utils 裡 [setStyles](https://github.com/oneuijs/oui-dom-utils/blob/master/src/index.js#L194) 的方法

  + add class

    ```js
    // jQuery
    $el.addClass(className);

    // Native
    el.classList.add(className);
    ```

  + remove class

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

  Width 與 Height 獲取方式相同，下面以 Height 為例：

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
      const styles = this.getComputedStyle(el);
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

    獲得匹配元素相對於父元素的坐標

    ```js
    // jQuery
    $el.position();

    // Native
    { left: el.offsetLeft, top: el.offsetTop }
    ```

  + Offset

    獲得匹配元素相對於文件的坐標

    ```js
    // jQuery
    $el.offset();

    // Native
    function getOffset (el) {
      const box = el.getBoundingClientRect();

      return {
        top: box.top + window.pageYOffset - document.documentElement.clientTop,
        left: box.left + window.pageXOffset - document.documentElement.clientLeft
      }
    }
    ```

- [2.4](#2.4) <a name='2.4'></a> Scroll Top


  獲取元素滾動條的當前垂直位置。

  ```js
  // jQuery
  $(window).scrollTop();

  // Native
  (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
  ```

**[⬆ 回到頂部](#目錄)**

## DOM Manipulation

- [3.1](#3.1) <a name='3.1'></a> Remove

  從 DOM 中移除元素。

  ```js
  // jQuery
  $el.remove();

  // Native
  el.parentNode.removeChild(el);
  ```

- [3.2](#3.2) <a name='3.2'></a> Text

  + Get text

    返回元素的文本內容，包含其後代。

    ```js
    // jQuery
    $el.text();

    // Native
    el.textContent;
    ```

  + Set text

    設置元素的文本內容。

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

  Append 在父元素的最後一個子元素後追加子元素

  ```js
  // jQuery
  $el.append("<div id='container'>hello</div>");

  // Native (HTML string)
  el.insertAdjacentHTML('beforeend', '<div id="container">Hello World</div>');

  // Native (Element)
  el.appendChild(newEl);
  ```

- [3.5](#3.5) <a name='3.5'></a> Prepend

  ```js
  // jQuery
  $el.prepend("<div id='container'>hello</div>");

  // Native (HTML string)
  el.insertAdjacentHTML('afterbegin', '<div id="container">Hello World</div>');

  // Native (Element)
  el.insertBefore(newEl, el.firstChild);
  ```

- [3.6](#3.6) <a name='3.6'></a> insertBefore

  在選取的元素前插入新節點

  ```js
  // jQuery
  $newEl.insertBefore(queryString);

  // Native (HTML string)
  el.insertAdjacentHTML('beforebegin ', '<div id="container">Hello World</div>');

  // Native (Element)
  const el = document.querySelector(selector);
  if (el.parentNode) {
    el.parentNode.insertBefore(newEl, el);
  }
  ```

- [3.7](#3.7) <a name='3.7'></a> insertAfter

  在選取的元素插入新節點

  ```js
  // jQuery
  $newEl.insertAfter(queryString);

  // Native (HTML string)
  el.insertAdjacentHTML('afterend', '<div id="container">Hello World</div>');

  // Native (Element)
  const el = document.querySelector(selector);
  if (el.parentNode) {
    el.parentNode.insertBefore(newEl, el.nextSibling);
  }
  ```

- [3.8](#3.8) <a name='3.8'></a> is

  如果匹配 query selector，返回 `true`

    ```js
    // jQuery
    $el.is(selector);

    // Native
    el.matches(selector);
    ```

- [3.9](#3.9) <a name='3.9'></a> clone

  創造一個深拷貝元素：此拷貝包含匹配元素及其所有後代元素和文本節點。

  ```js
  // jQuery. Sets parameter as `true` to indicate that event handlers should be copied along with the element.
  $el.clone();

  // Native
  el.cloneNode();
  ```

- [3.10](#3.10) <a name='3.10'></a> empty

  移除所有子節點

```js
// jQuery
$el.empty();

// Native
el.innerHTML = '';
```

- [3.11](#3.11) <a name='3.11'></a> wrap

 把每個被選取的元素放到指定的 HTML 結構裡

 ```js
 // jQuery
 $(".inner").wrap('<div class="wrapper"></div>');

 // Native
 Array.prototype.forEach.call(document.querySelector('.inner'), (el) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper';
    el.parentNode.insertBefore(wrapper, el);
    el.parentNode.removeChild(el);
    wrapper.appendChild(el);
 });

 ```

- [3.12](#3.12) <a name="3.12"></a> unwrap

  從 DOM 結構移除匹配元素的父元素

  ```js
  // jQuery
  $('.inner').unwrap();

  // Native
  Array.prototype.forEach.call(document.querySelectorAll('.inner'), (el) => {
        let elParentNode = el.parentNode

        if(elParentNode !== document.body) {
            elParentNode.parentNode.insertBefore(el, elParentNode)
            elParentNode.parentNode.removeChild(elParentNode)
        }
  });
  ```

- [3.13](#3.13) <a name="3.13"></a> replaceWith

  用提供的新內容取代任匹配元素集中的每個元素

  ```js
  //jQuery
  $('.inner').replaceWith('<div class="outer"></div>');

  //Native
  Array.prototype.forEach.call(document.querySelectorAll('.inner'),(el) => {
    const outer = document.createElement("div");
    outer.className = "outer";
    el.parentNode.insertBefore(outer, el);
    el.parentNode.removeChild(el);
  });
  ```

- [3.14](#3.14) <a name='3.14'></a> simple parse

  解析 HTML / SVG / XML 字串

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

**[⬆ 回到頂部](#目錄)**

## Ajax

[Fetch API](https://fetch.spec.whatwg.org/) 是一個用是來替換 XMLHttpRequest 執行 ajax 的新標準。適用於 Chrome 和 Firefox，你可以使用 polyfill 讓它在舊版瀏覽器上運行。。

IE9+ 請使用 [github/fetch](http://github.com/github/fetch)，IE8+ 請使用 [fetch-ie8](https://github.com/camsong/fetch-ie8/)，JSONP 請使用 [fetch-jsonp](https://github.com/camsong/fetch-jsonp)。

- [4.1](#4.1) <a name='4.1'></a> 從伺服器載入數據並將返回的 HTML 放入匹配的元素中。

  ```js
  // jQuery
  $(selector).load(url, completeCallback)

  // Native
  fetch(url).then(data => data.text()).then(data => {
    document.querySelector(selector).innerHTML = data
  }).then(completeCallback)
  ```

**[⬆ 回到頂部](#目錄)**

## Events

完整的替代命名空間及事件處理，請參考 https://github.com/oneuijs/oui-dom-events

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

- [5.1](#5.1) <a name='5.1'></a> 使用 on 綁定事件

  ```js
  // jQuery
  $el.on(eventName, eventHandler);

  // Native
  el.addEventListener(eventName, eventHandler);
  ```

- [5.2](#5.2) <a name='5.2'></a> 使用 off 綁定事件

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

**[⬆ 回到頂部](#目錄)**

## Utilities

大部份的 jQuery 實用工具都能在 native API 中找到。其它進階功能可以選用專注於穩定及效能的優質工具庫，推薦 [lodash](https://lodash.com)。

- [6.1](#6.1) <a name='6.1'></a> 基本工具

  + isArray

  判斷參數是否為陣列。

  ```js
  // jQuery
  $.isArray(array);

  // Native
  Array.isArray(array);
  ```

  + isWindow

  判斷參數是否為 window.

  ```js
  // jQuery
  $.isWindow(obj);

  // Native
  function isWindow(obj) {
    return obj !== null && obj !== undefined && obj === obj.window;
  }
  ```

  + inArray

  在陣列中搜尋指定值並返回索引值 (找不到則返回 -1)。

  ```js
  // jQuery
  $.inArray(item, array);

  // Native
  array.indexOf(item) > -1;

  // ES6-way
  array.includes(item);
  ```

  + isNumeric

  判斷傳入的參數是否為數字。
  為了更好的準確性，請使用 `typeof` 確定型別，或參考下方 `type` 範例。

  ```js
  // jQuery
  $.isNumeric(item);

  // Native
  function isNumeric(value) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  ```

  + isFunction

  判斷傳入的參數是否為 Javascript 函式。

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

  檢測物件是否為空值 (包含不可枚舉的屬性)

  ```js
  // jQuery
  $.isEmptyObject(obj);

  // Native
  function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
  }
  ```

  + isPlainObject

  檢測物件是否為純對象 (使用 “{}” 或 “new Object” 創建)

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

  將二個或多個物件的內容合併到一個新物件中，且不修改任一個參數。
  object.assign 是 ES6 API，你也可以使用 [polyfill](https://github.com/ljharb/object.assign)。

  ```js
  // jQuery
  $.extend({}, object1, object2);

  // Native
  Object.assign({}, object1, object2);
  ```

  + trim

  刪除字串開頭和結尾的空白。

  ```js
  // jQuery
  $.trim(string);

  // Native
  string.trim();
  ```

  + map

  將陣列或物件裡的所有項目轉換為新的陣列項目。

  ```js
  // jQuery
  $.map(array, (value, index) => {
  });

  // Native
  array.map((value, index) => {
  });
  ```

  + each

  通用迭代函式，可用於無縫迭代物件或陣列。

  ```js
  // jQuery
  $.each(array, (index, value) => {
  });

  // Native
  array.forEach((value, index) => {
  });
  ```

  + grep

  找到陣列中符合過濾函式的元素。

  ```js
  // jQuery
  $.grep(array, (value, index) => {
  });

  // Native
  array.filter((value, index) => {
  });
  ```

  + type

  檢測物件中的 JavaScript [Class] 內部型態。

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

  將二個陣列的內容合併到第一個陣列裡。

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

  返回表示當前時間的數字。

  ```js
  // jQuery
  $.now();

  // Native
  Date.now();
  ```

  + proxy

  傳入一個函式並返回一個新的函式，該函式綁定指定的上下文。

  ```js
  // jQuery
  $.proxy(fn, context);

  // Native
  fn.bind(context);
  ```

  <a name="makeArray"></a>+ makeArray

  將類似陣列的物件轉換為真正的 JavaScript 陣列。

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

  檢查 DOM 元素是否為其它 DOM 元素的後代。

  ```js
  // jQuery
  $.contains(el, child);

  // Native
  el !== child && el.contains(child);
  ```

- [6.3](#6.3) <a name='6.3'></a> Globaleval

  執行一些 JavaScript 的全域域代碼。

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

  將字串解析為 DOM nodes 陣列。

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

  檢查元素是否存在於 DOM 裡。
  
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

**[⬆ 回到頂部](#目錄)**

## Promises

promise 表示異步操作的最終結果。 jQuery 用它自己的方式來處理 promises。原生 JavaScript 依據 [Promises/A+](http://promises-aplus.github.io/promises-spec/) 標準來實現最小 API 處理 promises。

- [7.1](#7.1) <a name='7.1'></a> done, fail, always

  `done` 會在 promise 解決時調用，`fail` 會在 promise 拒絕時調用，`always` 無論 promise 解決或拒絕時都會調用。

  ```js
  // jQuery
  $promise.done(doneCallback).fail(failCallback).always(alwaysCallback)

  // Native
  promise.then(doneCallback, failCallback).then(alwaysCallback, alwaysCallback)
  ```

- [7.2](#7.2) <a name='7.2'></a> when

  `when` 用於處理多個 promises。當全部 promises 被解決時返回，當任一 promises 被拒絕時拒絕。

  ```js
  // jQuery
  $.when($promise1, $promise2).done((promise1Result, promise2Result) => {
  });

  // Native
  Promise.all([$promise1, $promise2]).then([promise1Result, promise2Result] => {});
  ```

- [7.3](#7.3) <a name='7.3'></a> Deferred

  Deferred 是創建 promises 的一種方式。

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

**[⬆ 回到頂部](#目錄)**

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

  顯示或隱藏元素。

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

  調整元素的透明度。

  ```js
  // jQuery
  $el.fadeTo('slow',0.15);
  // Native
  el.style.transition = 'opacity 3s'; // assume 'slow' equals 3 seconds
  el.style.opacity = '0.15';
  ```

- [8.5](#8.5) <a name='8.5'></a> FadeToggle

  動畫調整透明度來顯示或隱藏。

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

  滑動效果來顯示或隱藏元素。

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

  執行一組自定義動畫的 CSS 屬性。

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
