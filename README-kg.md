## jQuery'ге муктаждыгынар жок


Биздин убакта фронт-энд чөйрөсү абдан ылдам өнүгүп жатат, ошонун менен бирге заманбап браузерлер көптөгөн DOM/BOM API жагын ишке ашырды. Бул абдан жакшы көрүнүш. Анткени, силер DOM'ду манипуляциялоо же  окуялардын объектерин иштешиш үчүн jQuery'ни башынан үйрөнүнөрдүн кажети калбайт.Ошонун менен бирге,  алдыда келе жаткан React, Angular жана  Vue фронт-энд библиотекалардын жардамы менен, DOM'ду түздөн-түз манипуляциялоо өзүнчө бир антипаттернге айланды.Бул проект jQuery методдорунун ордуна колдонсо боло турган нативдүү JavaScript альтернативаларынын көбүн өзүнө камтыйт.

Мисалдар азыркы, дайыма жаңыланып турган браузерлерге (Chrome, Edge, Firefox, Safari) арналган. Microsoft Internet Explorer'ди мындан ары колдобойт, ошондуктан IE үчүн жазылган кошумча чечимдер алынып салынды. Эгерде алар дагы эле керек болсо, [IE менен иштеген акыркы версияны](https://github.com/camsong/You-Dont-Need-jQuery/tree/c4e00b3) карагыла.

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
* `document.querySelectorAll` баардык дал келген элементтерди статикалык түйүндөр коллекциясы (NodeList) катары кайтарат. Ал `forEach` методун колдойт, аны `Array.from(document.querySelectorAll(selector))` аркылуу массивге конвертация кылууга болот.
* Эгерде эч элементтер дал келбесе, jQuery бош jQuery объектин, `document.querySelectorAll` бош NodeList'ти кайтарат, ал эми `document.querySelector` `null` кайтарат.

> Белгилөө: `document.getElementById`, `document.getElementsByClassName` жана `document.getElementsByTagName` методдору `querySelector*` методдоруна караганда бир аз ылдамыраак, бирок `getElementsBy*` *жандуу* (live) HTMLCollection кайтарат, ал DOM өзгөргөн сайын өзү да өзгөрөт. Ылдамдыкты өлчөп, чыныгы көйгөй таппасаңар, `querySelector*` колдонгула.

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
    [...el.parentNode.children].filter((child) =>
      child !== el
    );
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

  // Нативдүү түрү
  el.closest(selector);
  ```

- [1.7](#1.7) <a name='1.7'></a> Ата-энеге чейин
     Бир бирине   жана селекторго дал келген, DOM'дун узели жана jquery'нин объектинен тышкары  элементтерлин сетинде жайгашкан ар-бир элементтин ата-энесин кайтарат.

  ```js
  // jQuery
  $el.parentsUntil(selector, filter);

  // Нативдүү түрү
  function parentsUntil(el, selector, filter) {
    const result = [];

    // Ата-энеден баштап дал келүү
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
    $('.radio').index(e.currentTarget);

    // Нативдүү түрү
    [...document.querySelectorAll('.radio')].indexOf(e.currentTarget);
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
    // jQuery
    $el.attr('foo', 'bar');

    // Нативдүү түрү
    el.setAttribute('foo', 'bar');
    ```

  +  `data-` атрибутту табуу

    ```js
    // jQuery
    $el.data('foo');

    // Нативдүү түрү
    el.dataset.foo;

    // же
    el.getAttribute('data-foo');
    ```

    **[⬆ Башына](#Мазмуну)**

    ## CSS & Style

    - [2.1](#2.1) <a name='2.1'></a> CSS

      +  Стильди алуу

        ```js
        // jQuery
        $el.css('color');

        // Нативдүү түрү
        // Белгилөө: браузер эсептеген акыркы маанини кайтарат, мисалы, '#f01' ордуна 'rgb(255, 0, 17)'
        getComputedStyle(el).color;
        ```

      +  style менчиктоо

        ```js
        // jQuery
        $el.css({ color: '#f01' });

        // Нативдүү түрү
        el.style.color = '#f01';
        ```

      +  Бир нече стилди орнотуу

        ```js
        // jQuery
        $el.css({ color: '#f01', 'border-color': '#f02' });

        // Нативдүү түрү
        Object.assign(el.style, { color: '#f01', borderColor: '#f02' });
        ```

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
        // jQuery
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

        // Так сандарга чейин (`border-box` болгондо, анда `height - border`; `content-box` болгондо, анда `height + padding`)
        el.clientHeight;

        // Ондон бирине чейин (`border-box` болгондо, анда `height`; `content-box` болгондо, анда `height + padding + border`)
        el.getBoundingClientRect().height;
        ```

    - [2.3](#2.3) <a name='2.3'></a> Позиция  жана  өтүү

      + Позициясы

        Ата-энесин жылуусу боюнча учурдагы координаттарды алуу

        ```js
        // jQuery
        $el.position();

        // Нативдүү түрү
        const position = { left: el.offsetLeft, top: el.offsetTop };
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
            top: box.top + window.scrollY,
            left: box.left + window.scrollX
          };
        }
        ```

    - [2.4](#2.4) <a name='2.4'></a> Жогоруга жылдыруу

      ```js
      // jQuery
      $(window).scrollTop();

      // Нативдүү түрү
      window.scrollY;
      ```

    **[⬆ Башына](#Мазмуну)**

    ## DOM манипуляциясы

    - [3.1](#3.1) <a name='3.1'></a> Remove

       DOM'дон элементти өчүрүү .

      ```js
      // jQuery
      $el.remove();

      // Нативдүү түрү
      el.remove();
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
      // jQuery: DOMString жана Node объекттери үчүн бирдей синтаксис
      $parent.append(newEl | '<div id="container">Hello World</div>');

      // Нативдүү түрү (Element же текст): саптар HTML катары талдалбайт, жөнөкөй текст катары кошулат
      parent.append(newEl | 'Hello World');

      // Нативдүү түрү (HTML сабы)
      parent.insertAdjacentHTML('beforeend', '<div id="container">Hello World</div>');
      ```

    - [3.5](#3.5) <a name='3.5'></a> Prepend

      ```js
      // jQuery: DOMString жана Node объекттери үчүн бирдей синтаксис
      $parent.prepend(newEl | '<div id="container">Hello World</div>');

      // Нативдүү түрү (Element же текст): саптар HTML катары талдалбайт, жөнөкөй текст катары кошулат
      parent.prepend(newEl | 'Hello World');

      // Нативдүү түрү (HTML сабы)
      parent.insertAdjacentHTML('afterbegin', '<div id="container">Hello World</div>');
      ```

    - [3.6](#3.6) <a name='3.6'></a> insertBefore

      Тандалган элементтин астына жаны элементти кошуу


      ```js
      // jQuery
      $newEl.insertBefore(selector);

      const el = document.querySelector(selector);

      // Нативдүү түрү (Element)
      el.before(newEl);

      // Нативдүү түрү (HTML сабы)
      el.insertAdjacentHTML('beforebegin', '<div id="container">Hello World</div>');
      ```

    - [3.7](#3.7) <a name='3.7'></a> insertAfter

      Тандалган элементтен кийин жаны элементти кошуу

      ```js
      // jQuery
      $newEl.insertAfter(selector);

      const el = document.querySelector(selector);

      // Нативдүү түрү (Element)
      el.after(newEl);

      // Нативдүү түрү (HTML сабы)
      el.insertAdjacentHTML('afterend', '<div id="container">Hello World</div>');
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

    [Fetch API](https://fetch.spec.whatwg.org/) - XMLHttpRequest'тин ордун баскан стандарт, ал бардык заманбап браузерлерде иштейт. `$.ajax`'тан айырмаланып, `fetch` 404 же 500 сыяктуу HTTP ката статусу келгенде **ката бербейт** (reject кылбайт), ошондуктан `response.ok` маанисин өзүңөр текшергиле. JSONP-кайрылуулар үчүн [fetch-jsonp](https://github.com/camsong/fetch-jsonp) колдонуп көргүлө.

    - [4.0](#4.0) <a name='4.0'></a> JSON алуу

      ```js
      // jQuery
      $.getJSON(url).done(handleData).fail(handleError);

      // Нативдүү түрү
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

    - [4.0.1](#4.0.1) <a name='4.0.1'></a> JSON жөнөтүү

      ```js
      // jQuery
      $.ajax({
        url,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
      });

      // Нативдүү түрү
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      ```

    - [4.0.2](#4.0.2) <a name='4.0.2'></a> Токтотуу жана убакыт чеги

      ```js
      // jQuery
      const jqXHR = $.ajax({ url, timeout: 5000 });
      jqXHR.abort();

      // Нативдүү түрү
      const controller = new AbortController();
      fetch(url, { signal: controller.signal });
      controller.abort();

      // Нативдүү түрү (убакыт чеги)
      fetch(url, { signal: AbortSignal.timeout(5000) });
      ```

    - [4.1](#4.1) <a name='4.1'></a> Серверден маалымат жүктөп, кайтарылган HTML кодун дал келген элементке коюу.

      ```js
      // jQuery
      $(selector).load(url, completeCallback)

      // Нативдүү түрү
      fetch(url)
        .then((response) => response.text())
        .then((html) => {
          document.querySelector(selector).innerHTML = html;
        })
        .then(completeCallback);
      ```

    **[⬆ Башына](#Мазмуну)**

    ## Окуялар

    - [5.1](#5.1) <a name='5.1'></a> Окуяларды onn аркылуу  байланыштыруу

      ```js
      // jQuery
      $el.on(eventName, eventHandler);

      // Нативдүү түрү
      el.addEventListener(eventName, eventHandler);
      ```

    - [5.1.1](#5.1.1) <a name='5.1.1'></a> Окуяны one аркылуу бир жолу гана байланыштыруу

      ```js
      // jQuery
      $el.one(eventName, eventHandler);

      // Нативдүү түрү
      el.addEventListener(eventName, eventHandler, { once: true });
      ```

    - [5.1.2](#5.1.2) <a name='5.1.2'></a> Окуяларды делегациялоо

      ```js
      // jQuery
      $el.on(eventName, selector, eventHandler);

      // Нативдүү түрү
      el.addEventListener(eventName, (event) => {
        const target = event.target.closest(selector);
        if (target && el.contains(target)) {
          eventHandler.call(target, event);
        }
      });
      ```

    - [5.2](#5.2) <a name='5.2'></a> Окуяларды off аркылуу  жоюу

      ```js
      // jQuery
      $el.off(eventName, eventHandler);

      // Нативдүү түрү
      el.removeEventListener(eventName, eventHandler);

      // Нативдүү түрү: jQuery'деги аттар мейкиндиги (namespace) сыяктуу, бир нече угуучуну (listener) бир эле учурда алып салуу
      const controller = new AbortController();
      el.addEventListener('click', onClick, { signal: controller.signal });
      el.addEventListener('keydown', onKeydown, { signal: controller.signal });
      controller.abort();
      ```

    - [5.3](#5.3) <a name='5.3'></a> Trigger

      ```js
      // jQuery
      $(el).trigger('custom-event', {key1: 'data'});

      // Нативдүү түрү. jQuery окуялары ата-эне элементтерге чейин көтөрүлөт (bubble), ал эми нативдүү окуялар `bubbles: true` болбосо көтөрүлбөйт.
      // Маалыматты окуяны иштеткен функциянын ичинде `event.detail` аркылуу алгыла.
      const event = new CustomEvent('custom-event', {
        bubbles: true,
        cancelable: true,
        detail: { key1: 'data' },
      });

      el.dispatchEvent(event);
      ```

    **[⬆ Башына](#Мазмуну)**

    ## Утилиталар

    - [6.1](#6.1) <a name='6.1'></a> isArray

      ```js
      // jQuery
      $.isArray(array);

      // Нативдүү түрү
      Array.isArray(array);
      ```

    - [6.2](#6.2) <a name='6.2'></a> Trim

      ```js
      // jQuery
      $.trim(string);

      // Нативдүү түрү
      string.trim();
      ```

    - [6.3](#6.3) <a name='6.3'></a> Объектин дайындоосу

      `deep` параметри жок `$.extend` сыяктуу эле, `Object.assign` жана spread да объекттин жогорку деңгээлин гана көчүрөт (shallow copy).

      ```js
      // jQuery
      $.extend({}, object1, object2);

      // Нативдүү түрү
      Object.assign({}, object1, object2);

      // Нативдүү түрү (spread)
      ({ ...object1, ...object2 });
      ```

      Бир объектти терең көчүрүү (deep copy):

      ```js
      // jQuery
      $.extend(true, {}, object);

      // Нативдүү түрү. Функцияларды жана DOM түйүндөрүн көчүрүүгө болбойт
      structuredClone(object);
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

    * [You Might Not Need jQuery](https://youmightnotneedjquery.com/) - Бат-бат окуялар, элементтер, ajax ж.б.у.с мисалдардын ванильдуу javascript менен көрсөтүү.
    * [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) - Бул жерде колдонулган ар бир DOM API боюнча маалымдама.
    * [Baseline](https://web.dev/baseline) - Веб-платформанын кайсы мүмкүнчүлүктөрүн бардык браузерлерде коопсуз колдонууга болорун текшерүү.

    ## Браузерлердин колдоосу

    ![Chrome][chrome-image] | ![Edge][edge-image] | ![Firefox][firefox-image] | ![Safari][safari-image] | ![Opera][opera-image]
    --- | --- | --- | --- | --- |
    Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ |

    Кээ бир мисалдар жаңыраак API'лерди колдонот: `Promise.withResolvers()` (2024), `el.replaceChildren()` (2020) жана `AbortSignal.timeout()` (2022). Эгерде эски браузерлерди колдоо керек болсо, [Baseline](https://web.dev/baseline) аркылуу текшергиле.

    # License

    MIT

[chrome-image]: https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png
[firefox-image]: https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png
[edge-image]: https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png
[opera-image]: https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png
[safari-image]: https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png
