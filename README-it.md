## Non hai bisogno di jQuery

Il mondo del Frontend si evolve rapidamente oggigiorno, i browsers moderni hanno gia' implementato un'ampia gamma di DOM/BOM API soddisfacenti. Non dobbiamo imparare jQuery dalle fondamenta per la manipolazione del DOM o di eventi. Nel frattempo, grazie al prevalicare di librerie per il frontend come React, Angular a Vue, manipolare il DOM direttamente diventa un anti-pattern, di consequenza jQuery non e' mai stato meno importante. Questo progetto sommarizza la maggior parte dei metodi e implementazioni alternative a jQuery.

Gli snippet sono pensati per gli attuali browser evergreen (Chrome, Edge, Firefox, Safari). Internet Explorer non è più supportato da Microsoft, per cui i fallback specifici per IE sono stati rimossi. Se vi servono ancora, consultate l'[ultima versione compatibile con IE](https://github.com/camsong/You-Dont-Need-jQuery/tree/c4e00b3).

## Tabella contenuti

1. [Traduzioni](#traduzioni)
1. [Query Selector](#query-selector)
1. [CSS & Style](#css--style)
1. [Manipolazione DOM](#manipolazione-dom)
1. [Ajax](#ajax)
1. [Eventi](#eventi)
1. [Utilities](#utilities)
1. [Alternative](#alternative)
1. [Supporto Browsers](#supporto-browsers)

## Traduzioni

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

Al posto di comuni selettori come class, id o attributi possiamo usare `document.querySelector` o `document.querySelectorAll` per sostituzioni. La differenza risiede in:
* `document.querySelector` restituisce il primo elemento combiaciante
* `document.querySelectorAll` restituisce tutti gli elementi corrispondenti come NodeList statica. Supporta `forEach` e può essere convertita in Array usando `Array.from(document.querySelectorAll(selector))`
* Se nessun elemento corrisponde, jQuery restituisce un oggetto jQuery vuoto e `document.querySelectorAll` una NodeList vuota, mentre `document.querySelector` restituisce `null`.

> Notare: `document.getElementById`, `document.getElementsByClassName` e `document.getElementsByTagName` sono leggermente più veloci di `querySelector*`, ma `getElementsBy*` restituiscono una HTMLCollection *live*, che cambia al variare del DOM. Preferite `querySelector*`, a meno che non abbiate misurato un collo di bottiglia.

- [1.0](#1.0) <a name='1.0'></a> Query da selettore

  ```js
  // jQuery
  $('selector');

  // Nativo
  document.querySelectorAll('selector');
  ```

- [1.1](#1.1) <a name='1.1'></a> Query da classe

  ```js
  // jQuery
  $('.class');

  // Nativo
  document.querySelectorAll('.class');

  // or
  document.getElementsByClassName('class');
  ```

- [1.2](#1.2) <a name='1.2'></a> Query da id

  ```js
  // jQuery
  $('#id');

  // Nativo
  document.querySelector('#id');

  // o
  document.getElementById('id');
  ```

- [1.3](#1.3) <a name='1.3'></a> Query da attributo

  ```js
  // jQuery
  $('a[target=_blank]');

  // Nativo
  document.querySelectorAll('a[target=_blank]');
  ```

- [1.4](#1.4) <a name='1.4'></a> Trovare qualcosa.

  + Trovare nodes

    ```js
    // jQuery
    $el.find('li');

    // Nativo
    el.querySelectorAll('li');
    ```

  + Trovare body

    ```js
    // jQuery
    $('body');

    // Nativo
    document.body;
    ```

  + Trovare Attributi

    ```js
    // jQuery
    $el.attr('foo');

    // Nativo
    el.getAttribute('foo');
    ```

  + Trovare attributo data

    ```js
    // jQuery
    $el.data('foo');

    // Nativo
    el.dataset.foo;

    // o
    el.getAttribute('data-foo');
    ```

- [1.5](#1.5) <a name='1.5'></a> Fratelli/Precedento/Successivo Elemento

  + Elementi fratelli

    ```js
    // jQuery
    $el.siblings();

    // Nativo
    [...el.parentNode.children].filter((child) =>
      child !== el
    );
    ```

  + Elementi precedenti

    ```js
    // jQuery
    $el.prev();

    // Nativo
    el.previousElementSibling;
    ```

  + Elementi successivi

    ```js
    // jQuery
    $el.next();

    // Nativo
    el.nextElementSibling;
    ```

- [1.6](#1.6) <a name='1.6'></a> Il piu' vicino

  Restituisce il primo elementi combiaciante il selettore fornito, attraversando dall'elemento corrente fino al document .

  ```js
  // jQuery
  $el.closest(selector);

  // Nativo
  el.closest(selector);
  ```

- [1.7](#1.7) <a name='1.7'></a> Fino a parenti

  Ottiene il parente di ogni elemento nel set corrente di elementi combiacianti, fino a ma non incluso, l'elemento combiaciante il selettorer, DOM node, o jQuery object.

  ```js
  // jQuery
  $el.parentsUntil(selector, filter);

  // Nativo
  function parentsUntil(el, selector, filter) {
    const result = [];

    // il match parte dal parente
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

    // Nativo
    document.querySelector('#my-input').value;
    ```

  + Get index of e.currentTarget between `.radio`

    ```js
    // jQuery
    $('.radio').index(e.currentTarget);

    // Nativo
    [...document.querySelectorAll('.radio')].indexOf(e.currentTarget);
    ```

- [1.9](#1.9) <a name='1.9'></a> Iframe Contents

  `$('iframe').contents()` restituisce `contentDocument` per questo specifico iframe

  + Iframe contenuti

    ```js
    // jQuery
    $iframe.contents();

    // Nativo
    iframe.contentDocument;
    ```

  + Iframe Query

    ```js
    // jQuery
    $iframe.contents().find('.css');

    // Nativo
    iframe.contentDocument.querySelectorAll('.css');
    ```

**[⬆ back to top](#table-of-contents)**

## CSS & Style

- [2.1](#2.1) <a name='2.1'></a> CSS

  + Ottenere style

    ```js
    // jQuery
    $el.css('color');

    // Nativo
    // NOTA: restituisce il valore risolto, ad es. 'rgb(255, 0, 17)' anziché '#f01'
    getComputedStyle(el).color;
    ```

  + Settare style

    ```js
    // jQuery
    $el.css({ color: '#f01' });

    // Nativo
    el.style.color = '#f01';
    ```

  + Settare più stili

    ```js
    // jQuery
    $el.css({ color: '#f01', 'border-color': '#f02' });

    // Nativo
    Object.assign(el.style, { color: '#f01', borderColor: '#f02' });
    ```

  + Aggiungere classe

    ```js
    // jQuery
    $el.addClass(className);

    // Nativo
    el.classList.add(className);
    ```

  + Rimouvere class

    ```js
    // jQuery
    $el.removeClass(className);

    // Nativo
    el.classList.remove(className);
    ```

  + has class

    ```js
    // jQuery
    $el.hasClass(className);

    // Nativo
    el.classList.contains(className);
    ```

  + Toggle class

    ```js
    // jQuery
    $el.toggleClass(className);

    // Nativo
    el.classList.toggle(className);
    ```

- [2.2](#2.2) <a name='2.2'></a> Width & Height

  Width e Height sono teoricamente identici, prendendo Height come esempio:

  + Window height

    ```js
    // jQuery
    $(window).height();

    // senza scrollbar, si comporta come jQuery
    window.document.documentElement.clientHeight;

    // con scrollbar
    window.innerHeight;
    ```

  + Document height

    ```js
    // jQuery
    $(document).height();

    // Nativo
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

    // Nativo
    function getHeight(el) {
      const styles = window.getComputedStyle(el);
      const height = el.offsetHeight;
      const borderTopWidth = parseFloat(styles.borderTopWidth);
      const borderBottomWidth = parseFloat(styles.borderBottomWidth);
      const paddingTop = parseFloat(styles.paddingTop);
      const paddingBottom = parseFloat(styles.paddingBottom);
      return height - borderBottomWidth - borderTopWidth - paddingTop - paddingBottom;
    }

    // preciso a intero (quando `border-box`, e' `height - border`; quando `content-box`, e' `height + padding`)
    el.clientHeight;

    // preciso a decimale (quando `border-box`, e' `height`; quando `content-box`, e' `height + padding + border`)
    el.getBoundingClientRect().height;
    ```

- [2.3](#2.3) <a name='2.3'></a> Position & Offset

  + Position

    ```js
    // jQuery
    $el.position();

    // Nativo
    const position = { left: el.offsetLeft, top: el.offsetTop };
    ```

  + Offset

    ```js
    // jQuery
    $el.offset();

    // Nativo
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

  // Nativo
  window.scrollY;
  ```

**[⬆ back to top](#table-of-contents)**

## Manipolazione DOM

- [3.1](#3.1) <a name='3.1'></a> Remove
  ```js
  // jQuery
  $el.remove();

  // Nativo
  el.remove();
  ```

- [3.2](#3.2) <a name='3.2'></a> Text

  + Get text

    ```js
    // jQuery
    $el.text();

    // Nativo
    el.textContent;
    ```

  + Set text

    ```js
    // jQuery
    $el.text(string);

    // Nativo
    el.textContent = string;
    ```

- [3.3](#3.3) <a name='3.3'></a> HTML

  + Ottenere HTML

    ```js
    // jQuery
    $el.html();

    // Nativo
    el.innerHTML;
    ```

  + Settare HTML

    ```js
    // jQuery
    $el.html(htmlString);

    // Nativo
    el.innerHTML = htmlString;
    ```

- [3.4](#3.4) <a name='3.4'></a> Append

  appendere elemento figlio dopo l'ultimo elemento figlio del genitore

  ```js
  // jQuery: sintassi unificata per DOMString e oggetti Node
  $parent.append(newEl | '<div id="container">Hello World</div>');

  // Nativo (Element o testo): le stringhe vengono inserite come testo semplice, non interpretate come HTML
  parent.append(newEl | 'Hello World');

  // Nativo (stringa HTML)
  parent.insertAdjacentHTML('beforeend', '<div id="container">Hello World</div>');
  ```

- [3.5](#3.5) <a name='3.5'></a> Prepend

  ```js
  // jQuery: sintassi unificata per DOMString e oggetti Node
  $parent.prepend(newEl | '<div id="container">Hello World</div>');

  // Nativo (Element o testo): le stringhe vengono inserite come testo semplice, non interpretate come HTML
  parent.prepend(newEl | 'Hello World');

  // Nativo (stringa HTML)
  parent.insertAdjacentHTML('afterbegin', '<div id="container">Hello World</div>');
  ```

- [3.6](#3.6) <a name='3.6'></a> insertBefore

  Inserire un nuovo node prima dell'elemento selezionato

  ```js
  // jQuery
  $newEl.insertBefore(selector);

  const el = document.querySelector(selector);

  // Nativo (Element)
  el.before(newEl);

  // Nativo (stringa HTML)
  el.insertAdjacentHTML('beforebegin', '<div id="container">Hello World</div>');
  ```

- [3.7](#3.7) <a name='3.7'></a> insertAfter

  Insert a new node after the selected elements

  ```js
  // jQuery
  $newEl.insertAfter(selector);

  const el = document.querySelector(selector);

  // Nativo (Element)
  el.after(newEl);

  // Nativo (stringa HTML)
  el.insertAdjacentHTML('afterend', '<div id="container">Hello World</div>');
  ```

- [3.8](#3.8) <a name='3.8'></a> is

  Restituisce `true` se combacia con l'elemento selezionato

  ```js
  // jQuery - Notare `is` funziona anche con `function` o `elements` non di importanza qui
  $el.is(selector);

  // Nativo
  el.matches(selector);
  ```

**[⬆ back to top](#table-of-contents)**

## Ajax

[Fetch API](https://fetch.spec.whatwg.org/) è il sostituto standard di XMLHttpRequest e funziona in tutti i browser moderni. A differenza di `$.ajax`, `fetch` **non** rifiuta la Promise in caso di status HTTP di errore come 404 o 500: dovete controllare voi `response.ok`. Per JSONP, provate [fetch-jsonp](https://github.com/camsong/fetch-jsonp).

- [4.0](#4.0) <a name='4.0'></a> Richiedere JSON

  ```js
  // jQuery
  $.getJSON(url).done(handleData).fail(handleError);

  // Nativo
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

- [4.0.1](#4.0.1) <a name='4.0.1'></a> Inviare JSON con POST

  ```js
  // jQuery
  $.ajax({
    url,
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(data),
  });

  // Nativo
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  ```

- [4.0.2](#4.0.2) <a name='4.0.2'></a> Annullamento e timeout

  ```js
  // jQuery
  const jqXHR = $.ajax({ url, timeout: 5000 });
  jqXHR.abort();

  // Nativo
  const controller = new AbortController();
  fetch(url, { signal: controller.signal });
  controller.abort();

  // Nativo (timeout)
  fetch(url, { signal: AbortSignal.timeout(5000) });
  ```

- [4.1](#4.1) <a name='4.1'></a> Caricare dati dal server e inserire l'HTML restituito nell'elemento selezionato.

  ```js
  // jQuery
  $(selector).load(url, completeCallback)

  // Nativo
  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      document.querySelector(selector).innerHTML = html;
    })
    .then(completeCallback);
  ```

**[⬆ back to top](#table-of-contents)**

## Eventi

- [5.1](#5.1) <a name='5.1'></a> Bind un evento con on

  ```js
  // jQuery
  $el.on(eventName, eventHandler);

  // Nativo
  el.addEventListener(eventName, eventHandler);
  ```

- [5.1.1](#5.1.1) <a name='5.1.1'></a> Bind un evento una sola volta con one

  ```js
  // jQuery
  $el.one(eventName, eventHandler);

  // Nativo
  el.addEventListener(eventName, eventHandler, { once: true });
  ```

- [5.1.2](#5.1.2) <a name='5.1.2'></a> Delegazione degli eventi

  ```js
  // jQuery
  $el.on(eventName, selector, eventHandler);

  // Nativo
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

  // Nativo
  el.removeEventListener(eventName, eventHandler);

  // Nativo: rimuovere più listener in una volta sola, come con i namespace di jQuery
  const controller = new AbortController();
  el.addEventListener('click', onClick, { signal: controller.signal });
  el.addEventListener('keydown', onKeydown, { signal: controller.signal });
  controller.abort();
  ```

- [5.3](#5.3) <a name='5.3'></a> Trigger

  ```js
  // jQuery
  $(el).trigger('custom-event', {key1: 'data'});

  // Nativo. Gli eventi jQuery fanno bubbling, quelli nativi solo se si imposta `bubbles: true`.
  // Leggete i dati da `event.detail` nell'handler.
  const event = new CustomEvent('custom-event', {
    bubbles: true,
    cancelable: true,
    detail: { key1: 'data' },
  });

  el.dispatchEvent(event);
  ```

**[⬆ back to top](#table-of-contents)**

## Utilities

- [6.1](#6.1) <a name='6.1'></a> isArray

  ```js
  // jQuery
  $.isArray(array);

  // Nativo
  Array.isArray(array);
  ```

- [6.2](#6.2) <a name='6.2'></a> Trim

  ```js
  // jQuery
  $.trim(string);

  // Nativo
  string.trim();
  ```

- [6.3](#6.3) <a name='6.3'></a> Object Assign

  Extend: unisce il contenuto di due o più oggetti in un nuovo oggetto, senza modificare gli argomenti.
  Come `$.extend` senza `deep`, `Object.assign` e lo spread creano solo una copia superficiale (shallow copy).

  ```js
  // jQuery
  $.extend({}, object1, object2);

  // Nativo
  Object.assign({}, object1, object2);

  // Nativo (spread)
  ({ ...object1, ...object2 });
  ```

  Copia profonda (deep copy) di un singolo oggetto:

  ```js
  // jQuery
  $.extend(true, {}, object);

  // Nativo. Funzioni e nodi DOM non possono essere clonati
  structuredClone(object);
  ```

- [6.4](#6.4) <a name='6.4'></a> Contains

  ```js
  // jQuery
  $.contains(el, child);

  // Nativo
  el !== child && el.contains(child);
  ```

**[⬆ back to top](#table-of-contents)**

## Alternative

* [Forse non hai bisogno di jQuery](https://youmightnotneedjquery.com/) - Esempi di come creare eventi comuni, elementi, ajax etc usando puramente javascript.
* [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) - Documentazione di riferimento per tutte le DOM API usate qui.
* [Baseline](https://web.dev/baseline) - Per verificare quali funzionalità della piattaforma web si possono usare in sicurezza su tutti i browser.

## Supporto Browsers

![Chrome][chrome-image] | ![Edge][edge-image] | ![Firefox][firefox-image] | ![Safari][safari-image] | ![Opera][opera-image]
--- | --- | --- | --- | --- |
Ultimo ✔ | Ultimo ✔ | Ultimo ✔ | Ultimo ✔ | Ultimo ✔ |

Alcuni snippet usano API più recenti: `Promise.withResolvers()` (2024), `el.replaceChildren()` (2020) e `AbortSignal.timeout()` (2022). Se dovete supportare browser meno recenti, verificate su [Baseline](https://web.dev/baseline).

# Licenza

MIT

[chrome-image]: https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png
[firefox-image]: https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png
[edge-image]: https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png
[opera-image]: https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png
[safari-image]: https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png
