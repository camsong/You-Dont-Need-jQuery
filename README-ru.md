## Вам не нужен jQuery

В наше время среда front-end разработки быстро развивается, и современные браузеры достаточно хорошо реализовали работу с DOM/BOM API. Вам не нужно изучать jQuery с нуля для манипуляцией DOM'ом или объектами событий. В то же время, благодаря лидирующим front-end библиотекам, таким как React, Angular и Vue, манипуляция DOM'ом напрямую становится антипаттерном, а jQuery теряет свою значимость. Этот проект объединяет большинство альтернативных методов jQuery в нативном исполнении.

Примеры кода рассчитаны на актуальные версии автоматически обновляемых браузеров (Chrome, Edge, Firefox, Safari). Microsoft больше не поддерживает Internet Explorer, поэтому обходные решения для IE удалены. Если они вам все еще нужны, смотрите [последнюю версию с поддержкой IE](https://github.com/camsong/You-Dont-Need-jQuery/tree/c4e00b3).

## Содержание

1. [Переводы](#Переводы)
1. [Query Selector](#query-selector)
1. [CSS & Style](#css--style)
1. [Манипуляция с DOM](#манипуляции-с-dom)
1. [Ajax](#ajax)
1. [События](#События)
1. [Утилиты](#Утилиты)
1. [Альтернативы](#Альтернативы)
1. [Поддержка браузеров](#Поддержка-браузеров)

## Переводы

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

Для часто используемых селекторов, таких как class, id или attribute мы можем использовать `document.querySelector` или `document.querySelectorAll` для замены. Разница такова:
* `document.querySelector` возвращает первый совпавший элемент
* `document.querySelectorAll` возвращает все совпавшие элементы как статический список узлов (NodeList). Он поддерживает `forEach`, и его можно конвертировать в массив, используя `Array.from(document.querySelectorAll(selector))` или любой из способов, описанных в [makeArray](#makeArray)
* Если никакие элементы не совпадут, jQuery вернет пустой объект jQuery, а `document.querySelectorAll` вернет пустой NodeList, тогда как `document.querySelector` вернет `null`.

> Заметка: `document.getElementById`, `document.getElementsByClassName` и `document.getElementsByTagName` работают немного быстрее, чем `querySelector*`, но `getElementsBy*` возвращают *живую* коллекцию HTMLCollection, которая меняется вместе с DOM. Отдавайте предпочтение `querySelector*`, если только замеры не выявили здесь узкое место.

- [1.0](#1.0) <a name='1.0'></a> Query by selector

  ```js
  // jQuery
  $('selector');

  // Нативно
  document.querySelectorAll('selector');
  ```

- [1.1](#1.1) <a name='1.1'></a> Запрос по классу

  ```js
  // jQuery
  $('.class');

  // Нативно
  document.querySelectorAll('.class');

  // или
  document.getElementsByClassName('class');
  ```

- [1.2](#1.2) <a name='1.2'></a> Запрос по ID

  ```js
  // jQuery
  $('#id');

  // Нативно
  document.querySelector('#id');

  // или
  document.getElementById('id');
  ```

- [1.3](#1.3) <a name='1.3'></a> Запрос по атрибуту

  ```js
  // jQuery
  $('a[target=_blank]');

  // Нативно
  document.querySelectorAll('a[target=_blank]');
  ```

- [1.4](#1.4) <a name='1.4'></a> Найти среди потомков

  ```js
  // jQuery
  $el.find('li');

  // Нативно
  el.querySelectorAll('li');
  ```

- [1.5](#1.5) <a name='1.5'></a> Родственные/Предыдущие/Следующие Элементы

  + Родственные элементы

    ```js
    // jQuery
    $el.siblings();

    // Нативно
    [...el.parentNode.children].filter((child) =>
      child !== el
    );
    ```

  + Предыдущие элементы

    ```js
    // jQuery
    $el.prev();

    // Нативно
    el.previousElementSibling;
    ```

  + Следующие элементы

    ```js
    // jQuery
    $el.next();

    // Нативно
    el.nextElementSibling;
    ```

- [1.6](#1.6) <a name='1.6'></a> Ближайший

  Возвращает первый совпавший элемент по предоставленному селектору, проходя от текущего элемента до документа.

  ```js
  // jQuery
  $el.closest(selector);

  // Нативно
  el.closest(selector);
  ```

- [1.7](#1.7) <a name='1.7'></a> Родители до

  Получить родителей каждого элемента в текущем результате совпавших элементов, но не включая элемент, совпавший с указанным селектором, узлом DOM'а, или объектом jQuery.

  ```js
  // jQuery
  $el.parentsUntil(selector, filter);

  // Нативно
  function parentsUntil(el, selector, filter) {
    const result = [];

    // Совпадать начиная от родителя
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

- [1.8](#1.8) <a name='1.8'></a> Форма

  + Input/Textarea

    ```js
    // jQuery
    $('#my-input').val();

    // Нативно
    document.querySelector('#my-input').value;
    ```

  + Получить индекс e.currentTarget между `.radio`

    ```js
    // jQuery
    $('.radio').index(e.currentTarget);

    // Нативно
    [...document.querySelectorAll('.radio')].indexOf(e.currentTarget);
    ```

- [1.9](#1.9) <a name='1.9'></a> Содержимое Iframe

  `$('iframe').contents()` возвращает `contentDocument` именно для этого iframe

  + Контент Iframe

    ```js
    // jQuery
    $iframe.contents();

    // Нативно
    iframe.contentDocument;
    ```

  + Iframe Query

    ```js
    // jQuery
    $iframe.contents().find('.css');

    // Нативно
    iframe.contentDocument.querySelectorAll('.css');
    ```

- [1.10](#1.10) <a name='1.10'></a> Найти body

  ```js
  // jQuery
  $('body');

  // Нативно
  document.body;
  ```

- [1.11](#1.11) <a name='1.11'></a> Получение и изменение атрибута

  + Найти атрибут

    ```js
    // jQuery
    $el.attr('foo');

    // Нативно
    el.getAttribute('foo');
    ```
  + Добавление атрибута

    ```js
    // jQuery
    $el.attr('foo', 'bar');

    // Нативно
    el.setAttribute('foo', 'bar');
    ```

  + Найти `data-` атрибут

    ```js
    // jQuery
    $el.data('foo');

    // Нативно
    el.dataset.foo;

    // или
    el.getAttribute('data-foo');
    ```

**[⬆ Наверх](#Содержание)**

## CSS & Style

- [2.1](#2.1) <a name='2.1'></a> CSS

  + Получить стили

    ```js
    // jQuery
    $el.css('color');

    // Нативно
    // ЗАМЕТКА: возвращает итоговое значение, например 'rgb(255, 0, 17)', а не '#f01'
    getComputedStyle(el).color;
    ```

  + Присвоение style

    ```js
    // jQuery
    $el.css({ color: '#f01' });

    // Нативно
    el.style.color = '#f01';
    ```

  + Присвоение нескольких стилей

    ```js
    // jQuery
    $el.css({ color: '#f01', 'border-color': '#f02' });

    // Нативно
    Object.assign(el.style, { color: '#f01', borderColor: '#f02' });
    ```

  + Добавить класс

    ```js
    // jQuery
    $el.addClass(className);

    // Нативно
    el.classList.add(className);
    ```

  + Удалить class

    ```js
    // jQuery
    $el.removeClass(className);

    // Нативно
    el.classList.remove(className);
    ```

  + Имеет ли класс

    ```js
    // jQuery
    $el.hasClass(className);

    // Нативно
    el.classList.contains(className);
    ```

  + Переключить класс

    ```js
    // jQuery
    $el.toggleClass(className);

    // Нативно
    el.classList.toggle(className);
    ```

- [2.2](#2.2) <a name='2.2'></a> Ширина и Высота

  Ширина и высота теоретически имеют общие свойства, например возьмем высоту:

  + Высота окна

    ```js
    // jQuery
    $(window).height();

    // без полосы прокрутки, ведет себя как jQuery
    window.document.documentElement.clientHeight;

    // вместе с полосой прокрутки
    window.innerHeight;
    ```

  + Высота документа

    ```js
    // jQuery
    $(document).height();

    // Нативно
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

  + Высота элемента

    ```js
    // jQuery
    $el.height();

    // Нативно
    function getHeight(el) {
      const styles = window.getComputedStyle(el);
      const height = el.offsetHeight;
      const borderTopWidth = parseFloat(styles.borderTopWidth);
      const borderBottomWidth = parseFloat(styles.borderBottomWidth);
      const paddingTop = parseFloat(styles.paddingTop);
      const paddingBottom = parseFloat(styles.paddingBottom);
      return height - borderBottomWidth - borderTopWidth - paddingTop - paddingBottom;
    }

    // С точностью до целого числа (когда `border-box`, это `height - border`; когда `content-box`, это `height + padding`)
    el.clientHeight;

    // С точностью до десятых (когда `border-box`, это `height`; когда `content-box`, это `height + padding + border`)
    el.getBoundingClientRect().height;
    ```

- [2.3](#2.3) <a name='2.3'></a> Позиция и смещение

  + Position

    Получить текущие координаты элемента относительно смещения его родителя

    ```js
    // jQuery
    $el.position();

    // Нативно
    const position = { left: el.offsetLeft, top: el.offsetTop };
    ```

  + Offset

    Получить текущие координаты элемента относительно документа

    ```js
    // jQuery
    $el.offset();

    // Нативно
    function getOffset (el) {
      const box = el.getBoundingClientRect();

      return {
        top: box.top + window.scrollY,
        left: box.left + window.scrollX
      };
    }
    ```

- [2.4](#2.4) <a name='2.4'></a> Прокрутка вверх

  ```js
  // jQuery
  $(window).scrollTop();

  // Нативно
  window.scrollY;
  ```

**[⬆ Наверх](#Содержание)**

## Манипуляции с DOM

- [3.1](#3.1) <a name='3.1'></a> Remove

  Удаление элемента из DOM.

  ```js
  // jQuery
  $el.remove();

  // Нативно
  el.remove();
  ```

- [3.2](#3.2) <a name='3.2'></a> Text

  + Получить текст

    Получить текстовое содержимое элемента, включая его потомков,

    ```js
    // jQuery
    $el.text();

    // Нативно
    el.textContent;
    ```

  + Присвоить текст

    ```js
    // jQuery
    $el.text(string);

    // Нативно
    el.textContent = string;
    ```

- [3.3](#3.3) <a name='3.3'></a> HTML

  + Получить HTML

    ```js
    // jQuery
    $el.html();

    // Нативно
    el.innerHTML;
    ```

  + Присвоить HTML

    ```js
    // jQuery
    $el.html(htmlString);

    // Нативно
    el.innerHTML = htmlString;
    ```

- [3.4](#3.4) <a name='3.4'></a> Append

  Добавить родительскому элементу новый дочерний элемент.

  ```js
  // jQuery: единый синтаксис для DOMString и объектов Node
  $parent.append(newEl | '<div id="container">Hello World</div>');

  // Нативно (элемент или текст): строки вставляются как обычный текст и не разбираются как HTML
  parent.append(newEl | 'Hello World');

  // Нативно (строка HTML)
  parent.insertAdjacentHTML('beforeend', '<div id="container">Hello World</div>');
  ```

- [3.5](#3.5) <a name='3.5'></a> Prepend

	Добавить родительскому элементу новый дочерний элемент перед остальными

  ```js
  // jQuery: единый синтаксис для DOMString и объектов Node
  $parent.prepend(newEl | '<div id="container">Hello World</div>');

  // Нативно (элемент или текст): строки вставляются как обычный текст и не разбираются как HTML
  parent.prepend(newEl | 'Hello World');

  // Нативно (строка HTML)
  parent.insertAdjacentHTML('afterbegin', '<div id="container">Hello World</div>');
  ```

- [3.6](#3.6) <a name='3.6'></a> insertBefore

  Вставка нового элемента перед выбранным элементом

  ```js
  // jQuery
  $newEl.insertBefore(selector);

  const el = document.querySelector(selector);

  // Нативно (элемент)
  el.before(newEl);

  // Нативно (строка HTML)
  el.insertAdjacentHTML('beforebegin', '<div id="container">Hello World</div>');
  ```

- [3.7](#3.7) <a name='3.7'></a> insertAfter

  Вставка новго элемента после выбранного элемента

  ```js
  // jQuery
  $newEl.insertAfter(selector);

  const el = document.querySelector(selector);

  // Нативно (элемент)
  el.after(newEl);

  // Нативно (строка HTML)
  el.insertAdjacentHTML('afterend', '<div id="container">Hello World</div>');
  ```

- [3.8](#3.8) <a name='3.8'></a> is

  Возвращает `true` если  совпадает с селектором запроса

  ```js
  // jQuery - заметьте что `is` так же работает с `function` или `elements` которые не имеют к этому отношения
  $el.is(selector);

  // Нативно
  el.matches(selector);
  ```

**[⬆ Наверх](#Содержание)**

## Ajax

[Fetch API](https://fetch.spec.whatwg.org/) - стандартная замена XMLHttpRequest, которая работает во всех современных браузерах. В отличие от `$.ajax`, `fetch` **не** отклоняет промис при HTTP-ошибках, таких как 404 или 500, поэтому проверяйте `response.ok` самостоятельно. Для JSONP-запросов попробуйте [fetch-jsonp](https://github.com/camsong/fetch-jsonp).

- [4.0](#4.0) <a name='4.0'></a> Запрос JSON

  ```js
  // jQuery
  $.getJSON(url).done(handleData).fail(handleError);

  // Нативно
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

- [4.0.1](#4.0.1) <a name='4.0.1'></a> Отправка JSON (POST)

  ```js
  // jQuery
  $.ajax({
    url,
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(data),
  });

  // Нативно
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  ```

- [4.0.2](#4.0.2) <a name='4.0.2'></a> Отмена запроса и тайм-аут

  ```js
  // jQuery
  const jqXHR = $.ajax({ url, timeout: 5000 });
  jqXHR.abort();

  // Нативно
  const controller = new AbortController();
  fetch(url, { signal: controller.signal });
  controller.abort();

  // Нативно (тайм-аут)
  fetch(url, { signal: AbortSignal.timeout(5000) });
  ```

- [4.1](#4.1) <a name='4.1'></a> Загрузить данные с сервера и поместить полученный HTML в элемент.

  ```js
  // jQuery
  $(selector).load(url, completeCallback)

  // Нативно
  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      document.querySelector(selector).innerHTML = html;
    })
    .then(completeCallback);
  ```

**[⬆ Наверх](#Содержание)**

## События

- [5.0](#5.0) <a name='5.0'></a> Готовность документа по событию `DOMContentLoaded`

  ```js
  // jQuery
  $(document).ready(eventHandler);

  // Нативно
  // Проверяем, что событие DOMContentLoaded было выполнено
  if (document.readyState !== 'loading') {
    eventHandler();
  } else {
    document.addEventListener('DOMContentLoaded', eventHandler);
  }

  // Или подключите скрипт через `<script defer>` или `<script type="module">`,
  // тогда он выполнится после того, как документ будет разобран.
  ```

- [5.1](#5.1) <a name='5.1'></a> Связать событие используя `on`

  ```js
  // jQuery
  $el.on(eventName, eventHandler);

  // Нативно
  el.addEventListener(eventName, eventHandler);
  ```

- [5.1.1](#5.1.1) <a name='5.1.1'></a> Связать событие однократно используя `one`

  ```js
  // jQuery
  $el.one(eventName, eventHandler);

  // Нативно
  el.addEventListener(eventName, eventHandler, { once: true });
  ```

- [5.1.2](#5.1.2) <a name='5.1.2'></a> Делегирование событий

  ```js
  // jQuery
  $el.on(eventName, selector, eventHandler);

  // Нативно
  el.addEventListener(eventName, (event) => {
    const target = event.target.closest(selector);
    if (target && el.contains(target)) {
      eventHandler.call(target, event);
    }
  });
  ```

- [5.2](#5.2) <a name='5.2'></a> Отвязать событие используя `off`

  ```js
  // jQuery
  $el.off(eventName, eventHandler);

  // Нативно
  el.removeEventListener(eventName, eventHandler);

  // Нативно: удалить сразу несколько обработчиков, как с пространствами имен в jQuery
  const controller = new AbortController();
  el.addEventListener('click', onClick, { signal: controller.signal });
  el.addEventListener('keydown', onKeydown, { signal: controller.signal });
  controller.abort();
  ```

- [5.3](#5.3) <a name='5.3'></a> Trigger

  ```js
  // jQuery
  $(el).trigger('custom-event', {key1: 'data'});

  // Нативно. События jQuery всплывают, а нативные всплывают, только если указать `bubbles: true`.
  // В обработчике данные можно получить из `event.detail`.
  const event = new CustomEvent('custom-event', {
    bubbles: true,
    cancelable: true,
    detail: { key1: 'data' },
  });

  el.dispatchEvent(event);
  ```

**[⬆ Наверх](#Содержание)**

## Утилиты

Большинство из утилит, представленных в jQuery также могут быть найдены в нативном API. Более продвинутые функции могут быть выбраны из других, более актуальных библиотек, направленных на согласованность данных и производительность. Например, [Lodash](https://lodash.com) и [es-toolkit](https://es-toolkit.dev) являются рекомендуемыми заменами.

- [6.1](#6.1) <a name='6.1'></a> Basic utilities

  + isArray

  Определить, является ли аргумент массивом.

  ```js
  // jQuery
  $.isArray(array);

  // Нативно
  Array.isArray(array);
  ```
+ isWindow

  Определить, является ли аргумент окном.

  ```js
  // jQuery
  $.isWindow(obj);

  // Нативно
  function isWindow(obj) {
    return obj != null && obj === obj.window;
  }
  ```

  + inArray

 Поиск определенного значения в массиве и возвращение его индекса (или -1 если значение не найдено)

  ```js
  // jQuery
  $.inArray(item, array);

  // Нативно
  array.indexOf(item);
  ```

  Проверить, содержится ли определенное значение в массиве.

  ```js
  // jQuery
  $.inArray(item, array) > -1;

  // Нативно
  array.indexOf(item) > -1;

  // В нотации ES6
  array.includes(item);
  ```

  + isNumeric

  Determine if the argument passed is numerical.
  Use `typeof` to decide the type or the `type` example for better accuracy. Определить, является ли переданный аргумент числовым. Используйте `typeof` для определения типа или `type` для большей точности.

  ```js
  // jQuery
  $.isNumeric(item);

  // Нативно
  function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  ```

  + isFunction

  Определить,  является ли переданный аргумент функцией(объектом) JavaScript.

  ```js
  // jQuery
  $.isFunction(item);

  // Нативно
  function isFunction(item) {
    if (typeof item === 'function') {
      return true;
    }
    var type = Object.prototype.toString.call(item);
    return type === '[object Function]' || type === '[object GeneratorFunction]';
  }
  ```

  + isEmptyObject

  Проверить, является ли объект пустым (не содержащим перечесляемых свойств)

  ```js
  // jQuery
  $.isEmptyObject(obj);

  // Нативно
  function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
  }
  ```

  + isPlainObject

  Проверить, является ли объект простым / 'ванильным' (созданным с помощью “{}” или “new Object”)

  ```js
  // jQuery
  $.isPlainObject(obj);

  // Нативно
  function isPlainObject(obj) {
    if (Object.prototype.toString.call(obj) !== '[object Object]') {
      return false;
    }

    const proto = Object.getPrototypeOf(obj);
    return proto === null || proto === Object.prototype;
  }
  ```

  + extend

  Объединить содержимое двух или более объектов в новый объект, не изменяя ни один из аргументов.
  Как и `$.extend` без `deep`, `Object.assign` и оператор spread создают только поверхностную копию.

  ```js
  // jQuery
  $.extend({}, object1, object2);

  // Нативно
  Object.assign({}, object1, object2);

  // Нативно (spread)
  ({ ...object1, ...object2 });
  ```

  Глубокое копирование одного объекта:

  ```js
  // jQuery
  $.extend(true, {}, object);

  // Нативно. Функции и узлы DOM клонировать нельзя
  structuredClone(object);
  ```

  + trim

  Убрать символы пробелов из начала и конца строки.

  ```js
  // jQuery
  $.trim(string);

  // Нативно
  string.trim();
  ```

  + map

  Преобразовать все элементы массива или объекта в новый массив.

  ```js
  // jQuery
  $.map(array, (value, index) => {
  });

  // Нативно
  array.map((value, index) => {
  });
  ```

  + each

  Общая (generic) функция итератора, которую можно использовать для последовательной итерации как по объектам, так и по массивам.

  ```js
  // jQuery (верните `false`, чтобы прервать цикл)
  $.each(array, (index, value) => {
  });

  // Нативно (используйте `for...of` или `some`, если нужно выйти из цикла досрочно)
  array.forEach((value, index) => {
  });

  // Нативно, для объектов
  Object.entries(obj).forEach(([key, value]) => {
  });
  ```

  + grep

  Найти элементы массива которые удовлетворяют функции-фильтру.

  ```js
  // jQuery
  $.grep(array, (value, index) => {
  });

  // Нативно
  array.filter((value, index) => {
  });
  ```

  + type

  Определите внутренний класс JavaScript объекта.

  ```js
  // jQuery
  $.type(obj);

  // Нативно
  function type(item) {
    const reTypeOf = /(?:^\[object\s(.*?)\]$)/;
    return Object.prototype.toString.call(item)
      .replace(reTypeOf, '$1')
      .toLowerCase();
  }
  ```

  + merge

  Объединить содержимое двух массивов в первый массив.

  ```js
  // jQuery, изменяет array1, не удаляя дубликаты
  $.merge(array1, array2);

  // Нативно, изменяет array1, не удаляя дубликаты
  array1.push(...array2);

  // Нативно, возвращает новый массив, не удаляя дубликаты
  function merge(...args) {
    return [].concat(...args);
  }

  // Версия с Set, возвращает новый массив, удаляя дубликаты
  function merge(...args) {
    return Array.from(new Set([].concat(...args)));
  }
  ```

  + now

  Вернуть текущее время в числовом формате.

  ```js
  // jQuery
  $.now();

  // Нативно
  Date.now();
  ```

  + proxy

  По заданной функции, создает другую такую же, cохраняя контекст.

  ```js
  // jQuery
  $.proxy(fn, context);

  // Нативно
  fn.bind(context);
  ```

  <a name="makeArray"></a>+ makeArray

  Конвертирует объекты, похожие на массивы, в массивы JavaScript.

  ```js
  // jQuery
  $.makeArray(arrayLike);

  // Нативно
  Array.from(arrayLike);

  // В нотации ES6: используя оператор распространения
  [...arrayLike];
  ```

- [6.2](#6.2) <a name='6.2'></a> Contains

  Проверяет, не является ли элемент DOM потомком другого элемента DOM.

  ```js
  // jQuery
  $.contains(el, child);

  // Нативно
  el !== child && el.contains(child);
  ```

- [6.3](#6.3) <a name='6.3'></a> globalEval

  Исполняет определенный JavaScript код глобально.

  ```js
  // jQuery
  $.globalEval(code);

  // Нативно
  function globalEval(code) {
    const script = document.createElement('script');
    script.text = code;

    document.head.appendChild(script).parentNode.removeChild(script);
  }

  // Используем eval, учитывая, что контекст eval текущий, а контекст $.globalEval глобальный.
  eval(code);
  ```

- [6.4](#6.4) <a name='6.4'></a> parse

  + parseHTML

  Разбирает строку в массив узлов DOM.

  ```js
  // jQuery
  $.parseHTML(htmlString);

  // Нативно
  function parseHTML(string) {
    const context = document.implementation.createHTMLDocument();

    // Устанавливает базовую ссылку для созданного документа, чтобы любые проанализированные элементы с URL-адресами
    // основывались на URL-адресе документа.
    const base = context.createElement('base');
    base.href = document.location.href;
    context.head.appendChild(base);

    context.body.innerHTML = string;
    return Array.from(context.body.childNodes);
  }
  ```

- [6.5](#6.5) <a name='6.5'></a> exists

  Проверяет, существует ли элемент в DOM.

  ```js
  // jQuery
  if ($('selector').length) {
    // exists
  }

  // Нативно
  if (document.querySelector('selector')) {
    // exists
  }
  ```

**[⬆ Наверх](#Содержание)**

## Промисы (Promises)

Промисы предоставляют собой удобный способ организации асинхронного кода. У jQuery есть свой способ обработки промисов. Нативный JavaScript реализует тонкий и минимальный API для обработки промисов в соответствии с [Promises/A+](https://promisesaplus.com/) спецификацией, а благодаря `async`/`await` код с промисами читается как синхронный.

- [7.1](#7.1) <a name='7.1'></a> done, fail, always

  `done` вызывается, когда промис разрешен,` fail` вызывается, когда промис отклонен, `always` вызывается, когда промис либо разрешен, либо отклонен.

  ```js
  // jQuery
  $promise.done(doneCallback).fail(failCallback).always(alwaysCallback)

  // Нативно
  promise.then(doneCallback, failCallback).finally(alwaysCallback);

  // Нативно (async/await)
  try {
    doneCallback(await promise);
  } catch (error) {
    failCallback(error);
  } finally {
    alwaysCallback();
  }
  ```

- [7.2](#7.2) <a name='7.2'></a> when

  `when` используется для обработки нескольких промисов. Он разрешится, когда будут выполнены все промисы, и отклонится, если один из промисов будет отклонен.

  ```js
  // jQuery
  $.when($promise1, $promise2).done((promise1Result, promise2Result) => {
  });

  // Нативно
  Promise.all([promise1, promise2]).then(([promise1Result, promise2Result]) => {});

  // Нативно (async/await)
  const [promise1Result, promise2Result] = await Promise.all([promise1, promise2]);
  ```

- [7.3](#7.3) <a name='7.3'></a> Deferred

  Отложенный способ создания промисов.

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

  // Нативно
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

  // Отложенным способом
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

**[⬆ Наверх](#Содержание)**

## Анимации

[Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) (`el.animate()`) ближе всего к эффектам jQuery: он принимает длительность в миллисекундах, по возможности выполняет анимацию вне основного потока и возвращает объект `Animation`, у которого промис `finished` разрешается, когда анимация заканчивается.

- [8.1](#8.1) <a name='8.1'></a> Show & Hide

  ```js
  // jQuery
  $el.show();
  $el.hide();

  // Нативно
  el.style.display = ''; // или 'block', 'inline', ..., если элемент скрыт таблицей стилей
  el.style.display = 'none';

  // Нативно (если `display` элемента нигде больше не задан)
  el.hidden = false;
  el.hidden = true;
  ```

- [8.2](#8.2) <a name='8.2'></a> Toggle

  Показать или скрыть элемент.

  ```js
  // jQuery
  $el.toggle();

  // Нативно
  if (getComputedStyle(el).display === 'none') {
    el.style.display = ''; // или 'block', 'inline', ...
  } else {
    el.style.display = 'none';
  }
  ```

- [8.3](#8.3) <a name='8.3'></a> FadeIn & FadeOut

  ```js
  // jQuery
  $el.fadeIn(3000);
  $el.fadeOut(3000);

  // Нативный fadeIn (появление)
  function fadeIn(el, ms = 400) {
    el.style.display = '';
    return el.animate([{ opacity: 0 }, { opacity: 1 }], ms).finished;
  }

  // Нативный fadeOut (исчезновение)
  function fadeOut(el, ms = 400) {
    return el.animate([{ opacity: 1 }, { opacity: 0 }], ms).finished.then(() => {
      el.style.display = 'none';
    });
  }
  ```

- [8.4](#8.4) <a name='8.4'></a> FadeTo

  Регулировка непрозрачности элемента.

  ```js
  // jQuery
  $el.fadeTo('slow',0.15);
  // Нативно ('slow' в jQuery равно 600 миллисекундам)
  el.animate([{ opacity: 0.15 }], { duration: 600, fill: 'forwards' });
  ```

- [8.5](#8.5) <a name='8.5'></a> FadeToggle

  Отображение или скрытие элемента через изменение его непрозрачности.

  ```js
  // jQuery
  $el.fadeToggle();

  // Нативно, с помощью fadeIn и fadeOut из 8.3
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

  // Нативный slideUp (сворачивание)
  function slideUp(el, ms = 400) {
    el.style.overflow = 'hidden';
    return el.animate([{ height: `${el.offsetHeight}px` }, { height: '0px' }], ms).finished.then(() => {
      el.style.display = 'none';
      el.style.overflow = '';
    });
  }

  // Нативный slideDown (разворачивание)
  function slideDown(el, ms = 400) {
    el.style.display = '';
    el.style.overflow = 'hidden';
    return el.animate([{ height: '0px' }, { height: `${el.scrollHeight}px` }], ms).finished.then(() => {
      el.style.overflow = '';
    });
  }
  ```

- [8.7](#8.7) <a name='8.7'></a> SlideToggle

  Отобразить или скрыть элемент скользящим движением (слайдом).

  ```js
  // jQuery
  $el.slideToggle();

  // Нативно, с помощью slideUp и slideDown из 8.6
  if (getComputedStyle(el).display === 'none') {
    slideDown(el);
  } else {
    slideUp(el);
  }
  ```

- [8.8](#8.8) <a name='8.8'></a> Animate

  Perform a custom animation of a set of CSS properties. Применить пользовательский набор свойств анимации CSS.

  ```js
  // jQuery
  $el.animate({ params }, speed);

  // Нативно (speed в миллисекундах)
  el.animate([params], { duration: speed, fill: 'forwards' });
  ```


## Альтернативы

* [You Might Not Need jQuery](https://youmightnotneedjquery.com/) - Примеры как исполняются частые события, элементы, ajax и тд с ванильным javascript.
* [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) - Справочник по всем DOM API, которые используются в этом руководстве.
* [Baseline](https://web.dev/baseline) - Позволяет проверить, какие возможности веб-платформы можно безопасно использовать во всех браузерах.

## Поддержка браузеров

![Chrome][chrome-image] | ![Edge][edge-image] | ![Firefox][firefox-image] | ![Safari][safari-image] | ![Opera][opera-image]
--- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ |

Некоторые примеры используют более новые API: `Promise.withResolvers()` (2024), `el.replaceChildren()` (2020) и `AbortSignal.timeout()` (2022). Если вы поддерживаете старые браузеры, сверьтесь с [Baseline](https://web.dev/baseline).

# License

MIT

[chrome-image]: https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png
[firefox-image]: https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png
[edge-image]: https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png
[opera-image]: https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png
[safari-image]: https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png
