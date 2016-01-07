## Vous n'avez pas besoin de jQuery

De nos jours, les environnements frontend évolues si rapidement que les navigateurs récents ont déjà implémentés beaucoup d'API DOM/BOM suffisants. Il n'est pas utile d'apprendre jQuery à partir de rien pour manipuler le DOM ou les évènements. Pendant ce temps, grâce à l'efficacité de bibliothèques frontend comme React, Angular et Vue, manipuler directement le DOM est devenu obsolète, jQuery n'a jamais été aussi peu important. Ce projet résume la plupart des alternatives à jQuery à l'aide d'implémentations natives, compatibles IE 10+.

## Sommaire

1. [Sélecteur jQuery](#query-selector)
1. [Style et CSS](#css--style)
1. [Manipulation du DOM](#dom-manipulation)
1. [Ajax](#ajax)
1. [Évènements](#events)
1. [Utilitaires](#utilities)
1. [Traduction](#translation)
1. [Navigateurs compatibles](#browser-support)

## Sélecteur jQuery

À la place des sélecteurs communs comme class, id ou attribute il est possible d'utiliser `document.querySelector` ou `document.querySelectorAll` à la place. Les différences consistent en:
* `document.querySelector` retourne le premier élément trouvé
* `document.querySelectorAll` retourne tous les éléments trouvés sous forme d'une NodeList. Il est possible de le convertir en Array à l'aide de `[].slice.call(document.querySelectorAll(selector) || []);`
* Si aucun élément n'a été trouvé, jQuery peut retourner `[]` alors que l'API DOM va retourner `null`. Faite attention au Null Pointer Exception. Vous pouvez aussi utiliser `||` pour définir la valeur par défaut si rien n'a été trouvé, comme `document.querySelectorAll(selector) || []`

> Remarque: `document.querySelector` et `document.querySelectorAll` sont assez **LENT**, essayez plutôt d'utiliser `getElementById`, `document.getElementsByClassName` ou `document.getElementsByTagName` si vous souhaitez obtenir un gain de performance.

- [1.0](#1.0) <a name='1.0'></a> Requête par sélecteur

  ```js
  // jQuery
  $('selector');

  // Natif
  document.querySelectorAll('selector');
  ```

- [1.1](#1.1) <a name='1.1'></a> Requête par classe

  ```js
  // jQuery
  $('.class');

  // Natif
  document.querySelectorAll('.class');

  // ou
  document.getElementsByClassName('class');
  ```

- [1.2](#1.2) <a name='1.2'></a> Requête par id

  ```js
  // jQuery
  $('#id');

  // Natif
  document.querySelector('#id');

  // ou
  document.getElementById('id');
  ```

- [1.3](#1.3) <a name='1.3'></a> Requête par attribut

  ```js
  // jQuery
  $('a[target=_blank]');

  // Natif
  document.querySelectorAll('a[target=_blank]');
  ```

- [1.4](#1.4) <a name='1.4'></a> Trouver le n-ème

  + Trouver des noeus

    ```js
    // jQuery
    $el.find('li');

    // Natif
    el.querySelectorAll('li');
    ```

  + Trouver le body

    ```js
    // jQuery
    $('body');

    // Natif
    document.body;
    ```

  + Trouver un attribut

    ```js
    // jQuery
    $el.attr('foo');

    // Natif
    e.getAttribute('foo');
    ```

  + Trouver un attribut data

    ```js
    // jQuery
    $el.data('foo');

    // Natif
    // avec getAttribute
    el.getAttribute('data-foo');
    // vous pouvez également utiliser `dataset` si seule la compatibilité IE 11+ est nécessaire
    el.dataset['foo'];
    ```

- [1.5](#1.5) <a name='1.5'></a> Éléments voisins/précédents/suivants

  + Éléments voisins

    ```js
    // jQuery
    $el.siblings();

    // Natif
    [].filter.call(el.parentNode.children, function(child) {
      return child !== el;
    });
    ```

  + Éléments précédents

    ```js
    // jQuery
    $el.prev();

    // Natif
    el.previousElementSibling;

    ```

  + Éléments suivants

    ```js
    // next
    $el.next();
    el.nextElementSibling;
    ```

- [1.6](#1.6) <a name='1.6'></a> Plus proche

  Retourne le premier élément trouver à l'aide du sélecteur fourni, parcourant l'élément actuel vers le document.

  ```js
  // jQuery
  $el.closest(queryString);

  // Natif
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

- [1.7](#1.7) <a name='1.7'></a> Parents jusqu'à

  Retourne les ancêtres de chaque élément dans l'ensemble d'éléments trouvés courants, jusqu'à (sans l'inclure) l'élément correspondant au sélecteur, le noeud DOM ou l'objet JQuery.

  ```js
  // jQuery
  $el.parentsUntil(selector, filter);

  // Natif
  function parentsUntil(el, selector, filter) {
    const result = [];
    const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;

    // la correspondance commence à partir du parent
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

- [1.8](#1.8) <a name='1.8'></a> Formulaire

  + Input/Textarea

    ```js
    // jQuery
    $('#my-input').val();

    // Natif
    document.querySelector('#my-input').value;
    ```

  + Obtenir l'index du e.currentTarget entre `.radio`

    ```js
    // jQuery
    $(e.currentTarget).index('.radio');

    // Natif
    [].indexOf.call(document.querySelectAll('.radio'), e.currentTarget);
    ```

- [1.9](#1.9) <a name='1.9'></a> Contenus Iframe

  `$('iframe').contents()` retourne `contentDocument` pour cet iframe en particulier

  + Contenus de l'Iframe

    ```js
    // jQuery
    $iframe.contents();

    // Natif
    iframe.contentDocument;
    ```

  + Requête Iframe

    ```js
    // jQuery
    $iframe.contents().find('.css');

    // Natif
    iframe.contentDocument.querySelectorAll('.css');
    ```

**[⬆ remonter](#table-of-contents)**

## Style & CSS

- [2.1](#2.1) <a name='2.1'></a> CSS

  + Obtenir le style

    ```js
    // jQuery
    $el.css("color");

    // Natif
    // NOTE: Bug connu, retournera 'auto" si la valeur du site est 'auto'
    const win = el.ownerDocument.defaultView;
    // null signifie ne pas retourner les pseudo styles
    win.getComputedStyle(el, null).color;
    ```

  + Définir le style

    ```js
    // jQuery
    $el.css({ color: "#ff0011" });

    // Natif
    el.style.color = '#ff0011';
    ```

  + Obtenir/Définir les styles

    Notez que si vous souhaitez définir plusieurs styles à la fois, you devriez vous référer à la méthode [setStyles](https://github.com/oneuijs/oui-dom-utils/blob/master/src/index.js#L194) du paquet oui-dom-utils.


  + Ajouter une classe

    ```js
    // jQuery
    $el.addClass(className);

    // Natif
    el.classList.add(className);
    ```

  + Supprimer une classe

    ```js
    // jQuery
    $el.removeClass(className);

    // Natif
    el.classList.remove(className);
    ```

  + Possède une classe

    ```js
    // jQuery
    $el.hasClass(className);

    // Natif
    el.classList.contains(className);
    ```

  + Basculer une class

    ```js
    // jQuery
    $el.toggleClass(className);

    // Natif
    el.classList.toggle(className);
    ```

- [2.2](#2.2) <a name='2.2'></a> Largeur et Hauteur

  Travailler avec la hauteur ou la largeur est en théorie identique, prenons la hauteur pour exemple:

  + Hauteur de la fenêtre

    ```js
    // hauteur de la fenêtre
    $(window).height();
    // se comporte comme jQuery sans ascenseur
    window.document.documentElement.clientHeight;
    // avec ascenseur
    window.innerHeight;
    ```

  + Hauteur du document

    ```js
    // jQuery
    $(document).height();

    // Natif
    document.documentElement.scrollHeight;
    ```

  + Hauteur de l'élement

    ```js
    // jQuery
    $el.height();

    // NatiF
    function getHeight(el) {
      const styles = this.getComputedStyles(el);
      const height = el.offsetHeight;
      const borderTopWidth = parseFloat(styles.borderTopWidth);
      const borderBottomWidth = parseFloat(styles.borderBottomWidth);
      const paddingTop = parseFloat(styles.paddingTop);
      const paddingBottom = parseFloat(styles.paddingBottom);
      return height - borderBottomWidth - borderTopWidth - paddingTop - paddingBottom;
    }
    // précis à l'entier près (quand `border-box`, son `height`; quand `content-box`, son `height + padding + border`)
    el.clientHeight;
    // précis à la décimale près (quand `border-box`, son `height`; quand `content-box`, son `height + padding + border`)
    el.getBoundingClientRect().height;
    ```

- [2.3](#2.3) <a name='2.3'></a> Position et offset

  + Position

    ```js
    // jQuery
    $el.position();

    // Natif
    { left: el.offsetLeft, top: el.offsetTop }
    ```

  + Offset

    ```js
    // jQuery
    $el.offset();

    // Natif
    function getOffset (el) {
      const box = el.getBoundingClientRect();

      return {
        top: box.top + window.pageYOffset - document.documentElement.clientTop,
        left: box.left + window.pageXOffset - document.documentElement.clientLeft
      }
    }
    ```

- [2.4](#2.4) <a name='2.4'></a> Défiler vers le haut

  ```js
  // jQuery
  $(window).scrollTop();

  // Natif
  (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
  ```

**[⬆ remonter](#table-of-contents)**

## Manipulation du DOM

- [3.1](#3.1) <a name='3.1'></a> Supprimer
  ```js
  // jQuery
  $el.remove();

  // Natif
  el.parentNode.removeChild(el);
  ```

- [3.2](#3.2) <a name='3.2'></a> Texte

  + Obtenir le texte

    ```js
    // jQuery
    $el.text();

    // Natif
    el.textContent;
    ```

  + Définir le text

    ```js
    // jQuery
    $el.text(string);

    // Natif
    el.textContent = string;
    ```

- [3.3](#3.3) <a name='3.3'></a> HTML

  + Obtenir l'HTML

    ```js
    // jQuery
    $el.html();

    // Natif
    el.innerHTML;
    ```

  + Définir l'HTML

    ```js
    // jQuery
    $el.html(htmlString);

    // Natif
    el.innerHTML = htmlString;
    ```

- [3.4](#3.4) <a name='3.4'></a> Ajouter

  Ajouter un élément enfant après le dernier enfant de l'élément parent.

  ```js
  // jQuery
  $el.append("<div id='container'>hello</div>");

  // Natif
  let newEl = document.createElement('div');
  newEl.setAttribute('id', 'container');
  newEl.innerHTML = 'hello';
  el.appendChild(newEl);
  ```

- [3.5](#3.5) <a name='3.5'></a> Faire précéder

  ```js
  // jQuery
  $el.prepend("<div id='container'>hello</div>");

  // Natif
  let newEl = document.createElement('div');
  newEl.setAttribute('id', 'container');
  newEl.innerHTML = 'hello';
  el.insertBefore(newEl, el.firstChild);
  ```

- [3.6](#3.6) <a name='3.6'></a> Insérer avant

  Insérer un nouveau noeud avant les éléments sélectionnés.

  ```js
  // jQuery
  $newEl.insertBefore(queryString);

  // Natif
  newEl.insertBefore(document.querySelector(queryString));
  ```

- [3.7](#3.7) <a name='3.7'></a> Insérer après

  Insérer un nouveau noeud après les noeufs sélectionnés

  ```js
  // jQuery
  $newEl.insertAfter(queryString);

  // Natif
  function insertAfter(newEl, queryString) {
    const parent = document.querySelector(queryString).parentNode;

    if (parent.lastChild === newEl) {
      parent.appendChild(newEl);
    } else {
      parent.insertBefore(newEl, parent.nextSibling);
    }
  },
  ```

**[⬆ remonter](#table-of-contents)**

## Ajax

Remplacer avec [fetch](https://github.com/camsong/fetch-ie8) et [fetch-jsonp](https://github.com/camsong/fetch-jsonp)

**[⬆ remonter](#table-of-contents)**

## Évènements

Pour remplacer complètement jusqu'aux espaces de nom et délégations, se référer à https://github.com/oneuijs/oui-dom-events

- [5.1](#5.1) <a name='5.1'></a> Attacher un événement avec `on`

  ```js
  // jQuery
  $el.on(eventName, eventHandler);

  // Natif
  el.addEventListener(eventName, eventHandler);
  ```

- [5.2](#5.2) <a name='5.2'></a> Détacher un événement avec `off`

  ```js
  // jQuery
  $el.off(eventName, eventHandler);

  // Natif
  el.removeEventListener(eventName, eventHandler);
  ```

- [5.3](#5.3) <a name='5.3'></a> Trigger

  ```js
  // jQuery
  $(el).trigger('custom-event', {key1: 'data'});

  // Natif
  if (window.CustomEvent) {
    const event = new CustomEvent('custom-event', {detail: {key1: 'data'}});
  } else {
    const event = document.createEvent('CustomEvent');
    event.initCustomEvent('custom-event', true, true, {key1: 'data'});
  }

  el.dispatchEvent(event);
  ```

**[⬆ remonter](#table-of-contents)**

## Utilitaires

- [6.1](#6.1) <a name='6.1'></a> isArray

  ```js
  // jQuery
  $.isArray(range);

  // Natif
  Array.isArray(range);
  ```

- [6.2](#6.2) <a name='6.2'></a> Trim

  ```js
  // jQuery
  $.trim(string);

  // Natif
  string.trim();
  ```

- [6.3](#6.3) <a name='6.3'></a> Assigner un objet

  Pour étendre, utiliser le polyfill object.assign https://github.com/ljharb/object.assign

  ```js
  // jQuery
  $.extend({}, defaultOpts, opts);

  // Natif
  Object.assign({}, defaultOpts, opts);
  ```

- [6.4](#6.4) <a name='6.4'></a> Contient

  ```js
  // jQuery
  $.contains(el, child);

  // Natif
  el !== child && el.contains(child);
  ```

**[⬆ remonter](#table-of-contents)**

## Traductions

* [한국어](./README.ko-KR.md)
* [简体中文](./README.zh-CN.md)
* [Bahasa Melayu](./README-my.md)
* [Bahasa Indonesia](./README-id.md)
* [Português(PT-BR)](./README.pt-BR.md)
* [Tiếng Việt Nam](./README-vi.md)
* [Español](./README-es.md)
* [Русский](./README-ru.md)
* [Türkçe](./README-tr.md)
* [Italian](./README-it.md)
* [Français](./README-fr.md)

## Navigateurs compatibles

![Chrome](https://raw.github.com/alrra/browser-logos/master/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/firefox/firefox_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/internet-explorer/internet-explorer_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/opera/opera_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/safari/safari_48x48.png)
--- | --- | --- | --- | --- |
Plus récente ✔ | Plus récente ✔ | 10+ ✔ | Plus récente ✔ | 6.1+ ✔ |

# Licence

MIT
