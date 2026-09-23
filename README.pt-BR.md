## You (Might) Don't Need jQuery

Você não precisa de jQuery
---

Ambientes Frontend evoluem rapidamente nos dias de hoje, navegadores modernos já implementaram uma grande parte das APIs DOM/BOM que são boas o suficiente. Nós não temos que aprender jQuery a partir do zero para manipulação do DOM ou eventos. Nesse meio tempo, graças a bibliotecas frontend como React, Angular e Vue, a manipulação direta do DOM torna-se um anti-padrão, jQuery é menos importante do que nunca. Este projeto resume a maioria das alternativas dos métodos jQuery em implementação nativa.

Os exemplos têm como alvo os navegadores evergreen atuais (Chrome, Edge, Firefox, Safari). O Internet Explorer não é mais suportado pela Microsoft, por isso os fallbacks específicos para IE foram removidos. Se você ainda precisar deles, consulte a [última versão compatível com o IE](https://github.com/camsong/You-Dont-Need-jQuery/tree/c4e00b3).

## Tabela de conteúdos

1. [Translations](#translations)
1. [Query Selector](#query-selector)
1. [CSS & Estilo](#css--estilo)
1. [Manipulação do DOM](#manipulação-do-dom)
1. [Ajax](#ajax)
1. [Eventos](#eventos)
1. [Utilitários](#utilitários)
1. [Suporte dos Navegadores](#suporte-dos-navegadores)

## Translations

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

No lugar de seletores comuns como classe, id ou atributo podemos usar `document.querySelector` ou `document.querySelectorAll` para substituição. As diferenças são:
* `document.querySelector` retorna o primeiro elemento correspondente
* `document.querySelectorAll` retorna todos os elementos correspondentes como uma NodeList estática. Ela suporta `forEach` e pode ser convertida para Array usando `Array.from(document.querySelectorAll(selector))`
* Se não tiver elementos correspondentes, o jQuery retorna um objeto jQuery vazio e `document.querySelectorAll` retorna uma NodeList vazia, enquanto `document.querySelector` retorna `null`.

> Aviso: `document.getElementById`, `document.getElementsByClassName` e `document.getElementsByTagName` são um pouco mais rápidos que `querySelector*`, mas os métodos `getElementsBy*` retornam uma HTMLCollection *viva* (live), que muda conforme o DOM muda. Prefira `querySelector*`, a menos que você tenha medido e encontrado um gargalo de performance.

- [1.0](#1.0) <a name='1.0'></a> Query por seletor

  ```js
  // jQuery
  $('selector');

  // Nativo
  document.querySelectorAll('selector');
  ```

- [1.1](#1.1) <a name='1.1'></a> Query por classe

  ```js
  // jQuery
  $('.class');

  // Nativo
  document.querySelectorAll('.class');

  // ou
  document.getElementsByClassName('class');
  ```

- [1.2](#1.2) <a name='1.2'></a> Query por id

  ```js
  // jQuery
  $('#id');

  // Nativo
  document.querySelector('#id');

  // ou
  document.getElementById('id');
  ```

- [1.3](#1.3) <a name='1.3'></a> Query por atributo

  ```js
  // jQuery
  $('a[target=_blank]');

  // Nativo
  document.querySelectorAll('a[target=_blank]');
  ```

- [1.4](#1.4) <a name='1.4'></a> Find sth.

  + Busca por nós

    ```js
    // jQuery
    $el.find('li');

    // Nativo
    el.querySelectorAll('li');
    ```

  + Buscar `body`

    ```js
    // jQuery
    $('body');

    // Nativo
    document.body;
    ```

  + Buscar atributos

    ```js
    // jQuery
    $el.attr('foo');

    // Nativo
    el.getAttribute('foo');
    ```

  + Buscar atributos `data-`

    ```js
    // jQuery
    $el.data('foo');

    // Nativo
    el.dataset.foo;

    // ou
    el.getAttribute('data-foo');
    ```

- [1.5](#1.5) <a name='1.5'></a> Sibling/Previous/Next Elements

  + Sibling elements

    ```js
    // jQuery
    $el.siblings();

    // Nativo
    [...el.parentNode.children].filter((child) =>
      child !== el
    );
    ```

  + Previous elements

    ```js
    // jQuery
    $el.prev();

    // Nativo
    el.previousElementSibling;
    ```

  + Next elements

    ```js
    // jQuery
    $el.next();

    // Nativo
    el.nextElementSibling;
    ```

- [1.6](#1.6) <a name='1.6'></a> Closest

  Retorna o primeiro elemento que corresponda ao seletor, partindo do elemento atual para o document.

  ```js
  // jQuery
  $el.closest(selector);

  // Nativo
  el.closest(selector);
  ```

- [1.7](#1.7) <a name='1.7'></a> Parents Until

  Obtém os ancestrais de cada elemento no atual conjunto de elementos combinados, mas não inclui o elemento correspondente pelo seletor, nó do DOM, ou objeto jQuery.

  ```js
  // jQuery
  $el.parentsUntil(selector, filter);

  // Nativo
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

    // Nativo
    document.querySelector('#my-input').value;
    ```

  + Obter o índice do e.currentTarget entre `.radio`

    ```js
    // jQuery
    $('.radio').index(e.currentTarget);

    // Nativo
    [...document.querySelectorAll('.radio')].indexOf(e.currentTarget);
    ```

- [1.9](#1.9) <a name='1.9'></a> Iframe Contents

  `$('iframe').contents()` retorna `contentDocument` para este iframe específico

  + Iframe contents

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

**[⬆ ir para o topo](#tabela-de-conteúdos)**


## CSS & Estilo

- [2.1](#2.1) <a name='2.1'></a> CSS

  + Obter estilo

    ```js
    // jQuery
    $el.css('color');

    // Nativo
    // NOTA: retorna o valor resolvido, por exemplo 'rgb(255, 0, 17)' em vez de '#f01'
    getComputedStyle(el).color;
    ```

  + Definir Estilo

    ```js
    // jQuery
    $el.css({ color: '#f01' });

    // Nativo
    el.style.color = '#f01';
    ```

  + Definir vários estilos

    ```js
    // jQuery
    $el.css({ color: '#f01', 'border-color': '#f02' });

    // Nativo
    Object.assign(el.style, { color: '#f01', borderColor: '#f02' });
    ```

  + Adicionar classe

    ```js
    // jQuery
    $el.addClass(className);

    // Nativo
    el.classList.add(className);
    ```

  + Remover classe

    ```js
    // jQuery
    $el.removeClass(className);

    // Nativo
    el.classList.remove(className);
    ```

  + Verificar classe

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

- [2.2](#2.2) <a name='2.2'></a> Largura e Altura

  `width` e `height` são teoricamente idênticos, vamos pegar `height` como exemplo:

  + Altura da janela

    ```js
    // jQuery
    $(window).height();

    // sem scrollbar, se comporta como jQuery
    window.document.documentElement.clientHeight;

    // com scrollbar
    window.innerHeight;
    ```

  + Altura do Documento

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

  + Altura do Elemento

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

    // preciso para inteiro (quando `border-box`, é `height - border`; quando `content-box`, é `height + padding`)
    el.clientHeight;

    // preciso para decimal (quando `border-box`, é `height`; quando `content-box`, é `height + padding + border`)
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

- [2.4](#2.4) <a name='2.4'></a> Rolar para o topo

  ```js
  // jQuery
  $(window).scrollTop();

  // Nativo
  window.scrollY;
  ```

**[⬆ ir para o topo](#tabela-de-conteúdos)**

## Manipulação do Dom

- [3.1](#3.1) <a name='3.1'></a> Remover
  ```js
  // jQuery
  $el.remove();

  // Nativo
  el.remove();
  ```

- [3.2](#3.2) <a name='3.2'></a> Texto

  + Obter texto

    ```js
    // jQuery
    $el.text();

    // Nativo
    el.textContent;
    ```

  + Definir texto

    ```js
    // jQuery
    $el.text(string);

    // Nativo
    el.textContent = string;
    ```

- [3.3](#3.3) <a name='3.3'></a> HTML

  + Obter HTML

    ```js
    // jQuery
    $el.html();

    // Nativo
    el.innerHTML;
    ```

  + Definir HTML

    ```js
    // jQuery
    $el.html(htmlString);

    // Nativo
    el.innerHTML = htmlString;
    ```

- [3.4](#3.4) <a name='3.4'></a> Append

  Incluir elemento filho após o último filho do elemento pai.

  ```js
  // jQuery: sintaxe unificada para DOMString e objetos Node
  $parent.append(newEl | '<div id="container">Hello World</div>');

  // Nativo (Element ou texto): strings são inseridas como texto simples, não interpretadas como HTML
  parent.append(newEl | 'Hello World');

  // Nativo (string HTML)
  parent.insertAdjacentHTML('beforeend', '<div id="container">Hello World</div>');
  ```

- [3.5](#3.5) <a name='3.5'></a> Prepend

  ```js
  // jQuery: sintaxe unificada para DOMString e objetos Node
  $parent.prepend(newEl | '<div id="container">Hello World</div>');

  // Nativo (Element ou texto): strings são inseridas como texto simples, não interpretadas como HTML
  parent.prepend(newEl | 'Hello World');

  // Nativo (string HTML)
  parent.insertAdjacentHTML('afterbegin', '<div id="container">Hello World</div>');
  ```

- [3.6](#3.6) <a name='3.6'></a> insertBefore

  Insere um novo nó antes dos elementos selecionados.

  ```js
  // jQuery
  $newEl.insertBefore(selector);

  const el = document.querySelector(selector);

  // Nativo (Element)
  el.before(newEl);

  // Nativo (string HTML)
  el.insertAdjacentHTML('beforebegin', '<div id="container">Hello World</div>');
  ```

- [3.7](#3.7) <a name='3.7'></a> insertAfter

  Insere um novo nó após os elementos selecionados.

  ```js
  // jQuery
  $newEl.insertAfter(selector);

  const el = document.querySelector(selector);

  // Nativo (Element)
  el.after(newEl);

  // Nativo (string HTML)
  el.insertAdjacentHTML('afterend', '<div id="container">Hello World</div>');
  ```

**[⬆ ir para o topo](#tabela-de-conteúdos)**

## Ajax

A [Fetch API](https://fetch.spec.whatwg.org/) é a substituta padrão do XMLHttpRequest e funciona em todos os navegadores modernos. Diferente de `$.ajax`, o `fetch` **não** rejeita a Promise em caso de status de erro HTTP, como 404 ou 500; você mesmo precisa verificar `response.ok`. Para JSONP, experimente o [fetch-jsonp](https://github.com/camsong/fetch-jsonp).

- [4.0](#4.0) <a name='4.0'></a> Requisitar JSON

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

- [4.0.1](#4.0.1) <a name='4.0.1'></a> Enviar JSON com POST

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

- [4.0.2](#4.0.2) <a name='4.0.2'></a> Cancelamento e timeout

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

- [4.1](#4.1) <a name='4.1'></a> Carregar dados do servidor e inserir o HTML retornado no elemento correspondente.

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

**[⬆ ir para o topo](#tabela-de-conteúdos)**

## Eventos

- [5.1](#5.1) <a name='5.1'></a> `Bind` num evento com `on`

  ```js
  // jQuery
  $el.on(eventName, eventHandler);

  // Nativo
  el.addEventListener(eventName, eventHandler);
  ```

- [5.1.1](#5.1.1) <a name='5.1.1'></a> `Bind` num evento uma única vez com `one`

  ```js
  // jQuery
  $el.one(eventName, eventHandler);

  // Nativo
  el.addEventListener(eventName, eventHandler, { once: true });
  ```

- [5.1.2](#5.1.2) <a name='5.1.2'></a> Delegação de eventos

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

- [5.2](#5.2) <a name='5.2'></a> `Unbind` num evento com `off`

  ```js
  // jQuery
  $el.off(eventName, eventHandler);

  // Nativo
  el.removeEventListener(eventName, eventHandler);

  // Nativo: remove vários listeners de uma vez, como os namespaces do jQuery
  const controller = new AbortController();
  el.addEventListener('click', onClick, { signal: controller.signal });
  el.addEventListener('keydown', onKeydown, { signal: controller.signal });
  controller.abort();
  ```

- [5.3](#5.3) <a name='5.3'></a> Trigger

  ```js
  // jQuery
  $(el).trigger('custom-event', {key1: 'data'});

  // Nativo. Eventos do jQuery propagam (bubbling); os nativos só propagam com `bubbles: true`.
  // Leia os dados em `event.detail` no handler.
  const event = new CustomEvent('custom-event', {
    bubbles: true,
    cancelable: true,
    detail: { key1: 'data' },
  });

  el.dispatchEvent(event);
  ```

**[⬆ ir para o topo](#tabela-de-conteúdos)**

## Utilitários

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

  Mescla o conteúdo de dois ou mais objetos em um novo objeto, sem modificar nenhum dos argumentos.
  Assim como `$.extend` sem `deep`, `Object.assign` e o spread fazem apenas uma cópia rasa (shallow copy).

  ```js
  // jQuery
  $.extend({}, object1, object2);

  // Nativo
  Object.assign({}, object1, object2);

  // Nativo (spread)
  ({ ...object1, ...object2 });
  ```

  Cópia profunda de um único objeto:

  ```js
  // jQuery
  $.extend(true, {}, object);

  // Nativo. Funções e nós do DOM não podem ser clonados
  structuredClone(object);
  ```

- [6.4](#6.4) <a name='6.4'></a> Contains

  ```js
  // jQuery
  $.contains(el, child);

  // Nativo
  el !== child && el.contains(child);
  ```

**[⬆ ir para o topo](#tabela-de-conteúdos)**

## Suporte dos Navegadores

![Chrome][chrome-image] | ![Edge][edge-image] | ![Firefox][firefox-image] | ![Safari][safari-image] | ![Opera][opera-image]
--- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ |

Alguns exemplos usam APIs mais recentes: `Promise.withResolvers()` (2024), `el.replaceChildren()` (2020) e `AbortSignal.timeout()` (2022). Consulte o [Baseline](https://web.dev/baseline) se você precisa dar suporte a navegadores mais antigos.

# Licença

MIT

[chrome-image]: https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png
[firefox-image]: https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png
[edge-image]: https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png
[opera-image]: https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png
[safari-image]: https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png
