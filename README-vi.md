## You (Might) Don't Need jQuery

## Bạn không cần jQuery nữa đâu

Ngày nay, môi trường lập trình front-end phát triển rất nhanh chóng, các trình duyệt hiện đại đã cung cấp các API đủ tốt để làm việc với DOM/BOM. Bạn không còn cần phải học về jQuery nữa. Đồng thời, nhờ sự ra đời của các thư viện như React, Angular và Vue đã khiến cho việc can thiệp trực tiếp vào DOM trở thành một việc không tốt. jQuery đã không còn quan trọng như trước nữa. Bài viết này tổng hợp những cách để thay thế các hàm của jQuery bằng các hàm được hỗ trợ bởi trình duyệt.

Các đoạn code trong bài viết hướng tới các trình duyệt evergreen hiện nay (Chrome, Edge, Firefox, Safari). Internet Explorer không còn được Microsoft hỗ trợ, vì vậy các đoạn code fallback dành riêng cho IE đã được loại bỏ. Nếu bạn vẫn cần chúng, hãy xem [phiên bản cuối cùng còn tương thích với IE](https://github.com/camsong/You-Dont-Need-jQuery/tree/c4e00b3).

## Danh mục

1. [Query Selector](#query-selector)
1. [CSS & Style](#css--style)
1. [Thao tác với DOM](#thao-tác-với-dom)
1. [Ajax](#ajax)
1. [Events](#events)
1. [Hàm tiện ích](#hàm-tiện-ích)
1. [Ngôn ngữ khác](#ngôn-ngữ-khác)
1. [Các trình duyệt hỗ trợ](#các-trình-duyệt-hỗ-trợ)

## Ngôn ngữ khác

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

Đối với những selector phổ biến như class, id hoặc thuộc tính thì chúng ta có thể sử dụng `document.querySelector` hoặc `document.querySelectorAll` để thay thế cho jQuery selector. Sự khác biệt của hai hàm này là ở chỗ:

* `document.querySelector` trả về element đầu tiên được tìm thấy
* `document.querySelectorAll` trả về tất cả các element được tìm thấy dưới dạng một NodeList tĩnh (static NodeList). NodeList này hỗ trợ `forEach`, và có thể được convert qua array bằng cách `Array.from(document.querySelectorAll(selector))`
* Nếu không có element nào được tìm thấy, thì jQuery sẽ trả về một jQuery object rỗng và `document.querySelectorAll` trả về một NodeList rỗng, trong khi đó `document.querySelector` sẽ trả về `null`.

> Chú ý : `document.getElementById`, `document.getElementsByClassName` và `document.getElementsByTagName` nhanh hơn `querySelector*` một chút, nhưng `getElementsBy*` trả về một HTMLCollection *live*, tức là nó sẽ thay đổi theo DOM. Hãy ưu tiên dùng `querySelector*`, trừ khi bạn đã đo đạc và thấy đây thực sự là điểm nghẽn hiệu suất.

- [1.0](#1.0) <a name='1.0'></a> Query bằng selector

  ```js
  // jQuery
  $('selector');

  // Native
  document.querySelectorAll('selector');
  ```

- [1.1](#1.1) <a name='1.1'></a> Query bằng class

  ```js
  // jQuery
  $('.class');

  // Native
  document.querySelectorAll('.class');

  // hoặc
  document.getElementsByClassName('class');
  ```

- [1.2](#1.2) <a name='1.2'></a> Query bằng id

  ```js
  // jQuery
  $('#id');

  // Native
  document.querySelector('#id');

  // hoặc
  document.getElementById('id');
  ```

- [1.3](#1.3) <a name='1.3'></a> Query bằng thuộc tính

  ```js
  // jQuery
  $('a[target=_blank]');

  // Native
  document.querySelectorAll('a[target=_blank]');
  ```

- [1.4](#1.4) <a name='1.4'></a> Tìm bất cứ gì.

  + Tìm node

    ```js
    // jQuery
    $el.find('li');

    // Native
    el.querySelectorAll('li');
    ```

  + Tìm body

    ```js
    // jQuery
    $('body');

    // Native
    document.body;
    ```

  + lấy thuộc tính

    ```js
    // jQuery
    $el.attr('foo');

    // Native
    el.getAttribute('foo');
    ```

  + Lấy giá trị của thuộc tính `data`

    ```js
    // jQuery
    $el.data('foo');

    // Native
    el.dataset.foo;

    // hoặc
    el.getAttribute('data-foo');
    ```

- [1.5](#1.5) <a name='1.5'></a> Tìm element cùng level/trước/sau

  + Element cùng level

    ```js
    // jQuery
    $el.siblings();

    // Native
    [...el.parentNode.children].filter((child) =>
      child !== el
    );
    ```

  + Element ở phía trước

    ```js
    // jQuery
    $el.prev();

    // Native
    el.previousElementSibling;
    ```

  + Element ở phía sau

    ```js
    // jQuery
    $el.next();

    // Native
    el.nextElementSibling;
    ```

- [1.6](#1.6) <a name='1.6'></a> Element gần nhất

  Trả về element đầu tiên có selector khớp với yêu cầu khi duyệt từ element hiện tại trở lên tới document.

  ```js
  // jQuery
  $el.closest(selector);

  // Native
  el.closest(selector);
  ```

- [1.7](#1.7) <a name='1.7'></a> Tìm parent

  Truy ngược một cách đệ quy tổ tiên của element hiện tại, cho đến khi tìm được một element tổ tiên ( element cần tìm ) mà element đó là con trực tiếp của element khớp với selector được cung cấp, Return lại element cần tìm đó.

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

  + Lấy index của e.currentTarget trong danh sách các element khớp với selector `.radio`

    ```js
    // jQuery
    $('.radio').index(e.currentTarget);

    // Native
    [...document.querySelectorAll('.radio')].indexOf(e.currentTarget);
    ```

- [1.9](#1.9) <a name='1.9'></a> Nội dung Iframe

  `$('iframe').contents()` trả về thuộc tính `contentDocument` của iframe được tìm thấy

  + Nọi dung iframe

    ```js
    // jQuery
    $iframe.contents();

    // Native
    iframe.contentDocument;
    ```

  + Query Iframe

    ```js
    // jQuery
    $iframe.contents().find('.css');

    // Native
    iframe.contentDocument.querySelectorAll('.css');
    ```

**[⬆ Trở về đầu](#danh-mục)**

## CSS & Style

- [2.1](#2.1) <a name='2.1'></a> CSS

  + Lấy style

    ```js
    // jQuery
    $el.css('color');

    // Native
    // NOTE: trả về giá trị đã được tính toán (resolved value), ví dụ 'rgb(255, 0, 17)' chứ không phải '#f01'
    getComputedStyle(el).color;
    ```

  + Đặt style

    ```js
    // jQuery
    $el.css({ color: '#f01' });

    // Native
    el.style.color = '#f01';
    ```

  + Đặt nhiều style

    ```js
    // jQuery
    $el.css({ color: '#f01', 'border-color': '#f02' });

    // Native
    Object.assign(el.style, { color: '#f01', borderColor: '#f02' });
    ```

  + Thêm class và element

    ```js
    // jQuery
    $el.addClass(className);

    // Native
    el.classList.add(className);
    ```

  + Loại bỏ class class ra khỏi element

    ```js
    // jQuery
    $el.removeClass(className);

    // Native
    el.classList.remove(className);
    ```

  + Kiểm tra xem element có class nào đó hay không

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

- [2.2](#2.2) <a name='2.2'></a> Chiều rộng, chiều cao

  Về mặt lý thuyết thì chiều rộng và chiều cao giống như nhau trong cả jQuery và DOM API:

  + Chiều rộng của window

    ```js
    // jQuery
    $(window).height();

    // trừ đi scrollbar, giống với jQuery
    window.document.documentElement.clientHeight;

    // Tính luôn scrollbar
    window.innerHeight;
    ```

  + Chiều cao của Document

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

  + Chiều cao của element

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

    // chính xác tới số nguyên (khi có thuộc tính `box-sizing` là `border-box`, nó là `height - border`; khi box-sizing là `content-box`, nó là `height + padding`)
    el.clientHeight;

    // Chính xác tới số thập phân (khi `box-sizing` là `border-box`, nó là `height`; khi `box-sizing` là `content-box`, nó là `height + padding + border`)
    el.getBoundingClientRect().height;
    ```

- [2.3](#2.3) <a name='2.3'></a> Position & Offset

  + Position

    ```js
    // jQuery
    $el.position();

    // Native
    const position = { left: el.offsetLeft, top: el.offsetTop };
    ```

  + Offset

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

  ```js
  // jQuery
  $(window).scrollTop();

  // Native
  window.scrollY;
  ```

**[⬆ Trở về đầu](#danh-mục)**

## Thao tác với DOM

- [3.1](#3.1) <a name='3.1'></a> Loại bỏ
  ```js
  // jQuery
  $el.remove();

  // Native
  el.remove();
  ```

- [3.2](#3.2) <a name='3.2'></a> Text

  + Lấy text

    ```js
    // jQuery
    $el.text();

    // Native
    el.textContent;
    ```

  + Đặt giá trị text

    ```js
    // jQuery
    $el.text(string);

    // Native
    el.textContent = string;
    ```

- [3.3](#3.3) <a name='3.3'></a> HTML

  + Lấy HTML

    ```js
    // jQuery
    $el.html();

    // Native
    el.innerHTML;
    ```

  + Đặt giá trị HTML

    ```js
    // jQuery
    $el.html(htmlString);

    // Native
    el.innerHTML = htmlString;
    ```

- [3.4](#3.4) <a name='3.4'></a> Append

  append một element sau element con cuối cùng của element cha

  ```js
  // jQuery: cú pháp thống nhất cho cả DOMString và Node object
  $parent.append(newEl | '<div id="container">Hello World</div>');

  // Native (Element hoặc text): chuỗi được chèn vào dưới dạng text thuần, không được parse thành HTML
  parent.append(newEl | 'Hello World');

  // Native (chuỗi HTML)
  parent.insertAdjacentHTML('beforeend', '<div id="container">Hello World</div>');
  ```

- [3.5](#3.5) <a name='3.5'></a> Prepend

  ```js
  // jQuery: cú pháp thống nhất cho cả DOMString và Node object
  $parent.prepend(newEl | '<div id="container">Hello World</div>');

  // Native (Element hoặc text): chuỗi được chèn vào dưới dạng text thuần, không được parse thành HTML
  parent.prepend(newEl | 'Hello World');

  // Native (chuỗi HTML)
  parent.insertAdjacentHTML('afterbegin', '<div id="container">Hello World</div>');
  ```

- [3.6](#3.6) <a name='3.6'></a> insertBefore

  Chèn một node vào trước element được query.

  ```js
  // jQuery
  $newEl.insertBefore(selector);

  const el = document.querySelector(selector);

  // Native (Element)
  el.before(newEl);

  // Native (chuỗi HTML)
  el.insertAdjacentHTML('beforebegin', '<div id="container">Hello World</div>');
  ```

- [3.7](#3.7) <a name='3.7'></a> insertAfter

  Chèn node vào sau element được query

  ```js
  // jQuery
  $newEl.insertAfter(selector);

  const el = document.querySelector(selector);

  // Native (Element)
  el.after(newEl);

  // Native (chuỗi HTML)
  el.insertAdjacentHTML('afterend', '<div id="container">Hello World</div>');
  ```

**[⬆ Trở về đầu](#danh-mục)**

## Ajax

[Fetch API](https://fetch.spec.whatwg.org/) là chuẩn thay thế cho XMLHttpRequest và hoạt động trên mọi trình duyệt hiện đại. Khác với `$.ajax`, `fetch` **không** reject khi server trả về HTTP status lỗi như 404 hay 500; bạn cần tự kiểm tra `response.ok`. Với JSONP, hãy thử [fetch-jsonp](https://github.com/camsong/fetch-jsonp).

- [4.0](#4.0) <a name='4.0'></a> Lấy dữ liệu JSON

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

- [4.0.1](#4.0.1) <a name='4.0.1'></a> Gửi dữ liệu JSON bằng POST

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

- [4.0.2](#4.0.2) <a name='4.0.2'></a> Hủy request và đặt timeout

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

- [4.1](#4.1) <a name='4.1'></a> Tải dữ liệu từ server và đặt HTML trả về vào element được chọn.

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

**[⬆ Trở về đầu](#danh-mục)**

## Events

- [5.1](#5.1) <a name='5.1'></a> Bind event bằng on

  ```js
  // jQuery
  $el.on(eventName, eventHandler);

  // Native
  el.addEventListener(eventName, eventHandler);
  ```

- [5.1.1](#5.1.1) <a name='5.1.1'></a> Bind event chỉ một lần bằng one

  ```js
  // jQuery
  $el.one(eventName, eventHandler);

  // Native
  el.addEventListener(eventName, eventHandler, { once: true });
  ```

- [5.1.2](#5.1.2) <a name='5.1.2'></a> Ủy quyền sự kiện (event delegation)

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

- [5.2](#5.2) <a name='5.2'></a> Unbind event bằng off

  ```js
  // jQuery
  $el.off(eventName, eventHandler);

  // Native
  el.removeEventListener(eventName, eventHandler);

  // Native: gỡ nhiều listener cùng một lúc, tương tự namespace của jQuery
  const controller = new AbortController();
  el.addEventListener('click', onClick, { signal: controller.signal });
  el.addEventListener('keydown', onKeydown, { signal: controller.signal });
  controller.abort();
  ```

- [5.3](#5.3) <a name='5.3'></a> Trigger

  ```js
  // jQuery
  $(el).trigger('custom-event', {key1: 'data'});

  // Native. Event của jQuery mặc định có bubble, còn event native thì không, trừ khi đặt `bubbles: true`.
  // Đọc dữ liệu từ `event.detail` trong handler.
  const event = new CustomEvent('custom-event', {
    bubbles: true,
    cancelable: true,
    detail: { key1: 'data' },
  });

  el.dispatchEvent(event);
  ```

**[⬆ Trở về đầu](#danh-mục)**

## Hàm tiện ích

- [6.1](#6.1) <a name='6.1'></a> isArray

  ```js
  // jQuery
  $.isArray(array);

  // Native
  Array.isArray(array);
  ```

- [6.2](#6.2) <a name='6.2'></a> Trim

  ```js
  // jQuery
  $.trim(string);

  // Native
  string.trim();
  ```

- [6.3](#6.3) <a name='6.3'></a> Object Assign

  Gộp nội dung của hai hay nhiều object vào một object mới mà không làm thay đổi các object truyền vào.
  Giống như `$.extend` khi không dùng `deep`, `Object.assign` và cú pháp spread chỉ tạo ra bản sao nông (shallow copy).

  ```js
  // jQuery
  $.extend({}, object1, object2);

  // Native
  Object.assign({}, object1, object2);

  // Native (spread)
  ({ ...object1, ...object2 });
  ```

  Sao chép sâu (deep copy) một object:

  ```js
  // jQuery
  $.extend(true, {}, object);

  // Native. Không thể clone function và DOM node
  structuredClone(object);
  ```

- [6.4](#6.4) <a name='6.4'></a> Contains

  ```js
  // jQuery
  $.contains(el, child);

  // Native
  el !== child && el.contains(child);
  ```

**[⬆ Trở về đầu](#danh-mục)**

## Các trình duyệt hỗ trợ

![Chrome][chrome-image] | ![Edge][edge-image] | ![Firefox][firefox-image] | ![Safari][safari-image] | ![Opera][opera-image]
--- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ |

Một vài đoạn code sử dụng các API mới hơn: `Promise.withResolvers()` (2024), `el.replaceChildren()` (2020) và `AbortSignal.timeout()` (2022). Nếu bạn cần hỗ trợ các trình duyệt cũ hơn, hãy kiểm tra trên [Baseline](https://web.dev/baseline).

# Giấy phép

MIT

[chrome-image]: https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png
[firefox-image]: https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png
[edge-image]: https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png
[opera-image]: https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png
[safari-image]: https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png
