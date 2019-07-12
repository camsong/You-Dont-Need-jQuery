## Nie Potrzebujesz jQuery

Środowiska frontendowe rozwijają się błyskawicznie, nowsze przeglądarki zaimplementowały już większą część API DOM/BOM, które są całkiem użyteczne. Nie musimy uczyć się jQuery od podstaw by manipulować modelem dokumentu lub obsługiwać zdarzenia. Tymczasem, dzięki coraz większej dominacji bibliotek frontendowych takich jak React, Angular czy Vue, obsługa DOM bezpośrednio staje się antywzorcem projektowym, a jQuery coraz bardziej traci na znaczeniu. Ten projekt pokazuje w jaki sposób można zastąpić większość metod jQuery korzystając z natywnej implementacji, ze wsparciem dla IE 10+.

## Spis treści

1. [Tłumaczenia](#tłumaczenia)
1. [Wybór przez selektory](#wybór-przez-selektory)
1. [CSS i styl](#css-i-styl)
1. [Manipulacja DOM](#manipulacja-dom)
1. [Ajax](#ajax)
1. [Zdarzenia](#zdarzenia)
1. [Funkcje użytkowe](#funkcje-użytkowe)
1. [Obietnice](#obietnice)
1. [Animacja](#animacja)
1. [Alternatywy](#alternatywy)
1. [Wsparcie przeglądarek](#wsparcie-przeglądarek)

## Tłumaczenia

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

## Wybór przez Selektory

Zamiast korzystania z powszechnych selektorów takich jak klasa, id czy też atrybut, możemy użyć `document.querySelector` lub `document.querySelectorAll`. Różnica między nimi to:
* `document.querySelector` zwraca pierwszy pasujący element
* `document.querySelectorAll` zwraca wszystkie elementy jako NodeList. Może zostać przekształcony do tablicy przy użyciu `Array.prototype.slice.call(document.querySelectorAll(selector));`
* Jeżeli żaden element nie został znaleziony, jQuery oraz `document.querySelectorAll` zwrócą `[]`, a `document.querySelector` zwróci `null`.

> Uwaga: `document.querySelector` i `document.querySelectorAll` są dosyć **WOLNE**, staraj się używać `document.getElementById`, `document.getElementsByClassName` lub `document.getElementsByTagName` jeżeli chcesz zwiększyć wydajność.

- [1.0](#1.0) <a name='1.0'></a> Wybór przez selektor

  ```js
  // jQuery
  $('selector');

  // Natywnie
  document.querySelectorAll('selector');
  ```

- [1.1](#1.1) <a name='1.1'></a> Wybór przez klasę

  ```js
  // jQuery
  $('.class');

  // Natywnie
  document.querySelectorAll('.class');

  // lub
  document.getElementsByClassName('class');
  ```

- [1.2](#1.2) <a name='1.2'></a> Wybór przez id

  ```js
  // jQuery
  $('#id');

  // Natywnie
  document.querySelector('#id');

  // lub
  document.getElementById('id');
  ```

- [1.3](#1.3) <a name='1.3'></a> Wybór przez atrybut

  ```js
  // jQuery
  $('a[target=_blank]');

  // Natywnie
  document.querySelectorAll('a[target=_blank]');
  ```

- [1.4](#1.4) <a name='1.4'></a> Wybór spośród potomków

  ```js
  // jQuery
  $el.find('li');

  // Natywnie
  el.querySelectorAll('li');
  ```

- [1.5](#1.5) <a name='1.5'></a> Rodzeństwo, Poprzednie/Następne elementy

  + Rodzeństwo

    ```js
    // jQuery
    $el.siblings();

    // Natywnie
    Array.prototype.filter.call(el.parentNode.children, (child) =>
      child !== el
    );
    ```

  + Poprzednie elementy

    ```js
    // jQuery
    $el.prev();

    // Natywnie
    el.previousElementSibling;
    ```

  + Następne elementy

    ```js
    // jQuery
    $el.next();

    // Natywnie
    el.nextElementSibling;
    ```

- [1.6](#1.6) <a name='1.6'></a> Najbliższy

  Zwraca pierwszy pasujący element przez podany selektor, sprawdzając kolejno elementy od bieżącego.

  ```js
  // jQuery
  $el.closest(selector);

  // Natywnie - Tylko najnowsze, bez wsparcia w IE
  el.closest(selector);

  // Natywnie - IE10+
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

- [1.7](#1.7) <a name='1.7'></a> Rodzice dopóki

  Zwraca potomków każdego elementu w bieżącym zbiorze pasujących elementów, aż do elementu dopasowanego przez selektor, węzeł DOM, lub obiekt jQuery.

  ```js
  // jQuery
  $el.parentsUntil(selector, filter);

  // Natywnie
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

- [1.8](#1.8) <a name='1.8'></a> Formularze

  + Pola tekstowe

    ```js
    // jQuery
    $('#my-input').val();

    // Natywnie
    document.querySelector('#my-input').value;
    ```

  + Otrzymanie indeksu `e.currentTarget` wewnątrz elementów `.radio`

    ```js
    // jQuery
    $('.radio').index(e.currentTarget);

    // Natywnie
    Array.prototype.indexOf.call(document.querySelectorAll('.radio'), e.currentTarget);
    ```

- [1.9](#1.9) <a name='1.9'></a> Zawartość ramek

  `$('iframe').contents()` zwraca `contentDocument` tego iframe

  + Zawartość ramki

    ```js
    // jQuery
    $iframe.contents();

    // Natywnie
    iframe.contentDocument;
    ```

  + Wybór elementu ramki

    ```js
    // jQuery
    $iframe.contents().find('.css');

    // Natywnie
    iframe.contentDocument.querySelectorAll('.css');
    ```

- [1.10](#1.10) <a name='1.10'></a> Otrzymanie body

  ```js
  // jQuery
  $('body');

  // Native
  document.body;
  ```

- [1.11](#1.11) <a name='1.11'></a> Akcesory atrybutów

  + Otrzymanie wartości atrybutu

    ```js
    // jQuery
    $el.attr('foo');

    // Natywnie
    el.getAttribute('foo');
    ```
  + Ustawienie wartości atrybutu

    ```js
    // jQuery, działa w pamięci bez zmiany DOM
    $el.attr('foo', 'bar');

    // Natywnie
    el.setAttribute('foo', 'bar');
    ```

  + Otrzymanie wartości atrybutu `data-`

    ```js
    // jQuery
    $el.data('foo');

    // Natywnie (użycie `getAttribute`)
    el.getAttribute('data-foo');

    // Natywnie (użycie `dataset` jeżeli wspierasz tylko przeglądarki IE 11+)
    el.dataset['foo'];
    ```

**[⬆ powrót](#spis-treści)**

## CSS i styl

- [2.1](#2.1) <a name='2.1'></a> CSS

  + Otrzymanie stylu

    ```js
    // jQuery
    $el.css('color');

    // Natywnie
    // UWAGA: Znany bug, zwróci 'auto' jeżeli wartość style wynosi 'auto'
    const win = el.ownerDocument.defaultView;

    // null oznacza, że nie zostaną zwrócone pseudostyle
    win.getComputedStyle(el, null).color;
    ```

  + Ustawienie stylu

    ```js
    // jQuery
    $el.css({ color: '#f01' });

    // Natywnie
    el.style.color = '#f01';
    ```

  + Otrzymanie/Ustawienie stylów

    Jeżeli chcesz ustawić wiele stylów jednocześnie, możesz odwołać się do metody [setStyles](https://github.com/oneuijs/oui-dom-utils/blob/master/src/index.js#L194) w pakiecie oui-dom-utils.


  + Dodanie klasy

    ```js
    // jQuery
    $el.addClass(className);

    // Natywnie
    el.classList.add(className);
    ```

  + Usunięcie klasy

    ```js
    // jQuery
    $el.removeClass(className);

    // Natywnie
    el.classList.remove(className);
    ```

  + Sprawdzenie czy element posiada klasę

    ```js
    // jQuery
    $el.hasClass(className);

    // Natywnie
    el.classList.contains(className);
    ```

  + Przełączenie klasy

    ```js
    // jQuery
    $el.toggleClass(className);

    // Natywnie
    el.classList.toggle(className);
    ```

- [2.2](#2.2) <a name='2.2'></a> Szerokość i wysokość

  Manipulowanie szerokością i wysokością jest teoretycznie takie samo, dla przykładu użycie wysokości:

  + Wysokość okna

    ```js
    // window height
    $(window).height();

    // z paskiem przewijania
    window.document.documentElement.clientHeight;

    // bez paska, działa jak jQuery
    window.innerHeight;
    ```

  + Wysokość dokumentu

    ```js
    // jQuery
    $(document).height();

    // Natywnie
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

  + Wysokość elementu

    ```js
    // jQuery
    $el.height();

    // Natywnie
    function getHeight(el) {
      const styles = window.getComputedStyle(el);
      const height = el.offsetHeight;
      const borderTopWidth = parseFloat(styles.borderTopWidth);
      const borderBottomWidth = parseFloat(styles.borderBottomWidth);
      const paddingTop = parseFloat(styles.paddingTop);
      const paddingBottom = parseFloat(styles.paddingBottom);
      return height - borderBottomWidth - borderTopWidth - paddingTop - paddingBottom;
    }

    // dokładne do części całkowitej（jeżeli `border-box`, wtedy `height - border`; jeżeli `content-box`, wtedy `height + padding`）
    el.clientHeight;

    // dokładne do części dziesiętnej（jeżeli `border-box`, wtedy `height`; jeżeli `content-box`, wtedy `height + padding + border`）
    el.getBoundingClientRect().height;
    ```

- [2.3](#2.3) <a name='2.3'></a> Pozycja i przesunięcie

  + Pozycja

    Otrzymanie bieżącej pozycji elementu relatywnie do przesunięcia rodzica.

    ```js
    // jQuery
    $el.position();

    // Natywnie
    { left: el.offsetLeft, top: el.offsetTop }
    ```

  + Przesunięcie

    Otrzymanie bieżącej pozycji elementu relatywnie do dokumentu.

    ```js
    // jQuery
    $el.offset();

    // Natywnie
    function getOffset (el) {
      const box = el.getBoundingClientRect();

      return {
        top: box.top + window.pageYOffset - document.documentElement.clientTop,
        left: box.left + window.pageXOffset - document.documentElement.clientLeft
      };
    }
    ```

- [2.4](#2.4) <a name='2.4'></a> Przesunięcie widoku

  Otrzymanie bieżącego przesunięcia w pionie elementu.

  ```js
  // jQuery
  $(window).scrollTop();

  // Natywnie
  (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
  ```

**[⬆ wróć](#spis-treści)**

## Manipulacja DOM

- [3.1](#3.1) <a name='3.1'></a> Usuwanie

  Usunięcie elementu z DOM.

  ```js
  // jQuery
  $el.remove();

  // Natywnie
  el.parentNode.removeChild(el);
  ```

- [3.2](#3.2) <a name='3.2'></a> Tekst

  + Otrzymanie tekstu

    Otrzymanie połączonej zawartości tekstowej elementu, włącznie z jego potomkami,

    ```js
    // jQuery
    $el.text();

    // Natywnie
    el.textContent;
    ```

  + Ustawianie tekstu

    Ustawianie zawartości tekstowej elementu do wyznaczonej wartości.

    ```js
    // jQuery
    $el.text(string);

    // Natywnie
    el.textContent = string;
    ```

- [3.3](#3.3) <a name='3.3'></a> HTML

  + Otrzymanie HTML

    ```js
    // jQuery
    $el.html();

    // Natywnie
    el.innerHTML;
    ```

  + Ustawianie HTML

    ```js
    // jQuery
    $el.html(htmlString);

    // Natywnie
    el.innerHTML = htmlString;
    ```

- [3.4](#3.4) <a name='3.4'></a> Dodawanie na koniec

  Dodanie elementu jako dziecko po ostatnim dziecku elementu rodzica

  ```js
  // jQuery
  $el.append('<div id="container">Hello World</div>');

  // Natywnie (tekst HTML)
  el.insertAdjacentHTML('beforeend', '<div id="container">Hello World</div>');

  // Natywnie (Element)
  el.appendChild(newEl);
  ```

- [3.5](#3.5) <a name='3.5'></a> Dodawanie na początek

  ```js
  // jQuery
  $el.prepend('<div id="container">Hello World</div>');

  // Natywnie (tekst HTML)
  el.insertAdjacentHTML('afterbegin', '<div id="container">Hello World</div>');

  // Natywnie (Element)
  el.insertBefore(newEl, el.firstChild);
  ```

- [3.6](#3.6) <a name='3.6'></a> Dodawanie przed

  Dodanie nowego węzła przed wybranymi elementami

  ```js
  // jQuery
  $newEl.insertBefore(selector);

  // Natywnie (tekst HTML)
  el.insertAdjacentHTML('beforebegin ', '<div id="container">Hello World</div>');

  // Natywnie (Element)
  const el = document.querySelector(selector);
  if (el.parentNode) {
    el.parentNode.insertBefore(newEl, el);
  }
  ```

- [3.7](#3.7) <a name='3.7'></a> Dodawanie po elemencie

  Dodanie nowego węzła po wybranych elementach

  ```js
  // jQuery
  $newEl.insertAfter(selector);

  // Natywnie (tekst HTML)
  el.insertAdjacentHTML('afterend', '<div id="container">Hello World</div>');

  // Natywnie (Element)
  const el = document.querySelector(selector);
  if (el.parentNode) {
    el.parentNode.insertBefore(newEl, el.nextSibling);
  }
  ```

- [3.8](#3.8) <a name='3.8'></a> Porównywanie

  Zwraca `true` jeżeli podany selektor pasuje do wybranego elementu

  ```js
  // jQuery - Zauważ, że `is` działa również z `function` lub `elements`, które nie są tutaj rozważane
  $el.is(selector);

  // Natywnie
  el.matches(selector);
  ```
- [3.9](#3.9) <a name='3.9'></a> Kopiowanie

  Tworzenie głębokiej kopii wybranego elementu

  ```js
  // jQuery
  $el.clone();

  // Natywnie
  el.cloneNode();

  // Żeby kopiować głęboko, należy ustawić parametr na `true`
  ```

- [3.10](#3.10) <a name='3.10'></a> Wyczyszczenie

  Usuwa wszystkie węzły dzieci

  ```js
  // jQuery
  $el.empty();

  // Natywnie
  el.innerHTML = '';
  ```

- [3.11](#3.11) <a name='3.11'></a> Zawinięcie

  Umieszczenie każdego elementu w strukturze HTML

  ```js
  // jQuery
  $('.inner').wrap('<div class="wrapper"></div>');

  // Natywnie
  Array.prototype.forEach.call(document.querySelectorAll('.inner'), (el) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper';
    el.parentNode.insertBefore(wrapper, el);
    el.parentNode.removeChild(el);
    wrapper.appendChild(el);
  });
  ```

- [3.12](#3.12) <a name='3.12'></a> Odwinięcie

  Usuwa rodziców z pasujących elementów z DOM

  ```js
  // jQuery
  $('.inner').unwrap();

  // Natywnie
  Array.prototype.forEach.call(document.querySelectorAll('.inner'), (el) => {
    Array.prototype.forEach.call(el.childNodes, (child) => {
      el.parentNode.insertBefore(child, el);
    });
    el.parentNode.removeChild(el);
  });
  ```

- [3.13](#3.13) <a name='3.13'></a> Zamiana

  Wymiana każdego elementu ze zbioru pasujących elementów na podaną nową zawartość

  ```js
  // jQuery
  $('.inner').replaceWith('<div class="outer"></div>');

  // Natywnie
  Array.prototype.forEach.call(document.querySelectorAll('.inner'), (el) => {
    const outer = document.createElement('div');
    outer.className = 'outer';
    el.parentNode.insertBefore(outer, el);
    el.parentNode.removeChild(el);
  });
  ```


**[⬆ powrót](#spis-treści)**

## Ajax

[Fetch API](https://fetch.spec.whatwg.org/) jest nowym standardem mającym zastąpić XMLHttpRequest by wykonować ajax. Obecnie działa na Chrome i Firefox, istnieje możliwość użycia tzw. polyfills (wypełnień) by móc używać tej funkcjonalności w starszych przeglądarkach.

Wypróbuj [github/fetch](http://github.com/github/fetch) na IE9+ lub [fetch-ie8](https://github.com/camsong/fetch-ie8/) na IE8+, [fetch-jsonp](https://github.com/camsong/fetch-jsonp) by wykonywać żądania JSONP.

- [4.1](#4.1) <a name='4.1'></a> Ładowanie danych z serwera i umieszczenie zwróconego HTML do pasującego elementu

  ```js
  // jQuery
  $(selector).load(url, completeCallback)

  // Natywnie
  fetch(url).then(data => data.text()).then(data => {
    document.querySelector(selector).innerHTML = data
  }).then(completeCallback)
  ```

**[⬆ powrót](#spis-treści)**

## Zdarzenia

Dla pełnego zastąpienia ze wsparciem przestrzenią nazw i delegowaniem, odnieś się do https://github.com/oneuijs/oui-dom-events

- [5.0](#5.0) <a name='5.0'></a> Dokument gotowy ze zdarzeniem `DOMContentLoaded`

  ```js
  // jQuery
  $(document).ready(eventHandler);

  // Natywnie
  // Sprawdź czy zdarzenie DOMContentLoaded został zakończone
  if (document.readyState !== 'loading') {
    eventHandler();
  } else {
    document.addEventListener('DOMContentLoaded', eventHandler);
  }
  ```

- [5.1](#5.1) <a name='5.1'></a> Nasłuchiwanie funkcji na zdarzenie

  ```js
  // jQuery
  $el.on(eventName, eventHandler);

  // Natywnie
  el.addEventListener(eventName, eventHandler);
  ```

- [5.2](#5.2) <a name='5.2'></a> Zatrzymanie nasłuchiwania

  ```js
  // jQuery
  $el.off(eventName, eventHandler);

  // Natywnie
  el.removeEventListener(eventName, eventHandler);
  ```

- [5.3](#5.3) <a name='5.3'></a> Wywołanie zdarzenia

  ```js
  // jQuery
  $(el).trigger('custom-event', {key1: 'data'});

  // Natywnie
  if (window.CustomEvent) {
    const event = new CustomEvent('custom-event', {detail: {key1: 'data'}});
  } else {
    const event = document.createEvent('CustomEvent');
    event.initCustomEvent('custom-event', true, true, {key1: 'data'});
  }

  el.dispatchEvent(event);
  ```

**[⬆ powrót](#spis-treści)**

## Funkcje użytkowe

Większość funkcji użytkowych można znaleźć w natywnym API. Pozostałe, bardziej zaawansowane funkcje mogą zostać zastąpione lepszymi bibliotekami użytkowymi, które skupiają się na spójności i wydajności. Rekomendowaną biblioteką jest [lodash](https://lodash.com).

- [6.1](#6.1) <a name='6.1'></a> Podstawowe funkcje użytkowe

  + isArray

  Sprawdza czy podany argument jest tablicą.

  ```js
  // jQuery
  $.isArray(array);

  // Natywnie
  Array.isArray(array);
  ```

  + isWindow

  Sprawdza czy podany argument jest oknem.

  ```js
  // jQuery
  $.isWindow(obj);

  // Natywnie
  function isWindow(obj) {
    return obj !== null && obj !== undefined && obj === obj.window;
  }
  ```

  + inArray

  Szuka podanej wartości wewnątrz tablicy i zwraca jej indeks (lub -1 jeżeli nie znaleziono).

  ```js
  // jQuery
  $.inArray(item, array);

  // Natywnie
  array.indexOf(item) > -1;

  // sposób ES6
  array.includes(item);
  ```

  + isNumeric

  Sprawdza czy podany argument jest wartością numeryczną.
  Użyj `typeof` by sprawdzić typ lub przykładu `type` dla większej dokładności.

  ```js
  // jQuery
  $.isNumeric(item);

  // Natywnie
  function isNumeric(value) {
    var type = typeof value;

    return (type === 'number' || type === 'string') && !Number.isNaN(value - Number.parseFloat(value));
  }
  ```

  + isFunction

  Sprawdza czy podany argument jest obiektem funkcji.

  ```js
  // jQuery
  $.isFunction(item);

  // Natywnie
  function isFunction(item) {
    if (typeof item === 'function') {
      return true;
    }
    var type = Object.prototype.toString(item);
    return type === '[object Function]' || type === '[object GeneratorFunction]';
  }
  ```

  + isEmptyObject

  Sprawdza czy obiekt jest pusty (nie posiada żadnych wymiernych atrybutów).

  ```js
  // jQuery
  $.isEmptyObject(obj);

  // Natywnie
  function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
  }
  ```

  + isPlainObject

  Sprawdza czy obiekt jest prostym obiektem (stworzonym przy pomocy “{}” lub “new Object”).

  ```js
  // jQuery
  $.isPlainObject(obj);

  // Natywnie
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

  Scalenie zawartości dwóch lub większej ilości obiektów razem w pierwszy obiekt.
  `Object.assign` należy do API ES6, więc można również użyć [wypełnienia](https://github.com/ljharb/object.assign).

  ```js
  // jQuery
  $.extend({}, defaultOpts, opts);

  // Natywnie
  Object.assign({}, defaultOpts, opts);
  ```

  + trim

  Usuwa białe znaki z początku i końca ciągu znaków.

  ```js
  // jQuery
  $.trim(string);

  // Natywnie
  string.trim();
  ```

  + map

  Przekształcenie wszystkich elementów tablicy lub obiektu w nową tablicę.

  ```js
  // jQuery
  $.map(array, (value, index) => {
  });

  // Natywnie
  array.map((value, index) => {
  });
  ```

  + each

  Ogólna funkcja do iteracji, która może być użyta zarówno na obiektach jak i tablicach.

  ```js
  // jQuery
  $.each(array, (index, value) => {
  });

  // Natywnie
  array.forEach((value, index) => {
  });
  ```

  + grep

  Zwraca elementy które przechodzą test podanej funkcji filtrującej.

  ```js
  // jQuery
  $.grep(array, (value, index) => {
  });

  // Natywnie
  array.filter((value, index) => {
  });
  ```

  + type

  Ustala wewnętrzną klasę obiektu.

  ```js
  // jQuery
  $.type(obj);

  // Natywnie
  function type(item) {
    const reTypeOf = /(?:^\[object\s(.*?)\]$)/;
    return Object.prototype.toString.call(item)
      .replace(reTypeOf, '$1')
      .toLowerCase();
  }
  ```

  + merge

  Scala zawartość dwóch tablic w jedną.

  ```js
  // jQuery
  $.merge(array1, array2);

  // Natywnie
  // Funkcja concat nie usuwa duplikatów.
  function merge(...args) {
    return [].concat(...args)
  }
  ```

  + now

  Zwraca liczbę reprezentującą bieżący czas.

  ```js
  // jQuery
  $.now();

  // Natywnie
  Date.now();
  ```

  + proxy

  Pobiera funkcję jako argument i zwraca nową funkcję, która będzie miała zawsze określony kontekst.

  ```js
  // jQuery
  $.proxy(fn, context);

  // Natywnie
  fn.bind(context);
  ```

  + makeArray

  Konwertuje obiekt tablico-podobny w tablicę.

  ```js
  // jQuery
  $.makeArray(arrayLike);

  // Natywnie
  Array.prototype.slice.call(arrayLike);

  // sposób ES6
  Array.from(arrayLike);
  ```

- [6.2](#6.2) <a name='6.2'></a> Zawieranie

  Sprawdza czy dany element DOM jest potomkiem innego elementu DOM.

  ```js
  // jQuery
  $.contains(el, child);

  // Natywnie
  el !== child && el.contains(child);
  ```

- [6.3](#6.3) <a name='6.3'></a> Globalna ewaluacja

  Wykonuje kod Javascript z globalnym kontekstem.

  ```js
  // jQuery
  $.globaleval(code);

  // Natywnie
  function Globaleval(code) {
    const script = document.createElement('script');
    script.text = code;

    document.head.appendChild(script).parentNode.removeChild(script);
  }

  // Używaj eval, chociaż kontekst eval jest lokalny, a kontekst $.Globaleval jest globalny.
  eval(code);
  ```

- [6.4](#6.4) <a name='6.4'></a> parse

  + parseHTML

  Przetwarza łańcuch znaków w tablicę węzłów DOM.

  ```js
  // jQuery
  $.parseHTML(htmlString);

  // Natywnie
  function parseHTML(string) {
    const context = document.implementation.createHTMLDocument();

    // Ustaw href elementu na stworzony dokument, żeby przetworzone elementy z URL
    // były oparte o URL dokumentu
    const base = context.createElement('base');
    base.href = document.location.href;
    context.head.appendChild(base);

    context.body.innerHTML = string;
    return context.body.children;
  }
  ```

  + parseJSON

  Pobiera ciąg znaków reprezentujący JSON i zwraca wynikową wartość Javascript.

  ```js
  // jQuery
  $.parseJSON(str);

  // Natywnie
  JSON.parse(str);
  ```

**[⬆ powrót](#spis-treści)**

## Obietnice

Obietnice (_ang. Promises_) reprezentują ewentualny wynik asynchronicznej operacji. jQuery posiada własny system zarządzania obietnicami. Natywny Javascript implementuje minimalną warstwę API do obsługi obietnic według specyfikacji [Promises/A+](http://promises-aplus.github.io/promises-spec/).

- [7.1](#7.1) <a name='7.1'></a> done, fail, always

  `done` jest wywoływane gdy obietnica zostanie zakończona sukcesem, `fail` jest wywoływane gdy obietnica jest odrzucona, `always` gdy obietnica jest zakończona z dowolnym wynikiem.

  ```js
  // jQuery
  $promise.done(doneCallback).fail(failCallback).always(alwaysCallback)

  // Natywnie
  promise.then(doneCallback, failCallback).then(alwaysCallback, alwaysCallback)
  ```

- [7.2](#7.2) <a name='7.2'></a> when

  `when` wykorzystuje się do obsługi wielu obietnic jednocześnie. Zakończy się sukcesem, jeżeli wszystkie podane obietnice zostaną również zakończone sukcesem; zakończy się odrzuceniem, jeżeli jakakolwiek z obietnic zostanie odrzucona.

  ```js
  // jQuery
  $.when($promise1, $promise2).done((promise1Result, promise2Result) => {
  });

  // Natywnie
  Promise.all([$promise1, $promise2]).then([promise1Result, promise2Result] => {});
  ```

- [7.3](#7.3) <a name='7.3'></a> Deferred

  Deferred (_pl. Odłożenie_) jest metodą tworzenia obietnic.

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

  // Natywnie
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

  // sposób z Deferred
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

**[⬆ powrót](#spis-treści)**

## Animacja

- [8.1](#8.1) <a name='8.1'></a> Show i Hide

  ```js
  // jQuery
  $el.show();
  $el.hide();

  // Natywnie
  // Po więcej szczegółów o tej metodzie odnieś się do https://github.com/oneuijs/oui-dom-utils/blob/master/src/index.js#L363
  el.style.display = ''|'inline'|'inline-block'|'inline-table'|'block';
  el.style.display = 'none';
  ```

- [8.2](#8.2) <a name='8.2'></a> Toggle

  Wyświetla lub ukrywa element.

  ```js
  // jQuery
  $el.toggle();

  // Natywnie
  if (el.ownerDocument.defaultView.getComputedStyle(el, null).display === 'none') {
    el.style.display = ''|'inline'|'inline-block'|'inline-table'|'block';
  } else {
    el.style.display = 'none';
  }
  ```

- [8.3](#8.3) <a name='8.3'></a> FadeIn i FadeOut

  ```js
  // jQuery
  $el.fadeIn(3000);
  $el.fadeOut(3000);

  // Natywnie
  el.style.transition = 'opacity 3s';
  // FadeIn
  el.style.opacity = '1';
  // FadeOut
  el.style.opacity = '0';
  ```

- [8.4](#8.4) <a name='8.4'></a> FadeTo

  Dostosowuje przezroczystość elementu w czasie.

  ```js
  // jQuery
  $el.fadeTo('slow',0.15);
  // Natywnie
  el.style.transition = 'opacity 3s'; // przyjęto że 'slow' trwa 3 sekundy
  el.style.opacity = '0.15';
  ```

- [8.5](#8.5) <a name='8.5'></a> FadeToggle

  Wyświetla lub ukrywa element przez animowanie jego przezroczystości.

  ```js
  // jQuery
  $el.fadeToggle();

  // Natywnie
  el.style.transition = 'opacity 3s';
  const { opacity } = el.ownerDocument.defaultView.getComputedStyle(el, null);
  if (opacity === '1') {
    el.style.opacity = '0';
  } else {
    el.style.opacity = '1';
  }
  ```

- [8.6](#8.6) <a name='8.6'></a> SlideUp i SlideDown

  ```js
  // jQuery
  $el.slideUp();
  $el.slideDown();

  // Natywnie
  const originHeight = '100px';
  el.style.transition = 'height 3s';
  // slideUp
  el.style.height = '0px';
  // slideDown
  el.style.height = originHeight;
  ```

- [8.7](#8.7) <a name='8.7'></a> SlideToggle

  Wyświetla lub ukrywa element przez przesunięcie.

  ```js
  // jQuery
  $el.slideToggle();

  // Natywnie
  const originHeight = '100px';
  el.style.transition = 'height 3s';
  const { height } = el.ownerDocument.defaultView.getComputedStyle(el, null);
  if (parseInt(height, 10) === 0) {
    el.style.height = originHeight;
  }
  else {
    el.style.height = '0px';
  }
  ```

- [8.8](#8.8) <a name='8.8'></a> Animate

  Wykonuje własną animację zbioru atrybutów CSS.

  ```js
  // jQuery
  $el.animate({ params }, speed);

  // Natywnie
  el.style.transition = 'all ' + speed;
  Object.keys(params).forEach((key) =>
    el.style[key] = params[key];
  )
  ```

## Alternatywy

* [You Might Not Need jQuery](http://youmightnotneedjquery.com/) - Przykłady wykonania powszechnych zdarzeń, elementów, ajax itd. z użyciem zwykłego Javascript.
* [npm-dom](http://github.com/npm-dom) oraz [webmodules](http://github.com/webmodules) - Indywidualne moduły DOM na NPM.

## Wsparcie przeglądarek

![Chrome][chrome-image] | ![Firefox][firefox-image] | ![IE][ie-image] | ![Opera][opera-image] | ![Safari][safari-image]
--- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | 10+ ✔ | Latest ✔ | 6.1+ ✔ |

# Licencja

MIT

[chrome-image]: https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png
[firefox-image]: https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png
[ie-image]: https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png
[opera-image]: https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png
[safari-image]: https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png
