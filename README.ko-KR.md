## You (Might) Don't Need jQuery

오늘날 프론트엔드 개발 환경은 급격히 진화하고 있고, 모던 브라우저들은 이미 충분히 많은 DOM/BOM API들을 구현했습니다. 우리는 jQuery를 DOM 처리나 이벤트를 위해 처음부터 배울 필요가 없습니다. React, Angular, Vue같은 프론트엔드 라이브러리들이 주도권을 차지하는 동안 DOM을 바로 처리하는 것은 안티패턴이 되었고, jQuery의 중요성은 줄어들었습니다. 이 프로젝트는 대부분의 jQuery 메소드의 대안을 네이티브 JavaScript 구현으로 소개합니다.

예제 코드는 현재의 에버그린 브라우저(Chrome, Edge, Firefox, Safari)를 대상으로 합니다. Internet Explorer는 더 이상 Microsoft의 지원을 받지 않으므로 IE 전용 대체 코드는 제거했습니다. 여전히 필요하다면 [IE를 지원하는 마지막 버전](https://github.com/camsong/You-Dont-Need-jQuery/tree/c4e00b3)을 참고하세요.

노트: jQuery는 여전히 훌륭한 라이브러리이며 많은 유즈 케이스를 갖고 있습니다. 원하지 않으신다면 마이그레이트하지 않으셔도됩니다.

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

평범한 class, id, attribute같은 selector는 `document.querySelector`나 `document.querySelectorAll`으로 대체할 수 있습니다.
* `document.querySelector`는 처음 매칭된 엘리먼트를 반환합니다.
* `document.querySelectorAll`는 모든 매칭된 엘리먼트를 정적(static) NodeList로 반환합니다. `forEach`를 지원하며, `Array.from(document.querySelectorAll(selector))` 또는 [makeArray](#makeArray)에 소개된 방법으로 Array로 변환할 수 있습니다.
* 만약 매칭된 엘리먼트가 없으면 jQuery는 빈 jQuery 객체를, `document.querySelectorAll`는 빈 NodeList를 반환하지만 `document.querySelector`는 `null`을 반환합니다.

> 안내: `document.getElementById`, `document.getElementsByClassName`, `document.getElementsByTagName`은 `querySelector*`보다 약간 빠르지만, `getElementsBy*`는 DOM이 바뀌면 함께 바뀌는 *live* HTMLCollection을 반환합니다. 직접 측정해서 병목을 확인한 경우가 아니라면 `querySelector*`를 사용하세요.

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

  // 또는
  document.getElementsByClassName('class');
  ```

- [1.2](#1.2) <a name='1.2'></a> id로 찾기

  ```js
  // jQuery
  $('#id');

  // Native
  document.querySelector('#id');

  // 또는
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

    // Native
    [...el.parentNode.children].filter((child) =>
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

  + 모든 이전 형제 엘리먼트

    ```js
    // jQuery (선택적 필터 셀렉터)
    $el.prevAll($filter);

    // Native (선택적 필터 함수)
    function getPreviousSiblings(elem, filter) {
      const sibs = [];
      while ((elem = elem.previousElementSibling)) {
        if (!filter || filter(elem)) sibs.push(elem);
      }
      return sibs;
    }
    ```

  + 모든 다음 형제 엘리먼트

    ```js
    // jQuery (선택적 셀렉터 필터)
    $el.nextAll($filter);

    // Native (선택적 필터 함수)
    function getNextSiblings(elem, filter) {
      const sibs = [];
      while ((elem = elem.nextElementSibling)) {
        if (!filter || filter(elem)) sibs.push(elem);
      }
      return sibs;
    }
    ```

    필터 함수 예제:

    ```js
    function exampleFilter(elem) {
      switch (elem.nodeName.toUpperCase()) {
        case 'DIV':
          return true;
        case 'SPAN':
          return true;
        default:
          return false;
      }
    }
    ```

- [1.6](#1.6) <a name='1.6'></a> Closest

  현재 엘리먼트부터 document로 이동하면서 주어진 셀렉터와 일치하는 가장 가까운 엘리먼트를 반환합니다.

  ```js
  // jQuery
  $el.closest(selector);

  // Native
  el.closest(selector);
  ```

- [1.7](#1.7) <a name='1.7'></a> Parents Until

  주어진 셀렉터에 매칭되는 엘리먼트를 찾기까지 부모 태그들을 위로 올라가며 탐색하여 저장해두었다가 DOM 노드 또는 jQuery object로 반환합니다.

  ```js
  // jQuery
  $el.parentsUntil(selector, filter);

  // Native
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

    // Native
    document.querySelector('#my-input').value;
    ```

  + e.currentTarget이 몇 번째 `.radio` 인지 구하기

    ```js
    // jQuery
    $('.radio').index(e.currentTarget);

    // Native
    [...document.querySelectorAll('.radio')].indexOf(e.currentTarget);
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
    // jQuery
    $el.attr('foo', 'bar');

    // Native
    el.setAttribute('foo', 'bar');
    ```

  + `data-` 속성 얻기

    ```js
    // jQuery
    $el.data('foo');

    // Native
    el.dataset.foo;

    // 또는
    el.getAttribute('data-foo');
    ```

- [1.12](#1.12) <a name='1.12'></a> 문자열을 포함하는 셀렉터(대소문자 구분)

    ```js
    // jQuery
    $("selector:contains('text')");

    // Native
    function contains(selector, text) {
      const elements = document.querySelectorAll(selector);
      return Array.from(elements).filter((element) =>
        element.textContent.includes(text)
      );
    }
    ```

**[⬆ 목차로 돌아가기](#목차)**

## CSS & Style

- [2.1](#2.1) <a name='2.1'></a> CSS

  + style값 얻기

    ```js
    // jQuery
    $el.css('color');

    // Native
    // NOTE: '#f01'이 아니라 'rgb(255, 0, 17)'처럼 계산된 값(resolved value)을 반환합니다.
    getComputedStyle(el).color;
    ```

  + style값 설정하기

    ```js
    // jQuery
    $el.css({ color: '#f01' });

    // Native
    el.style.color = '#f01';
    ```

  + 여러 style값을 한 번에 설정하기

    ```js
    // jQuery
    $el.css({ color: '#f01', 'border-color': '#f02' });

    // Native
    Object.assign(el.style, { color: '#f01', borderColor: '#f02' });
    ```

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
    // jQuery
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

    // 정수로 정확하게 (`border-box`일 때 이 값은 `height - border`이고, `content-box`일 때, 이 값은 `height + padding`)
    el.clientHeight;

    // 실수로 정확하게 (`border-box`일 때 이 값은 `height`이고, `content-box`일 때, 이 값은 `height + padding + border`)
    el.getBoundingClientRect().height;
    ```

- [2.3](#2.3) <a name='2.3'></a> Position & Offset

  + Position

    오프셋 부모를 기준으로 엘리먼트의 현재 위치를 얻습니다.

    ```js
    // jQuery
    $el.position();

    // Native
    const position = { left: el.offsetLeft, top: el.offsetTop };
    ```

  + Offset

    다큐먼트를 기준으로 엘리먼트의 현재 위치를 얻습니다.

    ```js
    // jQuery
    $el.offset();

    // Native
    function getOffset (el) {
      const box = el.getBoundingClientRect();

      return {
        top: box.top + window.scrollY,
        left: box.left + window.scrollX
      };
    }
    ```

- [2.4](#2.4) <a name='2.4'></a> Scroll Top

  엘리먼트에대한 스크롤바의 현재 수직 위치를 얻습니다.

  ```js
  // jQuery
  $(window).scrollTop();

  // Native
  window.scrollY;
  ```

**[⬆ 목차로 돌아가기](#목차)**

## DOM 조작

- [3.1](#3.1) <a name='3.1'></a> 제거

  DOM으로부터 엘리먼트를 제거합니다.

  ```js
  // jQuery
  $el.remove();

  // Native
  el.remove();
  ```

- [3.2](#3.2) <a name='3.2'></a> Text

  + text 가져오기

    자손을 포함하는 엘리먼트의 결합된 텍스트 컨텐츠를 얻습니다.

    ```js
    // jQuery
    $el.text();

    // Native
    el.textContent;
    ```

  + text 설정하기

    엘리먼트의 컨텐츠를 지정한 텍스트로 설정합니다.
  
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

  부모 엘리먼트의 마지막 자식 다음으로 엘리먼트를 추가합니다.

  ```js
  // jQuery: DOMString과 Node 객체를 위한 통합된 구문
  $parent.append(newEl | '<div id="container">Hello World</div>');

  // Native (엘리먼트 또는 텍스트): 문자열은 HTML로 파싱되지 않고 일반 텍스트로 삽입됩니다
  parent.append(newEl | 'Hello World');

  // Native (HTML 문자열)
  parent.insertAdjacentHTML('beforeend', '<div id="container">Hello World</div>');
  ```

- [3.5](#3.5) <a name='3.5'></a> 해당 엘리먼트의 자식들 앞에 넣기(Prepend)

  ```js
  // jQuery: DOMString과 Node 객체를 위한 통합된 구문
  $parent.prepend(newEl | '<div id="container">Hello World</div>');

  // Native (엘리먼트 또는 텍스트): 문자열은 HTML로 파싱되지 않고 일반 텍스트로 삽입됩니다
  parent.prepend(newEl | 'Hello World');

  // Native (HTML 문자열)
  parent.insertAdjacentHTML('afterbegin', '<div id="container">Hello World</div>');
  ```

- [3.6](#3.6) <a name='3.6'></a> 해당 엘리먼트 앞에 넣기(insertBefore)

  새 노드를 선택한 엘리먼트 앞에 넣습니다.

  ```js
  // jQuery
  $newEl.insertBefore(selector);

  const el = document.querySelector(selector);

  // Native (엘리먼트)
  el.before(newEl);

  // Native (HTML 문자열)
  el.insertAdjacentHTML('beforebegin', '<div id="container">Hello World</div>');
  ```

- [3.7](#3.7) <a name='3.7'></a> 해당 엘리먼트 뒤에 넣기(insertAfter)

  새 노드를 선택한 엘리먼트 뒤에 넣습니다.

  ```js
  // jQuery
  $newEl.insertAfter(selector);

  const el = document.querySelector(selector);

  // Native (엘리먼트)
  el.after(newEl);

  // Native (HTML 문자열)
  el.insertAdjacentHTML('afterend', '<div id="container">Hello World</div>');
  ```

- [3.8](#3.8) <a name='3.8'></a> is

  query selector와 일치하면 `true` 를 반환합니다.

  ```js
  // jQuery - `is`는 함수, 존재하는 jQuery 객체 또는 여기에서 언급하지 않은 DOM 엘리먼트와도 동작함을 알립니다.
  $el.is(selector);

  // Native
  el.matches(selector);
  ```
- [3.9](#3.9) <a name='3.9'></a> clone

  엘리먼트의 깊은 복사본을 생성합니다. 일치한 엘리먼트를 포함해 그 자손 노드와 텍스트 노드를 모두 복사합니다.

  ```js
  // jQuery. 이벤트 핸들러와 데이터까지 복사하려면 `true`를 전달하세요.
  $el.clone();

  // Native. 깊은 복사를 하려면 `true`를 전달하세요. 이벤트 리스너는 어떤 경우에도 복사되지 않습니다.
  el.cloneNode(true);
  ```

- [3.10](#3.10) <a name='3.10'></a> empty

  모든 자식 노드를 제거합니다.

  ```js
  // jQuery
  $el.empty();

  // Native
  el.replaceChildren();
  ```

- [3.11](#3.11) <a name='3.11'></a> wrap

  각각의 엘리먼트를 주어진 HTML 구조로 감쌉니다.

  ```js
  // jQuery
  $('.inner').wrap('<div class="wrapper"></div>');

  // Native
  document.querySelectorAll('.inner').forEach((el) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper';
    el.before(wrapper);
    wrapper.append(el);
  });
  ```

- [3.12](#3.12) <a name='3.12'></a> unwrap

  DOM에서 해당 엘리먼트를 감싸고 있는 부모 요소를 없앱니다.

  ```js
  // jQuery
  $('.inner').unwrap();

  // Native
  new Set([...document.querySelectorAll('.inner')].map((el) => el.parentElement))
    .forEach((parent) => {
      if (parent !== document.body) {
        parent.replaceWith(...parent.childNodes);
      }
    });
  ```

- [3.13](#3.13) <a name='3.13'></a> replaceWith

  각각의 엘리먼트를 주어진 새 엘리먼트로 교체합니다.

  ```js
  // jQuery
  $('.inner').replaceWith('<div class="outer"></div>');

  // Native
  document.querySelectorAll('.inner').forEach((el) => {
    const outer = document.createElement('div');
    outer.className = 'outer';
    el.replaceWith(outer);
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
  function parse(html) {
    const template = document.createElement('template');
    template.innerHTML = html;
    return template.content;
  }

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

[Fetch API](https://fetch.spec.whatwg.org/)는 XMLHttpRequest를 대체하는 표준이며, 모든 모던 브라우저에서 작동합니다. `$.ajax`와 달리 `fetch`는 404나 500 같은 HTTP 오류 상태에서도 reject되지 **않으므로**, `response.ok`를 직접 확인해야 합니다. JSONP 요청에는 [fetch-jsonp](https://github.com/camsong/fetch-jsonp)를 이용해보세요.

- [4.0](#4.0) <a name='4.0'></a> JSON 요청하기

  ```js
  // jQuery
  $.getJSON(url).done(handleData).fail(handleError);

  // Native
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

- [4.0.1](#4.0.1) <a name='4.0.1'></a> JSON POST 요청하기

  ```js
  // jQuery
  $.ajax({
    url,
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(data),
  });

  // Native
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  ```

- [4.0.2](#4.0.2) <a name='4.0.2'></a> 요청 중단 및 타임아웃

  ```js
  // jQuery
  const jqXHR = $.ajax({ url, timeout: 5000 });
  jqXHR.abort();

  // Native
  const controller = new AbortController();
  fetch(url, { signal: controller.signal });
  controller.abort();

  // Native (타임아웃)
  fetch(url, { signal: AbortSignal.timeout(5000) });
  ```

- [4.1](#4.1) <a name='4.1'></a> 서버로부터 HTML data를 불러와서 매칭된 엘리먼트에 배치.

  ```js
  // jQuery
  $(selector).load(url, completeCallback)

  // Native
  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      document.querySelector(selector).innerHTML = html;
    })
    .then(completeCallback);
  ```

**[⬆ 목차로 돌아가기](#목차)**

## 이벤트

- [5.0](#5.0) <a name='5.0'></a> `DOMContentLoaded`가 되어 문서가 사용 가능한지

  ```js
  // jQuery
  $(document).ready(eventHandler);

  // Native
  // DOMContentLoaded가 이미 완료되었는지를 확인
  if (document.readyState !== 'loading') {
    eventHandler();
  } else {
    document.addEventListener('DOMContentLoaded', eventHandler);
  }

  // 또는 스크립트를 `<script defer>`나 `<script type="module">`로 불러오세요.
  // 이렇게 불러온 스크립트는 문서 파싱이 끝난 뒤에 실행됩니다.
  ```

- [5.1](#5.1) <a name='5.1'></a> 이벤트 Bind 걸기

  ```js
  // jQuery
  $el.on(eventName, eventHandler);

  // Native
  el.addEventListener(eventName, eventHandler);
  ```

- [5.1.1](#5.1.1) <a name='5.1.1'></a> 이벤트 한 번만 Bind 걸기(one)

  ```js
  // jQuery
  $el.one(eventName, eventHandler);

  // Native
  el.addEventListener(eventName, eventHandler, { once: true });
  ```

- [5.1.2](#5.1.2) <a name='5.1.2'></a> 이벤트 위임(Delegation)

  ```js
  // jQuery
  $el.on(eventName, selector, eventHandler);

  // Native
  el.addEventListener(eventName, (event) => {
    const target = event.target.closest(selector);
    if (target && el.contains(target)) {
      eventHandler.call(target, event);
    }
  });
  ```

- [5.2](#5.2) <a name='5.2'></a> 이벤트 Bind 풀기

  ```js
  // jQuery
  $el.off(eventName, eventHandler);

  // Native
  el.removeEventListener(eventName, eventHandler);

  // Native: jQuery 네임스페이스처럼 여러 리스너를 한 번에 제거하기
  const controller = new AbortController();
  el.addEventListener('click', onClick, { signal: controller.signal });
  el.addEventListener('keydown', onKeydown, { signal: controller.signal });
  controller.abort();
  ```

- [5.3](#5.3) <a name='5.3'></a> 이벤트 발생시키기(Trigger)

  ```js
  // jQuery
  $(el).trigger('custom-event', {key1: 'data'});

  // Native. jQuery 이벤트는 버블링되지만, 네이티브 이벤트는 `bubbles: true`를 지정해야 버블링됩니다.
  // 핸들러에서는 `event.detail`로 데이터를 읽습니다.
  const event = new CustomEvent('custom-event', {
    bubbles: true,
    cancelable: true,
    detail: { key1: 'data' },
  });

  el.dispatchEvent(event);
  ```

**[⬆ 목차로 돌아가기](#목차)**

## 유틸리티

대부분의 jQuery 유틸은 네이티브 API에서도 찾을 수 있습니다. 다른 향상된 기능들은 지속성과 성능에 중점을 둔 더 나은 유틸 라이브러리로부터 선택할 수 있습니다. 권장하는 대안은 [Lodash](https://lodash.com)와 [es-toolkit](https://es-toolkit.dev)입니다.

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
    return obj != null && obj === obj.window;
  }
  ```

  + inArray

  배열에서 해당 값이 있는지 검색하고 해당 값의 순번을 반환합니다. (검색 결과가 없을 경우 -1을 반환)

  ```js
  // jQuery
  $.inArray(item, array);

  // Native
  array.indexOf(item);
  ```

  배열에 해당 값이 있는지 검사합니다.

  ```js
  // jQuery
  $.inArray(item, array) > -1;

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
  function isNumeric(n) {
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
    var type = Object.prototype.toString.call(item);
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
    if (Object.prototype.toString.call(obj) !== '[object Object]') {
      return false;
    }

    const proto = Object.getPrototypeOf(obj);
    return proto === null || proto === Object.prototype;
  }
  ```

  + extend

  두 개 이상의 객체를 첫 번째 객체로 합칩니다.
  `deep` 없이 호출한 `$.extend`와 마찬가지로, `Object.assign`과 spread는 얕은 복사만 합니다.

  ```js
  // jQuery
  $.extend({}, object1, object2);

  // Native
  Object.assign({}, object1, object2);

  // Native (spread 연산자)
  ({ ...object1, ...object2 });
  ```

  객체 하나를 깊은 복사하기:

  ```js
  // jQuery
  $.extend(true, {}, object);

  // Native. 함수와 DOM 노드는 복제할 수 없습니다
  structuredClone(object);
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

  객체나 배열 모두에 매끄럽게 사용할 수 있는 포괄적인 용도의 반복 함수입니다.

  ```js
  // jQuery (`false`를 반환하면 반복을 중단합니다)
  $.each(array, (index, value) => {
  });

  // Native (중간에 반복을 멈춰야 한다면 `for...of`나 `some`을 사용하세요)
  array.forEach((value, index) => {
  });

  // Native, 객체의 경우
  Object.entries(obj).forEach(([key, value]) => {
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
  // jQuery, array1을 변경하며 중복된 항목을 제거하지 않습니다
  $.merge(array1, array2);

  // Native, array1을 변경하며 중복된 항목을 제거하지 않습니다
  array1.push(...array2);

  // Native, 새 배열을 반환하며 중복된 항목을 제거하지 않습니다
  function merge(...args) {
    return [].concat(...args);
  }

  // Set 버전, 새 배열을 반환하며 중복된 항목을 제거합니다
  function merge(...args) {
    return Array.from(new Set([].concat(...args)));
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

  <a name="makeArray"></a>+ makeArray

  array-like 한 객체를 진짜 JavaScript 배열로 변환합니다.

  ```js
  // jQuery
  $.makeArray(arrayLike);

  // Native
  Array.from(arrayLike);

  // ES6 방식: spread 연산자
  [...arrayLike];
  ```

- [6.2](#6.2) <a name='6.2'></a> Contains

  주어진 엘리먼트가 주어진 또 다른 엘리먼트를 자손으로 포함하는지 검사합니다.

  ```js
  // jQuery
  $.contains(el, child);

  // Native
  el !== child && el.contains(child);
  ```

- [6.3](#6.3) <a name='6.3'></a> globalEval

  JavaScript 코드를 전역적으로 실행합니다.

  ```js
  // jQuery
  $.globalEval(code);

  // Native
  function globalEval(code) {
    const script = document.createElement('script');
    script.text = code;

    document.head.appendChild(script).parentNode.removeChild(script);
  }

  // eval 함수를 쓸 수도 있습니다. 하지만 $.globalEval 의 context가 전역인 데 반해 eval 함수의 context 는 실행 영역입니다.
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
    return Array.from(context.body.childNodes);
  }
  ```

- [6.5](#6.5) <a name='6.5'></a> exists

  엘리먼트가 DOM에 존재하는지를 확인합니다

  ```js
  // jQuery
  if ($('selector').length) {
    // 존재함
  }

  // Native
  if (document.querySelector('selector')) {
    // 존재함
  }
  ```

**[⬆ 목차로 돌아가기](#목차)**

## Promises

Promise는 비동기적인 작업의 결과를 표현합니다. jQuery는 자체적인 promise 처리를 가지고 있습니다. 네이티브 JavaScript엔 [Promises/A+](https://promisesaplus.com/) 명세에 맞는 얇고 작은 API가 구현되어 있으며, `async`/`await`를 사용하면 동기 코드처럼 읽히는 코드를 작성할 수 있습니다.

- [7.1](#7.1) <a name='7.1'></a> done, fail, always

  `done`은 promise가 처리되었을 때, `fail`은 promise가 거절되었을 때, `always`는 promise가 어떻게 되었건 실행됩니다.

  ```js
  // jQuery
  $promise.done(doneCallback).fail(failCallback).always(alwaysCallback)

  // Native
  promise.then(doneCallback, failCallback).finally(alwaysCallback);

  // Native (async/await)
  try {
    doneCallback(await promise);
  } catch (error) {
    failCallback(error);
  } finally {
    alwaysCallback();
  }
  ```

- [7.2](#7.2) <a name='7.2'></a> when

  `when`은 여러 개의 promise들을 처리할 때 사용됩니다. 이것은 모든 promise가 처리되었을 때 resolve하고 하나라도 거절되면 reject합니다.

  ```js
  // jQuery
  $.when($promise1, $promise2).done((promise1Result, promise2Result) => {
  });

  // Native
  Promise.all([promise1, promise2]).then(([promise1Result, promise2Result]) => {});

  // Native (async/await)
  const [promise1Result, promise2Result] = await Promise.all([promise1, promise2]);
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

**[⬆ 목차로 돌아가기](#목차)**

## Animation

[Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)(`el.animate()`)는 jQuery 이펙트에 가장 가까운 네이티브 기능입니다. 밀리초 단위의 지속 시간을 받고, 가능한 경우 메인 스레드 밖에서 실행되며, 애니메이션이 끝나면 resolve되는 `finished` promise를 가진 `Animation` 객체를 반환합니다.

- [8.1](#8.1) <a name='8.1'></a> Show & Hide

  ```js
  // jQuery
  $el.show();
  $el.hide();

  // Native
  el.style.display = ''; // 스타일시트로 숨긴 경우에는 'block', 'inline' 등을 지정
  el.style.display = 'none';

  // Native (다른 곳에서 `display` 스타일을 지정하지 않은 경우)
  el.hidden = false;
  el.hidden = true;
  ```

- [8.2](#8.2) <a name='8.2'></a> Toggle

  엘리먼트를 출력하거나 숨깁니다.

  ```js
  // jQuery
  $el.toggle();

  // Native
  if (getComputedStyle(el).display === 'none') {
    el.style.display = ''; // 또는 'block', 'inline', ...
  } else {
    el.style.display = 'none';
  }
  ```

- [8.3](#8.3) <a name='8.3'></a> FadeIn & FadeOut

  ```js
  // jQuery
  $el.fadeIn(3000);
  $el.fadeOut(3000);

  // Native fadeIn
  function fadeIn(el, ms = 400) {
    el.style.display = '';
    return el.animate([{ opacity: 0 }, { opacity: 1 }], ms).finished;
  }

  // Native fadeOut
  function fadeOut(el, ms = 400) {
    return el.animate([{ opacity: 1 }, { opacity: 0 }], ms).finished.then(() => {
      el.style.display = 'none';
    });
  }
  ```

- [8.4](#8.4) <a name='8.4'></a> FadeTo

  엘리먼트의 투명도(opacity)를 조정합니다.

  ```js
  // jQuery
  $el.fadeTo('slow',0.15);
  // Native (jQuery에서 'slow'는 600밀리초입니다)
  el.animate([{ opacity: 0.15 }], { duration: 600, fill: 'forwards' });
  ```

- [8.5](#8.5) <a name='8.5'></a> FadeToggle

  엘리먼트를 투명도를 조절해서 보여주거나 숨깁니다.

  ```js
  // jQuery
  $el.fadeToggle();

  // Native, 8.3의 fadeIn과 fadeOut 사용
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

  // Native slideUp
  function slideUp(el, ms = 400) {
    el.style.overflow = 'hidden';
    return el.animate([{ height: `${el.offsetHeight}px` }, { height: '0px' }], ms).finished.then(() => {
      el.style.display = 'none';
      el.style.overflow = '';
    });
  }

  // Native slideDown
  function slideDown(el, ms = 400) {
    el.style.display = '';
    el.style.overflow = 'hidden';
    return el.animate([{ height: '0px' }, { height: `${el.scrollHeight}px` }], ms).finished.then(() => {
      el.style.overflow = '';
    });
  }
  ```

- [8.7](#8.7) <a name='8.7'></a> SlideToggle

  슬라이딩 모션과 함께 엘리먼트를 보이거나 숨깁니다.

  ```js
  // jQuery
  $el.slideToggle();

  // Native, 8.6의 slideUp과 slideDown 사용
  if (getComputedStyle(el).display === 'none') {
    slideDown(el);
  } else {
    slideUp(el);
  }
  ```

- [8.8](#8.8) <a name='8.8'></a> Animate

  자체적으로 CSS 프로퍼티들을 에니메이션합니다.

  ```js
  // jQuery
  $el.animate({ params }, speed);

  // Native (speed는 밀리초 단위)
  el.animate([params], { duration: speed, fill: 'forwards' });
  ```

## 대안방법

* [You Might Not Need jQuery](https://youmightnotneedjquery.com/) - 일반 자바스크립트로 공통이벤트, 엘리먼트, ajax 등을 다루는 방법 예제.
* [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) - 여기서 사용한 모든 DOM API에 대한 레퍼런스.
* [Baseline](https://web.dev/baseline) - 어떤 웹 플랫폼 기능을 여러 브라우저에서 안전하게 사용할 수 있는지 확인할 수 있습니다.

## 브라우저 지원

![Chrome][chrome-image] | ![Edge][edge-image] | ![Firefox][firefox-image] | ![Safari][safari-image] | ![Opera][opera-image]
--- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ |

일부 예제는 비교적 최근에 추가된 API를 사용합니다: `Promise.withResolvers()`(2024), `el.replaceChildren()`(2020), `AbortSignal.timeout()`(2022). 구형 브라우저까지 지원해야 한다면 [Baseline](https://web.dev/baseline)을 확인하세요.

# License

MIT

[chrome-image]: https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png
[firefox-image]: https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png
[edge-image]: https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png
[opera-image]: https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png
[safari-image]: https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png
