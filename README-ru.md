## Вам не нужен jQuery

В наше время среда front-end разработки быстро развивается, и современные браузеры достаточно хорошо реализовали работу с DOM/BOM API. Вам не нужно изучать jQuery с нуля для манипуляцией DOM'ом или объектами событий. В то же время, благодаря лидирующим front-end библиотекам, таким как React, Angular и Vue, манипуляция DOM'ом напрямую становится антипаттерном, а jQuery теряет свою значимость. Этот проект объединяет большинство альтернативных методов jQuery в нативном исполнении с поддержкой IE 10+.

## Содержание

1. [Переводы](#Переводы)
1. [Query Selector](#query-selector)
1. [CSS & Style](#css--style)
1. [Манипуляция с DOM](#Манипуляции-dom)
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
* `document.querySelectorAll` возвращает все совпавшие элементы как список узлов (NodeList). Его можно конвертировать в массив, используя `Array.prototype.slice.call(document.querySelectorAll(selector));`
* Если никакие элементы не совпадут, jQuery и `document.querySelectorAll` вернет `[]` где `document.querySelector` вернет `null`.

> Заметка: `document.querySelector` и `document.querySelectorAll` достаточно **МЕДЛЕННЫ**, старайтесь использовать `getElementById`, `document.getElementsByClassName` или `document.getElementsByTagName` если хотите улучшить производительность.

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
    Array.prototype.filter.call(el.parentNode.children, (child) =>
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

  Возвращает первый совпавший элемент по предоставленному селектору, обходя от текущего элементы до документа.

  ```js
  // jQuery
  $el.closest(selector);

  // Нативно - только последние версии браузеров, без IE
  el.closest(selector);

  // Нативно - IE10+
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

- [1.7](#1.7) <a name='1.7'></a> Родители до

  Получить родителей каждого элемента в текущем результате совпавших элементов, но не включая элемент, совпавший с указанным селектором, узлом DOM'а, или объектом jQuery.

  ```js
  // jQuery
  $el.parentsUntil(selector, filter);

  // Нативно
  function parentsUntil(el, selector, filter) {
    const result = [];
    const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;

    // Совпадать начиная от родителя
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
    Array.prototype.indexOf.call(document.querySelectorAll('.radio'), e.currentTarget);
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
    // jQuery, помните, это происходит в памяти без изменения DOM
    $el.attr('foo', 'bar');

    // Нативно
    el.setAttribute('foo', 'bar');
    ```

  + Найти `data-` атрибут

    ```js
    // jQuery
    $el.data('foo');

    // Нативно (используя `getAttribute`)
    el.getAttribute('data-foo');

    // Нативно (используя `dataset`, если не требуется поддержка ниже IE 11)
    el.dataset['foo'];
    ```

**[⬆ Наверх](#Содержание)**

## CSS & Style

- [2.1](#2.1) <a name='2.1'></a> CSS

  + Получить стили

    ```js
    // jQuery
    $el.css('color');

    // Нативно
    // ЗАМЕТКА: Известная ошибка, возвращает 'auto' если значение стиля 'auto'
    const win = el.ownerDocument.defaultView;

    // null означает не возвращать псевдостили
    win.getComputedStyle(el, null).color;
    ```

  + Присвоение style

    ```js
    // jQuery
    $el.css({ color: '#f01' });

    // Нативно
    el.style.color = '#f01';
    ```

  + Получение/Присвоение стилей

    Заметьте что если вы хотите присвоить несколько стилей за раз, вы можете сослаться на [setStyles](https://github.com/oneuijs/oui-dom-utils/blob/master/src/index.js#L194) метод в пакете oui-dom-utils.


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
    // Высота окна
    $(window).height();

    // вместе с полосой прокрутки
    window.document.documentElement.clientHeight;

    // без полосы прокрутки, ведет себя как jQuery
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

    // С точностью до целого числа（когда `border-box`, это `height - border`; когда `content-box`, это `height + padding`）
    el.clientHeight;

    // С точностью до десятых（когда `border-box`, это `height`; когда `content-box`, это `height + padding + border`）
    el.getBoundingClientRect().height;
    ```

- [2.3](#2.3) <a name='2.3'></a> Позиция и смещение

  + Position

    Получить текущие координаты элемента относительно смещения его родителя

    ```js
    // jQuery
    $el.position();

    // Нативно
    { left: el.offsetLeft, top: el.offsetTop }
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
        top: box.top + window.pageYOffset - document.documentElement.clientTop,
        left: box.left + window.pageXOffset - document.documentElement.clientLeft
      };
    }
    ```

- [2.4](#2.4) <a name='2.4'></a> Прокрутка вверх

  ```js
  // jQuery
  $(window).scrollTop();

  // Нативно
  (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
  ```

**[⬆ Наверх](#Содержание)**

## Манипуляции с DOM

- [3.1](#3.1) <a name='3.1'></a> Remove

  Удаление элемента из DOM.

  ```js
  // jQuery
  $el.remove();

  // Нативно
  el.parentNode.removeChild(el);
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
  // jQuery
  $el.append('<div id="container">Hello World</div>');

  // Нативно (строка HTML)
  el.insertAdjacentHTML('beforeend', '<div id="container">Hello World</div>');

  // Нативно (элемент)
  el.appendChild(newEl);
  ```

- [3.5](#3.5) <a name='3.5'></a> Prepend

	Добавить родительскому элементу новый дочерний элемент перед остальными

  ```js
  // jQuery
  $el.prepend('<div id="container">Hello World</div>');

  // Нативно (строка HTML)
  el.insertAdjacentHTML('afterbegin', '<div id="container">Hello World</div>');

  // Нативно (элемент)
  el.insertBefore(newEl, el.firstChild);
  ```

- [3.6](#3.6) <a name='3.6'></a> insertBefore

  Вставка нового элемента перед выбранным элементом

  ```js
  // jQuery
  $newEl.insertBefore(selector);

  // Нативно (строка HTML)
  el.insertAdjacentHTML('beforebegin ', '<div id="container">Hello World</div>');

  // Нативно (элемент)
  const el = document.querySelector(selector);
  if (el.parentNode) {
    el.parentNode.insertBefore(newEl, el);
  }
  ```

- [3.7](#3.7) <a name='3.7'></a> insertAfter

  Вставка новго элемента после выбранного элемента

  ```js
  // jQuery
  $newEl.insertAfter(selector);

  // Нативно (строка HTML)
  el.insertAdjacentHTML('afterend', '<div id="container">Hello World</div>');

  // Нативно (элемент)
  const el = document.querySelector(selector);
  if (el.parentNode) {
    el.parentNode.insertBefore(newEl, el.nextSibling);
  }
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

[Fetch API](https://fetch.spec.whatwg.org/) - новый стандарт, заменяющий XMLHttpRequest для ajax. Работает в Chrome и Firefox, вы можете использовать полифилы, для поддержки старых браузеров.

Попробуйте [github/fetch](http://github.com/github/fetch) для IE9+ или [fetch-ie8](https://github.com/camsong/fetch-ie8/) для IE8+, [fetch-jsonp](https://github.com/camsong/fetch-jsonp) для JSONP-запросов.

- [4.1](#4.1) <a name='4.1'></a> Загрузить данные с сервера и поместить полученный HTML в элемент.

  ```js
  // jQuery
  $(selector).load(url, completeCallback)

  // Нативно
  fetch(url).then(data => data.text()).then(data => {
    document.querySelector(selector).innerHTML = data
  }).then(completeCallback)
  ```

**[⬆ Наверх](#Содержание)**

## События

Для полной замены пространства имен и делегирования, используйте  [oui-dom-events](https://github.com/oneuijs/oui-dom-events)

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
  ```

- [5.1](#5.1) <a name='5.1'></a> Связать событие используя `on`

  ```js
  // jQuery
  $el.on(eventName, eventHandler);

  // Нативно
  el.addEventListener(eventName, eventHandler);
  ```

- [5.2](#5.2) <a name='5.2'></a> Отвязать событие используя `off`

  ```js
  // jQuery
  $el.off(eventName, eventHandler);

  // Нативно
  el.removeEventListener(eventName, eventHandler);
  ```

- [5.3](#5.3) <a name='5.3'></a> Trigger

  ```js
  // jQuery
  $(el).trigger('custom-event', {key1: 'data'});

  // Нативно
  if (window.CustomEvent) {
    const event = new CustomEvent('custom-event', {detail: {key1: 'data'}});
  } else {
    const event = document.createEvent('CustomEvent');
    event.initCustomEvent('custom-event', true, true, {key1: 'data'});
  }

  el.dispatchEvent(event);
  ```

**[⬆ Наверх](#Содержание)**

## Утилиты

Большинство из утилит, представленных в jQuery также могут быть найдены в нативном API. Более продвинутые функции могут быть выбраны из других, более актуальных библиотек, направленных на согласованность данных и производительность. Например, [Lodash](https://lodash.com) является рекомендуемой заменой.

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
    return obj !== null && obj !== undefined && obj === obj.window;
  }
  ```

  + inArray

 Поиск определенного значения в массиве и возвращение его индекса (или -1 если значение не найдено)

  ```js
  // jQuery
  $.inArray(item, array);

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

  Объединить содержимое двух или более объектов в новый объект, не изменяя ни один из аргументов. 
  object.assign является частью ES6 API, также можно использовать [полифилл](https://github.com/ljharb/object.assign).

  ```js
  // jQuery
  $.extend({}, object1, object2);

  // Нативно
  Object.assign({}, object1, object2);
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
  // jQuery
  $.each(array, (index, value) => {
  });

  // Нативно
  array.forEach((value, index) => {
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
  // jQuery, не удаляя дубликаты
  $.merge(array1, array2);

  // Нативно, не удаляя дубликаты
  function merge(...args) {
    return [].concat(...args)
  }

  // В нотации ES6, не удаляя дубликаты
  array1 = [...array1, ...array2]

  // Версия с удалением дубликатов
  function merge(...args) {
    return Array.from(new Set([].concat(...args)))
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
  Array.prototype.slice.call(arrayLike);

  // В нотации ES6: Array.from() метод
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

- [6.3](#6.3) <a name='6.3'></a> Globaleval

  Исполняет определенный JavaScript код глобально.

  ```js
  // jQuery
  $.globaleval(code);

  // Нативно
  function Globaleval(code) {
    const script = document.createElement('script');
    script.text = code;

    document.head.appendChild(script).parentNode.removeChild(script);
  }

  // Используем eval, учитывая, что контекст eval текущий, а контекст $.Globaleval глобальный.
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
    return context.body.children;
  }
  ```
- [6.5](#6.4) <a name='6.5'></a> exists

+ exists

  Проверяет, существует ли элемент в DOM.
  
  ```js
  // jQuery
  if ($('selector').length) {
     // exists
  }

  // Нативно
  var element =  document.getElementById('elementId');
  if (typeof(element) != 'undefined' && element != null) 
  {
     // exists
  }
  ```

**[⬆ Наверх](#Содержание)**

## Промисы (Promises)

Промисы предоставляют собой удобный способ организации асинхронного кода. У jQuery есть свой способ обработки промисов. Нативный JavaScript реализует тонкий и минимальный API для обработки промисов в соответствии с [Promises/A+](http://promises-aplus.github.io/promises-spec/) спецификацией.

- [7.1](#7.1) <a name='7.1'></a> done, fail, always

  `done` вызывается, когда промис разрешен,` fail` вызывается, когда промис отклонен, `always` вызывается, когда промис либо разрешен, либо отклонен.

  ```js
  // jQuery
  $promise.done(doneCallback).fail(failCallback).always(alwaysCallback)

  // Нативно
  promise.then(doneCallback, failCallback).then(alwaysCallback, alwaysCallback)
  ```

- [7.2](#7.2) <a name='7.2'></a> when

  `when` используется для обработки нескольких промисов. Он разрешится, когда будут выполнены все промисы, и отклонится, если один из промисов будет отклонен.

  ```js
  // jQuery
  $.when($promise1, $promise2).done((promise1Result, promise2Result) => {
  });

  // Нативно
  Promise.all([$promise1, $promise2]).then([promise1Result, promise2Result] => {});
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

**[⬆ Наверх](#Содержание)**

## Анимации

- [8.1](#8.1) <a name='8.1'></a> Show & Hide

  ```js
  // jQuery
  $el.show();
  $el.hide();

  // Нативно
  // За дополнительной информацией о методе show, пройдите по ссылке https://github.com/oneuijs/oui-dom-utils/blob/master/src/index.js#L363
  el.style.display = ''|'inline'|'inline-block'|'inline-table'|'block';
  el.style.display = 'none';
  ```

- [8.2](#8.2) <a name='8.2'></a> Toggle

  Показать или скрыть элемент.

  ```js
  // jQuery
  $el.toggle();

  // Нативно
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

  // Нативный fadeOut (исчезновение)
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

  // Нативный fadeIn (появление)
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

  Регулировка непрозрачности элемента.

  ```js
  // jQuery
  $el.fadeTo('slow',0.15);
  // Нативно
  el.style.transition = 'opacity 3s'; // assume 'slow' equals 3 seconds
  el.style.opacity = '0.15';
  ```

- [8.5](#8.5) <a name='8.5'></a> FadeToggle

  Отображение или скрытие элемента через изменение его непрозрачности.

  ```js
  // jQuery
  $el.fadeToggle();

  // Нативно
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

  // Нативно
  const originHeight = '100px';
  el.style.transition = 'height 3s';
  // slideUp
  el.style.height = '0px';
  // slideDown
  el.style.height = originHeight;
  ```

- [8.7](#8.7) <a name='8.7'></a> SlideToggle

  Отобразить или скрыть элемент скользящим движением (слайдом).

  ```js
  // jQuery
  $el.slideToggle();

  // Нативно
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

  Perform a custom animation of a set of CSS properties. Применить пользовательский набор свойств анимации CSS.

  ```js
  // jQuery
  $el.animate({ params }, speed);

  // Нативно
  el.style.transition = 'all ' + speed;
  Object.keys(params).forEach((key) =>
    el.style[key] = params[key];
  )
  ```


## Альтернативы

* [You Might Not Need jQuery](http://youmightnotneedjquery.com/) - Примеры как исполняются частые события, элементы, ajax и тд с ванильным javascript.
* [npm-dom](http://github.com/npm-dom) и [webmodules](http://github.com/webmodules) - Отдельные DOM модули можно найти на NPM

## Поддержка браузеров

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
