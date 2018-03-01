## Вам не нужен jQuery

В наше время среда front-end разработки быстро развивается, и современные браузеры достаточно хорошо реализовали работу с DOM/BOM API. Вам не нужно изучать jQuery с нуля для манипуляцией DOM'ом или объектами событий. В то же время, благодаря лидирующим front-end библиотекам, таким как React, Angular и Vue, манипуляция DOM'ом напрямую становится антипаттерном, а jQuery теряет свою значимость. Этот проект объединяет большинство альтернативных методов jQuery в нативном исполнении с поддержкой IE 10+.

## Содержание

1. [Переводы](#Переводы)
1. [Query Selector](#query-selector)
1. [CSS & Style](#css--style)
1. [Манипуляция DOM](#Манипуляции-dom)
1. [Ajax](#ajax)
1. [События](#События)
1. [Утилиты](#Утилиты)
1. [Альтернативы](#Альтернативы)
1. [Поддержка браузеров](#Поддержка-браузеров)

## Переводы

* [한국어](./README.ko-KR.md)
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

  // Native
  document.querySelectorAll('selector');
  ```

- [1.1](#1.1) <a name='1.1'></a> Запрос по классу

  ```js
  // jQuery
  $('.class');

  // Native
  document.querySelectorAll('.class');

  // или
  document.getElementsByClassName('class');
  ```

- [1.2](#1.2) <a name='1.2'></a> Запрос по ID

  ```js
  // jQuery
  $('#id');

  // Native
  document.querySelector('#id');

  // или
  document.getElementById('id');
  ```

- [1.3](#1.3) <a name='1.3'></a> Запрос по атрибуту

  ```js
  // jQuery
  $('a[target=_blank]');

  // Native
  document.querySelectorAll('a[target=_blank]');
  ```

- [1.4](#1.4) <a name='1.4'></a> Найти среди потомков

  ```js
  // jQuery
  $el.find('li');

  // Native
  el.querySelectorAll('li');
  ```

- [1.5](#1.5) <a name='1.5'></a> Родственные/Предыдущие/Следующие Элементы

  + Родственные элементы

    ```js
    // jQuery
    $el.siblings();

    // Native
    Array.prototype.filter.call(el.parentNode.children, (child) =>
      child !== el
    );
    ```

  + Предыдущие элементы

    ```js
    // jQuery
    $el.prev();

    // Native
    el.previousElementSibling;
    ```

  + Следующие элементы

    ```js
    // jQuery
    $el.next();

    // Native
    el.nextElementSibling;
    ```

- [1.6](#1.6) <a name='1.6'></a> Ближайший

  Возвращает первый совпавший элемент по предоставленному селектору, обходя от текущего элементы до документа.

  ```js
  // jQuery
  $el.closest(selector);

  // Native - только последние версии браузеров, без IE
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

- [1.7](#1.7) <a name='1.7'></a> Родители до

  Получить родителей каждого элемента в текущем результате совпавших элементов, но не включая элемент, совпавший с указанным селектором, узлом DOM'а, или объектом jQuery.

  ```js
  // jQuery
  $el.parentsUntil(selector, filter);

  // Native
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

    // Native
    document.querySelector('#my-input').value;
    ```

  + Получить индекс e.currentTarget между `.radio`

    ```js
    // jQuery
    $('.radio').index(e.currentTarget);

    // Native
    Array.prototype.indexOf.call(document.querySelectorAll('.radio'), e.currentTarget);
    ```

- [1.9](#1.9) <a name='1.9'></a> Содержимое Iframe

  `$('iframe').contents()` возвращает `contentDocument` именно для этого iframe

  + Контент Iframe

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

- [1.10](#1.10) <a name='1.10'></a> Найти body

  ```js
  // jQuery
  $('body');

  // Native
  document.body;
  ```

- [1.11](#1.11) <a name='1.11'></a> Получение и изменение атрибута

  + Найти атрибут

    ```js
    // jQuery
    $el.attr('foo');

    // Native
    el.getAttribute('foo');
    ```
  + Добавление атрибута

    ```js
    // jQuery, помните, это происходит в памяти без изменения DOM
    $el.attr('foo', 'bar');

    // Native
    el.setAttribute('foo', 'bar');
    ```

  + Найти `data-` атрибут

    ```js
    // jQuery
    $el.data('foo');

    // Native (используя `getAttribute`)
    el.getAttribute('data-foo');

    // Native (используя `dataset`, если не требуется поддержка ниже IE 11)
    el.dataset['foo'];
    ```

**[⬆ Наверх](#Содержание)**

## CSS & Style

- [2.1](#2.1) <a name='2.1'></a> CSS

  + Получить стили

    ```js
    // jQuery
    $el.css('color');

    // Native
    // ЗАМЕТКА: Известная ошибка, возвращает 'auto' если значение стиля 'auto'
    const win = el.ownerDocument.defaultView;

    // null означает не возвращать псевдостили
    win.getComputedStyle(el, null).color;
    ```

  + Присвоение style

    ```js
    // jQuery
    $el.css({ color: '#f01' });

    // Native
    el.style.color = '#f01';
    ```

  + Получение/Присвоение стилей

    Заметьте что если вы хотите присвоить несколько стилей за раз, вы можете сослаться на [setStyles](https://github.com/oneuijs/oui-dom-utils/blob/master/src/index.js#L194) метод в пакете oui-dom-utils.


  + Добавить класс

    ```js
    // jQuery
    $el.addClass(className);

    // Native
    el.classList.add(className);
    ```

  + Удалить class

    ```js
    // jQuery
    $el.removeClass(className);

    // Native
    el.classList.remove(className);
    ```

  + Имеет ли класс

    ```js
    // jQuery
    $el.hasClass(className);

    // Native
    el.classList.contains(className);
    ```

  + Переключить класс

    ```js
    // jQuery
    $el.toggleClass(className);

    // Native
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

  + Высота элемента

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

    // Native
    { left: el.offsetLeft, top: el.offsetTop }
    ```

  + Offset

    Получить текущие координаты элемента относительно документа

    ```js
    // jQuery
    $el.offset();

    // Native
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

  // Native
  (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
  ```

**[⬆ Наверх](#Содержание)**

## Манипуляции DOM

- [3.1](#3.1) <a name='3.1'></a> Remove

  Удаление элемента из DOM.

  ```js
  // jQuery
  $el.remove();

  // Native
  el.parentNode.removeChild(el);
  ```

- [3.2](#3.2) <a name='3.2'></a> Text

  + Получить текст

    Получить текстовое содержимое элемента, включая его потомков,

    ```js
    // jQuery
    $el.text();

    // Native
    el.textContent;
    ```

  + Присвоить текст

    ```js
    // jQuery
    $el.text(string);

    // Native
    el.textContent = string;
    ```

- [3.3](#3.3) <a name='3.3'></a> HTML

  + Получить HTML

    ```js
    // jQuery
    $el.html();

    // Native
    el.innerHTML;
    ```

  + Присвоить HTML

    ```js
    // jQuery
    $el.html(htmlString);

    // Native
    el.innerHTML = htmlString;
    ```

- [3.4](#3.4) <a name='3.4'></a> Append

  Добавить родительскому элементу новый дочерний элемент.

  ```js
  // jQuery
  $el.append('<div id="container">Hello World</div>');

  // Native (строка HTML)
  el.insertAdjacentHTML('beforeend', '<div id="container">Hello World</div>');

  // Native (элемент)
  el.appendChild(newEl);
  ```

- [3.5](#3.5) <a name='3.5'></a> Prepend

	Добавить родительскому элементу новый дочерний элемент перед остальными

  ```js
  // jQuery
  $el.prepend('<div id="container">Hello World</div>');

  // Native (строка HTML)
  el.insertAdjacentHTML('afterbegin', '<div id="container">Hello World</div>');

  // Native (элемент)
  el.insertBefore(newEl, el.firstChild);
  ```

- [3.6](#3.6) <a name='3.6'></a> insertBefore

  Вставка нового элемента перед выбранным элементом

  ```js
  // jQuery
  $newEl.insertBefore(selector);

  // Native (строка HTML)
  el.insertAdjacentHTML('beforebegin ', '<div id="container">Hello World</div>');

  // Native (элемент)
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

  // Native (строка HTML)
  el.insertAdjacentHTML('afterend', '<div id="container">Hello World</div>');

  // Native (элемент)
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

  // Native
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

  // Native
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

  // Native
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

  // Native
  el.addEventListener(eventName, eventHandler);
  ```

- [5.2](#5.2) <a name='5.2'></a> Отвязать событие используя `off`

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

**[⬆ Наверх](#Содержание)**

## Утилиты

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

- [6.3](#6.3) <a name='6.3'></a> Назначение объекта

  Дополнительно, используйте полифил object.assign https://github.com/ljharb/object.assign

  ```js
  // jQuery
  $.extend({}, defaultOpts, opts);

  // Native
  Object.assign({}, defaultOpts, opts);
  ```

- [6.4](#6.4) <a name='6.4'></a> Contains

  ```js
  // jQuery
  $.contains(el, child);

  // Native
  el !== child && el.contains(child);
  ```

**[⬆ Наверх](#Содержание)**

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
