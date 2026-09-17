## 你也许不需要 jQuery （You (Might) Don't Need jQuery）

前端发展很快，现代浏览器原生 API 已经足够好用。我们并不需要为了操作 DOM、Event 等再学习一下 jQuery 的 API。同时由于 React、Angular、Vue 等框架的流行，直接操作 DOM 不再是好的模式，jQuery 使用场景大大减少。本项目总结了大部分 jQuery API 替代的方法。

示例代码面向当前的常青浏览器（Chrome、Edge、Firefox、Safari）。微软已停止支持 Internet Explorer，所以针对 IE 的兼容写法都已删除。如果仍需要，请查看[最后一个兼容 IE 的版本](https://github.com/camsong/You-Dont-Need-jQuery/tree/c4e00b3)。

## 目录

1. [翻译](#翻译)
2. [Query 选择器](#query-选择器)
3. [CSS & Style](#css--style)
4. [DOM 操作](#dom-操作)
5. [Ajax](#ajax)
6. [事件](#事件)
7. [实用工具](#实用工具)
8. [Promises](#promises)
9. [动画](#动画)
10. [替代品](#替代品)
11. [浏览器支持](#浏览器支持)

## 翻译

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

## Query 选择器

常用的 class、id、属性 选择器都可以使用 `document.querySelector` 或 `document.querySelectorAll` 替代。区别是
* `document.querySelector` 返回第一个匹配的 Element
* `document.querySelectorAll` 返回所有匹配的 Element 组成的静态 NodeList。它支持 `forEach`，也可以用 `Array.from(document.querySelectorAll(selector))` 或 [makeArray](#makeArray) 里的其他方法转成 Array
* 如果匹配不到任何 Element，jQuery 返回空的 jQuery 对象，`document.querySelectorAll` 返回空的 NodeList，而 `document.querySelector` 返回 `null`，注意空指针异常。

> 注意：`document.getElementById`、`document.getElementsByClassName` 和 `document.getElementsByTagName` 比 `querySelector*` 略快，但 `getElementsBy*` 返回的是*动态*（live）HTMLCollection，会随 DOM 变化而变化。除非实测发现性能瓶颈，否则优先用 `querySelector*`。

- [1.0](#1.0) <a name='1.0'></a> 选择器查询

  ```js
  // jQuery
  $('selector');

  // Native
  document.querySelectorAll('selector');
  ```

- [1.1](#1.1) <a name='1.1'></a> class 查询

  ```js
  // jQuery
  $('.class');

  // Native
  document.querySelectorAll('.class');

  // or
  document.getElementsByClassName('class');
  ```

- [1.2](#1.2) <a name='1.2'></a> id 查询

  ```js
  // jQuery
  $('#id');

  // Native
  document.querySelector('#id');

  // or
  document.getElementById('id');
  ```

- [1.3](#1.3) <a name='1.3'></a> 属性查询

  ```js
  // jQuery
  $('a[target=_blank]');

  // Native
  document.querySelectorAll('a[target=_blank]');
  ```

- [1.4](#1.4) <a name='1.4'></a> 后代查询

  ```js
  // jQuery
  $el.find('li');

  // Native
  el.querySelectorAll('li');
  ```

- [1.5](#1.5) <a name='1.5'></a> 兄弟及上下元素

  + 兄弟元素

    ```js
    // jQuery
    $el.siblings();

    // Native
    [...el.parentNode.children].filter((child) =>
      child !== el
    );
    ```

  + 上一个元素

    ```js
    // jQuery
    $el.prev();

    // Native
    el.previousElementSibling;

    ```

  + 下一个元素

    ```js
    // next
    $el.next();

    // Native
    el.nextElementSibling;
    ```

- [1.6](#1.6) <a name='1.6'></a> Closest

  Closest 获得匹配选择器的第一个祖先元素，从当前元素开始沿 DOM 树向上。

  ```js
  // jQuery
  $el.closest(selector);

  // Native
  el.closest(selector);
  ```

- [1.7](#1.7) <a name='1.7'></a> Parents Until

  获取当前每一个匹配元素集的祖先，不包括匹配元素的本身。

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

  + 获取 e.currentTarget 在 `.radio` 中的数组索引

    ```js
    // jQuery
    $('.radio').index(e.currentTarget);

    // Native
    [...document.querySelectorAll('.radio')].indexOf(e.currentTarget);
    ```

- [1.9](#1.9) <a name='1.9'></a> Iframe Contents

  jQuery 对象的 iframe `contents()` 返回的是 iframe 内的 `document`

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

- [1.10](#1.10) <a name='1.10'></a> 获取 body

  ```js
  // jQuery
  $('body');

  // Native
  document.body;
  ```

- [1.11](#1.11) <a name='1.11'></a> 获取或设置属性

  + 获取属性

    ```js
    // jQuery
    $el.attr('foo');

    // Native
    el.getAttribute('foo');
    ```
  + 设置属性

    ```js
    // jQuery, note that this works in memory without change the DOM
    $el.attr('foo', 'bar');

    // Native
    el.setAttribute('foo', 'bar');
    ```

  + 获取 `data-` 属性

    ```js
    // jQuery
    $el.data('foo');

    // Native
    el.dataset.foo;

    // or
    el.getAttribute('data-foo');
    ```

**[⬆ 回到顶部](#目录)**

## CSS & Style

- [2.1](#2.1) <a name='2.1'></a> CSS

  + Get style

    ```js
    // jQuery
    $el.css('color');

    // Native
    // 注意：返回的是解析后的值，例如 'rgb(255, 0, 17)' 而不是 '#f01'
    getComputedStyle(el).color;
    ```

  + Set style

    ```js
    // jQuery
    $el.css({ color: "#ff0011" });

    // Native
    el.style.color = '#ff0011';
    ```

  + Get/Set Styles

    注意，如果想一次设置多个 style，可以参考 oui-dom-utils 中 [setStyles](https://github.com/oneuijs/oui-dom-utils/blob/master/src/index.js#L194) 方法

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

  Width 与 Height 获取方法相同，下面以 Height 为例：

  + Window height

    ```js
    // window height
    $(window).height();

    // 不含 scrollbar，与 jQuery 行为一致
    window.document.documentElement.clientHeight;

    // 含 scrollbar
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

    // 精确到整数（border-box 时为 height - border 值，content-box 时为 height + padding 值）
    el.clientHeight;

    // 精确到小数（border-box 时为 height 值，content-box 时为 height + padding + border 值）
    el.getBoundingClientRect().height;
    ```

- [2.3](#2.3) <a name='2.3'></a> Position & Offset

  + Position

    获得匹配元素相对父元素的偏移

    ```js
    // jQuery
    $el.position();

    // Native
    { left: el.offsetLeft, top: el.offsetTop }
    ```

  + Offset

    获得匹配元素相对文档的偏移

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


  获取元素滚动条垂直位置。

  ```js
  // jQuery
  $(window).scrollTop();

  // Native
  window.scrollY;
  ```

**[⬆ 回到顶部](#目录)**

## DOM 操作

- [3.1](#3.1) <a name='3.1'></a> Remove

  从 DOM 中移除元素。

  ```js
  // jQuery
  $el.remove();

  // Native
  el.remove();
  ```

- [3.2](#3.2) <a name='3.2'></a> Text

  + Get text

    返回指定元素及其后代的文本内容。

    ```js
    // jQuery
    $el.text();

    // Native
    el.textContent;
    ```

  + Set text

    设置元素的文本内容。

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

  Append 插入到子节点的末尾

  ```js
  // jQuery：DOMString 和 Node 对象用同一种写法
  $parent.append(newEl | '<div id="container">Hello World</div>');

  // Native (Element or text)：字符串会作为纯文本插入，不会被解析成 HTML
  parent.append(newEl | 'Hello World');

  // Native (HTML string)
  parent.insertAdjacentHTML('beforeend', '<div id="container">Hello World</div>');
  ```

- [3.5](#3.5) <a name='3.5'></a> Prepend

  ```js
  // jQuery：DOMString 和 Node 对象用同一种写法
  $parent.prepend(newEl | '<div id="container">Hello World</div>');

  // Native (Element or text)：字符串会作为纯文本插入，不会被解析成 HTML
  parent.prepend(newEl | 'Hello World');

  // Native (HTML string)
  parent.insertAdjacentHTML('afterbegin', '<div id="container">Hello World</div>');
  ```

- [3.6](#3.6) <a name='3.6'></a> insertBefore

  在选中元素前插入新节点

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

  在选中元素后插入新节点

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

  如果匹配给定的选择器，返回true

    ```js
    // jQuery
    $el.is(selector);

    // Native
    el.matches(selector);
    ```

- [3.9](#3.9) <a name='3.9'></a> clone

  深拷贝被选元素。（生成被选元素的副本，包含子节点、文本和属性。）

  ```js
  // jQuery。传 `true` 会同时复制事件处理函数和数据
  $el.clone();

  // Native。传 `true` 才是深拷贝；事件监听器不会被复制
  el.cloneNode(true);
  ```

- [3.10](#3.10) <a name='3.10'></a> empty

  移除所有子节点

  ```js
  // jQuery
  $el.empty();

  // Native
  el.replaceChildren();
  ```

- [3.11](#3.11) <a name='3.11'></a> wrap

  把每个被选元素放置在指定的HTML结构中。

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

  移除被选元素的父元素的DOM结构

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

  用指定的元素替换被选的元素

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

  解析 HTML/SVG/XML 字符串

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

**[⬆ 回到顶部](#目录)**

## Ajax

[Fetch API](https://fetch.spec.whatwg.org/) 是替代 XMLHttpRequest 的标准方案，所有现代浏览器都已支持。和 `$.ajax` 不同，`fetch` 遇到 404、500 这类 HTTP 错误状态时**不会** reject，需要自己检查 `response.ok`。JSONP 请使用 [fetch-jsonp](https://github.com/camsong/fetch-jsonp)。

- [4.0](#4.0) <a name='4.0'></a> 请求 JSON

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

- [4.0.2](#4.0.2) <a name='4.0.2'></a> 中止请求与超时

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

- [4.1](#4.1) <a name='4.1'></a> 从服务器读取数据并替换匹配元素的内容。

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

**[⬆ 回到顶部](#目录)**

## 事件

- [5.0](#5.0) <a name='5.0'></a> Document ready by `DOMContentLoaded`

  ```js
  // jQuery
  $(document).ready(eventHandler);

  // Native
  // 检测 DOMContentLoaded 是否已完成
  if (document.readyState !== 'loading') {
    eventHandler();
  } else {
    document.addEventListener('DOMContentLoaded', eventHandler);
  }

  // 或者用 `<script defer>` 或 `<script type="module">` 加载脚本，
  // 它们会在文档解析完成后才执行。
  ```

- [5.1](#5.1) <a name='5.1'></a> 使用 on 绑定事件

  ```js
  // jQuery
  $el.on(eventName, eventHandler);

  // Native
  el.addEventListener(eventName, eventHandler);
  ```

- [5.1.1](#5.1.1) <a name='5.1.1'></a> 使用 one 绑定一次性事件

  ```js
  // jQuery
  $el.one(eventName, eventHandler);

  // Native
  el.addEventListener(eventName, eventHandler, { once: true });
  ```

- [5.1.2](#5.1.2) <a name='5.1.2'></a> 事件代理

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

- [5.2](#5.2) <a name='5.2'></a> 使用 off 解绑事件

  ```js
  // jQuery
  $el.off(eventName, eventHandler);

  // Native
  el.removeEventListener(eventName, eventHandler);

  // Native：一次移除多个监听器，类似 jQuery 的命名空间
  const controller = new AbortController();
  el.addEventListener('click', onClick, { signal: controller.signal });
  el.addEventListener('keydown', onKeydown, { signal: controller.signal });
  controller.abort();
  ```

- [5.3](#5.3) <a name='5.3'></a> Trigger

  ```js
  // jQuery
  $(el).trigger('custom-event', {key1: 'data'});

  // Native。jQuery 事件默认冒泡，原生事件需要 `bubbles: true`
  // 在处理函数里通过 `event.detail` 读取数据
  const event = new CustomEvent('custom-event', {
    bubbles: true,
    cancelable: true,
    detail: { key1: 'data' },
  });

  el.dispatchEvent(event);
  ```

**[⬆ 回到顶部](#目录)**

## 实用工具

大部分实用工具都能在 native API 中找到. 其他高级功能可以选用专注于该领域的稳定性和性能都更好的库来代替，推荐 [lodash](https://lodash.com) 和 [es-toolkit](https://es-toolkit.dev)。

- [6.1](#6.1) <a name='6.1'></a> 基本工具

  + isArray

  检测参数是不是数组。

  ```js
  // jQuery
  $.isArray(range);

  // Native
  Array.isArray(range);
  ```

  + isWindow

  检测参数是不是 window。

  ```js
  // jQuery
  $.isWindow(obj);

  // Native
  function isWindow(obj) {
    return obj != null && obj === obj.window;
  }
  ```

  + inArray

  在数组中搜索指定值并返回索引 (找不到则返回 -1)。

  ```js
  // jQuery
  $.inArray(item, array);

  // Native
  array.indexOf(item);
  ```

  检测数组中是否包含指定值。

  ```js
  // jQuery
  $.inArray(item, array) > -1;

  // Native
  array.indexOf(item) > -1;

  // ES6-way
  array.includes(item);
  ```

  + isNumeric

  检测传入的参数是不是数字。
  Use `typeof` to decide the type or the `type` example for better accuracy.

  ```js
  // jQuery
  $.isNumeric(item);

  // Native
  function isNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }
  ```

  + isFunction

  检测传入的参数是不是 JavaScript 函数对象。

  ```js
  // jQuery
  $.isFunction(item);

  // Native
  function isFunction(item) {
    if (typeof item === 'function') {
      return true;
    }
    var type = Object.prototype.toString(item);
    return type === '[object Function]' || type === '[object GeneratorFunction]';
  }
  ```

  + isEmptyObject

  检测对象是否为空 (包括不可枚举属性)。

  ```js
  // jQuery
  $.isEmptyObject(obj);

  // Native
  function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
  }
  ```

  + isPlainObject

  检测是不是扁平对象 (使用 “{}” 或 “new Object” 创建)。

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

  把两个或多个对象的内容合并到一个新对象，不修改任何参数。
  和不带 `deep` 参数的 `$.extend` 一样，`Object.assign` 和展开运算符都只做浅拷贝。

  ```js
  // jQuery
  $.extend({}, object1, object2);

  // Native
  Object.assign({}, object1, object2);

  // Native (spread)
  ({ ...object1, ...object2 });
  ```

  深拷贝单个对象：

  ```js
  // jQuery
  $.extend(true, {}, object);

  // Native。函数和 DOM 节点无法被克隆
  structuredClone(object);
  ```

  + trim

  移除字符串头尾空白。

  ```js
  // jQuery
  $.trim(string);

  // Native
  string.trim();
  ```

  + map

  将数组或对象转化为包含新内容的数组。

  ```js
  // jQuery
  $.map(array, (value, index) => {
  });

  // Native
  array.map((value, index) => {
  });
  ```

  + each

  轮询函数，可用于平滑的轮询对象和数组。

  ```js
  // jQuery
  $.each(array, (index, value) => {
  });

  // Native
  array.forEach((value, index) => {
  });
  ```

  + grep

  找到数组中符合过滤函数的元素。

  ```js
  // jQuery
  $.grep(array, (value, index) => {
  });

  // Native
  array.filter((value, index) => {
  });
  ```

  + type

  检测对象的 JavaScript [Class] 内部类型。

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

  合并第二个数组内容到第一个数组。

  ```js
  // jQuery，会修改 array1，不去除重复值
  $.merge(array1, array2);

  // Native，会修改 array1，不去除重复值
  array1.push(...array2);

  // Native，使用 concat 返回新数组，不去除重复值
  function merge(...args) {
    return [].concat(...args);
  }

  // 使用 Set 返回新数组，会去除重复值
  function merge(...args) {
    return Array.from(new Set([].concat(...args)));
  }
  ```

  + now

  返回当前时间的数字呈现。

  ```js
  // jQuery
  $.now();

  // Native
  Date.now();
  ```

  + proxy

  传入函数并返回一个新函数，该函数绑定指定上下文。

  ```js
  // jQuery
  $.proxy(fn, context);

  // Native
  fn.bind(context);
  ```

  <a name="makeArray"></a>+ makeArray

  类数组对象转化为真正的 JavaScript 数组。

  ```js
  // jQuery
  $.makeArray(arrayLike);

  // Native
  Array.from(arrayLike);

  // ES6-way: spread operator
  [...arrayLike];
  ```

- [6.2](#6.2) <a name='6.2'></a> 包含

  检测 DOM 元素是不是其他 DOM 元素的后代。

  ```js
  // jQuery
  $.contains(el, child);

  // Native
  el !== child && el.contains(child);
  ```

- [6.3](#6.3) <a name='6.3'></a> globalEval

  全局执行 JavaScript 代码。

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

- [6.4](#6.4) <a name='6.4'></a> 解析

  + parseHTML

  解析字符串为 DOM 节点数组。

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

  + parseJSON

  传入格式正确的 JSON 字符串并返回 JavaScript 值。

  ```js
  // jQuery
  $.parseJSON(str);

  // Native
  JSON.parse(str);
  ```

**[⬆ 回到顶部](#目录)**

## Promises

Promise 代表异步操作的最终结果。jQuery 用它自己的方式处理 promises，原生 JavaScript 遵循 [Promises/A+](https://promisesaplus.com/) 标准实现了最小 API 来处理 promises，配合 `async`/`await` 还能写得像同步代码一样。

- [7.1](#7.1) <a name='7.1'></a> done, fail, always

  `done` 会在 promise 解决时调用，`fail` 会在 promise 拒绝时调用，`always` 总会调用。

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

  `when` 用于处理多个 promises。当全部 promises 被解决时返回，当任一 promise 被拒绝时拒绝。

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

  Deferred 是创建 promises 的一种方式。

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

**[⬆ 回到顶部](#目录)**

## 动画

[Web Animations API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Animations_API)（`el.animate()`）是最接近 jQuery 动画效果的原生方案：时长以毫秒为单位，尽可能在主线程之外运行，并返回一个 `Animation` 对象，动画结束时它的 `finished` promise 会 resolve。

- [8.1](#8.1) <a name='8.1'></a> Show & Hide

  ```js
  // jQuery
  $el.show();
  $el.hide();

  // Native
  el.style.display = ''; // 如果样式表把它隐藏了，就设为 'block'、'inline' 等
  el.style.display = 'none';

  // Native（元素没有在别处用 `display` 设置样式时）
  el.hidden = false;
  el.hidden = true;
  ```

- [8.2](#8.2) <a name='8.2'></a> Toggle

  显示或隐藏元素。

  ```js
  // jQuery
  $el.toggle();

  // Native
  if (getComputedStyle(el).display === 'none') {
    el.style.display = ''; // 或 'block'、'inline' 等
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

  调整元素透明度。

  ```js
  // jQuery
  $el.fadeTo('slow',0.15);
  // Native（jQuery 中 'slow' 等于 600 毫秒）
  el.animate([{ opacity: 0.15 }], { duration: 600, fill: 'forwards' });
  ```

- [8.5](#8.5) <a name='8.5'></a> FadeToggle

  动画调整透明度用来显示或隐藏。

  ```js
  // jQuery
  $el.fadeToggle();

  // Native，使用 8.3 中的 fadeIn 和 fadeOut
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

  滑动切换显示或隐藏。

  ```js
  // jQuery
  $el.slideToggle();

  // Native，使用 8.6 中的 slideUp 和 slideDown
  if (getComputedStyle(el).display === 'none') {
    slideDown(el);
  } else {
    slideUp(el);
  }
  ```

- [8.8](#8.8) <a name='8.8'></a> Animate

  执行一系列 CSS 属性动画。

  ```js
  // jQuery
  $el.animate({ params }, speed);

  // Native（speed 单位为毫秒）
  el.animate([params], { duration: speed, fill: 'forwards' });
  ```

**[⬆ 回到顶部](#目录)**

## 替代品

* [你可能不需要 jQuery (You Might Not Need jQuery)](https://youmightnotneedjquery.com/) - 如何使用原生 JavaScript 实现通用事件，元素，ajax 等用法。
* [MDN Web Docs](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model) - 本文用到的所有 DOM API 的参考文档。
* [Baseline](https://web.dev/baseline) - 查询哪些 Web 平台特性可以放心地跨浏览器使用。

## 浏览器支持

![Chrome][chrome-image] | ![Edge][edge-image] | ![Firefox][firefox-image] | ![Safari][safari-image] | ![Opera][opera-image]
--- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ |

少数示例用到了较新的 API：`Promise.withResolvers()`（2024）、`el.replaceChildren()`（2020）和 `AbortSignal.timeout()`（2022）。如果需要支持旧浏览器，请先在 [Baseline](https://web.dev/baseline) 上确认。

# License

MIT

[chrome-image]: https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png
[firefox-image]: https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png
[edge-image]: https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png
[opera-image]: https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png
[safari-image]: https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png
