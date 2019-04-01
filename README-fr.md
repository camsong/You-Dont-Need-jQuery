## Vous n'avez pas besoin de jQuery [![Build Status](https://travis-ci.org/oneuijs/You-Dont-Need-jQuery.svg)](https://travis-ci.org/oneuijs/You-Dont-Need-jQuery)


De nos jours, les environnements frontend évoluent si rapidement que les navigateurs récents ont déjà implémenté beaucoup d'API DOM/BOM suffisantes. Il n'est pas utile d'apprendre jQuery à partir de rien pour manipuler le DOM ou les évènements. Pendant ce temps, grâce à l'efficacité de bibliothèques frontend comme React, Angular et Vue, manipuler directement le DOM est devenu obsolète, jQuery n'a jamais été aussi peu important. Ce projet résume la plupart des alternatives à jQuery à l'aide d'implémentations natives, compatibles avec IE 10+.

## Sommaire

1. [Traductions](#traductions)
1. [Sélecteur jQuery](#sélecteur-jquery)
1. [Style et CSS](#style--css)
1. [Manipulation du DOM](#manipulation-du-dom)
1. [Ajax](#ajax)
1. [Évènements](#évènements)
1. [Utilitaires](#utilitaires)
1. [Promesses](#promesses)
1. [Animation](#animation)
1. [Alternatives](#alternatives)
1. [Navigateurs compatibles](#navigateurs-compatibles)

## Traductions

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

## Sélecteur jQuery

À la place des sélecteurs communs comme class, id ou attribute il est possible d'utiliser `document.querySelector` ou `document.querySelectorAll`. Les différences sont que:
* `document.querySelector` retourne le premier élément trouvé,
* `document.querySelectorAll` retourne tous les éléments trouvés sous forme d'une [NodeList](https://developer.mozilla.org/en-US/docs/Web/API/NodeList). Il est possible de le convertir en Array à l'aide de `[].slice.call(document.querySelectorAll(selector) || []);`,
* si aucun élément n'a été trouvé, jQuery peut retourner `[]` alors que l'API DOM va retourner `null`. Faites attention au Null Pointer Exception. Vous pouvez aussi utiliser `||` pour définir la valeur par défaut si rien n'a été trouvé, comme `document.querySelectorAll(selector) || []`.

> Remarque: `document.querySelector` et `document.querySelectorAll` sont assez **LENTS**, essayez plutôt d'utiliser `getElementById`, `document.getElementsByClassName` ou `document.getElementsByTagName` si vous souhaitez obtenir un gain de performance.

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
- [1.4](#1.4) <a name='1.4'></a> Requête par descendants

  ```js
  // jQuery
  $el.find('li');

  // Natif
  el.querySelectorAll('li');
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

  Retourne le premier élément trouvé à l'aide du sélecteur fourni, parcourant l'élément actuel vers le document.

  ```js
  // jQuery
  $el.closest(queryString);

  // Natif - Seulement le dernier, ne fonctionne pas sous IE
  el.closest(selector);

  // Natif - IE10+
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
    [].indexOf.call(document.querySelectorAll('.radio'), e.currentTarget);
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
      const styles = window.getComputedStyle(el);
      const height = el.offsetHeight;
      const borderTopWidth = parseFloat(styles.borderTopWidth);
      const borderBottomWidth = parseFloat(styles.borderBottomWidth);
      const paddingTop = parseFloat(styles.paddingTop);
      const paddingBottom = parseFloat(styles.paddingBottom);
      return height - borderBottomWidth - borderTopWidth - paddingTop - paddingBottom;
    }
    // précis à l'entier près (quand `border-box`, son `height - border`; quand `content-box`, son `height + padding`)
    el.clientHeight;
    // précis à la décimale près (quand `border-box`, son `height`; quand `content-box`, son `height + padding + border`)
    el.getBoundingClientRect().height;
    ```

- [2.3](#2.3) <a name='2.3'></a> Position et offset

  + Position

    Récupère les coordonnées courantes de l'élement relatif à l'offset parent.

    ```js
    // jQuery
    $el.position();

    // Natif
    { left: el.offsetLeft, top: el.offsetTop }
    ```

  + Offset

    Récupère les coordonnées courantes de l'élement relatif au document.

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

  Récupère la position verticale courante de l'ascenseur pour cet élément.

  ```js
  // jQuery
  $(window).scrollTop();

  // Natif
  (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
  ```

**[⬆ remonter](#table-of-contents)**

## Manipulation du DOM

- [3.1](#3.1) <a name='3.1'></a> Supprimer

  Supprime l'élément du DOM.

  ```js
  // jQuery
  $el.remove();

  // Natif
  el.parentNode.removeChild(el);
  ```

- [3.2](#3.2) <a name='3.2'></a> Texte

  + Obtenir le texte

    Récupère le contenu textuel combiné de l'élément en incluant ses descendants.

    ```js
    // jQuery
    $el.text();

    // Natif
    el.textContent;
    ```

  + Définir le text

    Définit le contenu de l'élément à partir du texte spécifié.

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

  Insérer un nouveau noeud après les noeuds sélectionnés

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
- [3.8](#3.8) <a name='3.8'></a> est

  Retourne `true` le paramètre correspond à la requête de sélection

  ```js
  // jQuert - Noter que `is` fonctionne également avec `function` ou `elements` qui ne sont pas concernés ici
  $el.is(selector);

  // Natif
  el.matches(selector);
  ```

- [3.9](#3.9) <a name='3.9'></a> clone

  Créé une copie profonde de cet élément

  ```js
  // jQuery
  $el.clone();

  // Natif
  el.cloneNode();

  // Pour une copie profonde, définir le paramètre à `true`
  ```

- [3.10](#3.10) <a name='3.10'></a> vider

  Supprime tous les noeuds enfants

  ```js
  // jQuery
  $el.empty();

  // Natif
  el.innerHTML = '';
  ```

- [3.11](#3.11) <a name='3.11'></a> enrouler

  Enrouler une structure HTML autour de chaque élément

  ```js
  // jQuery
  $('.inner').wrap('<div class="wrapper"></div>');

  // Natif
  [].slice.call(document.querySelectorAll('.inner')).forEach(function(el){
    var wrapper = document.createElement('div');
    wrapper.className = 'wrapper';
    el.parentNode.insertBefore(wrapper, el);
    el.parentNode.removeChild(el);
    wrapper.appendChild(el);
  });
  ```

- [3.12](#3.12) <a name='3.12'></a> dérouler

  Supprime les parents de la collection des éléments correspondants du DOM

  ```js
  // jQuery
  $('.inner').unwrap();

  // Natif
  [].slice.call(document.querySelectorAll('.inner')).forEach(function(el){
    [].slice.call(el.childNodes).forEach(function(child){
      el.parentNode.insertBefore(child, el);
    });
    el.parentNode.removeChild(el);
  });
  ```
**[⬆ remonter](#table-of-contents)**

## Ajax

[Fetch API](https://fetch.spec.whatwg.org/) est le nouveau standard qui a pour but de remplacer XMLHttpRequest afin de faire de l'ajax. Il fonctionne sous Chrome et Firefox, il est possible d'utiliser polyfills pour le faire fonctionner sur de vieux navigateurs.

Essayer [github/fetch](http://github.com/github/fetch) sous IE9+ ou [fetch-ie8](https://github.com/camsong/fetch-ie8/) sous IE8+, [fetch-jsonp](https://github.com/camsong/fetch-jsonp) pour construire des requêtes JSONP.

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

La plupart des utilitaires se trouvent dans l'API native. D'autres fonctions avancées peuvent être choisies afin de se concentrer sur la cohérence et la performance. Il est recommandé de remplacer par [lodash](https://lodash.com).

- [6.1](#6.1) <a name='6.1'></a> Utilitaires basiques

  + isArray

  Détermine si l'argument est un tableau.

  ```js
  // jQuery
  $.isArray(range);

  // Natif
  Array.isArray(range);
  ```

  + isWindow

  Détermine si l'argument est une fenêtre.

  ```js
  // jQuery
  $.isWindow(obj);

  // Native
  function isWindow(obj) {
    return obj != null && obj === obj.window;
  }
  ```

  + inArray

  Recherche une valeur spécifique à l'intérieur d'un tableau et retourne son index (ou -1 si rien n'a été trouvé).

  ```js
  // jQuery
  $.inArray(item, array);

  // Natif
  Array.indexOf(item);
  ```

  + isNumeric

  Détermine si l'argument est un nombre.
  Utiliser `typeof` pour décider du type. Si nécessaire utiliser une bibliothèque, parfois `typeof` n'est pas exact.

  ```js
  // jQuery
  $.isNumeric(item);

  // Natif
  function isNumeric(item) {
    return typeof value === 'number';
  }
  ```

  + isFunction

  Détermine si l'argument est un objet fonction JavaScript.

  ```js
  // jQuery
  $.isFunction(item);

  // Natif
  function isFunction(item) {
    return typeof value === 'function';
  }
  ```

  + isEmptyObject

  Vérifie si un objet est vide (ne contient aucune propriétés énumérables).

  ```js
  // jQuery
  $.isEmptyObject(obj);

  // Natif
  function isEmptyObject(obj) {
    for (let key in obj) {
      return false;
    }
    return true;
  }
  ```

  + isPlainObject

  Vérifie si un objet est un objet "plat" (créé en utilisant "{}" ou "new Object").

  ```js
  // jQuery
  $.isPlainObject(obj);

  // Natif
  function isPlainObject(obj) {
    if (typeof (obj) !== 'object' || obj.nodeType || obj != null && obj === obj.window) {
      return false;
    }

    if (obj.constructor &&
        !{}.hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf')) {
      return false;
    }

    return true;
  }
  ```

  + extend

  Fusionne le contenu de deux objets ou plus ensembles en un seul objet.
  Object.assign fait parti de l'API ES6, il est également possible d'utiliser [polyfill](https://github.com/ljharb/object.assign).

  ```js
  // jQuery
  $.extend({}, defaultOpts, opts);

  // Natif
  Object.assign({}, defaultOpts, opts);
  ```

  + trim

  Supprime les espaces au début et à la fin d'une chaine de caractères String.

  ```js
  // jQuery
  $.trim(string);

  // Natif
  string.trim();
  ```

  + map

  Traduit tous les éléments d'un tableau ou d'un objet vers un nouveau tableau d'éléments.

  ```js
  // jQuery
  $.map(array, function(value, index) {
  });

  // Natif
  array.map(function(value, index) {
  });
  ```

  + each

  Une fonction générique d'itération, qui peut être utilisée pour itérer de façon transparente à travers des objets et des tableaux.

  ```js
  // jQuery
  $.each(array, function(value, index) {
  });

  // Natif
  array.forEach(function(value, index) {
  });
  ```

  + grep

  Trouve les éléments d'un tableau qui satisfont avec une fonction filtre.

  ```js
  // jQuery
  $.grep(array, function(value, index) {
  });

  // Natif
  array.filter(function(value, index) {
  });
  ```

  + type

  Détermine la [[Class]] interne JavaScript d'un objet.

  ```js
  // jQuery
  $.type(obj);

  // Natif
  Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
  ```

  + merge

  Fusionne le contenu de deux tableau dans un seul tableau.

  ```js
  // jQuery
  $.merge(array1, array2);

  // Natif
  // But concat function don't remove duplicate items.
  function merge() {
    return Array.prototype.concat.apply([], arguments)
  }
  ```

  + now

  Retourne un nombre représentant l'heure actuelle.

  ```js
  // jQuery
  $.now();

  // Natif
  Date.now();
  ```

  + proxy

  Prend une fonction et en retourne une nouvelle qui aura toujours un contexte particulier.

  ```js
  // jQuery
  $.proxy(fn, context);

  // Natif
  fn.bind(context);
  ```

  + makeArray

  Convertit un objet "array-like" vers un véritable tableau JavaScript.

  ```js
  // jQuery
  $.makeArray(array);

  // Natif
  [].slice.call(array);
  ```

- [6.2](#6.2) <a name='6.2'></a> Contient

  Vérifie si un élément du DOM est un descendant d'un autre élément du DOM.

  ```js
  // jQuery
  $.contains(el, child);

  // Natif
  el !== child && el.contains(child);
  ```

- [6.3](#6.3) <a name='6.3'></a> Globaleval

  Exécute du code JavaScript de manière globale.

  ```js
  // jQuery
  $.globaleval(code);

  // Natif
  function Globaleval(code) {
    let script = document.createElement('script');
    script.text = code;

    document.head.appendChild(script).parentNode.removeChild(script);
  }

  // Utilise eval, mais le contexte d'eval est l'actuel alors que le contexte de $.Globaleval est global.
  eval(code);
  ```

- [6.4](#6.4) <a name='6.4'></a> parse

  + parseHTML

  Parse une chaine de caractères vers un tableau de noeuds DOM.

  ```js
  // jQuery
  $.parseHTML(htmlString);

  // Natif
  function parseHTML(string) {
    const tmp = document.implementation.createHTMLDocument();
    tmp.body.innerHTML = string;
    return tmp.body.children;
  }
  ```

  + parseJSON

  Prend une chaine JSON correctement formatée et retourne la valeur JavaScript résultante.

  ```js
  // jQuery
  $.parseJSON(str);

  // Natif
  JSON.parse(str);
  ```

**[⬆ remonter](#table-of-contents)**

## Promesses

Une promesse représente le résultat éventuel d'une opération asynchrone. jQuery a sa propre manière de traiter les promesses. JavaScript natif implémente une API minimale et légère afin de traiter les promesses en accord avec les spécifications [Promises/A+](http://promises-aplus.github.io/promises-spec/).


- [7.1](#7.1) <a name='7.1'></a> done, fail, always

  `done` est appelée quand une promesse est résolue, `fail` est appelée quand une promesse est rejetée et `always` est appelée quand une promesse n'est ni résolue ni rejetée.

  ```js
  // jQuery
  $promise.done(doneCallback).fail(failCallback).always(alwaysCallback)

  // Natif
  promise.then(doneCallback, failCallback).then(alwaysCallback, alwaysCallback)
  ```

- [7.2](#7.2) <a name='7.2'></a> when

  `when` est utilisée pour traiter de multiples promesses. Elle sera résolue quand toutes les promesses le seront, and rejetée si au moins une est rejetée.

  ```js
  // jQuery
  $.when($promise1, $promise2).done((promise1Result, promise2Result) => {})

  // Natif
  Promise.all([$promise1, $promise2]).then([promise1Result, promise2Result] => {});
  ```

- [7.3](#7.3) <a name='7.3'></a> Deferred

  Deferred est un moyen de créer une promesse.

  ```js
  // jQuery
  function asyncFunc() {
    var d = new $.Deferred();
    setTimeout(function() {
      if(true) {
        d.resolve('some_value_compute_asynchronously');
      } else {
        d.reject('failed');
      }
    }, 1000);
    return d.promise();
  }

  // Natif
  function asyncFunc() {
    return new Promise((resolve, reject) => {
      setTimeout(function() {
        if (true) {
          resolve('some_value_compute_asynchronously');
        } else {
          reject('failed');
        }
      }, 1000);
    });
  }

  // Avec deferred
  function defer() {
    let resolve, reject;
    let promise = new Promise(function() {
      resolve = arguments[0];
      reject = arguments[1];
    });
    return { resolve, reject, promise };
  }
  function asyncFunc() {
    var d = defer();
    setTimeout(function() {
      if(true) {
        d.resolve('some_value_compute_asynchronously');
      } else {
        d.reject('failed');
      }
    }, 1000);
    return d.promise;
  }
  ```

**[⬆ remonter](#table-of-contents)**

## Animation

- [8.1](#8.1) <a name='8.1'></a> Show & Hide

  ```js
  // jQuery
  $el.show();
  $el.hide();

  // Natif
  //Pour plus de détails à propos de la méthode show, merci de se référer à https://github.com/oneuijs/oui-dom-utils/blob/master/src/index.js#L363

  el.style.display = ''|'inline'|'inline-block'|'inline-table'|'block';
  el.style.display = 'none';
  ```

- [8.2](#8.2) <a name='8.2'></a> Toggle

  Affiche ou cache un élément.

  ```js
  // jQuery
  $el.toggle();

  // Natif
  if (el.ownerDocument.defaultView.getComputedStyle(el, null).display === 'none') {
    el.style.display = ''|'inline'|'inline-block'|'inline-table'|'block';
  }
  else {
    el.style.display = 'none';
  }
  ```

- [8.3](#8.3) <a name='8.3'></a> FadeIn & FadeOut

  ```js
  // jQuery
  $el.fadeIn(3000);
  $el.fadeOut(3000);

  // Natif
  el.style.transition = 'opacity 3s';
  // fadeIn
  el.style.opacity = '1';
  // fadeOut
  el.style.opacity = '0';
  ```

- [8.4](#8.4) <a name='8.4'></a> FadeTo

  Ajuste l'opacité d'un élément.

  ```js
  // jQuery
  $el.fadeTo('slow',0.15);
  // Natif
  el.style.transition = 'opacity 3s'; // assume que 'slow' vaut 3 seconds
  el.style.opacity = '0.15';
  ```

- [8.5](#8.5) <a name='8.5'></a> FadeToggle

  Affiche ou cache un élément en animant son opacité.

  ```js
  // jQuery
  $el.fadeToggle();

  // Natif
  el.style.transition = 'opacity 3s';
  let { opacity } = el.ownerDocument.defaultView.getComputedStyle(el, null);
  if (opacity === '1') {
    el.style.opacity = '0';
  }
  else {
    el.style.opacity = '1';
  }
  ```

- [8.6](#8.6) <a name='8.6'></a> SlideUp & SlideDown

  ```js
  // jQuery
  $el.slideUp();
  $el.slideDown();

  // Natif
  let originHeight = '100px';
  el.style.transition = 'height 3s';
  // slideUp
  el.style.height = '0px';
  // slideDown
  el.style.height = originHeight;
  ```

- [8.7](#8.7) <a name='8.7'></a> SlideToggle

  Affiche ou cache un élément en le faisant glisser.

  ```js
  // jQuery
  $el.slideToggle();

  // Natif
  let originHeight = '100px';
  el.style.transition = 'height 3s';
  let { height } = el.ownerDocument.defaultView.getComputedStyle(el, null);
  if (parseInt(height, 10) === 0) {
    el.style.height = originHeight;
  }
  else {
   el.style.height = '0px';
  }
  ```

- [8.8](#8.8) <a name='8.8'></a> Animate

  Réalise une animation personnaliée à partir d'une collection de propriétés CSS.

  ```js
  // jQuery
  $el.animate({params}, speed);

  // Natif
  el.style.transition = 'all' + speed;
  Object.keys(params).forEach(function(key) {
    el.style[key] = params[key];
  })
  ```

## Alternatives

* [You Might Not Need jQuery](http://youmightnotneedjquery.com/) - Des exemples sur comment faire un simple évènement, ajax etc avec du javascript pur.
* [npm-dom](http://github.com/npm-dom) et [webmodules](http://github.com/webmodules) - Modules DOM sur NPM.

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
