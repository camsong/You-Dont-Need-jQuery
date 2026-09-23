## Nie Potrzebujesz jQuery

Środowiska frontendowe rozwijają się błyskawicznie, nowsze przeglądarki zaimplementowały już większą część API DOM/BOM, które są całkiem użyteczne. Nie musimy uczyć się jQuery od podstaw by manipulować modelem dokumentu lub obsługiwać zdarzenia. Tymczasem, dzięki coraz większej dominacji bibliotek frontendowych takich jak React, Angular czy Vue, obsługa DOM bezpośrednio staje się antywzorcem projektowym, a jQuery coraz bardziej traci na znaczeniu. Ten projekt pokazuje w jaki sposób można zastąpić większość metod jQuery korzystając z natywnej implementacji.

Przykłady kodu są przeznaczone dla aktualnych wersji przeglądarek aktualizowanych automatycznie (Chrome, Edge, Firefox, Safari). Microsoft nie wspiera już Internet Explorera, dlatego usunęliśmy rozwiązania zastępcze przeznaczone dla IE. Jeżeli nadal ich potrzebujesz, zajrzyj do [ostatniej wersji zgodnej z IE](https://github.com/camsong/You-Dont-Need-jQuery/tree/c4e00b3).

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
* `document.querySelectorAll` zwraca wszystkie elementy jako statyczną listę NodeList. Obsługuje ona `forEach` i można ją przekształcić do tablicy przy użyciu `Array.from(document.querySelectorAll(selector))`
* Jeżeli żaden element nie został znaleziony, jQuery zwróci pusty obiekt jQuery, a `document.querySelectorAll` pustą listę NodeList, natomiast `document.querySelector` zwróci `null`.

> Uwaga: `document.getElementById`, `document.getElementsByClassName` i `document.getElementsByTagName` są nieco szybsze niż `querySelector*`, ale `getElementsBy*` zwracają *żywą* kolekcję HTMLCollection, która aktualizuje się wraz ze zmianami w DOM. Używaj `querySelector*`, chyba że pomiary wykazały wąskie gardło.

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
    [...el.parentNode.children].filter((child) =>
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

  // Natywnie
  el.closest(selector);
  ```

- [1.7](#1.7) <a name='1.7'></a> Rodzice dopóki

  Zwraca potomków każdego elementu w bieżącym zbiorze pasujących elementów, aż do elementu dopasowanego przez selektor, węzeł DOM, lub obiekt jQuery.

  ```js
  // jQuery
  $el.parentsUntil(selector, filter);

  // Natywnie
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
    [...document.querySelectorAll('.radio')].indexOf(e.currentTarget);
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

  // Natywnie
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
    // jQuery
    $el.attr('foo', 'bar');

    // Natywnie
    el.setAttribute('foo', 'bar');
    ```

  + Otrzymanie wartości atrybutu `data-`

    ```js
    // jQuery
    $el.data('foo');

    // Natywnie
    el.dataset.foo;

    // lub
    el.getAttribute('data-foo');
    ```

**[⬆ powrót](#spis-treści)**

## CSS i styl

- [2.1](#2.1) <a name='2.1'></a> CSS

  + Otrzymanie stylu

    ```js
    // jQuery
    $el.css('color');

    // Natywnie
    // UWAGA: zwraca wartość wynikową, np. 'rgb(255, 0, 17)' zamiast '#f01'
    getComputedStyle(el).color;
    ```

  + Ustawienie stylu

    ```js
    // jQuery
    $el.css({ color: '#f01' });

    // Natywnie
    el.style.color = '#f01';
    ```

  + Ustawienie wielu stylów

    ```js
    // jQuery
    $el.css({ color: '#f01', 'border-color': '#f02' });

    // Natywnie
    Object.assign(el.style, { color: '#f01', borderColor: '#f02' });
    ```

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
    // jQuery
    $(window).height();

    // bez paska, działa jak jQuery
    window.document.documentElement.clientHeight;

    // z paskiem przewijania
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

    // dokładne do części całkowitej (jeżeli `border-box`, wtedy `height - border`; jeżeli `content-box`, wtedy `height + padding`)
    el.clientHeight;

    // dokładne do części dziesiętnej (jeżeli `border-box`, wtedy `height`; jeżeli `content-box`, wtedy `height + padding + border`)
    el.getBoundingClientRect().height;
    ```

- [2.3](#2.3) <a name='2.3'></a> Pozycja i przesunięcie

  + Pozycja

    Otrzymanie bieżącej pozycji elementu relatywnie do przesunięcia rodzica.

    ```js
    // jQuery
    $el.position();

    // Natywnie
    const position = { left: el.offsetLeft, top: el.offsetTop };
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
        top: box.top + window.scrollY,
        left: box.left + window.scrollX
      };
    }
    ```

- [2.4](#2.4) <a name='2.4'></a> Przesunięcie widoku

  Otrzymanie bieżącego przesunięcia w pionie elementu.

  ```js
  // jQuery
  $(window).scrollTop();

  // Natywnie
  window.scrollY;
  ```

**[⬆ wróć](#spis-treści)**

## Manipulacja DOM

- [3.1](#3.1) <a name='3.1'></a> Usuwanie

  Usunięcie elementu z DOM.

  ```js
  // jQuery
  $el.remove();

  // Natywnie
  el.remove();
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
  // jQuery: jednolita składnia dla ciągów DOMString i obiektów Node
  $parent.append(newEl | '<div id="container">Hello World</div>');

  // Natywnie (Element lub tekst): ciągi znaków są wstawiane jako zwykły tekst, a nie przetwarzane jako HTML
  parent.append(newEl | 'Hello World');

  // Natywnie (tekst HTML)
  parent.insertAdjacentHTML('beforeend', '<div id="container">Hello World</div>');
  ```

- [3.5](#3.5) <a name='3.5'></a> Dodawanie na początek

  ```js
  // jQuery: jednolita składnia dla ciągów DOMString i obiektów Node
  $parent.prepend(newEl | '<div id="container">Hello World</div>');

  // Natywnie (Element lub tekst): ciągi znaków są wstawiane jako zwykły tekst, a nie przetwarzane jako HTML
  parent.prepend(newEl | 'Hello World');

  // Natywnie (tekst HTML)
  parent.insertAdjacentHTML('afterbegin', '<div id="container">Hello World</div>');
  ```

- [3.6](#3.6) <a name='3.6'></a> Dodawanie przed

  Dodanie nowego węzła przed wybranymi elementami

  ```js
  // jQuery
  $newEl.insertBefore(selector);

  const el = document.querySelector(selector);

  // Natywnie (Element)
  el.before(newEl);

  // Natywnie (tekst HTML)
  el.insertAdjacentHTML('beforebegin', '<div id="container">Hello World</div>');
  ```

- [3.7](#3.7) <a name='3.7'></a> Dodawanie po elemencie

  Dodanie nowego węzła po wybranych elementach

  ```js
  // jQuery
  $newEl.insertAfter(selector);

  const el = document.querySelector(selector);

  // Natywnie (Element)
  el.after(newEl);

  // Natywnie (tekst HTML)
  el.insertAdjacentHTML('afterend', '<div id="container">Hello World</div>');
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
  // jQuery. Przekaż `true`, aby skopiować również procedury obsługi zdarzeń i dane.
  $el.clone();

  // Natywnie. Przekaż `true`, aby utworzyć głęboką kopię; funkcje nasłuchujące zdarzeń nigdy nie są kopiowane.
  el.cloneNode(true);
  ```

- [3.10](#3.10) <a name='3.10'></a> Wyczyszczenie

  Usuwa wszystkie węzły dzieci

  ```js
  // jQuery
  $el.empty();

  // Natywnie
  el.replaceChildren();
  ```

- [3.11](#3.11) <a name='3.11'></a> Zawinięcie

  Umieszczenie każdego elementu w strukturze HTML

  ```js
  // jQuery
  $('.inner').wrap('<div class="wrapper"></div>');

  // Natywnie
  document.querySelectorAll('.inner').forEach((el) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper';
    el.before(wrapper);
    wrapper.append(el);
  });
  ```

- [3.12](#3.12) <a name='3.12'></a> Odwinięcie

  Usuwa rodziców z pasujących elementów z DOM

  ```js
  // jQuery
  $('.inner').unwrap();

  // Natywnie
  new Set([...document.querySelectorAll('.inner')].map((el) => el.parentElement))
    .forEach((parent) => {
      if (parent !== document.body) {
        parent.replaceWith(...parent.childNodes);
      }
    });
  ```

- [3.13](#3.13) <a name='3.13'></a> Zamiana

  Wymiana każdego elementu ze zbioru pasujących elementów na podaną nową zawartość

  ```js
  // jQuery
  $('.inner').replaceWith('<div class="outer"></div>');

  // Natywnie
  document.querySelectorAll('.inner').forEach((el) => {
    const outer = document.createElement('div');
    outer.className = 'outer';
    el.replaceWith(outer);
  });
  ```


**[⬆ powrót](#spis-treści)**

## Ajax

[Fetch API](https://fetch.spec.whatwg.org/) jest standardowym następcą XMLHttpRequest i działa we wszystkich nowoczesnych przeglądarkach. W przeciwieństwie do `$.ajax`, `fetch` **nie** odrzuca obietnicy, gdy serwer zwróci kod błędu HTTP, taki jak 404 czy 500; wartość `response.ok` musisz sprawdzić samodzielnie. Do żądań JSONP wypróbuj [fetch-jsonp](https://github.com/camsong/fetch-jsonp).

- [4.0](#4.0) <a name='4.0'></a> Pobieranie danych JSON

  ```js
  // jQuery
  $.getJSON(url).done(handleData).fail(handleError);

  // Natywnie
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

- [4.0.1](#4.0.1) <a name='4.0.1'></a> Wysyłanie danych JSON (POST)

  ```js
  // jQuery
  $.ajax({
    url,
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(data),
  });

  // Natywnie
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  ```

- [4.0.2](#4.0.2) <a name='4.0.2'></a> Przerwanie żądania i limit czasu

  ```js
  // jQuery
  const jqXHR = $.ajax({ url, timeout: 5000 });
  jqXHR.abort();

  // Natywnie
  const controller = new AbortController();
  fetch(url, { signal: controller.signal });
  controller.abort();

  // Natywnie (limit czasu)
  fetch(url, { signal: AbortSignal.timeout(5000) });
  ```

- [4.1](#4.1) <a name='4.1'></a> Ładowanie danych z serwera i umieszczenie zwróconego HTML do pasującego elementu

  ```js
  // jQuery
  $(selector).load(url, completeCallback)

  // Natywnie
  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      document.querySelector(selector).innerHTML = html;
    })
    .then(completeCallback);
  ```

**[⬆ powrót](#spis-treści)**

## Zdarzenia

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

  // Możesz też załadować skrypt za pomocą `<script defer>` lub `<script type="module">`,
  // dzięki czemu zostanie on wykonany dopiero po przetworzeniu dokumentu.
  ```

- [5.1](#5.1) <a name='5.1'></a> Nasłuchiwanie funkcji na zdarzenie

  ```js
  // jQuery
  $el.on(eventName, eventHandler);

  // Natywnie
  el.addEventListener(eventName, eventHandler);
  ```

- [5.1.1](#5.1.1) <a name='5.1.1'></a> Jednorazowe nasłuchiwanie zdarzenia

  ```js
  // jQuery
  $el.one(eventName, eventHandler);

  // Natywnie
  el.addEventListener(eventName, eventHandler, { once: true });
  ```

- [5.1.2](#5.1.2) <a name='5.1.2'></a> Delegowanie zdarzeń

  ```js
  // jQuery
  $el.on(eventName, selector, eventHandler);

  // Natywnie
  el.addEventListener(eventName, (event) => {
    const target = event.target.closest(selector);
    if (target && el.contains(target)) {
      eventHandler.call(target, event);
    }
  });
  ```

- [5.2](#5.2) <a name='5.2'></a> Zatrzymanie nasłuchiwania

  ```js
  // jQuery
  $el.off(eventName, eventHandler);

  // Natywnie
  el.removeEventListener(eventName, eventHandler);

  // Natywnie: usunięcie kilku funkcji nasłuchujących naraz, podobnie jak przy przestrzeniach nazw w jQuery
  const controller = new AbortController();
  el.addEventListener('click', onClick, { signal: controller.signal });
  el.addEventListener('keydown', onKeydown, { signal: controller.signal });
  controller.abort();
  ```

- [5.3](#5.3) <a name='5.3'></a> Wywołanie zdarzenia

  ```js
  // jQuery
  $(el).trigger('custom-event', {key1: 'data'});

  // Natywnie. Zdarzenia jQuery są propagowane w górę (bubbling), a natywne tylko przy `bubbles: true`.
  // W funkcji obsługi dane odczytasz z `event.detail`.
  const event = new CustomEvent('custom-event', {
    bubbles: true,
    cancelable: true,
    detail: { key1: 'data' },
  });

  el.dispatchEvent(event);
  ```

**[⬆ powrót](#spis-treści)**

## Funkcje użytkowe

Większość funkcji użytkowych można znaleźć w natywnym API. Pozostałe, bardziej zaawansowane funkcje mogą zostać zastąpione lepszymi bibliotekami użytkowymi, które skupiają się na spójności i wydajności. Rekomendowanymi bibliotekami są [Lodash](https://lodash.com) oraz [es-toolkit](https://es-toolkit.dev).

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
    return obj != null && obj === obj.window;
  }
  ```

  + inArray

  Szuka podanej wartości wewnątrz tablicy i zwraca jej indeks (lub -1 jeżeli nie znaleziono).

  ```js
  // jQuery
  $.inArray(item, array);

  // Natywnie
  array.indexOf(item);
  ```

  Sprawdza, czy podana wartość znajduje się w tablicy.

  ```js
  // jQuery
  $.inArray(item, array) > -1;

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
  function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
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
    var type = Object.prototype.toString.call(item);
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
    if (Object.prototype.toString.call(obj) !== '[object Object]') {
      return false;
    }

    const proto = Object.getPrototypeOf(obj);
    return proto === null || proto === Object.prototype;
  }
  ```

  + extend

  Scalenie zawartości dwóch lub więcej obiektów w nowy obiekt bez modyfikowania żadnego z argumentów.
  Podobnie jak `$.extend` bez `deep`, `Object.assign` i operator spread tworzą jedynie płytką kopię.

  ```js
  // jQuery
  $.extend({}, object1, object2);

  // Natywnie
  Object.assign({}, object1, object2);

  // Natywnie (spread)
  ({ ...object1, ...object2 });
  ```

  Głęboka kopia pojedynczego obiektu:

  ```js
  // jQuery
  $.extend(true, {}, object);

  // Natywnie. Funkcji i węzłów DOM nie da się sklonować
  structuredClone(object);
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
  // jQuery (zwróć `false`, aby przerwać pętlę)
  $.each(array, (index, value) => {
  });

  // Natywnie (użyj `for...of` lub `some`, jeżeli chcesz przerwać pętlę wcześniej)
  array.forEach((value, index) => {
  });

  // Natywnie, dla obiektów
  Object.entries(obj).forEach(([key, value]) => {
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
  // jQuery, modyfikuje array1, nie usuwa duplikatów
  $.merge(array1, array2);

  // Natywnie, modyfikuje array1, nie usuwa duplikatów
  array1.push(...array2);

  // Natywnie, zwraca nową tablicę, nie usuwa duplikatów
  function merge(...args) {
    return [].concat(...args);
  }

  // Wersja z Set, zwraca nową tablicę, usuwa duplikaty
  function merge(...args) {
    return Array.from(new Set([].concat(...args)));
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
  Array.from(arrayLike);

  // sposób ES6: operator spread
  [...arrayLike];
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
  $.globalEval(code);

  // Natywnie
  function globalEval(code) {
    const script = document.createElement('script');
    script.text = code;

    document.head.appendChild(script).parentNode.removeChild(script);
  }

  // Używaj eval, chociaż kontekst eval jest lokalny, a kontekst $.globalEval jest globalny.
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
    return Array.from(context.body.childNodes);
  }
  ```

**[⬆ powrót](#spis-treści)**

## Obietnice

Obietnice (_ang. Promises_) reprezentują ewentualny wynik asynchronicznej operacji. jQuery posiada własny system zarządzania obietnicami. Natywny Javascript implementuje minimalną warstwę API do obsługi obietnic według specyfikacji [Promises/A+](https://promisesaplus.com/), a dzięki `async`/`await` kod oparty na obietnicach czyta się jak kod synchroniczny.

- [7.1](#7.1) <a name='7.1'></a> done, fail, always

  `done` jest wywoływane gdy obietnica zostanie zakończona sukcesem, `fail` jest wywoływane gdy obietnica jest odrzucona, `always` gdy obietnica jest zakończona z dowolnym wynikiem.

  ```js
  // jQuery
  $promise.done(doneCallback).fail(failCallback).always(alwaysCallback)

  // Natywnie
  promise.then(doneCallback, failCallback).finally(alwaysCallback);

  // Natywnie (async/await)
  try {
    doneCallback(await promise);
  } catch (error) {
    failCallback(error);
  } finally {
    alwaysCallback();
  }
  ```

- [7.2](#7.2) <a name='7.2'></a> when

  `when` wykorzystuje się do obsługi wielu obietnic jednocześnie. Zakończy się sukcesem, jeżeli wszystkie podane obietnice zostaną również zakończone sukcesem; zakończy się odrzuceniem, jeżeli jakakolwiek z obietnic zostanie odrzucona.

  ```js
  // jQuery
  $.when($promise1, $promise2).done((promise1Result, promise2Result) => {
  });

  // Natywnie
  Promise.all([promise1, promise2]).then(([promise1Result, promise2Result]) => {});

  // Natywnie (async/await)
  const [promise1Result, promise2Result] = await Promise.all([promise1, promise2]);
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

**[⬆ powrót](#spis-treści)**

## Animacja

[Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) (`el.animate()`) jest najbliższym natywnym odpowiednikiem efektów jQuery: przyjmuje czas trwania w milisekundach, w miarę możliwości działa poza głównym wątkiem i zwraca obiekt `Animation`, którego obietnica `finished` zostaje spełniona po zakończeniu animacji.

- [8.1](#8.1) <a name='8.1'></a> Show i Hide

  ```js
  // jQuery
  $el.show();
  $el.hide();

  // Natywnie
  el.style.display = ''; // lub 'block', 'inline', ... jeżeli element jest ukryty w arkuszu stylów
  el.style.display = 'none';

  // Natywnie (jeżeli właściwość `display` elementu nie jest ustawiana nigdzie indziej)
  el.hidden = false;
  el.hidden = true;
  ```

- [8.2](#8.2) <a name='8.2'></a> Toggle

  Wyświetla lub ukrywa element.

  ```js
  // jQuery
  $el.toggle();

  // Natywnie
  if (getComputedStyle(el).display === 'none') {
    el.style.display = ''; // lub 'block', 'inline', ...
  } else {
    el.style.display = 'none';
  }
  ```

- [8.3](#8.3) <a name='8.3'></a> FadeIn i FadeOut

  ```js
  // jQuery
  $el.fadeIn(3000);
  $el.fadeOut(3000);

  // Natywnie (fadeIn)
  function fadeIn(el, ms = 400) {
    el.style.display = '';
    return el.animate([{ opacity: 0 }, { opacity: 1 }], ms).finished;
  }

  // Natywnie (fadeOut)
  function fadeOut(el, ms = 400) {
    return el.animate([{ opacity: 1 }, { opacity: 0 }], ms).finished.then(() => {
      el.style.display = 'none';
    });
  }
  ```

- [8.4](#8.4) <a name='8.4'></a> FadeTo

  Dostosowuje przezroczystość elementu w czasie.

  ```js
  // jQuery
  $el.fadeTo('slow',0.15);
  // Natywnie ('slow' w jQuery oznacza 600 milisekund)
  el.animate([{ opacity: 0.15 }], { duration: 600, fill: 'forwards' });
  ```

- [8.5](#8.5) <a name='8.5'></a> FadeToggle

  Wyświetla lub ukrywa element przez animowanie jego przezroczystości.

  ```js
  // jQuery
  $el.fadeToggle();

  // Natywnie, z użyciem fadeIn i fadeOut z punktu 8.3
  if (getComputedStyle(el).display === 'none') {
    fadeIn(el);
  } else {
    fadeOut(el);
  }
  ```

- [8.6](#8.6) <a name='8.6'></a> SlideUp i SlideDown

  ```js
  // jQuery
  $el.slideUp();
  $el.slideDown();

  // Natywnie (slideUp)
  function slideUp(el, ms = 400) {
    el.style.overflow = 'hidden';
    return el.animate([{ height: `${el.offsetHeight}px` }, { height: '0px' }], ms).finished.then(() => {
      el.style.display = 'none';
      el.style.overflow = '';
    });
  }

  // Natywnie (slideDown)
  function slideDown(el, ms = 400) {
    el.style.display = '';
    el.style.overflow = 'hidden';
    return el.animate([{ height: '0px' }, { height: `${el.scrollHeight}px` }], ms).finished.then(() => {
      el.style.overflow = '';
    });
  }
  ```

- [8.7](#8.7) <a name='8.7'></a> SlideToggle

  Wyświetla lub ukrywa element przez przesunięcie.

  ```js
  // jQuery
  $el.slideToggle();

  // Natywnie, z użyciem slideUp i slideDown z punktu 8.6
  if (getComputedStyle(el).display === 'none') {
    slideDown(el);
  } else {
    slideUp(el);
  }
  ```

- [8.8](#8.8) <a name='8.8'></a> Animate

  Wykonuje własną animację zbioru atrybutów CSS.

  ```js
  // jQuery
  $el.animate({ params }, speed);

  // Natywnie (speed w milisekundach)
  el.animate([params], { duration: speed, fill: 'forwards' });
  ```

## Alternatywy

* [You Might Not Need jQuery](https://youmightnotneedjquery.com/) - Przykłady wykonania powszechnych zdarzeń, elementów, ajax itd. z użyciem zwykłego Javascript.
* [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) - Dokumentacja każdego użytego tutaj API DOM.
* [Baseline](https://web.dev/baseline) - Sprawdź, których funkcji platformy webowej można bezpiecznie używać we wszystkich przeglądarkach.

## Wsparcie przeglądarek

![Chrome][chrome-image] | ![Edge][edge-image] | ![Firefox][firefox-image] | ![Safari][safari-image] | ![Opera][opera-image]
--- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ |

Kilka przykładów korzysta z nowszych API: `Promise.withResolvers()` (2024), `el.replaceChildren()` (2020) oraz `AbortSignal.timeout()` (2022). Jeżeli wspierasz starsze przeglądarki, sprawdź [Baseline](https://web.dev/baseline).

# Licencja

MIT

[chrome-image]: https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png
[firefox-image]: https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png
[edge-image]: https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png
[opera-image]: https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png
[safari-image]: https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png
