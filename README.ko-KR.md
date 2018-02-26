## You Don't Need jQuery

오늘날 프론트엔드 개발 환경은 급격히 진화하고 있고, 모던 브라우저들은 이미 충분히 많은 DOM/BOM API들을 구현했습니다. 우리는 jQuery를 DOM 처리나 이벤트를 위해 처음부터 배울 필요가 없습니다. React, Angular, Vue같은 프론트엔드 라이브러리들이 주도권을 차지하는 동안 DOM을 바로 처리하는 것은 안티패턴이 되었고, jQuery의 중요성은 줄어들었습니다. 이 프로젝트는 대부분의 jQuery 메소드의 대안을 IE 10 이상을 지원하는 네이티브 구현으로 소개합니다.

## 목차

1. [번역](#번역)
1. [Query Selector](#query-selector)
1. [CSS & Style](#css--style)
1. [DOM 조작](#dom-조작)
1. [Ajax](#ajax)
1. [이벤트](#이벤트)
1. [유틸리티](#유틸리티)
1. [Promises](#promises)
1. [Animation](#animation)
1. [대안방법](#대안방법)
1. [브라우저 지원](#브라우저-지원)

## 번역

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

평범한 class, id, attribute같은 selector는 `document.querySelector`나 `document.querySelectorAll`으로 대체할 수 있습니다.
* `document.querySelector`는 처음 매칭된 엘리먼트를 반환합니다.
* `document.querySelectorAll`는 모든 매칭된 엘리먼트를 NodeList로 반환합니다. `Array.prototype.slice.call(document.querySelectorAll(selector));`을 사용해서 Array로 변환할 수 있습니다.
* 만약 매칭된 엘리멘트가 없으면 jQuery와 `document.querySelectorAll`는 `[]` 를 반환하지만 `document.querySelector`는 `null`을 반환합니다.

> 안내: `document.querySelector`와 `document.querySelectorAll`는 꽤 **느립니다**, `getElementById`나 `document.getElementsByClassName`, `document.getElementsByTagName`를 사용하면 퍼포먼스가 향상을 기대할 수 있습니다.

- [1.0](#1.0) <a name='1.0'></a> selector로 찾기

  ```js
  // jQuery
  $('selector');

  // Native
  document.querySelectorAll('selector');
  ```

- [1.1](#1.1) <a name='1.1'></a> class로 찾기

  ```js
  // jQuery
  $('.class');

  // Native
  document.querySelectorAll('.class');

  // or
  document.getElementsByClassName('class');
  ```

- [1.2](#1.2) <a name='1.2'></a> id로 찾기

  ```js
  // jQuery
  $('#id');

  // Native
  document.querySelector('#id');

  // or
  document.getElementById('id');
  ```

- [1.3](#1.3) <a name='1.3'></a> 속성(attribute)으로 찾기

  ```js
  // jQuery
  $('a[target=_blank]');

  // Native
  document.querySelectorAll('a[target=_blank]');
  ```

- [1.4](#1.4) <a name='1.4'></a> 자식에서 찾기

  ```js
  // jQuery
  $el.find('li');

  // Native
  el.querySelectorAll('li');
  ```

- [1.5](#1.5) <a name='1.5'></a> 형제/이전/다음 엘리먼트 찾기

  + 형제 엘리먼트

    ```js
    // jQuery
    $el.siblings();

    // Native - latest, Edge13+
    [...el.parentNode.children].filter((child) =>
      child !== el
    );
    // Native (alternative) - latest, Edge13+
    Array.from(el.parentNode.children).filter((child) =>
      child !== el
    );
    // Native - IE10+
    Array.prototype.filter.call(el.parentNode.children, (child) =>
      child !== el
    );
    ```

  + 이전 엘리먼트

    ```js
    // jQuery
    $el.prev();

    // Native
    el.previousElementSibling;
    ```

  + 다음 엘리먼트

    ```js
    // jQuery
    $el.next();

    // Native
    el.nextElementSibling;
    ```

- [1.6](#1.6) <a name='1.6'></a> Closest

  현재 엘리먼트부터 document로 이동하면서 주어진 셀렉터와 일치하는 가장 가까운 엘리먼트를 반환합니다.

  ```js
  // jQuery
  $el.closest(selector);

  // Native - 최신 브라우저만, IE는 미지원
   el.closest(selector);

  // Native - IE10 이상
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

- [1.7](#1.7) <a name='1.7'></a> Parents Until

  주어진 셀렉터에 매칭되는 엘리먼트를 찾기까지 부모 태그들을 위로 올라가며 탐색하여 저장해두었다가 DOM 노드 또는 jQuery object로 반환합니다.

  ```js
  // jQuery
  $el.parentsUntil(selector, filter);

  // Native
  function parentsUntil(el, selector, filter) {
    const result = [];
    const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;

    // match start from parent
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

- [1.8](#1.8) <a name='1.8'></a> Form

  + Input/Textarea

    ```js
    // jQuery
    $('#my-input').val();

    // Native
    document.querySelector('#my-input').value;
    ```

  + e.currentTarget이 몇 번째 `.radio` 인지 구하기

    ```js
    // jQuery
    $(e.currentTarget).index('.radio');

    // Native
    Array.prototype.indexOf.call(document.querySelectorAll('.radio'), e.currentTarget);
    ```

- [1.9](#1.9) <a name='1.9'></a> Iframe Contents

  `$('iframe').contents()`는 iframe에 한정해서 `contentDocument`를 반환합니다.

  + Iframe contents

    ```js
    // jQuery
    $iframe.contents();

    // Native
    iframe.contentDocument;
    ```

  + Iframe에서 찾기

    ```js
    // jQuery
    $iframe.contents().find('.css');

    // Native
    iframe.contentDocument.querySelectorAll('.css');
    ```

- [1.10](#1.10) <a name='1.10'></a> body 얻기

  ```js
  // jQuery
  $('body');

  // Native
  document.body;
  ```

- [1.11](#1.11) <a name='1.11'></a> 속성 얻기 및 설정

  + 속성 얻기

    ```js
    // jQuery
    $el.attr('foo');

    // Native
    el.getAttribute('foo');
    ```
  + 속성 설정하기

    ```js
    // jQuery, DOM 변형 없이 메모리에서 작동됩니다.
    $el.attr('foo', 'bar');

    // Native
    el.setAttribute('foo', 'bar');
    ```

  + `data-` 속성 얻기

    ```js
    // jQuery
    $el.data('foo');

    // Native (`getAttribute` 사용)
    el.getAttribute('data-foo');

    // Native (IE 11 이상의 지원만 필요하다면 `dataset`을 사용)
    el.dataset['foo'];
    ```

**[⬆ 목차로 돌아가기](#목차)**

## CSS & Style

- [2.1](#2.1) <a name='2.1'></a> CSS

  + style값 얻기

    ```js
    // jQuery
    $el.css("color");

    // Native
    // NOTE: 알려진 버그로, style값이 'auto'이면 'auto'를 반환합니다.
    const win = el.ownerDocument.defaultView;
    // null은 가상 스타일은 반환하지 않음을 의미합니다.
    win.getComputedStyle(el, null).color;
    ```

  + style값 설정하기

    ```js
    // jQuery
    $el.css({ color: '#f01' });

    // Native
    el.style.color = '#f01';
    ```

  + Style값들을 동시에 얻거나 설정하기

    만약 한번에 여러 style값을 바꾸고 싶다면 oui-dom-utils 패키지의 [setStyles](https://github.com/oneuijs/oui-dom-utils/blob/master/src/index.js#L194)를 사용해보세요.


  + class 추가하기

    ```js
    // jQuery
    $el.addClass(className);

    // Native
    el.classList.add(className);
    ```

  + class 제거하기

    ```js
    // jQuery
    $el.removeClass(className);

    // Native
    el.classList.remove(className);
    ```

  + class를 포함하고 있는지 검사하기

    ```js
    // jQuery
    $el.hasClass(className);

    // Native
    el.classList.contains(className);
    ```

  + class 토글하기

    ```js
    // jQuery
    $el.toggleClass(className);

    // Native
    el.classList.toggle(className);
    ```

- [2.2](#2.2) <a name='2.2'></a> 폭과 높이

  폭과 높이는 이론상 동일합니다. 높이로 예를 들겠습니다.

  + Window의 높이

    ```js
    // window 높이
    $(window).height();
    // jQuery처럼 스크롤바를 제외하기
    window.document.documentElement.clientHeight;
    // 스크롤바 포함
    window.innerHeight;
    ```

  + 문서 높이

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

  + Element 높이

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

    // 정수로 정확하게（`border-box`일 때 이 값은 `height - border`이고, `content-box`일 때, 이 값은 `height + padding`）
    el.clientHeight;

    // 실수로 정확하게（`border-box`일 때 이 값은 `height`이고, `content-box`일 때, 이 값은 `height + padding + border`）
    el.getBoundingClientRect().height;
    ```

- [2.3](#2.3) <a name='2.3'></a> Position & Offset

  + Position

    ```js
    // jQuery
    $el.position();

    // Native
    { left: el.offsetLeft, top: el.offsetTop }
    ```

  + Offset

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

- [2.4](#2.4) <a name='2.4'></a> Scroll Top

  ```js
  // jQuery
  $(window).scrollTop();

  // Native
  (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
  ```

**[⬆ 목차로 돌아가기](#목차)**

## DOM 조작

- [3.1](#3.1) <a name='3.1'></a> 제거
  ```js
  // jQuery
  $el.remove();

  // Native
  el.parentNode.removeChild(el);
  ```

- [3.2](#3.2) <a name='3.2'></a> Text

  + text 가져오기

    ```js
    // jQuery
    $el.text();

    // Native
    el.textContent;
    ```

  + text 설정하기

    ```js
    // jQuery
    $el.text(string);

    // Native
    el.textContent = string;
    ```

- [3.3](#3.3) <a name='3.3'></a> HTML

  + HTML 가져오기

    ```js
    // jQuery
    $el.html();

    // Native
    el.innerHTML;
    ```

  + HTML 설정하기

    ```js
    // jQuery
    $el.html(htmlString);

    // Native
    el.innerHTML = htmlString;
    ```

- [3.4](#3.4) <a name='3.4'></a> 해당 엘리먼트의 자식들 뒤에 넣기(Append)

  부모 엘리먼트의 마지막 자식으로 엘리먼트를 추가합니다.

  ```js
  // jQuery
  $el.append('<div id="container">Hello World</div>');

  // Native (HTML 문자열)
  el.insertAdjacentHTML('beforeend', '<div id="container">Hello World</div>');

  // Native (엘리먼트)
  el.appendChild(newEl);
  ```

- [3.5](#3.5) <a name='3.5'></a> 해당 엘리먼트의 자식들 앞에 넣기(Prepend)

  ```js
  // jQuery
  $el.prepend('<div id="container">Hello World</div>');

  // Native (HTML 문자열)
  el.insertAdjacentHTML('afterbegin', '<div id="container">Hello World</div>');

  // Native (엘리먼트)
  el.insertBefore(newEl, el.firstChild);
  ```

- [3.6](#3.6) <a name='3.6'></a> 해당 엘리먼트 앞에 넣기(insertBefore)

  새 노드를 선택한 엘리먼트 앞에 넣습니다.

  ```js
  // jQuery
  $newEl.insertBefore(selector);

  // Native (HTML 문자열)
  el.insertAdjacentHTML('beforebegin ', '<div id="container">Hello World</div>');

  // Native (엘리먼트)
  const el = document.querySelector(selector);
  if (el.parentNode) {
    el.parentNode.insertBefore(newEl, el);
  }
  ```

- [3.7](#3.7) <a name='3.7'></a> 해당 엘리먼트 뒤에 넣기(insertAfter)

  새 노드를 선택한 엘리먼트 뒤에 넣습니다.

  ```js
  // jQuery
  $newEl.insertAfter(selector);

  // Native (HTML 문자열)
  el.insertAdjacentHTML('afterend', '<div id="container">Hello World</div>');

  // Native (엘리먼트)
  onst el = document.querySelector(selector);
  if (el.parentNode) {
    el.parentNode.insertBefore(newEl, el.nextSibling);
  }
  ```
- [3.8](#3.8) <a name='3.8'></a> is

  query selector와 일치하면 `true` 를 반환합니다.

   ```js
  // jQuery
  $el.is(selector);

  // Native
  el.matches(selector);
  ```

- [3.9](#3.9) <a name='3.9'></a> clone

  엘리먼트의 복제본을 만듭니다.

  ```js
  // jQuery
  $el.clone();

  // Native
  el.cloneNode();

  // Deep clone은 파라미터를 `true` 로 설정하세요.
  ```

- [3.10](#3.10) <a name='3.10'></a> empty

  모든 자식 노드를 제거합니다.

  ```js
  // jQuery
  $el.empty();

  // Native
  el.innerHTML = '';
  ```

- [3.11](#3.11) <a name='3.11'></a> wrap

  각각의 엘리먼트를 주어진 HTML 구조로 감쌉니다.

  ```js
  // jQuery
  $('.inner').wrap('<div class="wrapper"></div>');

  // Native
  Array.prototype.forEach.call(document.querySelectorAll('.inner'), (el) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper';
    el.parentNode.insertBefore(wrapper, el);
    el.parentNode.removeChild(el);
    wrapper.appendChild(el);
  });
  ```

- [3.12](#3.12) <a name='3.12'></a> unwrap

  DOM에서 해당 엘리먼트를 감싸고 있는 부모 요소를 없앱니다.

  ```js
  // jQuery
  $('.inner').unwrap();

  // Native
  Array.prototype.forEach.call(document.querySelectorAll('.inner'), (el) => {
    let elParentNode = el.parentNode

    if(elParentNode !== document.body) {
        elParentNode.parentNode.insertBefore(el, elParentNode)
        elParentNode.parentNode.removeChild(elParentNode)
    }
  });
  ```

- [3.13](#3.13) <a name='3.13'></a> replaceWith

  각각의 엘리먼트를 주어진 새 엘리먼트로 교체합니다.

  ```js
  // jQuery
  $('.inner').replaceWith('<div class="outer"></div>');

  // Native
  Array.prototype.forEach.call(document.querySelectorAll('.inner'), (el) => {
    const outer = document.createElement('div');
    outer.className = 'outer';
    el.parentNode.insertBefore(outer, el);
    el.parentNode.removeChild(el);
  });
  ```

  - [3.14](#3.14) <a name='3.14'></a> 간단한 파싱

    문자열을 HTML/SVG/XML 로 파싱합니다.

    ```js
    // jQuery
    $(`<ol>
      <li>a</li>
      <li>b</li>
    </ol>
    <ol>
      <li>c</li>
      <li>d</li>
    </ol>`);

    // Native
    range = document.createRange();
    parse = range.createContextualFragment.bind(range);

    parse(`<ol>
      <li>a</li>
      <li>b</li>
    </ol>
    <ol>
      <li>c</li>
      <li>d</li>
    </ol>`);
    ```

**[⬆ 목차로 돌아가기](#목차)**

## Ajax

[Fetch API](https://fetch.spec.whatwg.org/) 는 XMLHttpRequest를 ajax로 대체하는 새로운 표준 입니다. Chrome과 Firefox에서 작동하며, polyfill을 이용해서 구형 브라우저에서 작동되도록 만들 수도 있습니다.

IE9 이상에서 지원하는 [github/fetch](http://github.com/github/fetch) 혹은 IE8 이상에서 지원하는 [fetch-ie8](https://github.com/camsong/fetch-ie8/), JSONP 요청을 만드는 [fetch-jsonp](https://github.com/camsong/fetch-jsonp)를 이용해보세요.

- [4.1](#4.1) <a name='4.1'></a> 서버로부터 HTML data를 불러와서 매칭된 엘리먼트에 배치.

  ```js
  // jQuery
  $(selector).load(url, completeCallback)

  // Native
  fetch(url).then(data => data.text()).then(data => {
    document.querySelector(selector).innerHTML = data
  }).then(completeCallback)
  ```

**[⬆ 목차로 돌아가기](#목차)**

## 이벤트

namespace와 delegation을 포함해서 완전히 갈아 엎길 원하시면 https://github.com/oneuijs/oui-dom-events 를 고려해보세요.

- [5.0](#5.0) <a name='5.0'></a> `DOMContentLoaded`가 되어 문서가 사용 가능한지

  ```js
  // jQuery
  $(document).ready(eventHandler);

  // Native
  // DOMContentLoaded 가 이미 끝났는지 검사
  if (document.readyState === 'complete' || document.readyState !== 'loading') {
    eventHandler();
  } else {
    document.addEventListener('DOMContentLoaded', eventHandler);
  }
  ```

- [5.1](#5.1) <a name='5.1'></a> 이벤트 Bind 걸기

  ```js
  // jQuery
  $el.on(eventName, eventHandler);

  // Native
  el.addEventListener(eventName, eventHandler);
  ```

- [5.2](#5.2) <a name='5.2'></a> 이벤트 Bind 풀기

  ```js
  // jQuery
  $el.off(eventName, eventHandler);

  // Native
  el.removeEventListener(eventName, eventHandler);
  ```

- [5.3](#5.3) <a name='5.3'></a> 이벤트 발생시키기(Trigger)

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

**[⬆ 목차로 돌아가기](#목차)**

## 유틸리티

- [6.1](#6.1) <a name='6.1'></a> 기본 유틸리티

  + isArray

  주어진 인자가 배열인지 검사합니다.

  ```js
  // jQuery
  $.isArray(array);

  // Native
  Array.isArray(array);
  ```

  + isWindow

  주어진 인자가 window 객체인지 검사합니다.

  ```js
  // jQuery
  $.isWindow(obj);

  // Native
  function isWindow(obj) {
    return obj !== null && obj !== undefined && obj === obj.window;
  }
  ```
  + inArray

  배열에서 해당 값이 있는지 검색하고 해당 값의 순번을 반환합니다. (검색 결과가 없을 경우 -1을 반환)

  ```js
  // jQuery
  $.inArray(item, array);

  // Native
  array.indexOf(item) > -1;

  // ES6 방식
  array.includes(item);
  ```

  + isNumeric

  주어진 인자가 숫자인지 검사합니다.
  검사에 `typeof` 를 사용합니다. 필요하면 라이브러리를 사용하세요. 가끔 `typeof`는 정확하지 않습니다.

  ```js
  // jQuery
  $.isNumeric(item);

  // Native
  function isNumeric(value) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  ```

  + isFunction

  주어진 인자가 JavaScript 함수 객체인지 검사합니다.

  ```js
  // jQuery
  $.isFunction(item);

  // Native
  function isFunction(item) {
    if (typeof item === 'function') {
      return true;
    }
    var type = Object.prototype.toString(item);
    return type === '[object Function]' || type === '[object GeneratorFunction]';
  }
  ```

  + isEmptyObject

  객체가 비어있는지 검사합니다. Check to see if an object is empty (열거할 수 있는 프로퍼티가 없는지 검사).

  ```js
  // jQuery
  $.isEmptyObject(obj);

  // Native
  function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
  }
  ```

  + isPlainObject

  주어진 객체가 평범한 객체인지 검사합니다. (“{}”이나 “new Object”으로 생성되었는지 검사)

  ```js
  // jQuery
  $.isPlainObject(obj);

  // Native
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

  두 개 이상의 객체를 첫 번째 객체로 합칩니다.
  object.assign 은 ES6 API입니다. [polyfill](https://github.com/ljharb/object.assign) 을 사용할 수 있습니다.

  ```js
  // jQuery
  $.extend({}, defaultOpts, opts);

  // Native
  Object.assign({}, defaultOpts, opts);
  ```

  + trim

  문자열 앞뒤에 붙은 공백문자를 제거합니다.

  ```js
  // jQuery
  $.trim(string);

  // Native
  string.trim();
  ```

  + map

  배열이나 객체 내의 모든 요소를 새 배열에 변환하여 저장합니다.

  ```js
  // jQuery
  $.map(array, (value, index) => {
  });

  // Native
  array.map((value, index) => {
  });
  ```

  + each

  객체나 함수 모두에 매끄럽게 사용할 수 있는 포괄적인 용도의 반복 함수입니다.

  ```js
  // jQuery
  $.each(array, (index, value) => {
  });

  // Native
  array.forEach((value, index) => {
  });
  ```

  + grep

  배열에서 필터 함수를 만족하는 엘리먼트를 찾습니다.

  ```js
  // jQuery
  $.grep(array, (value, index) => {
  });

  // Native
  array.filter((value, index) => {
  });
  ```

  + type

  객체의 JavaScript 내부 [[Class]]를 검사합니다.

  ```js
  // jQuery
  $.type(obj);

  // Native
  function type(item) {
    const reTypeOf = /(?:^\[object\s(.*?)\]$)/;
    return Object.prototype.toString.call(item)
      .replace(reTypeOf, '$1')
      .toLowerCase();
  }
  ```

  + merge

  두 배열을 첫 번째 배열로 합칩니다.

  ```js
  // jQuery
  $.merge(array1, array2);

  // Native
  // concat은 중복된 요소를 제거해주진 않습니다.
  function merge(...args) {
    return [].concat(...args)
  }

  // ES6 사용 방식. 중복된 요소를 제거해주진 않습니다.
  array1 = [...array1, ...array2]

  // Set 사용 버전. 중복된 요소는 삭제됩니다.
  function merge(...args) {
    return Array.from(new Set([].concat(...args)))
  }
  ```

  + now

  현재 시간을 숫자로 반환합니다.

  ```js
  // jQuery
  $.now();

  // Native
  Date.now();
  ```

  + proxy

  함수를 받아서 언제나 특정 context를 갖는 새 함수를 반환합니다.

  ```js
  // jQuery
  $.proxy(fn, context);

  // Native
  fn.bind(context);
  ```

  + makeArray

  array-like 한 객체를 진짜 JavaScript 배열로 변환합니다.

  ```js
  // jQuery
  $.makeArray(array);

  // Native
  Array.prototype.slice.call(arrayLike);

  // ES6 사용 방식
  Array.from(arrayLike);
  ```

- [6.2](#6.2) <a name='6.2'></a> Contains

  주어진 엘리먼트가 주어진 또 다른 엘리먼트를 자손으로 포함하는지 검사합니다.

  ```js
  // jQuery
  $.contains(el, child);

  // Native
  el !== child && el.contains(child);
  ```

- [6.3](#6.3) <a name='6.3'></a> Globaleval

  JavaScript 코드를 전역적으로 실행합니다.

  ```js
  // jQuery
  $.globaleval(code);

  // Native
  function Globaleval(code) {
    const script = document.createElement('script');
    script.text = code;

    document.head.appendChild(script).parentNode.removeChild(script);
  }

  // eval 함수를 쓸 수도 있습니다. 하지만 $.Globaleval 의 context가 전역인 데 반해 eval 함수의 context 는 실행 영역입니다.
  eval(code);
  ```

- [6.4](#6.4) <a name='6.4'></a> parse

  + parseHTML

  문자열을 DOM 노드의 배열로 변환합니다.

  ```js
  // jQuery
  $.parseHTML(htmlString);

  // Native
  function parseHTML(string) {
    const context = document.implementation.createHTMLDocument();

    // 생성된 도큐먼트를 위해 base href를 지정해서 URL이 있는 엘리먼트들은 도큐먼트 기준으로 처리됩니다.
    const base = context.createElement('base');
    base.href = document.location.href;
    context.head.appendChild(base);

    context.body.innerHTML = string;
    return context.body.children;
  }
  ```

  + parseJSON

  정상적인 JSON 문자열을 받아서 JavaScript 값을 받습니다.

  ```js
  // jQuery
  $.parseJSON(str);

  // Native
  JSON.parse(str);
  ```

**[⬆ 목차로 돌아가기](#목차)**

## Promises

Promise는 비동기적인 작업의 결과를 표현합니다. jQuery는 자체적인 promise 처리를 가지고 있습니다. 네이티브 JavaScript엔 [Promises/A+](http://promises-aplus.github.io/promises-spec/) 명세에 맞는 얇고 작은 API를 구현되어 있습니다.

- [7.1](#7.1) <a name='7.1'></a> done, fail, always

  `done`은 promise가 처리되었을 때, `fail`은 promise가 거절되었을 때, `always`는 promise가 어떻게 되었건 실행됩니다.

  ```js
  // jQuery
  $promise.done(doneCallback).fail(failCallback).always(alwaysCallback)

  // Native
  promise.then(doneCallback, failCallback).then(alwaysCallback, alwaysCallback)
  ```

- [7.2](#7.2) <a name='7.2'></a> when

  `when`은 여러 개의 promise들을 처리할 때 사용됩니다. 이것은 모든 promise가 처리되었을 때 resolve하고 하나라도 거절되면 reject합니다.

  ```js
  // jQuery
  $.when($promise1, $promise2).done((promise1Result, promise2Result) => {
  });

  // Native
  Promise.all([$promise1, $promise2]).then([promise1Result, promise2Result] => {});
  ```

- [7.3](#7.3) <a name='7.3'></a> Deferred

  Deferred는 promise를 생성하는 방법입니다.

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

  // Native
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

  // Deferred way
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

**[⬆ 목차로 돌아가기](#목차)**

## Animation

- [8.1](#8.1) <a name='8.1'></a> Show & Hide

  ```js
  // jQuery
  $el.show();
  $el.hide();

  // Native
  // show 메소드에 대한 더 자세한 정보를 보고 싶으면  https://github.com/oneuijs/oui-dom-utils/blob/master/src/index.js#L363 를 참고하세요
  el.style.display = ''|'inline'|'inline-block'|'inline-table'|'block';
  el.style.display = 'none';
  ```

- [8.2](#8.2) <a name='8.2'></a> Toggle

  엘리먼트를 출력하거나 숨깁니다.

  ```js
  // jQuery
  $el.toggle();

  // Native
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

  // Native
  el.style.transition = 'opacity 3s';
  // fadeIn
  el.style.opacity = '1';
  // fadeOut
  el.style.opacity = '0';
  ```

- [8.4](#8.4) <a name='8.4'></a> FadeTo

  엘리먼트의 투명도(opacity)를 조정합니다.

  ```js
  // jQuery
  $el.fadeTo('slow',0.15);
  // Native
  el.style.transition = 'opacity 3s'; // 'slow'가 3초라고 가정합니다.
  el.style.opacity = '0.15';
  ```

- [8.5](#8.5) <a name='8.5'></a> FadeToggle

  엘리먼트를 투명도를 조절해서 보여주거나 숨깁니다.

  ```js
  // jQuery
  $el.fadeToggle();

  // Native
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

  // Native
  const originHeight = '100px';
  el.style.transition = 'height 3s';
  // slideUp
  el.style.height = '0px';
  // slideDown
  el.style.height = originHeight;
  ```

- [8.7](#8.7) <a name='8.7'></a> SlideToggle

  슬라이딩 모션과 함께 엘리먼트를 보이거나 숨깁니다.

  ```js
  // jQuery
  $el.slideToggle();

  // Native
  const originHeight = '100px';
  el.style.transition = 'height 3s';
  const { height } = el.ownerDocument.defaultView.getComputedStyle(el, null);
  if (parseInt(height, 10) === 0) {
    el.style.height = originHeight;
  }
  else {
   el.style.height = '0px';
  }
  ```

- [8.8](#8.8) <a name='8.8'></a> Animate

  자체적으로 CSS 프로퍼티들을 에니메이션합니다.

  ```js
  // jQuery
  $el.animate({ params }, speed);

  // Native
  el.style.transition = 'all ' + speed;
  Object.keys(params).forEach((key) =>
    el.style[key] = params[key];
  )
  ```

**[⬆ 목차로 돌아가기](#목차)**

## 대안방법

* [You Might Not Need jQuery](http://youmightnotneedjquery.com/) - 일반 자바스크립트로 공통이벤트, 엘리먼트, ajax 등을 다루는 방법 예제.
* [npm-dom](http://github.com/npm-dom) 과 [webmodules](http://github.com/webmodules) - 개별 DOM모듈을 NPM에서 찾을 수 있습니다.

## Browser Support

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
