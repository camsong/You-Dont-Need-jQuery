## Vous n'avez pas besoin de jQuery



De nos jours, les environnements frontend évoluent si rapidement que les navigateurs récents ont déjà implémenté beaucoup d'API DOM/BOM suffisantes. Il n'est pas utile d'apprendre jQuery à partir de rien pour manipuler le DOM ou les évènements. Pendant ce temps, grâce à l'efficacité de bibliothèques frontend comme React, Angular et Vue, manipuler directement le DOM est devenu obsolète, jQuery n'a jamais été aussi peu important. Ce projet résume la plupart des alternatives à jQuery à l'aide d'implémentations natives.

Les exemples ciblent les versions actuelles des navigateurs à mise à jour automatique (Chrome, Edge, Firefox, Safari). Internet Explorer n'étant plus pris en charge par Microsoft, les solutions de repli spécifiques à IE ont été supprimées. Si vous en avez encore besoin, consultez la [dernière version compatible avec IE](https://github.com/camsong/You-Dont-Need-jQuery/tree/c4e00b3).

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
* `document.querySelectorAll` retourne tous les éléments trouvés sous forme d'une [NodeList](https://developer.mozilla.org/en-US/docs/Web/API/NodeList) statique. Elle prend en charge `forEach` et peut être convertie en Array à l'aide de `Array.from(document.querySelectorAll(selector))` ou de l'une des méthodes présentées dans [makeArray](#makeArray),
* si aucun élément n'a été trouvé, jQuery retourne un objet jQuery vide et `document.querySelectorAll` une NodeList vide, alors que `document.querySelector` retourne `null`.

> Remarque: `document.getElementById`, `document.getElementsByClassName` et `document.getElementsByTagName` sont légèrement plus rapides que `querySelector*`, mais les méthodes `getElementsBy*` retournent une HTMLCollection *dynamique* (live), qui évolue en même temps que le DOM. Préférez `querySelector*`, sauf si vous avez mesuré un réel goulot d'étranglement.

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
    [...el.parentNode.children].filter((child) =>
      child !== el
    );
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
    // jQuery
    $el.next();

    // Natif
    el.nextElementSibling;
    ```

- [1.6](#1.6) <a name='1.6'></a> Plus proche

  Retourne le premier élément trouvé à l'aide du sélecteur fourni, parcourant l'élément actuel vers le document.

  ```js
  // jQuery
  $el.closest(selector);

  // Natif
  el.closest(selector);
  ```

- [1.7](#1.7) <a name='1.7'></a> Parents jusqu'à

  Retourne les ancêtres de chaque élément dans l'ensemble d'éléments trouvés courants, jusqu'à (sans l'inclure) l'élément correspondant au sélecteur, le noeud DOM ou l'objet JQuery.

  ```js
  // jQuery
  $el.parentsUntil(selector, filter);

  // Natif
  function parentsUntil(el, selector, filter) {
    const result = [];

    // la correspondance commence à partir du parent
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
    $('.radio').index(e.currentTarget);

    // Natif
    [...document.querySelectorAll('.radio')].indexOf(e.currentTarget);
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
    $el.css('color');

    // Natif
    // NOTE: retourne la valeur résolue, par exemple 'rgb(255, 0, 17)' plutôt que '#f01'
    getComputedStyle(el).color;
    ```

  + Définir le style

    ```js
    // jQuery
    $el.css({ color: '#f01' });

    // Natif
    el.style.color = '#f01';
    ```

  + Définir plusieurs styles

    ```js
    // jQuery
    $el.css({ color: '#f01', 'border-color': '#f02' });

    // Natif
    Object.assign(el.style, { color: '#f01', borderColor: '#f02' });
    ```

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
    // jQuery
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

  + Hauteur de l'élement

    ```js
    // jQuery
    $el.height();

    // Natif
    function getHeight(el) {
      const styles = window.getComputedStyle(el);
      const height = el.offsetHeight;
      const borderTopWidth = parseFloat(styles.borderTopWidth);
      const borderBottomWidth = parseFloat(styles.borderBottomWidth);
      const paddingTop = parseFloat(styles.paddingTop);
      const paddingBottom = parseFloat(styles.paddingBottom);
      return height - borderBottomWidth - borderTopWidth - paddingTop - paddingBottom;
    }

    // précis à l'entier près (quand `border-box`, c'est `height - border`; quand `content-box`, c'est `height + padding`)
    el.clientHeight;

    // précis à la décimale près (quand `border-box`, c'est `height`; quand `content-box`, c'est `height + padding + border`)
    el.getBoundingClientRect().height;
    ```

- [2.3](#2.3) <a name='2.3'></a> Position et offset

  + Position

    Récupère les coordonnées courantes de l'élement relatif à l'offset parent.

    ```js
    // jQuery
    $el.position();

    // Natif
    const position = { left: el.offsetLeft, top: el.offsetTop };
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
        top: box.top + window.scrollY,
        left: box.left + window.scrollX
      };
    }
    ```

- [2.4](#2.4) <a name='2.4'></a> Défiler vers le haut

  Récupère la position verticale courante de l'ascenseur pour cet élément.

  ```js
  // jQuery
  $(window).scrollTop();

  // Natif
  window.scrollY;
  ```

**[⬆ remonter](#table-of-contents)**

## Manipulation du DOM

- [3.1](#3.1) <a name='3.1'></a> Supprimer

  Supprime l'élément du DOM.

  ```js
  // jQuery
  $el.remove();

  // Natif
  el.remove();
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
  // jQuery: syntaxe unifiée pour les DOMString et les objets Node
  $parent.append(newEl | '<div id="container">Hello World</div>');

  // Natif (élément ou texte): les chaînes sont insérées comme du texte brut, sans être interprétées comme du HTML
  parent.append(newEl | 'Hello World');

  // Natif (chaîne HTML)
  parent.insertAdjacentHTML('beforeend', '<div id="container">Hello World</div>');
  ```

- [3.5](#3.5) <a name='3.5'></a> Faire précéder

  ```js
  // jQuery: syntaxe unifiée pour les DOMString et les objets Node
  $parent.prepend(newEl | '<div id="container">Hello World</div>');

  // Natif (élément ou texte): les chaînes sont insérées comme du texte brut, sans être interprétées comme du HTML
  parent.prepend(newEl | 'Hello World');

  // Natif (chaîne HTML)
  parent.insertAdjacentHTML('afterbegin', '<div id="container">Hello World</div>');
  ```

- [3.6](#3.6) <a name='3.6'></a> Insérer avant

  Insérer un nouveau noeud avant les éléments sélectionnés.

  ```js
  // jQuery
  $newEl.insertBefore(selector);

  const el = document.querySelector(selector);

  // Natif (élément)
  el.before(newEl);

  // Natif (chaîne HTML)
  el.insertAdjacentHTML('beforebegin', '<div id="container">Hello World</div>');
  ```

- [3.7](#3.7) <a name='3.7'></a> Insérer après

  Insérer un nouveau noeud après les noeuds sélectionnés

  ```js
  // jQuery
  $newEl.insertAfter(selector);

  const el = document.querySelector(selector);

  // Natif (élément)
  el.after(newEl);

  // Natif (chaîne HTML)
  el.insertAdjacentHTML('afterend', '<div id="container">Hello World</div>');
  ```
- [3.8](#3.8) <a name='3.8'></a> est

  Retourne `true` le paramètre correspond à la requête de sélection

  ```js
  // jQuery - Noter que `is` fonctionne également avec une fonction, un objet jQuery existant ou un élément du DOM, qui ne sont pas concernés ici
  $el.is(selector);

  // Natif
  el.matches(selector);
  ```

- [3.9](#3.9) <a name='3.9'></a> clone

  Créé une copie profonde de cet élément

  ```js
  // jQuery. Passer `true` pour copier également les gestionnaires d'événements et les données.
  $el.clone();

  // Natif. Passer `true` pour une copie profonde; les écouteurs d'événements ne sont jamais copiés.
  el.cloneNode(true);
  ```

- [3.10](#3.10) <a name='3.10'></a> vider

  Supprime tous les noeuds enfants

  ```js
  // jQuery
  $el.empty();

  // Natif
  el.replaceChildren();
  ```

- [3.11](#3.11) <a name='3.11'></a> enrouler

  Enrouler une structure HTML autour de chaque élément

  ```js
  // jQuery
  $('.inner').wrap('<div class="wrapper"></div>');

  // Natif
  document.querySelectorAll('.inner').forEach((el) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper';
    el.before(wrapper);
    wrapper.append(el);
  });
  ```

- [3.12](#3.12) <a name='3.12'></a> dérouler

  Supprime les parents de la collection des éléments correspondants du DOM

  ```js
  // jQuery
  $('.inner').unwrap();

  // Natif
  new Set([...document.querySelectorAll('.inner')].map((el) => el.parentElement))
    .forEach((parent) => {
      if (parent !== document.body) {
        parent.replaceWith(...parent.childNodes);
      }
    });
  ```
**[⬆ remonter](#table-of-contents)**

## Ajax

[Fetch API](https://fetch.spec.whatwg.org/) est le standard qui remplace XMLHttpRequest pour faire de l'ajax, et il fonctionne dans tous les navigateurs modernes. Contrairement à `$.ajax`, `fetch` ne rejette **pas** la promesse en cas de code d'erreur HTTP comme 404 ou 500: c'est à vous de vérifier `response.ok`. Pour les requêtes JSONP, essayez [fetch-jsonp](https://github.com/camsong/fetch-jsonp).

- [4.0](#4.0) <a name='4.0'></a> Récupérer du JSON

  ```js
  // jQuery
  $.getJSON(url).done(handleData).fail(handleError);

  // Natif
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

- [4.0.1](#4.0.1) <a name='4.0.1'></a> Envoyer du JSON en POST

  ```js
  // jQuery
  $.ajax({
    url,
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(data),
  });

  // Natif
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  ```

- [4.0.2](#4.0.2) <a name='4.0.2'></a> Annulation et délai d'expiration

  ```js
  // jQuery
  const jqXHR = $.ajax({ url, timeout: 5000 });
  jqXHR.abort();

  // Natif
  const controller = new AbortController();
  fetch(url, { signal: controller.signal });
  controller.abort();

  // Natif (délai d'expiration)
  fetch(url, { signal: AbortSignal.timeout(5000) });
  ```

- [4.1](#4.1) <a name='4.1'></a> Charger des données depuis le serveur et placer le HTML retourné dans l'élément correspondant.

  ```js
  // jQuery
  $(selector).load(url, completeCallback)

  // Natif
  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      document.querySelector(selector).innerHTML = html;
    })
    .then(completeCallback);
  ```

**[⬆ remonter](#table-of-contents)**

## Évènements

- [5.1](#5.1) <a name='5.1'></a> Attacher un événement avec `on`

  ```js
  // jQuery
  $el.on(eventName, eventHandler);

  // Natif
  el.addEventListener(eventName, eventHandler);
  ```

- [5.1.1](#5.1.1) <a name='5.1.1'></a> Attacher un événement une seule fois avec `one`

  ```js
  // jQuery
  $el.one(eventName, eventHandler);

  // Natif
  el.addEventListener(eventName, eventHandler, { once: true });
  ```

- [5.1.2](#5.1.2) <a name='5.1.2'></a> Délégation d'événements

  ```js
  // jQuery
  $el.on(eventName, selector, eventHandler);

  // Natif
  el.addEventListener(eventName, (event) => {
    const target = event.target.closest(selector);
    if (target && el.contains(target)) {
      eventHandler.call(target, event);
    }
  });
  ```

- [5.2](#5.2) <a name='5.2'></a> Détacher un événement avec `off`

  ```js
  // jQuery
  $el.off(eventName, eventHandler);

  // Natif
  el.removeEventListener(eventName, eventHandler);

  // Natif: supprimer plusieurs écouteurs d'un coup, comme avec les espaces de noms jQuery
  const controller = new AbortController();
  el.addEventListener('click', onClick, { signal: controller.signal });
  el.addEventListener('keydown', onKeydown, { signal: controller.signal });
  controller.abort();
  ```

- [5.3](#5.3) <a name='5.3'></a> Trigger

  ```js
  // jQuery
  $(el).trigger('custom-event', {key1: 'data'});

  // Natif. Les événements jQuery remontent (bubbling), les événements natifs non, sauf avec `bubbles: true`.
  // Dans le gestionnaire, les données se lisent dans `event.detail`.
  const event = new CustomEvent('custom-event', {
    bubbles: true,
    cancelable: true,
    detail: { key1: 'data' },
  });

  el.dispatchEvent(event);
  ```

**[⬆ remonter](#table-of-contents)**

## Utilitaires

La plupart des utilitaires se trouvent dans l'API native. D'autres fonctions avancées peuvent être choisies afin de se concentrer sur la cohérence et la performance. Il est recommandé de remplacer par [Lodash](https://lodash.com) ou [es-toolkit](https://es-toolkit.dev).

- [6.1](#6.1) <a name='6.1'></a> Utilitaires basiques

  + isArray

  Détermine si l'argument est un tableau.

  ```js
  // jQuery
  $.isArray(array);

  // Natif
  Array.isArray(array);
  ```

  + isWindow

  Détermine si l'argument est une fenêtre.

  ```js
  // jQuery
  $.isWindow(obj);

  // Natif
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
  array.indexOf(item);
  ```

  Teste si une valeur spécifique se trouve dans un tableau.

  ```js
  // jQuery
  $.inArray(item, array) > -1;

  // Natif
  array.indexOf(item) > -1;

  // Façon ES6
  array.includes(item);
  ```

  + isNumeric

  Détermine si l'argument est un nombre.
  Utiliser `typeof` pour décider du type. Si nécessaire utiliser une bibliothèque, parfois `typeof` n'est pas exact.

  ```js
  // jQuery
  $.isNumeric(item);

  // Natif
  function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  ```

  + isFunction

  Détermine si l'argument est un objet fonction JavaScript.

  ```js
  // jQuery
  $.isFunction(item);

  // Natif
  function isFunction(item) {
    if (typeof item === 'function') {
      return true;
    }
    var type = Object.prototype.toString.call(item);
    return type === '[object Function]' || type === '[object GeneratorFunction]';
  }
  ```

  + isEmptyObject

  Vérifie si un objet est vide (ne contient aucune propriétés énumérables).

  ```js
  // jQuery
  $.isEmptyObject(obj);

  // Natif
  function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
  }
  ```

  + isPlainObject

  Vérifie si un objet est un objet "plat" (créé en utilisant "{}" ou "new Object").

  ```js
  // jQuery
  $.isPlainObject(obj);

  // Natif
  function isPlainObject(obj) {
    if (Object.prototype.toString.call(obj) !== '[object Object]') {
      return false;
    }

    const proto = Object.getPrototypeOf(obj);
    return proto === null || proto === Object.prototype;
  }
  ```

  + extend

  Fusionne le contenu de deux objets ou plus ensembles en un seul objet.
  Comme `$.extend` sans `deep`, `Object.assign` et la syntaxe de décomposition (spread) ne font qu'une copie superficielle.

  ```js
  // jQuery
  $.extend({}, object1, object2);

  // Natif
  Object.assign({}, object1, object2);

  // Natif (spread)
  ({ ...object1, ...object2 });
  ```

  Copie profonde d'un seul objet:

  ```js
  // jQuery
  $.extend(true, {}, object);

  // Natif. Les fonctions et les noeuds DOM ne peuvent pas être clonés
  structuredClone(object);
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
  $.map(array, (value, index) => {
  });

  // Natif
  array.map((value, index) => {
  });
  ```

  + each

  Une fonction générique d'itération, qui peut être utilisée pour itérer de façon transparente à travers des objets et des tableaux.

  ```js
  // jQuery (retourner `false` pour interrompre la boucle)
  $.each(array, (index, value) => {
  });

  // Natif (utiliser `for...of` ou `some` pour pouvoir interrompre la boucle)
  array.forEach((value, index) => {
  });

  // Natif, pour les objets
  Object.entries(obj).forEach(([key, value]) => {
  });
  ```

  + grep

  Trouve les éléments d'un tableau qui satisfont avec une fonction filtre.

  ```js
  // jQuery
  $.grep(array, (value, index) => {
  });

  // Natif
  array.filter((value, index) => {
  });
  ```

  + type

  Détermine la [[Class]] interne JavaScript d'un objet.

  ```js
  // jQuery
  $.type(obj);

  // Natif
  function type(item) {
    const reTypeOf = /(?:^\[object\s(.*?)\]$)/;
    return Object.prototype.toString.call(item)
      .replace(reTypeOf, '$1')
      .toLowerCase();
  }
  ```

  + merge

  Fusionne le contenu de deux tableau dans un seul tableau.

  ```js
  // jQuery, modifie array1, ne supprime pas les doublons
  $.merge(array1, array2);

  // Natif, modifie array1, ne supprime pas les doublons
  array1.push(...array2);

  // Natif, retourne un nouveau tableau, ne supprime pas les doublons
  function merge(...args) {
    return [].concat(...args);
  }

  // Version avec Set, retourne un nouveau tableau, supprime les doublons
  function merge(...args) {
    return Array.from(new Set([].concat(...args)));
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

  <a name="makeArray"></a>+ makeArray

  Convertit un objet "array-like" vers un véritable tableau JavaScript.

  ```js
  // jQuery
  $.makeArray(arrayLike);

  // Natif
  Array.from(arrayLike);

  // Façon ES6: opérateur de décomposition (spread)
  [...arrayLike];
  ```

- [6.2](#6.2) <a name='6.2'></a> Contient

  Vérifie si un élément du DOM est un descendant d'un autre élément du DOM.

  ```js
  // jQuery
  $.contains(el, child);

  // Natif
  el !== child && el.contains(child);
  ```

- [6.3](#6.3) <a name='6.3'></a> globalEval

  Exécute du code JavaScript de manière globale.

  ```js
  // jQuery
  $.globalEval(code);

  // Natif
  function globalEval(code) {
    const script = document.createElement('script');
    script.text = code;

    document.head.appendChild(script).parentNode.removeChild(script);
  }

  // Utilise eval, mais le contexte d'eval est l'actuel alors que le contexte de $.globalEval est global.
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
    const context = document.implementation.createHTMLDocument();

    // Définit le base href du document créé, afin que les URL des éléments analysés
    // soient résolues par rapport à l'URL du document
    const base = context.createElement('base');
    base.href = document.location.href;
    context.head.appendChild(base);

    context.body.innerHTML = string;
    return Array.from(context.body.childNodes);
  }
  ```

**[⬆ remonter](#table-of-contents)**

## Promesses

Une promesse représente le résultat éventuel d'une opération asynchrone. jQuery a sa propre manière de traiter les promesses. JavaScript natif implémente une API minimale et légère afin de traiter les promesses en accord avec les spécifications [Promises/A+](https://promisesaplus.com/), et `async`/`await` permet de les écrire comme du code synchrone.


- [7.1](#7.1) <a name='7.1'></a> done, fail, always

  `done` est appelée quand une promesse est résolue, `fail` est appelée quand une promesse est rejetée et `always` est appelée quand une promesse est soit résolue, soit rejetée.

  ```js
  // jQuery
  $promise.done(doneCallback).fail(failCallback).always(alwaysCallback)

  // Natif
  promise.then(doneCallback, failCallback).finally(alwaysCallback);

  // Natif (async/await)
  try {
    doneCallback(await promise);
  } catch (error) {
    failCallback(error);
  } finally {
    alwaysCallback();
  }
  ```

- [7.2](#7.2) <a name='7.2'></a> when

  `when` est utilisée pour traiter de multiples promesses. Elle sera résolue quand toutes les promesses le seront, and rejetée si au moins une est rejetée.

  ```js
  // jQuery
  $.when($promise1, $promise2).done((promise1Result, promise2Result) => {
  });

  // Natif
  Promise.all([promise1, promise2]).then(([promise1Result, promise2Result]) => {});

  // Natif (async/await)
  const [promise1Result, promise2Result] = await Promise.all([promise1, promise2]);
  ```

- [7.3](#7.3) <a name='7.3'></a> Deferred

  Deferred est un moyen de créer une promesse.

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

  // Natif
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

  // Avec deferred
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

**[⬆ remonter](#table-of-contents)**

## Animation

L'[API Web Animations](https://developer.mozilla.org/fr/docs/Web/API/Web_Animations_API) (`el.animate()`) est l'équivalent natif le plus proche des effets jQuery: elle prend une durée en millisecondes, s'exécute si possible en dehors du thread principal et retourne un objet `Animation` dont la promesse `finished` est résolue à la fin de l'animation.

- [8.1](#8.1) <a name='8.1'></a> Show & Hide

  ```js
  // jQuery
  $el.show();
  $el.hide();

  // Natif
  el.style.display = ''; // ou 'block', 'inline', ... si une feuille de style le masque
  el.style.display = 'none';

  // Natif (si le `display` de l'élément n'est pas défini ailleurs)
  el.hidden = false;
  el.hidden = true;
  ```

- [8.2](#8.2) <a name='8.2'></a> Toggle

  Affiche ou cache un élément.

  ```js
  // jQuery
  $el.toggle();

  // Natif
  if (getComputedStyle(el).display === 'none') {
    el.style.display = ''; // ou 'block', 'inline', ...
  } else {
    el.style.display = 'none';
  }
  ```

- [8.3](#8.3) <a name='8.3'></a> FadeIn & FadeOut

  ```js
  // jQuery
  $el.fadeIn(3000);
  $el.fadeOut(3000);

  // Natif fadeIn
  function fadeIn(el, ms = 400) {
    el.style.display = '';
    return el.animate([{ opacity: 0 }, { opacity: 1 }], ms).finished;
  }

  // Natif fadeOut
  function fadeOut(el, ms = 400) {
    return el.animate([{ opacity: 1 }, { opacity: 0 }], ms).finished.then(() => {
      el.style.display = 'none';
    });
  }
  ```

- [8.4](#8.4) <a name='8.4'></a> FadeTo

  Ajuste l'opacité d'un élément.

  ```js
  // jQuery
  $el.fadeTo('slow',0.15);
  // Natif ('slow' vaut 600 millisecondes dans jQuery)
  el.animate([{ opacity: 0.15 }], { duration: 600, fill: 'forwards' });
  ```

- [8.5](#8.5) <a name='8.5'></a> FadeToggle

  Affiche ou cache un élément en animant son opacité.

  ```js
  // jQuery
  $el.fadeToggle();

  // Natif, avec les fonctions fadeIn et fadeOut de 8.3
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

  // Natif slideUp
  function slideUp(el, ms = 400) {
    el.style.overflow = 'hidden';
    return el.animate([{ height: `${el.offsetHeight}px` }, { height: '0px' }], ms).finished.then(() => {
      el.style.display = 'none';
      el.style.overflow = '';
    });
  }

  // Natif slideDown
  function slideDown(el, ms = 400) {
    el.style.display = '';
    el.style.overflow = 'hidden';
    return el.animate([{ height: '0px' }, { height: `${el.scrollHeight}px` }], ms).finished.then(() => {
      el.style.overflow = '';
    });
  }
  ```

- [8.7](#8.7) <a name='8.7'></a> SlideToggle

  Affiche ou cache un élément en le faisant glisser.

  ```js
  // jQuery
  $el.slideToggle();

  // Natif, avec les fonctions slideUp et slideDown de 8.6
  if (getComputedStyle(el).display === 'none') {
    slideDown(el);
  } else {
    slideUp(el);
  }
  ```

- [8.8](#8.8) <a name='8.8'></a> Animate

  Réalise une animation personnaliée à partir d'une collection de propriétés CSS.

  ```js
  // jQuery
  $el.animate({ params }, speed);

  // Natif (speed en millisecondes)
  el.animate([params], { duration: speed, fill: 'forwards' });
  ```

## Alternatives

* [You Might Not Need jQuery](https://youmightnotneedjquery.com/) - Des exemples sur comment faire un simple évènement, ajax etc avec du javascript pur.
* [MDN Web Docs](https://developer.mozilla.org/fr/docs/Web/API/Document_Object_Model) - La documentation de référence de toutes les API DOM utilisées ici.
* [Baseline](https://web.dev/baseline) - Pour vérifier quelles fonctionnalités de la plateforme web peuvent être utilisées sans risque dans tous les navigateurs.

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

![Chrome][chrome-image] | ![Edge][edge-image] | ![Firefox][firefox-image] | ![Safari][safari-image] | ![Opera][opera-image]
--- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ |

Quelques exemples utilisent des API plus récentes: `Promise.withResolvers()` (2024), `el.replaceChildren()` (2020) et `AbortSignal.timeout()` (2022). Consultez [Baseline](https://web.dev/baseline) si vous devez prendre en charge des navigateurs plus anciens.

# Licence

MIT

[chrome-image]: https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png
[firefox-image]: https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png
[edge-image]: https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png
[opera-image]: https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png
[safari-image]: https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png
