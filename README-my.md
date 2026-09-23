## Anda tidak memerlukan jQuery

Mutakhir ini perkembangan dalam persekitaran frontend berlaku begitu pesat sekali. Justeru itu kebanyakan pelayar moden telahpun menyediakan API yang memadai untuk pengaksesan DOM/BOM. Kita tak payah lagi belajar jQuery dari asas untuk memanipulasi DOM dan acara-acara. Projek ini menawarkan perlaksanaan alternatif kepada kebanyakan kaedah-kaedah jQuery.

Contoh kod dalam panduan ini menyasarkan pelayar *evergreen* terkini yang dikemas kini secara automatik (Chrome, Edge, Firefox, Safari). Internet Explorer tidak lagi disokong oleh Microsoft, justeru kod sandaran (fallback) khusus untuk IE telah dikeluarkan. Jika anda masih memerlukannya, rujuk [versi terakhir yang serasi dengan IE](https://github.com/camsong/You-Dont-Need-jQuery/tree/c4e00b3).

## Isi Kandungan

1. [Terjemahan](#terjemahan)
1. [Pemilihan elemen](#pemilihan-elemen)
1. [CSS & Penggayaan](#css--style)
1. [Manipulasi DOM](#dom-manipulation)
1. [Ajax](#ajax)
1. [Events](#events)
1. [Utiliti](#utility)
1. [Browser Support](#sokongan-pelayar)

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

## Pemilihan Elemen

Pemilihan elemen yang umum seperti class, id atau atribut, biasanya kita boleh pakai `document.querySelector` atau `document.querySelectorAll` sebagai ganti. Bezanya terletak pada
* `document.querySelector` akan mengembalikan elemen pertama sekali yang sepadan dijumpai
* `document.querySelectorAll` akan mengembalikan kesemua elemen yang sepadan dijumpai sebagai sebuah NodeList statik. Ia menyokong `forEach`, dan boleh ditukar ke dalam bentuk array menggunakan `Array.from(document.querySelectorAll(selector))`
* Sekiranya tiada elemen yang sepadan dijumpai, jQuery akan mengembalikan objek jQuery yang kosong dan `document.querySelectorAll` akan mengembalikan NodeList yang kosong, manakala `document.querySelector` pula akan mengembalikan `null`.

> PERHATIAN: `document.getElementById`, `document.getElementsByClassName` dan `document.getElementsByTagName` sedikit lebih pantas berbanding `querySelector*`, tetapi `getElementsBy*` mengembalikan HTMLCollection yang *live*, iaitu ia turut berubah apabila DOM berubah. Utamakan `querySelector*` melainkan anda telah membuat pengukuran dan mendapati ia benar-benar menjadi punca kelembapan (bottleneck).

- [1.1](#1.1) <a name='1.1'></a> Pemilihan menggunakan class

  ```js
  // jQuery
  $('.class');

  // Native
  document.querySelectorAll('.class');

  // atau
  document.getElementsByClassName('class');
  ```

- [1.2](#1.2) <a name='1.2'></a> Pemilihan menggunakan id

  ```js
  // jQuery
  $('#id');

  // Native
  document.querySelector('#id');

  // atau
  document.getElementById('id');
  ```

- [1.3](#1.3) <a name='1.3'></a> Pemilihan menggunakan atribut

  ```js
  // jQuery
  $('a[target=_blank]');

  // Native
  document.querySelectorAll('a[target=_blank]');
  ```

- [1.4](#1.4) <a name='1.4'></a> Cari sth.

  + Find nodes

    ```js
    // jQuery
    $el.find('li');

    // Native
    el.querySelectorAll('li');
    ```

  + Cari body

    ```js
    // jQuery
    $('body');

    // Native
    document.body;
    ```

  + Cari Attribute

    ```js
    // jQuery
    $el.attr('foo');

    // Native
    el.getAttribute('foo');
    ```

  + Cari atribut data

    ```js
    // jQuery
    $el.data('foo');

    // Native
    el.dataset.foo;

    // atau
    el.getAttribute('data-foo');
    ```

- [1.5](#1.5) <a name='1.5'></a> Sibling/Previous/Next Elements

  + Sibling elements

    ```js
    // jQuery
    $el.siblings();

    // Native
    [...el.parentNode.children].filter((child) =>
      child !== el
    );
    ```

  + Previous elements

    ```js
    // jQuery
    $el.prev();

    // Native
    el.previousElementSibling;
    ```

  + Next elements

    ```js
    // jQuery
    $el.next();

    // Native
    el.nextElementSibling;
    ```

- [1.6](#1.6) <a name='1.6'></a> Closest

  Return the first matched element by provided selector, traversing from current element to document.

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

**[⬆ back to top](#isi-kandungan)**

## CSS & Style

- [2.1](#2.1) <a name='2.1'></a> CSS

  + Get style

    ```js
    // jQuery
    $el.css('color');

    // Native
    // NOTA: mengembalikan nilai yang telah diselesaikan (resolved value), cth. 'rgb(255, 0, 17)' dan bukannya '#f01'
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

**[⬆ back to top](#isi-kandungan)**

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

  append child element after the last child of parent element

  ```js
  // jQuery: sintaks yang sama untuk objek DOMString dan Node
  $parent.append(newEl | '<div id="container">Hello World</div>');

  // Native (Element atau teks): rentetan dimasukkan sebagai teks biasa, bukan dihuraikan sebagai HTML
  parent.append(newEl | 'Hello World');

  // Native (rentetan HTML)
  parent.insertAdjacentHTML('beforeend', '<div id="container">Hello World</div>');
  ```

- [3.5](#3.5) <a name='3.5'></a> Prepend

  ```js
  // jQuery: sintaks yang sama untuk objek DOMString dan Node
  $parent.prepend(newEl | '<div id="container">Hello World</div>');

  // Native (Element atau teks): rentetan dimasukkan sebagai teks biasa, bukan dihuraikan sebagai HTML
  parent.prepend(newEl | 'Hello World');

  // Native (rentetan HTML)
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

  // Native (rentetan HTML)
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

  // Native (rentetan HTML)
  el.insertAdjacentHTML('afterend', '<div id="container">Hello World</div>');
  ```

**[⬆ back to top](#isi-kandungan)**

## Ajax

[Fetch API](https://fetch.spec.whatwg.org/) ialah pengganti standard bagi XMLHttpRequest dan berfungsi dalam semua pelayar moden. Tidak seperti `$.ajax`, `fetch` **tidak** menolak (reject) promise apabila menerima status ralat HTTP seperti 404 atau 500; anda perlu menyemak `response.ok` sendiri. Untuk JSONP, cuba [fetch-jsonp](https://github.com/camsong/fetch-jsonp).

- [4.0](#4.0) <a name='4.0'></a> Mendapatkan data JSON

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

- [4.0.1](#4.0.1) <a name='4.0.1'></a> Menghantar data JSON dengan POST

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

- [4.0.2](#4.0.2) <a name='4.0.2'></a> Membatalkan permintaan dan had masa

  ```js
  // jQuery
  const jqXHR = $.ajax({ url, timeout: 5000 });
  jqXHR.abort();

  // Native
  const controller = new AbortController();
  fetch(url, { signal: controller.signal });
  controller.abort();

  // Native (had masa)
  fetch(url, { signal: AbortSignal.timeout(5000) });
  ```

- [4.1](#4.1) <a name='4.1'></a> Muatkan data daripada pelayan dan letakkan HTML yang dikembalikan ke dalam elemen yang sepadan.

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

**[⬆ back to top](#isi-kandungan)**

## Events

- [5.1](#5.1) <a name='5.1'></a> Bind an event with on

  ```js
  // jQuery
  $el.on(eventName, eventHandler);

  // Native
  el.addEventListener(eventName, eventHandler);
  ```

- [5.1.1](#5.1.1) <a name='5.1.1'></a> Mengikat acara sekali sahaja dengan one

  ```js
  // jQuery
  $el.one(eventName, eventHandler);

  // Native
  el.addEventListener(eventName, eventHandler, { once: true });
  ```

- [5.1.2](#5.1.2) <a name='5.1.2'></a> Delegasi acara

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

  // Native: alih keluar beberapa pendengar acara sekali gus, seperti ruang nama (namespace) dalam jQuery
  const controller = new AbortController();
  el.addEventListener('click', onClick, { signal: controller.signal });
  el.addEventListener('keydown', onKeydown, { signal: controller.signal });
  controller.abort();
  ```

- [5.3](#5.3) <a name='5.3'></a> Trigger

  ```js
  // jQuery
  $(el).trigger('custom-event', {key1: 'data'});

  // Native. Acara jQuery merambat naik (bubble), tetapi acara native tidak melainkan `bubbles: true` ditetapkan.
  // Baca data daripada `event.detail` di dalam pengendali acara.
  const event = new CustomEvent('custom-event', {
    bubbles: true,
    cancelable: true,
    detail: { key1: 'data' },
  });

  el.dispatchEvent(event);
  ```

**[⬆ back to top](#isi-kandungan)**

## Utility

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

  Gabungkan kandungan dua atau lebih objek ke dalam satu objek baharu tanpa mengubah mana-mana argumen.
  Sama seperti `$.extend` tanpa `deep`, `Object.assign` dan sintaks spread hanya membuat salinan cetek (shallow copy).

  ```js
  // jQuery
  $.extend({}, object1, object2);

  // Native
  Object.assign({}, object1, object2);

  // Native (spread)
  ({ ...object1, ...object2 });
  ```

  Membuat salinan dalam (deep copy) bagi satu objek:

  ```js
  // jQuery
  $.extend(true, {}, object);

  // Native. Fungsi dan nod DOM tidak boleh diklon
  structuredClone(object);
  ```

- [6.4](#6.4) <a name='6.4'></a> Contains

  ```js
  // jQuery
  $.contains(el, child);

  // Native
  el !== child && el.contains(child);
  ```

**[⬆ back to top](#isi-kandungan)**

## Sokongan Pelayar

![Chrome][chrome-image] | ![Edge][edge-image] | ![Firefox][firefox-image] | ![Safari][safari-image] | ![Opera][opera-image]
--- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ |

Beberapa contoh kod menggunakan API yang lebih baharu: `Promise.withResolvers()` (2024), `el.replaceChildren()` (2020) dan `AbortSignal.timeout()` (2022). Semak [Baseline](https://web.dev/baseline) jika anda perlu menyokong pelayar yang lebih lama.

# Lesen

MIT

[chrome-image]: https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png
[firefox-image]: https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png
[edge-image]: https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png
[opera-image]: https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png
[safari-image]: https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png
