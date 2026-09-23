## Anda tidak memerlukan jQuery

Perkembangan environment frontend sangatlah pesat, dimana banyak browser sudah mengimplementasikan DOM/BOM APIs dengan baik. Kita tidak perlu lagi belajar jQuery dari nol untuk keperluan memanipulasi DOM atau events. Secara bersamaan; dengan berterimakasih kepada library frontend terkini seperti React, Angular dan Vue; Memanipulasi DOM secara langsung telah menjadi anti-pattern atau sesuatu yang tidak perlu dilakukan lagi. Dengan kata lain, jQuery sekarang menjadi semakin tidak diperlukan. Projek ini memberikan informasi mengenai metode alternatif dari jQuery untuk implementasi Native.

Cuplikan kode di sini ditujukan untuk browser evergreen terkini (Chrome, Edge, Firefox, Safari). Internet Explorer sudah tidak didukung lagi oleh Microsoft, sehingga fallback khusus untuk IE telah dihapus. Jika anda masih membutuhkannya, lihat [versi terakhir yang kompatibel dengan IE](https://github.com/camsong/You-Dont-Need-jQuery/tree/c4e00b3).


## Daftar Isi

1. [Terjemahan](#translation)
1. [Query Selector](#query-selector)
1. [CSS & Style](#css-style)
1. [DOM Manipulation](#dom-manipulation)
1. [Ajax](#ajax)
1. [Events](#events)
1. [Utilities](#utilities)
1. [Browser Support](#browser-yang-di-support)

## Terjemahan

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

Untuk selector-selector umum seperti class, id atau attribute, kita dapat menggunakan `document.querySelector` atau `document.querySelectorAll` sebagai pengganti. Perbedaan diantaranya adalah:
* `document.querySelector` mengembalikan elemen pertama yang cocok
* `document.querySelectorAll` mengembalikan semua elemen yang cocok sebagai NodeList statis. NodeList ini mendukung `forEach`, dan bisa dikonversikan menjadi Array dengan `Array.from(document.querySelectorAll(selector))`
* Bila tidak ada elemen yang cocok, jQuery akan mengembalikan objek jQuery kosong dan `document.querySelectorAll` akan mengembalikan NodeList kosong, sedangkan `document.querySelector` akan mengembalikan `null`. Mohon diperhatikan mengenai Null Pointer Exception.

> Perhatian: `document.getElementById`, `document.getElementsByClassName` dan `document.getElementsByTagName` sedikit lebih cepat dibandingkan `querySelector*`, tetapi `getElementsBy*` mengembalikan HTMLCollection yang *live*, yang ikut berubah setiap kali DOM berubah. Utamakan `querySelector*`, kecuali anda sudah mengukurnya dan benar-benar menemukan bottleneck.

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

- [1.3](#1.3) <a name='1.3'></a> Query menggunakan attribute

  ```js
  // jQuery
  $('a[target=_blank]');

  // Native
  document.querySelectorAll('a[target=_blank]');
  ```

- [1.4](#1.4) <a name='1.4'></a> Pencarian.

  + Mencari nodes

    ```js
    // jQuery
    $el.find('li');

    // Native
    el.querySelectorAll('li');
    ```

  + Mencari body

    ```js
    // jQuery
    $('body');

    // Native
    document.body;
    ```

  + Mencari Attribute

    ```js
    // jQuery
    $el.attr('foo');

    // Native
    el.getAttribute('foo');
    ```

  + Mencari data attribute

    ```js
    // jQuery
    $el.data('foo');

    // Native
    el.dataset.foo;

    // or
    el.getAttribute('data-foo');
    ```

- [1.5](#1.5) <a name='1.5'></a> Elemen-elemen Sibling/Previous/Next

  + Elemen Sibling

    ```js
    // jQuery
    $el.siblings();

    // Native
    [...el.parentNode.children].filter((child) =>
      child !== el
    );
    ```

  + Elemen Previous

    ```js
    // jQuery
    $el.prev();

    // Native
    el.previousElementSibling;

    ```

  + Elemen Next

    ```js
    // jQuery
    $el.next();

    // Native
    el.nextElementSibling;
    ```

- [1.6](#1.6) <a name='1.6'></a> Closest

  Mengembalikan elemen sama yang digunakan dari selector pertama, dengan cara mencari elemen-sekarang sampai ke document.

  ```js
  // jQuery
  $el.closest(selector);

  // Native
  el.closest(selector);
  ```

- [1.7](#1.7) <a name='1.7'></a> Parents Until

  Digunakan untuk mendapatkan "ancestor" dari setiap elemen yang ditemukan. Namun tidak termasuk elemen-sekarang yang sudah didapat dari pencarian oleh selector, DOM node, atau object jQuery.

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

  `$('iframe').contents()` mengembalikan `contentDocument`

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

**[⬆ back to top](#daftar-isi)**

## CSS Style

- [2.1](#2.1) <a name='2.1'></a> CSS

  + Get style

    ```js
    // jQuery
    $el.css('color');

    // Native
    // PERHATIAN: yang dikembalikan adalah nilai yang sudah di-resolve, misalnya 'rgb(255, 0, 17)' dan bukan '#f01'
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

  Secara teori, width dan height identik, contohnya Height:

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

**[⬆ back to top](#daftar-isi)**

## DOM Manipulation

- [3.1](#3.1) <a name='3.1'></a> Remove
  ```js
  // jQuery
  $el.remove();

  // Native
  el.remove();
  ```

- [3.2](#3.2) <a name='3.2'></a> Text

  + Get text

    ```js
    // jQuery
    $el.text();

    // Native
    el.textContent;
    ```

  + Set text

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

  Menambahkan elemen-anak setelah anak terakhir dari elemen-parent

  ```js
  // jQuery: sintaks yang seragam untuk DOMString dan objek Node
  $parent.append(newEl | '<div id="container">Hello World</div>');

  // Native (Element atau teks): string disisipkan sebagai teks biasa, tidak di-parse sebagai HTML
  parent.append(newEl | 'Hello World');

  // Native (string HTML)
  parent.insertAdjacentHTML('beforeend', '<div id="container">Hello World</div>');
  ```

- [3.5](#3.5) <a name='3.5'></a> Prepend

  ```js
  // jQuery: sintaks yang seragam untuk DOMString dan objek Node
  $parent.prepend(newEl | '<div id="container">Hello World</div>');

  // Native (Element atau teks): string disisipkan sebagai teks biasa, tidak di-parse sebagai HTML
  parent.prepend(newEl | 'Hello World');

  // Native (string HTML)
  parent.insertAdjacentHTML('afterbegin', '<div id="container">Hello World</div>');
  ```

- [3.6](#3.6) <a name='3.6'></a> insertBefore

  Memasukkan node baru sebelum elemen yang dipilih.

  ```js
  // jQuery
  $newEl.insertBefore(selector);

  const el = document.querySelector(selector);

  // Native (Element)
  el.before(newEl);

  // Native (string HTML)
  el.insertAdjacentHTML('beforebegin', '<div id="container">Hello World</div>');
  ```

- [3.7](#3.7) <a name='3.7'></a> insertAfter

  Memasukkan node baru sesudah elemen yang dipilih.

  ```js
  // jQuery
  $newEl.insertAfter(selector);

  const el = document.querySelector(selector);

  // Native (Element)
  el.after(newEl);

  // Native (string HTML)
  el.insertAdjacentHTML('afterend', '<div id="container">Hello World</div>');
  ```

**[⬆ back to top](#daftar-isi)**

## Ajax

[Fetch API](https://fetch.spec.whatwg.org/) adalah pengganti standar untuk XMLHttpRequest dan sudah bisa digunakan di semua browser modern. Berbeda dengan `$.ajax`, `fetch` **tidak** melakukan reject ketika menerima status error HTTP seperti 404 atau 500; anda perlu memeriksa `response.ok` sendiri. Untuk JSONP, coba gunakan [fetch-jsonp](https://github.com/camsong/fetch-jsonp).

- [4.0](#4.0) <a name='4.0'></a> Mengambil data JSON

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

- [4.0.1](#4.0.1) <a name='4.0.1'></a> Mengirim data JSON dengan POST

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

- [4.0.2](#4.0.2) <a name='4.0.2'></a> Membatalkan request dan timeout

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

- [4.1](#4.1) <a name='4.1'></a> Memuat data dari server dan menempatkan HTML yang diterima ke dalam elemen yang cocok.

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

**[⬆ back to top](#daftar-isi)**

## Events

- [5.1](#5.1) <a name='5.1'></a> Bind event dengan menggunakan on

  ```js
  // jQuery
  $el.on(eventName, eventHandler);

  // Native
  el.addEventListener(eventName, eventHandler);
  ```

- [5.1.1](#5.1.1) <a name='5.1.1'></a> Bind event sekali saja dengan menggunakan one

  ```js
  // jQuery
  $el.one(eventName, eventHandler);

  // Native
  el.addEventListener(eventName, eventHandler, { once: true });
  ```

- [5.1.2](#5.1.2) <a name='5.1.2'></a> Delegasi event

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

- [5.2](#5.2) <a name='5.2'></a> Unbind event dengan menggunakan off

  ```js
  // jQuery
  $el.off(eventName, eventHandler);

  // Native
  el.removeEventListener(eventName, eventHandler);

  // Native: hapus beberapa listener sekaligus, seperti namespace di jQuery
  const controller = new AbortController();
  el.addEventListener('click', onClick, { signal: controller.signal });
  el.addEventListener('keydown', onKeydown, { signal: controller.signal });
  controller.abort();
  ```

- [5.3](#5.3) <a name='5.3'></a> Trigger

  ```js
  // jQuery
  $(el).trigger('custom-event', {key1: 'data'});

  // Native. Event jQuery melakukan bubbling, sedangkan event native tidak, kecuali dengan `bubbles: true`.
  // Baca datanya dari `event.detail` di dalam handler.
  const event = new CustomEvent('custom-event', {
    bubbles: true,
    cancelable: true,
    detail: { key1: 'data' },
  });

  el.dispatchEvent(event);
  ```

**[⬆ back to top](#daftar-isi)**

## Utilities

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

  Menggabungkan isi dari dua object atau lebih ke dalam sebuah object baru, tanpa mengubah argumen-argumennya.
  Sama seperti `$.extend` tanpa `deep`, `Object.assign` dan spread hanya membuat salinan dangkal (shallow copy).

  ```js
  // jQuery
  $.extend({}, object1, object2);

  // Native
  Object.assign({}, object1, object2);

  // Native (spread)
  ({ ...object1, ...object2 });
  ```

  Deep copy untuk satu object:

  ```js
  // jQuery
  $.extend(true, {}, object);

  // Native. Function dan node DOM tidak bisa di-clone
  structuredClone(object);
  ```

- [6.4](#6.4) <a name='6.4'></a> Contains

  ```js
  // jQuery
  $.contains(el, child);

  // Native
  el !== child && el.contains(child);
  ```

**[⬆ back to top](#daftar-isi)**

## Browser yang di Support

![Chrome][chrome-image] | ![Edge][edge-image] | ![Firefox][firefox-image] | ![Safari][safari-image] | ![Opera][opera-image]
--- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ |

Beberapa cuplikan kode menggunakan API yang lebih baru: `Promise.withResolvers()` (2024), `el.replaceChildren()` (2020) dan `AbortSignal.timeout()` (2022). Periksa [Baseline](https://web.dev/baseline) jika anda masih perlu mendukung browser yang lebih lama.

# License

MIT

[chrome-image]: https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png
[firefox-image]: https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png
[edge-image]: https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png
[opera-image]: https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png
[safari-image]: https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png
