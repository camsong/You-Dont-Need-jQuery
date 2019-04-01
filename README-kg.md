## jQuery'ге муктаждыгынар жок  [![Build Status](https://travis-ci.org/oneuijs/You-Dont-Need-jQuery.svg)](https://travis-ci.org/oneuijs/You-Dont-Need-jQuery)

Биздин убакта фронт-энд чөйрөсү абдан ылдам өнүгүп жатат, ошонун менен бирге заманбап браузерлер көптөгөн DOM/BOM API жагын ишке ашырды. Бул абдан жакшы көрүнүш. Анткени, силер DOM'ду манипуляциялоо же  окуялардын объектерин иштешиш үчүн jQuery'ни башынан үйрөнүнөрдүн кажети калбайт.Ошонун менен бирге,  алдыда келе жаткан React, Angular жана  Vue фронт-энд библиотекалардын жардамы менен, DOM'ду түздөн-түз манипуляциялоо өзүнчө бир антипаттернге айланды.Бул проект көптөгөн jQuery методдорун нативдуу аткаруусу  жана IE 10+ колдоосу менен кошулган көптөгөн альтернативаларды өзүнө камтыйт.
## Мазмуну

1. [Котормолор](#Котормолор)
1. [Query Selector](#query-selector)
1. [CSS & Style](#css--style)
1. [DOM манипуляциясы](#DOM-манипуляциясы)
1. [Ajax](#ajax)
1. [Окуялар](#Окуялар)
1. [Утилиталар](#Утилиталар)
1. [Альтернативалар](#Альтернативалар)
1. [Браузерлердин колдоосу](#Браузерлердин-колдоосу)

## Котормолор

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

## Query selector

 Көп колдонулган class, id же болбосо attribute сыяктуу селекторлор үчүн биз  `document.querySelector` же  `document.querySelectorAll` колдонсок болот. Айырмасы төмөнкүдөй:
* `document.querySelector` биринчи дал келген элементти кайтарат.
* `document.querySelectorAll` баардык дал келген элементтерди  түйүндөр коллекциялары(NodeList) сыяктуу кайтарат. Аны  `[].slice.call(document.querySelectorAll(selector) || []);` аркылуу  массивге конвертация кылууга болот.
* Эгерде эч элементтер дал келбесе, анда  DOM API  `null` кайтарганда  jQuery  `[]` кайтарат. Null (Null Pointer Exception) чыгаруунун көрсөткүчүнө  көнүл бургула.  Эгерде дал келүүлөр  кездешбесе, анда силер жарыяланбаган маани үчүн `||` колдонсонор болот `document.querySelectorAll(selector) || []`

> Белгилөө: `document.querySelector` жана `document.querySelectorAll` чыныгы **ЖАЙ**,  колдон келишинче кирешелүүлүктү жакшыртуу максатында `getElementById`, `document.getElementsByClassName` же `document.getElementsByTagName`  колдонго аракет кылгыла.

- [1.0](#1.0) <a name='1.0'></a> Селектор аркылуу издөө

  ```js
  // jQuery
  $('selector');

  // Нативдүү түрү
  document.querySelectorAll('selector');
  ```

- [1.1](#1.1) <a name='1.1'></a>  Класс боюнча кайрылуу

  ```js
  // jQuery
  $('.class');

  // Нативдүү түрү
  document.querySelectorAll('.class');

  // же
  document.getElementsByClassName('class');
  ```

- [1.2](#1.2) <a name='1.2'></a>  ID боюнча кайрылуу

  ```js
  // jQuery
  $('#id');

  // Нативдүү түрү
  document.querySelector('#id');

  // же
  document.getElementById('id');
  ```

- [1.3](#1.3) <a name='1.3'></a> Атрибут боюнча кайрылуу

  ```js
  // jQuery
  $('a[target=_blank]');

  // Нативдүү түрү
  document.querySelectorAll('a[target=_blank]');
  ```

- [1.4](#1.4) <a name='1.4'></a> Тукумдардын арасында издөө

  ```js
  // jQuery
  $el.find('li');

  // Нативдүү түрү
  el.querySelectorAll('li');
  ```

- [1.5](#1.5) <a name='1.5'></a> Бекем байланышкан/Мурунку/Кийинки элементтер

  + Бекем байланышкан элементтер

    ```js
    // jQuery
    $el.siblings();

    // Нативдүү түрү
    [].filter.call(el.parentNode.children, function(child) {
      return child !== el;
    });
    ```

  + Мурунку элементтер

    ```js
    // jQuery
    $el.prev();

    // Нативдүү түрү
    el.previousElementSibling;
    ```

  + Кийинки элементтер

    ```js
    // jQuery
    $el.next();

    // Нативдүү түрү
    el.nextElementSibling;
    ```

- [1.6](#1.6) <a name='1.6'></a> Жакынкы

  Берилген селектор аркылуу биринчи дал келген элементти кайтарат.

  ```js
  // jQuery
  $el.closest(selector);

  // Нативдүү түрү - Only latest, NO IE
  el.closest(selector);

  // Нативдүү түрү - IE10+
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

- [1.7](#1.7) <a name='1.7'></a> Ата-энеге чейин
     Бир бирине   жана селекторго дал келген, DOM'дун узели жана jquery'нин объектинен тышкары  элементтерлин сетинде жайгашкан ар-бир элементтин ата-энесин кайтарат.

  ```js
  // jQuery
  $el.parentsUntil(selector, filter);

  // Нативдүү түрү
  function parentsUntil(el, selector, filter) {
    const result = [];
    const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;

    // Ата-энеден баштап дал келүү
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

- [1.8](#1.8) <a name='1.8'></a> От

  + Input/Textarea

    ```js
    // jQuery
    $('#my-input').val();

    // Нативдүү түрү
    document.querySelector('#my-input').value;
    ```

  + e.currentTarget жана  `.radio` индексин алуу

    ```js
    // jQuery
    $(e.currentTarget).index('.radio');

    // Нативдүү түрү
    [].indexOf.call(document.querySelectorAll('.radio'), e.currentTarget);
    ```

- [1.9](#1.9) <a name='1.9'></a>  Iframe Контенти

  `$('iframe').contents()` 'дин  `contentDocument`'н кайтарат.

  +  Iframe'дин контенти

    ```js
    // jQuery
    $iframe.contents();

    // Нативдүү түрү
    iframe.contentDocument;
    ```

  + Iframe Кайрылуу

    ```js
    // jQuery
    $iframe.contents().find('.css');

    // Нативдүү түрү
    iframe.contentDocument.querySelectorAll('.css');
    ```

- [1.10](#1.10) <a name='1.10'></a>  body'ни табуу

  ```js
  // jQuery
  $('body');

  // Нативдүү түрү
  document.body;
  ```

- [1.11](#1.11) <a name='1.11'></a>Атрибутту алуу жана аны  өзгөртүү

  + Атрибутту табуу

    ```js
    // jQuery
    $el.attr('foo');

    // Нативдүү түрү
    el.getAttribute('foo');
    ```
  + Атрибутту кошуу

    ```js
    // jQuery, DOM'ду өзгөртпөстөн эсте иштей берет
    $el.attr('foo', 'bar');

    // Нативдүү түрү
    el.setAttribute('foo', 'bar');
    ```

  +  `data-` атрибутту табуу

    ```js
    // jQuery
    $el.data('foo');

    // Нативдүү түрү (`getAttribute`'ду колдонуп)
    el.getAttribute('data-foo');
    // Нативдүү түрү  ( `dataset`'ти колдонуу, эгерде  IE 11 төмөн колдоо жок болсо)
    el.dataset['foo'];
    ```

    **[⬆ Башына](#Мазмуну)**

    ## CSS & Style

    - [2.1](#2.1) <a name='2.1'></a> CSS

      +  Стильди алуу

        ```js
        // jQuery
        $el.css("color");

        // Нативдүү түрү
        // Белгилөө:  Белгилүү ката, эгерде стильдин мааниси 'auto' болсо, анда 'auto' кайтарат
        const win = el.ownerDocument.defaultView;
        // null псевдостильдерди кайтарбоону белгилейт
        win.getComputedStyle(el, null).color;
        ```

      +  style менчиктоо

        ```js
        // jQuery
        $el.css({ color: "#ff0011" });

        // Нативдүү түрү
        el.style.color = '#ff0011';
        ```

      +  Стильдерди Алуу/Менчиктоо

        Заметьте что если вы хотите присвоить несколько стилей за раз, вы можете сослаться на [setStyles](https://github.com/oneuijs/oui-dom-utils/blob/master/src/index.js#L194) метод в oui-dom-utils package.


      + Классты кошуу

        ```js
        // jQuery
        $el.addClass(className);

        // Нативдүү түрү
        el.classList.add(className);
        ```

      + Классты жок кылуу

        ```js
        // jQuery
        $el.removeClass(className);

        // Нативдүү түрү
        el.classList.remove(className);
        ```

      +  Классты камтыйт

        ```js
        // jQuery
        $el.hasClass(className);

        // Нативдүү түрү
        el.classList.contains(className);
        ```

      +  Классты которуу

        ```js
        // jQuery
        $el.toggleClass(className);

        // Нативдүү түрү
        el.classList.toggle(className);
        ```

    - [2.2](#2.2) <a name='2.2'></a> Туурасы жана узундугу

      Турасы жана узундугу теорикалык турдо бири-бирине окшош, узундугун мисалга алсак:

      + Терезенин узундугу

        ```js
        // Терезенин узундугу
        $(window).height();
        // Скролбарсыз jQuery'дей эле сыяктуу болот
        window.document.documentElement.clientHeight;
        // скролбар менен
        window.innerHeight;
        ```

      + Документтин узундугу

        ```js
        // jQuery
        $(document).height();

        // Нативдүү түрү
        document.documentElement.scrollHeight;
        ```

      + Элементтин узундугу

        ```js
        // jQuery
        $el.height();

        // Нативдүү түрү
        function getHeight(el) {
          const styles = window.getComputedStyle(el);
          const height = el.offsetHeight;
          const borderTopWidth = parseFloat(styles.borderTopWidth);
          const borderBottomWidth = parseFloat(styles.borderBottomWidth);
          const paddingTop = parseFloat(styles.paddingTop);
          const paddingBottom = parseFloat(styles.paddingBottom);
          return height - borderBottomWidth - borderTopWidth - paddingTop - paddingBottom;
        }
        // Так сандарга чейин（ `border-box` болгондо, анда `height - border`;  `content-box` болгондо, анда  `height + padding`）
        el.clientHeight;
        // Ондон бирине чейин（ `border-box` болгондо, анда `height`;  `content-box` болгондо, анда `height + padding + border`）
        el.getBoundingClientRect().height;
        ```

    - [2.3](#2.3) <a name='2.3'></a> Позиция  жана  өтүү

      + Позициясы

        Ата-энесин жылуусу боюнча учурдагы координаттарды алуу

        ```js
        // jQuery
        $el.position();

        // Нативдүү түрү
        { left: el.offsetLeft, top: el.offsetTop }
        ```

      + Ылдый өтүү

        Учурдагы элементтин координаттарын кайтарып алуу

        ```js
        // jQuery
        $el.offset();

        // Нативдүү түрү
        function getOffset (el) {
          const box = el.getBoundingClientRect();

          return {
            top: box.top + window.pageYOffset - document.documentElement.clientTop,
            left: box.left + window.pageXOffset - document.documentElement.clientLeft
          }
        }
        ```

    - [2.4](#2.4) <a name='2.4'></a> Жогоруга жылдыруу

      ```js
      // jQuery
      $(window).scrollTop();

      // Нативдүү түрү
      (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
      ```

    **[⬆ Башына](#Мазмуну)**

    ## DOM манипуляциясы

    - [3.1](#3.1) <a name='3.1'></a> Remove

       DOM'дон элементти өчүрүү .

      ```js
      // jQuery
      $el.remove();

      // Нативдүү түрү
      el.parentNode.removeChild(el);
      ```

    - [3.2](#3.2) <a name='3.2'></a> Текст

      +  Текстти кайтарып алуу

        Элементтин тексттик  түрүн кайтарып алуу

        ```js
        // jQuery
        $el.text();

        // Нативдүү түрү
        el.textContent;
        ```

      +  Текстти менчиктөө

        ```js
        // jQuery
        $el.text(string);

        // Нативдүү түрү
        el.textContent = string;
        ```

    - [3.3](#3.3) <a name='3.3'></a> HTML

      +  HTML кайтарып алуу

        ```js
        // jQuery
        $el.html();

        // Нативдүү түрү
        el.innerHTML;
        ```

      +  HTML'ны менчиктөө

        ```js
        // jQuery
        $el.html(htmlString);

        // Нативдүү түрү
        el.innerHTML = htmlString;
        ```

    - [3.4](#3.4) <a name='3.4'></a> Append

      Акыркы ата-эненин баласындан кийин жаны элементти кошуу

      ```js
      // jQuery
      $el.append("<div id='container'>hello</div>");

      // Нативдүү түрү
      el.insertAdjacentHTML("beforeend","<div id='container'>hello</div>");
      ```

    - [3.5](#3.5) <a name='3.5'></a> Prepend

      ```js
      // jQuery
      $el.prepend("<div id='container'>hello</div>");

      // Нативдүү түрү
      el.insertAdjacentHTML("afterbegin","<div id='container'>hello</div>");
      ```

    - [3.6](#3.6) <a name='3.6'></a> insertBefore

      Тандалган элементтин астына жаны элементти кошуу


      ```js
      // jQuery
      $newEl.insertBefore(queryString);

      // Нативдүү түрү
      const target = document.querySelector(queryString);
      target.parentNode.insertBefore(newEl, target);
      ```

    - [3.7](#3.7) <a name='3.7'></a> insertAfter

      Тандалган элементтен кийин жаны элементти кошуу

      ```js
      // jQuery
      $newEl.insertAfter(queryString);

      // Нативдүү түрү
      const target = document.querySelector(queryString);
      target.parentNode.insertBefore(newEl, target.nextSibling);
      ```

    - [3.8](#3.8) <a name='3.8'></a> is

       Эгерде селектордун кайрылуусуна  дал келсе, анда `true` кайтарат.

      ```js
      // jQuery - байсанар,   `is` `function` же  `elements` менен да иштейт.
      $el.is(selector);

      // Нативдүү түрү
      el.matches(selector);
      ```

    **[⬆ Башына](#Мазмуну)**

    ## Ajax

    [Fetch API](https://fetch.spec.whatwg.org/) -  XMLHttpRequest ajax үчүн орун алган жаны стандарт. Chrome жана Firefox үчүн иштейт, бирок силер эски браузерлердин колдоосу үчүн полифилдерди колдонсонор болот.

      IE9+ [github/fetch](http://github.com/github/fetch)үчүн  же  [fetch-ie8](https://github.com/camsong/fetch-ie8/)  IE8+ үчүн, [fetch-jsonp](https://github.com/camsong/fetch-jsonp)  JSONP-кайрылуулар үчүн колдонуп көргулө .

    **[⬆ Башына](#Мазмуну)**

    ## Окуялар

    Аттардын мейкиндигни толук алмаштыруу жана делегирование кылыш үчүн  [oui-dom-events](https://github.com/oneuijs/oui-dom-events) кайрылуу керек

    - [5.1](#5.1) <a name='5.1'></a> Окуяларды onn аркылуу  байланыштыруу

      ```js
      // jQuery
      $el.on(eventName, eventHandler);

      // Нативдүү түрү
      el.addEventListener(eventName, eventHandler);
      ```

    - [5.2](#5.2) <a name='5.2'></a> Окуяларды off аркылуу  жоюу

      ```js
      // jQuery
      $el.off(eventName, eventHandler);

      // Нативдүү түрү
      el.removeEventListener(eventName, eventHandler);
      ```

    - [5.3](#5.3) <a name='5.3'></a> Trigger

      ```js
      // jQuery
      $(el).trigger('custom-event', {key1: 'data'});

      // Нативдүү түрү
      if (window.CustomEvent) {
        const event = new CustomEvent('custom-event', {detail: {key1: 'data'}});
      } else {
        const event = document.createEvent('CustomEvent');
        event.initCustomEvent('custom-event', true, true, {key1: 'data'});
      }

      el.dispatchEvent(event);
      ```

    **[⬆ Башына](#Мазмуну)**

    ## Утилиталар

    - [6.1](#6.1) <a name='6.1'></a> isArray

      ```js
      // jQuery
      $.isArray(range);

      // Нативдүү түрү
      Array.isArray(range);
      ```

    - [6.2](#6.2) <a name='6.2'></a> Trim

      ```js
      // jQuery
      $.trim(string);

      // Нативдүү түрү
      string.trim();
      ```

    - [6.3](#6.3) <a name='6.3'></a> Объектин дайындоосу

      Кошумча  object.assign https://github.com/ljharb/object.assign полифилин колдонгула

      ```js
      // jQuery
      $.extend({}, defaultOpts, opts);

      // Нативдүү түрү
      Object.assign({}, defaultOpts, opts);
      ```

    - [6.4](#6.4) <a name='6.4'></a> Contains

      ```js
      // jQuery
      $.contains(el, child);

      // Нативдүү түрү
      el !== child && el.contains(child);
      ```

    **[⬆ Башына](#Мазмуну)**

    ## Альтернативалар

    * [You Might Not Need jQuery](http://youmightnotneedjquery.com/) - Бат-бат окуялар, элементтер, ajax ж.б.у.с мисалдардын ванильдуу javascript менен көрсөтүү.
    * [npm-dom](http://github.com/npm-dom) и [webmodules](http://github.com/webmodules) - Башка DOM бөлүктөрүy NPM'де тапса болот

    ## Браузерлердин колдоосу

    ![Chrome](https://raw.github.com/alrra/browser-logos/master/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/firefox/firefox_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/internet-explorer/internet-explorer_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/opera/opera_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/safari/safari_48x48.png)
    --- | --- | --- | --- | --- |
    Latest ✔ | Latest ✔ | 10+ ✔ | Latest ✔ | 6.1+ ✔ |

    # License

    MIT
