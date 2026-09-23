## Tú no necesitas jQuery

El desarrollo Frontend evoluciona día a día, y los navegadores modernos ya han implementado nativamente APIs para trabajar con DOM/BOM, las cuales son muy buenas, por lo que definitivamente no es necesario aprender jQuery desde cero para manipular el DOM. En la actualidad, gracias al surgimiento de librerías frontend como React, Angular y Vue, manipular el DOM es contrario a los patrones establecidos, y jQuery se ha vuelto menos importante. Este proyecto resume la mayoría de métodos alternativos a jQuery, pero de forma nativa.

Los ejemplos están pensados para las versiones actuales de los navegadores que se actualizan automáticamente (Chrome, Edge, Firefox, Safari). Microsoft ya no da soporte a Internet Explorer, por lo que se ha eliminado el código de compatibilidad específico para IE. Si todavía lo necesitas, consulta la [última versión compatible con IE](https://github.com/camsong/You-Dont-Need-jQuery/tree/c4e00b3).

## Tabla de Contenidos

1. [Traducción](#traducción)
1. [Query Selector](#query-selector)
1. [CSS & Estilo](#css--estilo)
1. [Manipulación DOM](#manipulación-dom)
1. [Ajax](#ajax)
1. [Eventos](#eventos)
1. [Utilidades](#utilidades)
1. [Promesas](#promesas)
1. [Animaciones](#animaciones)
1. [Alternativas](#alternativas)
1. [Navegadores soportados](#navegadores-soportados)

## Traducción

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

En lugar de los selectores comunes como clase, id o atributos podemos usar `document.querySelector` o `document.querySelectorAll` como alternativas. Las diferencias radican en:
* `document.querySelector` devuelve el primer elemento que cumpla con la condición
* `document.querySelectorAll` devuelve todos los elementos que cumplen con la condición en forma de NodeList estática. Admite `forEach` y puede ser convertido a Array usando `Array.from(document.querySelectorAll(selector))` o cualquiera de los métodos descritos en [makeArray](#makeArray)
* Si ningún elemento cumple con la condición, jQuery devuelve un objeto jQuery vacío y `document.querySelectorAll` devuelve una NodeList vacía, mientras que `document.querySelector` devuelve `null`.

> Nota: `document.getElementById`, `document.getElementsByClassName` y `document.getElementsByTagName` son ligeramente más rápidos que `querySelector*`, pero `getElementsBy*` devuelven una HTMLCollection *viva* (live), que cambia a medida que cambia el DOM. Es preferible usar `querySelector*`, salvo que se haya medido un cuello de botella.

- [1.0](#1.0) <a name='1.0'></a> Buscar por selector

  ```js
  // jQuery
  $('selector');

  // Nativo
  document.querySelectorAll('selector');
  ```

- [1.1](#1.1) <a name='1.1'></a> Buscar por Clase

  ```js
  // jQuery
  $('.class');

  // Nativo
  document.querySelectorAll('.class');

  // Forma alternativa
  document.getElementsByClassName('class');
  ```

- [1.2](#1.2) <a name='1.2'></a> Buscar por id

  ```js
  // jQuery
  $('#id');

  // Nativo
  document.querySelector('#id');

  // Forma alternativa
  document.getElementById('id');
  ```

- [1.3](#1.3) <a name='1.3'></a> Buscar por atributo

  ```js
  // jQuery
  $('a[target=_blank]');

  // Nativo
  document.querySelectorAll('a[target=_blank]');
  ```

- [1.4](#1.4) <a name='1.4'></a> Buscar en descendientes

    ```js
    // jQuery
    $el.find('li');

    // Nativo
    el.querySelectorAll('li');
    ```

- [1.5](#1.5) <a name='1.5'></a> Elementos Hermanos/Previos/Siguientes

  + Elementos hermanos

    ```js
    // jQuery
    $el.siblings();

    // Nativo
    [...el.parentNode.children].filter((child) =>
      child !== el
    );
    ```

  + Elementos previos

    ```js
    // jQuery
    $el.prev();

    // Nativo
    el.previousElementSibling;
    ```

  + Elementos siguientes

    ```js
    // jQuery
    $el.next();

    // Nativo
    el.nextElementSibling;
    ```

- [1.6](#1.6) <a name='1.6'></a> Más cercano

  Retorna el elemento más cercano que coincida con la condición, partiendo desde el nodo actual hasta document.

  ```js
  // jQuery
  $el.closest(selector);

  // Nativo
  el.closest(selector);
  ```

- [1.7](#1.7) <a name='1.7'></a> Padres hasta

  Obtiene los ancestros de cada elemento en el set actual de elementos que cumplan con la condición, sin incluir el actual

  ```js
  // jQuery
  $el.parentsUntil(selector, filter);

  // Nativo
  function parentsUntil(el, selector, filter) {
    const result = [];

    // Partir desde el elemento padre
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

- [1.8](#1.8) <a name='1.8'></a> Formularios

  + Input/Textarea

    ```js
    // jQuery
    $('#my-input').val();

    // Nativo
    document.querySelector('#my-input').value;
    ```

  + Obtener el índice de e.currentTarget en `.radio`

    ```js
    // jQuery
    $('.radio').index(e.currentTarget);

    // Nativo
    [...document.querySelectorAll('.radio')].indexOf(e.currentTarget);
    ```

- [1.9](#1.9) <a name='1.9'></a> Contenidos de Iframe

  `$('iframe').contents()` devuelve `contentDocument` para este iframe específico

  + Contenidos de Iframe

    ```js
    // jQuery
    $iframe.contents();

    // Nativo
    iframe.contentDocument;
    ```

  + Buscar dentro de un Iframe

    ```js
    // jQuery
    $iframe.contents().find('.css');

    // Nativo
    iframe.contentDocument.querySelectorAll('.css');
    ```

- [1.10](#1.10) <a name='1.10'></a> Obtener body

  ```js
  // jQuery
  $('body');

  // Nativo
  document.body;
  ```

- [1.11](#1.11) <a name='1.11'></a> Obtener y establecer atributos

  + Obtener un atributo

    ```js
    // jQuery
    $el.attr('foo');

    // Nativo
    el.getAttribute('foo');
    ```
  + Establecer un atributo

    ```js
    // jQuery
    $el.attr('foo', 'bar');

    // Nativo
    el.setAttribute('foo', 'bar');
    ```

  + Obtener un atributo `data-`

    ```js
    // jQuery
    $el.data('foo');

    // Nativo
    el.dataset.foo;

    // Forma alternativa
    el.getAttribute('data-foo');
    ```

**[⬆ volver al inicio](#tabla-de-contenidos)**

## CSS & Estilo

- [2.1](#2.1) <a name='2.1'></a> CSS

  + Obtener Estilo

    ```js
    // jQuery
    $el.css('color');

    // Nativo
    // NOTA: devuelve el valor resuelto, p. ej. 'rgb(255, 0, 17)' en lugar de '#f01'
    getComputedStyle(el).color;
    ```

  + Establecer estilo

    ```js
    // jQuery
    $el.css({ color: '#f01' });

    // Nativo
    el.style.color = '#f01';
    ```

  + Establecer varios estilos

    ```js
    // jQuery
    $el.css({ color: '#f01', 'border-color': '#f02' });

    // Nativo
    Object.assign(el.style, { color: '#f01', borderColor: '#f02' });
    ```

  + Agregar clase

    ```js
    // jQuery
    $el.addClass(className);

    // Nativo
    el.classList.add(className);
    ```

  + Quitar Clase

    ```js
    // jQuery
    $el.removeClass(className);

    // Nativo
    el.classList.remove(className);
    ```

  + Consultar si tiene clase

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

  Ancho y Alto son teóricamente idénticos. Usaremos el Alto como ejemplo:

  + Alto de Ventana

    ```js
    // jQuery
    $(window).height();

    // Sin scrollbar, se comporta como jQuery
    window.document.documentElement.clientHeight;

    // Con scrollbar
    window.innerHeight;
    ```

  + Alto de Documento

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

  + Alto de Elemento

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

    // Precisión de entero (para `border-box`, es `height - border`; con `content-box`, es `height + padding`)
    el.clientHeight;

    // Precisión de decimal (para `border-box`, es `height`; con `content-box`, es `height + padding + border`)
    el.getBoundingClientRect().height;
    ```

- [2.3](#2.3) <a name='2.3'></a> Posición y Offset

  + Posición

    Obtiene las coordenadas actuales del elemento, en relación con el padre.

    ```js
    // jQuery
    $el.position();

    // Nativo
    const position = { left: el.offsetLeft, top: el.offsetTop };
    ```

  + Offset

    Obtiene las coordenadas actuales del elemento, en relación con el documento.

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

- [2.4](#2.4) <a name='2.4'></a> Posición vertical del scroll

  Obtiene la posición vertical actual de la barra de scroll para el elemento.

  ```js
  // jQuery
  $(window).scrollTop();

  // Nativo
  window.scrollY;
  ```

**[⬆ volver al inicio](#tabla-de-contenidos)**

## Manipulación DOM

- [3.1](#3.1) <a name='3.1'></a> Eliminar

  Elimina el elemento del DOM

  ```js
  // jQuery
  $el.remove();

  // Nativo
  el.remove();
  ```

- [3.2](#3.2) <a name='3.2'></a> Texto

  + Obtener Texto

    Obtiene los contenidos de texto combinado del elemento, incluyendo sus decendientes.

    ```js
    // jQuery
    $el.text();

    // Nativo
    el.textContent;
    ```

  + Establecer Texto

    Establece el contenido del elemento al texto especificado

    ```js
    // jQuery
    $el.text(string);

    // Nativo
    el.textContent = string;
    ```

- [3.3](#3.3) <a name='3.3'></a> HTML

  + Obtener HTML

    ```js
    // jQuery
    $el.html();

    // Nativo
    el.innerHTML;
    ```

  + Establecer HTML

    ```js
    // jQuery
    $el.html(htmlString);

    // Nativo
    el.innerHTML = htmlString;
    ```

- [3.4](#3.4) <a name='3.4'></a> Añadir al final

  Añadir elemento hijo después del último hijo del elemento padre

  ```js
  // jQuery: sintaxis unificada para DOMString y objetos Node
  $parent.append(newEl | '<div id="container">Hello World</div>');

  // Nativo (Elemento o texto): los strings se insertan como texto plano, no se interpretan como HTML
  parent.append(newEl | 'Hello World');

  // Nativo (string de HTML)
  parent.insertAdjacentHTML('beforeend', '<div id="container">Hello World</div>');
  ```

- [3.5](#3.5) <a name='3.5'></a> Añadir al inicio

  ```js
  // jQuery: sintaxis unificada para DOMString y objetos Node
  $parent.prepend(newEl | '<div id="container">Hello World</div>');

  // Nativo (Elemento o texto): los strings se insertan como texto plano, no se interpretan como HTML
  parent.prepend(newEl | 'Hello World');

  // Nativo (String HTML)
  parent.insertAdjacentHTML('afterbegin', '<div id="container">Hello World</div>');
  ```

- [3.6](#3.6) <a name='3.6'></a> Insertar Antes

  Insertar un nuevo nodo antes de los elementos seleccionados

  ```js
  // jQuery
  $newEl.insertBefore(selector);

  const el = document.querySelector(selector);

  // Nativo (Elemento)
  el.before(newEl);

  // Nativo (String HTML)
  el.insertAdjacentHTML('beforebegin', '<div id="container">Hello World</div>');
  ```

- [3.7](#3.7) <a name='3.7'></a> Insertar después

  Insertar un nuevo nodo después de los elementos seleccionados

  ```js
  // jQuery
  $newEl.insertAfter(selector);

  const el = document.querySelector(selector);

  // Nativo (Elemento)
  el.after(newEl);

  // Nativo (String HTML)
  el.insertAdjacentHTML('afterend', '<div id="container">Hello World</div>');
  ```

- [3.8](#3.8) <a name='3.8'></a> es

  Retorna `true` si coincide con el selector de la búsqueda

  ```js
  // jQuery - Nota: `is` también funciona con una función, un objeto jQuery existente o un elemento del DOM, que no veremos aquí
  $el.is(selector);

  // Nativo
  el.matches(selector);
  ```
- [3.9](#3.9) <a name='3.9'></a> Clonar

  Crea una copia profunda del elemento

  ```js
  // jQuery. Pasa `true` para copiar también los manejadores de eventos y los datos.
  $el.clone();

  // Nativo. Pasa `true` para hacer una copia profunda; los event listeners nunca se copian.
  el.cloneNode(true);
  ```

- [3.10](#3.10) <a name='3.10'></a> Vaciar

  Elimina todos los nodos hijo

  ```js
  // jQuery
  $el.empty();

  // Nativo
  el.replaceChildren();
  ```

- [3.11](#3.11) <a name='3.11'></a> Envolver

  Crea una estructura HTML alrededor de cada elemento

  ```js
  // jQuery
  $('.inner').wrap('<div class="wrapper"></div>');

  // Nativo
  document.querySelectorAll('.inner').forEach((el) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper';
    el.before(wrapper);
    wrapper.append(el);
  });
  ```

- [3.12](#3.12) <a name='3.12'></a> Desenvolver

  Elimina los padres de una serie de elementos seleccionados del DOM

  ```js
  // jQuery
  $('.inner').unwrap();

  // Nativo
  new Set([...document.querySelectorAll('.inner')].map((el) => el.parentElement))
    .forEach((parent) => {
      if (parent !== document.body) {
        parent.replaceWith(...parent.childNodes);
      }
    });
  ```

- [3.13](#3.13) <a name='3.13'></a> Remplazar con

  Remplaza cada elemento en una serie de elementos seleccionados con nuevo contenido.

  ```js
  // jQuery
  $('.inner').replaceWith('<div class="outer"></div>');

  // Nativo
  document.querySelectorAll('.inner').forEach((el) => {
    const outer = document.createElement('div');
    outer.className = 'outer';
    el.replaceWith(outer);
  });
  ```


**[⬆ volver al inicio](#tabla-de-contenidos)**

## Ajax

[Fetch API](https://fetch.spec.whatwg.org/) es el estándar que reemplaza a XMLHttpRequest para efectuar peticiones AJAX y funciona en todos los navegadores modernos. A diferencia de `$.ajax`, `fetch` **no** rechaza la promesa cuando la respuesta tiene un código de estado HTTP de error, como 404 o 500; hay que comprobar `response.ok` manualmente. Para peticiones JSONP, puedes utilizar [fetch-jsonp](https://github.com/camsong/fetch-jsonp).

- [4.0](#4.0) <a name='4.0'></a> Solicitar JSON

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

- [4.0.1](#4.0.1) <a name='4.0.1'></a> Enviar JSON con POST

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

- [4.0.2](#4.0.2) <a name='4.0.2'></a> Cancelar una petición y tiempo de espera

  ```js
  // jQuery
  const jqXHR = $.ajax({ url, timeout: 5000 });
  jqXHR.abort();

  // Nativo
  const controller = new AbortController();
  fetch(url, { signal: controller.signal });
  controller.abort();

  // Nativo (tiempo de espera)
  fetch(url, { signal: AbortSignal.timeout(5000) });
  ```

- [4.1](#4.1) <a name='4.1'></a> Carga datos desde un servidor y coloca el HTML regresado en el elemento seleccionado.

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

**[⬆ volver al inicio](#tabla-de-contenidos)**

## Eventos

- [5.0](#5.0) <a name='5.0'></a> Document ready by `DOMContentLoaded`

  ```js
  // jQuery
  $(document).ready(eventHandler);

  // Nativo
  // Verifica que DOMContentLoaded ya se ha completado
  if (document.readyState !== 'loading') {
    eventHandler();
  } else {
    document.addEventListener('DOMContentLoaded', eventHandler);
  }

  // O carga tu script con `<script defer>` o `<script type="module">`,
  // que se ejecuta después de que se haya analizado el documento.
  ```

- [5.1](#5.1) <a name='5.1'></a> Asignar un evento con "on"

  ```js
  // jQuery
  $el.on(eventName, eventHandler);

  // Nativo
  el.addEventListener(eventName, eventHandler);
  ```

- [5.1.1](#5.1.1) <a name='5.1.1'></a> Asignar un evento una sola vez con "one"

  ```js
  // jQuery
  $el.one(eventName, eventHandler);

  // Nativo
  el.addEventListener(eventName, eventHandler, { once: true });
  ```

- [5.1.2](#5.1.2) <a name='5.1.2'></a> Delegación de eventos

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

- [5.2](#5.2) <a name='5.2'></a> Desasignar un evento con "off"

  ```js
  // jQuery
  $el.off(eventName, eventHandler);

  // Nativo
  el.removeEventListener(eventName, eventHandler);

  // Nativo: desasignar varios eventos a la vez, como con los namespaces de jQuery
  const controller = new AbortController();
  el.addEventListener('click', onClick, { signal: controller.signal });
  el.addEventListener('keydown', onKeydown, { signal: controller.signal });
  controller.abort();
  ```

- [5.3](#5.3) <a name='5.3'></a> Trigger

  ```js
  // jQuery
  $(el).trigger('custom-event', {key1: 'data'});

  // Nativo. Los eventos de jQuery se propagan hacia arriba (bubbling); los nativos no, salvo que se indique `bubbles: true`.
  // Lee los datos desde `event.detail` en el manejador.
  const event = new CustomEvent('custom-event', {
    bubbles: true,
    cancelable: true,
    detail: { key1: 'data' },
  });

  el.dispatchEvent(event);
  ```

**[⬆ volver al inicio](#tabla-de-contenidos)**

## Utilidades

La mayoría de las utilidades se encuentran en la API nativa. Otras funciones avanzadas podrían por utilidades de librerías que se centran en la consistencia y rendimiento. Se recomiendan [Lodash](https://lodash.com) y [es-toolkit](https://es-toolkit.dev) como reemplazo.

- [6.1](#6.1) <a name='6.1'></a> Utilidades Básicas

  + isArray

  Determina si el lemento es un vector(array).

  ```js
  // jQuery
  $.isArray(array);

  // Nativo
  Array.isArray(array);
  ```

  + isWindow

  Determina si el argumento en una ventana(window).

  ```js
  // jQuery
  $.isWindow(obj);

  // Nativo
  function isWindow(obj) {
    return obj != null && obj === obj.window;
  }
  ```

  + inArray

  Busca un valor específico en el array y retorna su índice (o -1 si no lo encuentra).

  ```js
  // jQuery
  $.inArray(item, array);

  // Nativo
  array.indexOf(item);
  ```

  Comprueba si un valor específico se encuentra en el array.

  ```js
  // jQuery
  $.inArray(item, array) > -1;

  // Nativo
  array.indexOf(item) > -1;

  // ES6
  array.includes(item);
  ```

  + isNumeric

  Determina si el argumento es un número.
  Utiliza `typeof` para decidir el tipo del `type` ejemplo para mayor precisión.

  ```js
  // jQuery
  $.isNumeric(item);

  // Nativo
  function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  ```

  + isFunction

  Determina si el argumento es objecto función de Javascript.

  ```js
  // jQuery
  $.isFunction(item);

  // Nativo
  function isFunction(item) {
    if (typeof item === 'function') {
      return true;
    }
    var type = Object.prototype.toString.call(item);
    return type === '[object Function]' || type === '[object GeneratorFunction]';
  }
  ```

  + isEmptyObject

  Verifica que un objeto esté vacío(contiene propiedades no enumerables).

  ```js
  // jQuery
  $.isEmptyObject(obj);

  // Nativo
  function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
  }
  ```

  + isPlainObject

  Verifica si un objeto es un objeto plano (creado utilizando “{}” o “new Object”).

  ```js
  // jQuery
  $.isPlainObject(obj);

  // Nativo
  function isPlainObject(obj) {
    if (Object.prototype.toString.call(obj) !== '[object Object]') {
      return false;
    }

    const proto = Object.getPrototypeOf(obj);
    return proto === null || proto === Object.prototype;
  }
  ```

  + extend

  Combina los contenidos de dos o más objetos en un nuevo objeto, sin modificar ninguno de los argumentos.
  Al igual que `$.extend` sin `deep`, `Object.assign` y el operador spread solo hacen una copia superficial.

  ```js
  // jQuery
  $.extend({}, object1, object2);

  // Nativo
  Object.assign({}, object1, object2);

  // Nativo (spread)
  ({ ...object1, ...object2 });
  ```

  Copia profunda de un único objeto:

  ```js
  // jQuery
  $.extend(true, {}, object);

  // Nativo. Las funciones y los nodos del DOM no se pueden clonar
  structuredClone(object);
  ```

  + trim

  Elimina los espacios en blanco del inicio y final de un string.

  ```js
  // jQuery
  $.trim(string);

  // Nativo
  string.trim();
  ```

  + map

  Traslada todos los elementos en un arreglo u objeto a un nuevo arreglo de elementos.

  ```js
  // jQuery
  $.map(array, (value, index) => {
  });

  // Nativo
  array.map((value, index) => {
  });
  ```

  + each

  Una función genérica de iteración, que puede ser utilizada de manera similar para iterar en objetos o arreglos.

  ```js
  // jQuery (retorna `false` para salir del bucle)
  $.each(array, (index, value) => {
  });

  // Nativo (usa `for...of` o `some` si necesitas salir del bucle antes)
  array.forEach((value, index) => {
  });

  // Nativo, para objetos
  Object.entries(obj).forEach(([key, value]) => {
  });
  ```

  + grep

  Encuentra los elementos de un arreglo que satisfacen una función filtro.

  ```js
  // jQuery
  $.grep(array, (value, index) => {
  });

  // Nativo
  array.filter((value, index) => {
  });
  ```

  + type

  Determina la clase [Class]  interna de Javascript de un objeto.

  ```js
  // jQuery
  $.type(obj);

  // Nativo
  function type(item) {
    const reTypeOf = /(?:^\[object\s(.*?)\]$)/;
    return Object.prototype.toString.call(item)
      .replace(reTypeOf, '$1')
      .toLowerCase();
  }
  ```

  + merge

  Combina los contenidos de dos o mas arreglos en el primero.

  ```js
  // jQuery, modifica array1, no elimina elementos duplicados
  $.merge(array1, array2);

  // Nativo, modifica array1, no elimina elementos duplicados
  array1.push(...array2);

  // Nativo, retorna un nuevo arreglo, no elimina elementos duplicados
  function merge(...args) {
    return [].concat(...args);
  }

  // Versión con Set, retorna un nuevo arreglo, sí elimina elementos duplicados
  function merge(...args) {
    return Array.from(new Set([].concat(...args)));
  }
  ```

  + now

  Retorna un número que representa la hora actual.

  ```js
  // jQuery
  $.now();

  // Nativo
  Date.now();
  ```

  + proxy

  Toma una función y regresa una nueva que siempre tendrá un contexto particular.

  ```js
  // jQuery
  $.proxy(fn, context);

  // Nativo
  fn.bind(context);
  ```

  <a name="makeArray"></a>+ makeArray

  Convierte un objeto similar a un arreglo en un verdarero arreglo de Javascript.

  ```js
  // jQuery
  $.makeArray(arrayLike);

  // Nativo
  Array.from(arrayLike);

  // ES6: operador spread
  [...arrayLike];
  ```

- [6.2](#6.2) <a name='6.2'></a> Contenedores

  Verifica si un elemento del DOM es descendiente de otro elemento del DOM.

  ```js
  // jQuery
  $.contains(el, child);

  // Nativo
  el !== child && el.contains(child);
  ```

- [6.3](#6.3) <a name='6.3'></a> globalEval

  Ejecuta el mismo código Javascript de manera global.

  ```js
  // jQuery
  $.globalEval(code);

  // Nativo
  function globalEval(code) {
    const script = document.createElement('script');
    script.text = code;

    document.head.appendChild(script).parentNode.removeChild(script);
  }

  // Utilizando eval, pero el contexto de eval es el actual, el contexto de $.globalEval es global.
  eval(code);
  ```

- [6.4](#6.4) <a name='6.4'></a> parse

  + parseHTML

  Parsea un string ien un arreglo de nodos DOM.

  ```js
  // jQuery
  $.parseHTML(htmlString);

  // Nativo
  function parseHTML(string) {
    const context = document.implementation.createHTMLDocument();

    // Se establece la base href para el documento creado, así todos los elementos parseados con URLs
    // estarán basados en la URL del documento
    const base = context.createElement('base');
    base.href = document.location.href;
    context.head.appendChild(base);

    context.body.innerHTML = string;
    return Array.from(context.body.childNodes);
  }
  ```

**[⬆ volver al inicio](#tabla-de-contenidos)**

## Promesas

Una promesa, representa el resultado eventual de una operación asíncrona. jQuery tiene su propio sistema para utilizar promesas. JavaScript nativo implementa una ligera y mínima API para utilizar promesas de acuerdo con la especificación [Promises/A+](https://promisesaplus.com/), y con `async`/`await` se pueden leer como si fueran código síncrono.

- [7.1](#7.1) <a name='7.1'></a> done, fail, always

  `done` se llama cuando una promesa se resuelve, `fail` se llama cuando una promesa es rechazada, `always` se llama cuando una promesa no ha sido resuelta o rechazada.

  ```js
  // jQuery
  $promise.done(doneCallback).fail(failCallback).always(alwaysCallback)

  // Nativo
  promise.then(doneCallback, failCallback).finally(alwaysCallback);

  // Nativo (async/await)
  try {
    doneCallback(await promise);
  } catch (error) {
    failCallback(error);
  } finally {
    alwaysCallback();
  }
  ```

- [7.2](#7.2) <a name='7.2'></a> when

  `when` se utiliza para manipular múltiples promesas. Se resolverá cuando todas las promesas sean resueltas y se rechazará si alguna es rechazada.

  ```js
  // jQuery
  $.when($promise1, $promise2).done((promise1Result, promise2Result) => {
  });

  // Nativo
  Promise.all([promise1, promise2]).then(([promise1Result, promise2Result]) => {});

  // Nativo (async/await)
  const [promise1Result, promise2Result] = await Promise.all([promise1, promise2]);
  ```

- [7.3](#7.3) <a name='7.3'></a> Deferred

  Deferred es una manera de crear promesas.

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

  // Nativo
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

  // Deferred
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

**[⬆ volver al inicio](#tabla-de-contenidos)**

## Animaciones

La [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) (`el.animate()`) es el equivalente nativo más cercano a los efectos de jQuery: recibe una duración en milisegundos, se ejecuta fuera del hilo principal cuando es posible y devuelve un objeto `Animation` cuya promesa `finished` se resuelve cuando la animación termina.

- [8.1](#8.1) <a name='8.1'></a> Mostrar y ocultar

  ```js
  // jQuery
  $el.show();
  $el.hide();

  // Nativo
  el.style.display = ''; // o 'block', 'inline', ... si una hoja de estilos lo oculta
  el.style.display = 'none';

  // Nativo (si el estilo `display` del elemento no se define en otro lugar)
  el.hidden = false;
  el.hidden = true;
  ```

- [8.2](#8.2) <a name='8.2'></a> Toggle

  Muestra u oculta el elemento

  ```js
  // jQuery
  $el.toggle();

  // Nativo
  if (getComputedStyle(el).display === 'none') {
    el.style.display = ''; // o 'block', 'inline', ...
  } else {
    el.style.display = 'none';
  }
  ```

- [8.3](#8.3) <a name='8.3'></a> FadeIn & FadeOut

  ```js
  // jQuery
  $el.fadeIn(3000);
  $el.fadeOut(3000);

  // Nativo fadeIn
  function fadeIn(el, ms = 400) {
    el.style.display = '';
    return el.animate([{ opacity: 0 }, { opacity: 1 }], ms).finished;
  }

  // Nativo fadeOut
  function fadeOut(el, ms = 400) {
    return el.animate([{ opacity: 1 }, { opacity: 0 }], ms).finished.then(() => {
      el.style.display = 'none';
    });
  }
  ```

- [8.4](#8.4) <a name='8.4'></a> FadeTo

  Ajusta la opacidad del elemento

  ```js
  // jQuery
  $el.fadeTo('slow',0.15);
  // Nativo ('slow' equivale a 600 milisegundos en jQuery)
  el.animate([{ opacity: 0.15 }], { duration: 600, fill: 'forwards' });
  ```

- [8.5](#8.5) <a name='8.5'></a> FadeToggle

  Muestra u oculta el emento animando su opacidad.

  ```js
  // jQuery
  $el.fadeToggle();

  // Nativo, usando fadeIn y fadeOut de 8.3
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

  // Nativo slideUp
  function slideUp(el, ms = 400) {
    el.style.overflow = 'hidden';
    return el.animate([{ height: `${el.offsetHeight}px` }, { height: '0px' }], ms).finished.then(() => {
      el.style.display = 'none';
      el.style.overflow = '';
    });
  }

  // Nativo slideDown
  function slideDown(el, ms = 400) {
    el.style.display = '';
    el.style.overflow = 'hidden';
    return el.animate([{ height: '0px' }, { height: `${el.scrollHeight}px` }], ms).finished.then(() => {
      el.style.overflow = '';
    });
  }
  ```

- [8.7](#8.7) <a name='8.7'></a> SlideToggle

  Muestra u oculta el elemento con una animación de deslizamiento.

  ```js
  // jQuery
  $el.slideToggle();

  // Nativo, usando slideUp y slideDown de 8.6
  if (getComputedStyle(el).display === 'none') {
    slideDown(el);
  } else {
    slideUp(el);
  }
  ```

- [8.8](#8.8) <a name='8.8'></a> Animate

  Realiza una animación personalizada de un conjunto de propiedades CSS.

  ```js
  // jQuery
  $el.animate({ params }, speed);

  // Nativo (speed en milisegundos)
  el.animate([params], { duration: speed, fill: 'forwards' });
  ```

## Alternativas

* [Quizá no necesites jQuery](https://youmightnotneedjquery.com/) - Ejemplos de como hacer un evento común, un elemento, ajax, etc, con Javascript puro.
* [MDN Web Docs](https://developer.mozilla.org/es/docs/Web/API/Document_Object_Model) - Referencia de todas las API del DOM que se usan aquí.
* [Baseline](https://web.dev/baseline) - Consulta qué funcionalidades de la plataforma web se pueden usar con seguridad en todos los navegadores.

## Navegadores soportados

![Chrome][chrome-image] | ![Edge][edge-image] | ![Firefox][firefox-image] | ![Safari][safari-image] | ![Opera][opera-image]
--- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ |

Algunos ejemplos usan APIs más recientes: `Promise.withResolvers()` (2024), `el.replaceChildren()` (2020) y `AbortSignal.timeout()` (2022). Consulta [Baseline](https://web.dev/baseline) si necesitas dar soporte a navegadores más antiguos.

# Licencia

MIT

[chrome-image]: https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png
[firefox-image]: https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png
[edge-image]: https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png
[opera-image]: https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png
[safari-image]: https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png
