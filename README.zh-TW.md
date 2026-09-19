## You (Might) Don't Need jQuery

當今的前端環境發展迅速，現代瀏覽器已經提供了足以用於正式環境的 DOM/BOM API，我們不需要為了 DOM 操作或事件處理而從頭開始學習 jQuery。同時，由於 React、Angular 和 Vue 等前端框架的普及，直接操作 DOM 已逐漸成為反模式，jQuery 的重要性也隨之降低。本專案整理了大部分以原生 JavaScript 替代 jQuery 方法的方式。

範例程式碼面向目前的常青瀏覽器（Chrome、Edge、Firefox、Safari）。Microsoft 已停止支援 Internet Explorer，因此已移除針對 IE 的相容寫法。如仍有需要，請參閱[最後一個相容 IE 的版本](https://github.com/camsong/You-Dont-Need-jQuery/tree/c4e00b3)。

ℹ️ 注意：
1. jQuery 仍然是一個很棒的函式庫，也有許多適用情境；若不想遷移，不需要為了改變而改變！
2. 這些替代方案並非在所有情境下都完全等價，使用前建議先行測試。


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

常見的 class、id、屬性等選擇器，可以使用 `document.querySelector` 或 `document.querySelectorAll` 替代。差別如下：
* `document.querySelector` 返回第一個符合的 Element
* `document.querySelectorAll` 返回由所有符合元素組成的靜態 NodeList。它支援 `forEach`，也可以使用 `Array.from(document.querySelectorAll(selector))` 或 [makeArray](#makeArray) 中的方法轉換成 Array
* 若沒有任何符合的元素，jQuery 返回空的 jQuery 物件，`document.querySelectorAll` 返回空的 NodeList，而 `document.querySelector` 返回 `null`。

> 注意：`document.getElementById`、`document.getElementsByClassName` 和 `document.getElementsByTagName` 比 `querySelector*` 稍快，但 `getElementsBy*` 返回的是會隨 DOM 改變的*動態*（live）HTMLCollection。除非實測發現效能瓶頸，否則應優先使用 `querySelector*`。

- [1.0](#1.0) <a name='1.0'></a> Query by selector 選擇器查詢 

  ```js
  // jQuery
  $('selector');

  // Native
  document.querySelectorAll('selector');
  ```

- [1.1](#1.1) <a name='1.1'></a> Query by class 查詢 class

  ```js
  // jQuery
  $('.class');

  // Native
  document.querySelectorAll('.class');

  // or
  document.getElementsByClassName('class');
  ```

- [1.2](#1.2) <a name='1.2'></a> Query by id 查詢 id 

  ```js
  // jQuery
  $('#id');

  // Native
  document.querySelector('#id');

  // or
  document.getElementById('id');
  ```

- [1.3](#1.3) <a name='1.3'></a> Query by attribute 屬性查詢 

  ```js
  // jQuery
  $('a[target=_blank]');

  // Native
  document.querySelectorAll('a[target=_blank]');
  ```

- [1.4](#1.4) <a name='1.4'></a> Query in descendants 後代查詢 

  ```js
  // jQuery
  $el.find('li');

  // Native
  el.querySelectorAll('li');
  ```

- [1.5](#1.5) <a name='1.5'></a> Sibling/Previous/Next Elements 同層相鄰及前後元素

  + All siblings 所有同層相鄰元素

    ```js
    // jQuery
    $el.siblings();

    // Native
    [...el.parentNode.children].filter((child) =>
      child !== el
    );
    ```

  + Previous sibling 前一個同層元素

    ```js
    // jQuery
    $el.prev();

    // Native
    el.previousElementSibling;
    ```
  + Next sibling 後一個同層元素

    ```js
    // jQuery
    $el.next();

    // Native
    el.nextElementSibling;
    ```

  + All previous siblings 所有之前的同層元素

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

  + All next siblings 所有之後的同層元素

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

    篩選函式範例：

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

- [1.6](#1.6) <a name='1.6'></a> Closest 遍尋

  Closest 返回匹配選擇器的第一個父元素，從當前元素開始沿 DOM 樹向上遍尋。

  ```js
  // jQuery
  $el.closest(selector);

  // Native
  el.closest(selector);
  ```

- [1.7](#1.7) <a name='1.7'></a> Parents Until

  獲取當前每一個匹配元素的祖先們，不包含匹配元素本身，DOM node 或 jQuery 物件。

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
    [...document.querySelectorAll('.radio')].indexOf(e.currentTarget);
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

  + Get an attribute 獲取屬性 

    ```js
    // jQuery
    $el.attr('foo');

    // Native
    el.getAttribute('foo');
    ```
  + Set an attribute 設置屬性 

    ```js
    // jQuery
    $el.attr('foo', 'bar');

    // Native
    el.setAttribute('foo', 'bar');
    ```

  + 獲取 `data-` 屬性 

    ```js
    // jQuery
    $el.data('foo');

    // Native
    el.dataset.foo;

    // or
    el.getAttribute('data-foo');
    ```

- [1.12](#1.12) <a name='1.12'></a> 包含字串的選擇器 (區分大小寫)

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

**[⬆ 回到頂部](#目錄)**

## CSS & Style

- [2.1](#2.1) <a name='2.1'></a> CSS

  + 取得樣式

    ```js
    // jQuery
    $el.css('color');

    // Native
    // NOTE: returns the resolved value, e.g. 'rgb(255, 0, 17)' rather than '#f01'
    getComputedStyle(el).color;
    ```

  + 設定樣式

    ```js
    // jQuery
    $el.css({ color: '#f01' });

    // Native
    el.style.color = '#f01';
    ```

  + 設定多個樣式

    ```js
    // jQuery
    $el.css({ color: '#f01', 'border-color': '#f02' });

    // Native
    Object.assign(el.style, { color: '#f01', borderColor: '#f02' });
    ```

  + Add class 新增 class

    ```js
    // jQuery
    $el.addClass(className);

    // Native
    el.classList.add(className);
    ```

  + Remove class 移除 class

    ```js
    // jQuery
    $el.removeClass(className);

    // Native
    el.classList.remove(className);
    ```

  + has class 是否含有 class

    ```js
    // jQuery
    $el.hasClass(className);

    // Native
    el.classList.contains(className);
    ```

  + Toggle class 切換 class

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

- [2.3](#2.3) <a name='2.3'></a> Position & Offset 定位和位移 

  + Position 定位 

    獲得匹配元素相對於父元素的坐標

    ```js
    // jQuery
    $el.position();

    // Native
    const position = { left: el.offsetLeft, top: el.offsetTop };
    ```

  + Offset 位移 

    獲得匹配元素相對於文件的坐標

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


  獲取元素滾動條的當前垂直位置。

  ```js
  // jQuery
  $(window).scrollTop();

  // Native
  window.scrollY;
  ```

**[⬆ 回到頂部](#目錄)**

## DOM Manipulation DOM 操作 

- [3.1](#3.1) <a name='3.1'></a> Remove 移除 

  從 DOM 中移除元素。

  ```js
  // jQuery
  $el.remove();

  // Native
  el.remove();
  ```

- [3.2](#3.2) <a name='3.2'></a> Text 文字 

  + Get text 獲取文字 

    返回元素的文本內容，包含其後代。

    ```js
    // jQuery
    $el.text();

    // Native
    el.textContent;
    ```

  + Set text 設置文字 

    設置元素的文本內容。

    ```js
    // jQuery
    $el.text(string);

    // Native
    el.textContent = string;
    ```

- [3.3](#3.3) <a name='3.3'></a> HTML

  + Get HTML 獲取 HTML 

    ```js
    // jQuery
    $el.html();

    // Native
    el.innerHTML;
    ```

  + Set HTML 設置 HTML 

    ```js
    // jQuery
    $el.html(htmlString);

    // Native
    el.innerHTML = htmlString;
    ```

- [3.4](#3.4) <a name='3.4'></a> Append 追加 

  Append 在父元素的最後一個子元素後追加子元素

  ```js
  // jQuery: unified syntax for DOMString and Node objects
  $parent.append(newEl | '<div id="container">Hello World</div>');

  // Native (Element or text): strings are inserted as plain text, not parsed as HTML
  parent.append(newEl | 'Hello World');

  // Native (HTML string)
  parent.insertAdjacentHTML('beforeend', '<div id="container">Hello World</div>');
  ```

- [3.5](#3.5) <a name='3.5'></a> Prepend 前置 

  ```js
  // jQuery: unified syntax for DOMString and Node objects
  $parent.prepend(newEl | '<div id="container">Hello World</div>');

  // Native (Element or text): strings are inserted as plain text, not parsed as HTML
  parent.prepend(newEl | 'Hello World');

  // Native (HTML string)
  parent.insertAdjacentHTML('afterbegin', '<div id="container">Hello World</div>');
  ```

- [3.6](#3.6) <a name='3.6'></a> insertBefore 在元素前方插入 

  在選取的元素前插入新節點

  ```js
  // jQuery
  $newEl.insertBefore(selector);

  const el = document.querySelector(selector);

  // Native (Element)
  el.before(newEl);

  // Native (HTML string)
  el.insertAdjacentHTML('beforebegin', '<div id="container">Hello World</div>');
  ```

- [3.7](#3.7) <a name='3.7'></a> insertAfter 在元素後方插入 

  在選取的元素插入新節點

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

  如果匹配 query selector，返回 `true`

  ```js
  // jQuery - Notice `is` also works with a function, an existing jQuery object or a DOM element, which are not of concern here
  $el.is(selector);

  // Native
  el.matches(selector);
  ```

- [3.9](#3.9) <a name='3.9'></a> clone

  創造一個深拷貝元素：此拷貝包含匹配元素及其所有後代元素和文本節點。

  ```js
  // jQuery. Pass `true` to also copy event handlers and data.
  $el.clone();

  // Native. Pass `true` for a deep copy; event listeners are never copied.
  el.cloneNode(true);
  ```

- [3.10](#3.10) <a name='3.10'></a> empty

  移除所有子節點

  ```js
  // jQuery
  $el.empty();

  // Native
  el.replaceChildren();
  ```

- [3.11](#3.11) <a name='3.11'></a> wrap

 把每個被選取的元素放到指定的 HTML 結構裡

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

- [3.12](#3.12) <a name="3.12"></a> unwrap

  從 DOM 結構移除匹配元素的父元素

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

- [3.13](#3.13) <a name="3.13"></a> replaceWith

  用提供的新內容取代任何匹配元素集中的每個元素

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

**[⬆ 回到頂部](#目錄)**

## Ajax

[Fetch API](https://fetch.spec.whatwg.org/) 是取代 XMLHttpRequest 的標準方案，所有現代瀏覽器都已支援。與 `$.ajax` 不同，`fetch` 遇到 404、500 等 HTTP 錯誤狀態時**不會** reject，必須自行檢查 `response.ok`。JSONP 請使用 [fetch-jsonp](https://github.com/camsong/fetch-jsonp)。

- [4.0](#4.0) <a name='4.0'></a> 請求 JSON

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

- [4.0.1](#4.0.1) <a name='4.0.1'></a> POST JSON

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

- [4.0.2](#4.0.2) <a name='4.0.2'></a> 中止請求與逾時

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

- [4.1](#4.1) <a name='4.1'></a> 從伺服器載入數據並將返回的 HTML 放入匹配的元素中。

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

**[⬆ 回到頂部](#目錄)**

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

- [5.1](#5.1) <a name='5.1'></a> 使用 on 綁定事件

  ```js
  // jQuery
  $el.on(eventName, eventHandler);

  // Native
  el.addEventListener(eventName, eventHandler);
  ```

- [5.1.1](#5.1.1) <a name='5.1.1'></a> 使用 one 綁定一次性事件

  ```js
  // jQuery
  $el.one(eventName, eventHandler);

  // Native
  el.addEventListener(eventName, eventHandler, { once: true });
  ```

- [5.1.2](#5.1.2) <a name='5.1.2'></a> 事件委派

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

- [5.2](#5.2) <a name='5.2'></a> 使用 off 解除事件綁定

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

**[⬆ 回到頂部](#目錄)**

## Utilities

大部分的 jQuery 實用工具都能在原生 API 中找到。其他進階功能可以選用專注於穩定性與效能的工具庫，推薦 [Lodash](https://lodash.com) 和 [es-toolkit](https://es-toolkit.dev)。

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

  判斷參數是否為 window

  ```js
  // jQuery
  $.isWindow(obj);

  // Native
  function isWindow(obj) {
    return obj != null && obj === obj.window;
  }
  ```

  + inArray

  在陣列中搜尋指定值並返回索引值（找不到則返回 -1）。

  ```js
  // jQuery
  $.inArray(item, array);

  // Native
  array.indexOf(item);
  ```

  檢查陣列中是否包含指定值。

  ```js
  // jQuery
  $.inArray(item, array) > -1;

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
  function isNumeric(n) {
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
    if (Object.prototype.toString.call(obj) !== '[object Object]') {
      return false;
    }

    const proto = Object.getPrototypeOf(obj);
    return proto === null || proto === Object.prototype;
  }
  ```

  + extend

  將兩個或多個物件的內容合併到一個新物件中，且不修改任一個參數。
  和不帶 `deep` 參數的 `$.extend` 一樣，`Object.assign` 和展開運算子都只會建立淺拷貝。

  ```js
  // jQuery
  $.extend({}, object1, object2);

  // Native
  Object.assign({}, object1, object2);

  // Native (spread)
  ({ ...object1, ...object2 });
  ```

  深層複製單一物件：

  ```js
  // jQuery
  $.extend(true, {}, object);

  // Native. Functions and DOM nodes cannot be cloned
  structuredClone(object);
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

- [6.3](#6.3) <a name='6.3'></a> globalEval

  在全域範圍執行 JavaScript 程式碼。

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
    return Array.from(context.body.childNodes);
  }
  ```
- [6.5](#6.5) <a name='6.5'></a> exists

  檢查元素是否存在於 DOM 裡。

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

**[⬆ 回到頂部](#目錄)**

## Promises

Promise 表示非同步操作的最終結果。jQuery 以自己的方式處理 promises；原生 JavaScript 則依循 [Promises/A+](https://promisesaplus.com/) 規範提供精簡的 API，搭配 `async`/`await` 還能寫得如同步程式碼一般易讀。

- [7.1](#7.1) <a name='7.1'></a> done, fail, always

  `done` 會在 promise 解決時調用，`fail` 會在 promise 拒絕時調用，`always` 無論 promise 解決或拒絕時都會調用。

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

  `when` 用於處理多個 promises。當全部 promises 被解決時返回，當任一 promises 被拒絕時拒絕。

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

**[⬆ 回到頂部](#目錄)**

## Animation

[Web Animations API](https://developer.mozilla.org/zh-TW/docs/Web/API/Web_Animations_API)（`el.animate()`）是最接近 jQuery 動畫效果的原生方案：時長以毫秒為單位，並在可能的情況下於主執行緒之外執行。它會返回 `Animation` 物件，其 `finished` promise 會在動畫結束時 resolve。

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

  顯示或隱藏元素。

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

  調整元素的透明度。

  ```js
  // jQuery
  $el.fadeTo('slow',0.15);
  // Native ('slow' equals 600 milliseconds in jQuery)
  el.animate([{ opacity: 0.15 }], { duration: 600, fill: 'forwards' });
  ```

- [8.5](#8.5) <a name='8.5'></a> FadeToggle

  動畫調整透明度來顯示或隱藏。

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

  滑動效果來顯示或隱藏元素。

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

  執行一組自定義動畫的 CSS 屬性。

  ```js
  // jQuery
  $el.animate({ params }, speed);

  // Native (speed in milliseconds)
  el.animate([params], { duration: speed, fill: 'forwards' });
  ```

**[⬆ 回到頂部](#目錄)**

## Alternatives

* [You Might Not Need jQuery](https://youmightnotneedjquery.com/) - 使用原生 JavaScript 完成常見事件、元素與 Ajax 操作的範例。
* [MDN Web Docs](https://developer.mozilla.org/zh-TW/docs/Web/API/Document_Object_Model) - 本文所使用各項 DOM API 的參考文件。
* [Baseline](https://web.dev/baseline) - 查詢哪些 Web 平台功能可安全地跨瀏覽器使用。

## Browser Support

![Chrome][chrome-image] | ![Edge][edge-image] | ![Firefox][firefox-image] | ![Safari][safari-image] | ![Opera][opera-image]
--- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ |

少數範例使用了較新的 API：`Promise.withResolvers()`（2024）、`el.replaceChildren()`（2020）和 `AbortSignal.timeout()`（2022）。若需支援較舊的瀏覽器，請先在 [Baseline](https://web.dev/baseline) 上確認。

# License

MIT

[chrome-image]: https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png
[firefox-image]: https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png
[edge-image]: https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png
[opera-image]: https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png
[safari-image]: https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png
