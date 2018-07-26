## jQueryは必要ない（You Don't Need jQuery）


フロントエンドの開発環境はめまぐるしく進化していて、最近のブラウザでは十分な質、量のDOM/BOM APIが実装されています。もうDOM操作やイベント処理のためにjQueryを覚える必要はありません。また、ReactやAngularそしてVueなどのフロントエンドライブラリの流行により、DOMを直接操作することはアンチパターンとなりました。jQueryはそれほど重要ではなくなったのです。このプロジェクトは、jQueryでの書き方の代わりとなるネイティブでの書き方(IE10以上)をまとめます。

## 目次

1. [Translations](#translations)
1. [セレクタ](#セレクタ)
1. [CSSとスタイル](#cssとスタイル)
1. [DOM操作](#dom操作)
1. [Ajax](#ajax)
1. [イベント](#イベント)
1. [ユーティリティ関数](#ユーティリティ関数)
1. [Promise](#promise)
1. [アニメーション](#アニメーション)
1. [選択肢](#選択肢)
1. [対応ブラウザ](#対応ブラウザ)


## Translations

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
* [Polski](./README-pl.md)

## セレクタ

classセレクタ、idセレクタ、属性セレクタのような主要セレクタは`document.querySelector`もしくは`document.querySelectorAll`で代替できます。

jQueryのセレクタと比べて以下の違いがあります。

* `document.querySelector`はセレクタにマッチする最初のエレメントを返す
* `document.querySelectorAll`はセレクタにマッチする全てのエレメントのNodeListを返す。`Array.prototype.slice.call(document.querySelectorAll(selector) || []);`で配列に変換できる。
* セレクタにマッチする要素がなかった場合、jQueryは`[]`を返すが、DOM APIは`null`を返す。したがってNull Pointer Exceptionに注意する必要がある。もしくは`document.querySelectorAll(selector) || []`のように`||`を使ってデフォルト値を指定しておく。

> 注意：`document.querySelector`と`document.querySelectorAll`はかなり**遅い**です。もし、パフォーマンスが必要なら`document.getElementById`や`document.getElementsByClassName`、`document.getElementsByTagName`を使ってください。


- [1.0](#1.0) <a name='1.0'></a> セレクタによる選択

  ```js
  // jQuery
  $('selector');

  // Native
  document.querySelectorAll('selector');
  ```

- [1.1](#1.1) <a name='1.1'></a> クラス名による選択

  ```js
  // jQuery
  $('.class');

  // Native
  document.querySelectorAll('.class');

  // or
  document.getElementsByClassName('class');
  ```

- [1.2](#1.2) <a name='1.2'></a> idによる選択

  ```js
  // jQuery
  $('#id');

  // Native
  document.querySelector('#id');

  // or
  document.getElementById('id');
  ```

- [1.3](#1.3) <a name='1.3'></a> 属性による選択

  ```js
  // jQuery
  $('a[target=_blank]');

  // Native
  document.querySelectorAll('a[target=_blank]');
  ```

- [1.4](#1.4) <a name='1.4'></a> 子孫要素の選択

  ```js
  // jQuery
  $el.find('li');

  // Native
  el.querySelectorAll('li');
  ```  

- [1.5](#1.5) <a name='1.5'></a> 兄弟要素の選択

  + 兄弟要素

    ```js
    // jQuery
    $el.siblings();

    // Native
    Array.prototype.filter.call(el.parentNode.children, function(child) {
      return child !== el;
    });
    ```

  + 直前の兄弟要素

    ```js
    // jQuery
    $el.prev();

    // Native
    el.previousElementSibling;
    ```

  + 直後の兄弟要素

    ```js
    // jQuery
    $el.next();

    // Native
    el.nextElementSibling;
    ```

- [1.6](#1.6) <a name='1.6'></a> 祖先要素の選択

  指定要素からdocument方向に遡って走査し、セレクタにマッチする最初の祖先要素を返します。

  ```js
  // jQuery
  $el.closest(selector);

  // Native - 最近のブラウザのみ。IEでは動かない。
  el.closest(selector);

  // Native - IE10+
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

  指定要素からセレクタにマッチする祖先要素までdocument方向に遡って走査し、フィルタにマッチする祖先要素を全て取得します。ただし、セレクタで指定された要素は含みません。

  ```js
  // jQuery
  $el.parentsUntil(selector, filter);

  // Native
  function parentsUntil(el, selector, filter) {
    const result = [];
    const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;

    // parentから走査を開始する
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

- [1.8](#1.8) <a name='1.8'></a> フォーム

  + input/textarea

    ```js
    // jQuery
    $('#my-input').val();

    // Native
    document.querySelector('#my-input').value;
    ```

  + `.radio`内での`e.currentTarget`のインデックスを返す

    ```js
    // jQuery
    $(e.currentTarget).index('.radio');

    // Native
    Array.prototype.indexOf.call(document.querySelectorAll('.radio'), e.currentTarget);
    ```

- [1.9](#1.9) <a name='1.9'></a> iframeのコンテンツ

  `$('iframe').contents()`はiframeの`contentDocument`を返します。

  + Iframe contents

    ```js
    // jQuery
    $iframe.contents();

    // Native
    iframe.contentDocument;
    ```

  + Iframe Query

    ```js
    // jQuery
    $iframe.contents().find('.css');

    // Native
    iframe.contentDocument.querySelectorAll('.css');
    ```

- [1.10](#1.10) <a name='1.10'></a> bodyを取得する

  ```js
  // jQuery
  $('body');

  // Native
  document.body;
  ```

- [1.11](#1.11) <a name='1.11'></a> 属性の設定、取得

  + 属性値を取得する

    ```js
    // jQuery
    $el.attr('foo');

    // Native
    el.getAttribute('foo');
    ```
  + 属性値を設定する

    ```js
    // jQuery, DOMを変化させずメモリ上で動作することに注意
    $el.attr('foo', 'bar');

    // Native
    el.setAttribute('foo', 'bar');
    ```

  + `data-`属性を取得する

    ```js
    // jQuery
    $el.data('foo');

    // Native (`getAttribute`を使う)
    el.getAttribute('data-foo');
    // Native (IE11以上のサポートなら`dataset`を使ってもよい)
    el.dataset['foo'];
    ```

**[⬆ back to top](#目次)**

## CSSとスタイル

- [2.1](#2.1) <a name='2.1'></a> CSS

  + スタイルを取得する

    ```js
    // jQuery
    $el.css("color");

    // Native
    // NOTE: 既知のバグ デフォルト値が'auto'の場合、値が指定されていなくても'auto'が返る
    const win = el.ownerDocument.defaultView;
    // nullは疑似要素でないことを示している
    win.getComputedStyle(el, null).color;
    ```

  + スタイルを設定する

    ```js
    // jQuery
    $el.css({ color: "#ff0011" });

    // Native
    el.style.color = '#ff0011';
    ```

  + スタイルを一括取得、一括設定する

	複数のスタイルを一括で設定したいなら、oui-dom-utilsの[setStyles](https://github.com/oneuijs/oui-dom-utils/blob/master/src/index.js#L194)関数を参考にすると良いでしょう。

  + クラスを追加する
    ```js
    // jQuery
    $el.addClass(className);

    // Native
    el.classList.add(className);
    ```

  + クラスを削除する

    ```js
    // jQuery
    $el.removeClass(className);

    // Native
    el.classList.remove(className);
    ```

  + クラスの有無をチェックする

    ```js
    // jQuery
    $el.hasClass(className);

    // Native
    el.classList.contains(className);
    ```

  + クラスの有無を切り替える

    ```js
    // jQuery
    $el.toggleClass(className);

    // Native
    el.classList.toggle(className);
    ```

- [2.2](#2.2) <a name='2.2'></a> 横幅と高さ

  横幅(width)と高さ(height)の書き方はほぼ同じなので、高さ（height）の例のみを示します。

  + ウィンドウの高さ

    ```js
    // window height
    $(window).height();
    // jQueryのようにスクロールバーを除いた高さ
    window.document.documentElement.clientHeight;
    // スクロールバーを含めるなら
    window.innerHeight;
    ```

  + ドキュメントの高さ

    ```js
    // jQuery
    $(document).height();

    // Native
    document.documentElement.scrollHeight;
    ```

  + エレメントの高さ

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
    // integerで取得（`border-box`の時は`height - border`が、`content-box`の時は`height + padding`が返る）
    el.clientHeight;
    // decimalで取得（`border-box`の時は`height`が、`content-box`の時は`height + padding + border`が返る）
    el.getBoundingClientRect().height;
    ```

- [2.3](#2.3) <a name='2.3'></a> PositionとOffset

  + Position

    offset parentを起点として、エレメントの座標を取得する。

    ```js
    // jQuery
    $el.position();

    // Native
    { left: el.offsetLeft, top: el.offsetTop }
    ```

  + Offset

    documentを起点として、エレメントの座標を取得する。

    ```js
    // jQuery
    $el.offset();

    // Native
    function getOffset (el) {
      const box = el.getBoundingClientRect();

      return {
        top: box.top + window.pageYOffset - document.documentElement.clientTop,
        left: box.left + window.pageXOffset - document.documentElement.clientLeft
      }
    }
    ```

- [2.4](#2.4) <a name='2.4'></a> スクロール位置

  縦スクロールバーの位置を取得する。

  ```js
  // jQuery
  $(window).scrollTop();

  // Native
  (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
  ```

**[⬆ back to top](#目次)**

## DOM操作

- [3.1](#3.1) <a name='3.1'></a> Remove

  DOMからエレメントを削除する。

  ```js
  // jQuery
  $el.remove();

  // Native
  el.parentNode.removeChild(el);
  ```

- [3.2](#3.2) <a name='3.2'></a> Text

  + テキストを取得する

    子孫エレメントも含めた全テキスト内容を取得する。

    ```js
    // jQuery
    $el.text();

    // Native
    el.textContent;
    ```

  + テキストを設定する

    エレメントのコンテントを指定されたテキストに設定する。

    ```js
    // jQuery
    $el.text(string);

    // Native
    el.textContent = string;
    ```

- [3.3](#3.3) <a name='3.3'></a> HTML

  + HTMLを取得する

    ```js
    // jQuery
    $el.html();

    // Native
    el.innerHTML;
    ```

  + HTMLを設定する

    ```js
    // jQuery
    $el.html(htmlString);

    // Native
    el.innerHTML = htmlString;
    ```

- [3.4](#3.4) <a name='3.4'></a> Append

  最後の子要素としてエレメントを追加する。

  ```js
  // jQuery
  $el.append("<div id='container'>hello</div>");

  // Native
  el.insertAdjacentHTML("beforeend","<div id='container'>hello</div>");
  ```

- [3.5](#3.5) <a name='3.5'></a> Prepend

  最初の子要素としてエレメントを追加する。

  ```js
  // jQuery
  $el.prepend("<div id='container'>hello</div>");

  // Native
  el.insertAdjacentHTML("afterbegin","<div id='container'>hello</div>");
  ```

- [3.6](#3.6) <a name='3.6'></a> insertBefore

  指定要素の後ろに新しいノードを追加する。

  ```js
  // jQuery
  $newEl.insertBefore(queryString);

  // Native
  const target = document.querySelector(queryString);
  target.parentNode.insertBefore(newEl, target);
  ```

- [3.7](#3.7) <a name='3.7'></a> insertAfter

  指定要素の前に新しいノードを追加する。

  ```js
  // jQuery
  $newEl.insertAfter(queryString);

  // Native
  const target = document.querySelector(queryString);
  target.parentNode.insertBefore(newEl, target.nextSibling);
  ```

- [3.8](#3.8) <a name='3.8'></a> is

  セレクタにマッチするなら`true`を返す。

  ```js
  // is関数は複数エレメントや関数にも対応するが、matches関数は単一エレメントのみに使える
  $el.is(selector);

  // Native
  el.matches(selector);
  ```
- [3.9](#3.9) <a name='3.9'></a> clone

  エレメントのディープコピーを生成する。

  ```js
  // jQuery
  $el.clone();

  // Native
  el.cloneNode();

  //  パラメータには`true`が渡され、深い複製を生成します。
  // 浅い複製を生成するには、`false`を渡します。
  ```

- [3.10](#3.10) <a name='3.10'></a> empty

  全ての子ノードを削除する。

  ```js
  // jQuery
  $el.empty();

  // Native
  el.innerHTML = '';
  ```

- [3.11](#3.11) <a name='3.11'></a> wrap

  エレメントを指定のHTMLで囲む。

  ```js
  // jQuery
  $('.inner').wrap('<div class="wrapper"></div>');

  // Native
  Array.prototype.slice.call(document.querySelectorAll('.inner')).forEach(function(el){
    var wrapper = document.createElement('div');
    wrapper.className = 'wrapper';
    el.parentNode.insertBefore(wrapper, el);
    el.parentNode.removeChild(el);
    wrapper.appendChild(el);
  });
  ```

- [3.12](#3.12) <a name='3.12'></a> unwrap

  セレクタにマッチしたエレメントの親要素をDOMから削除する。マッチしたエレメント自体は残す。

  ```js
  // jQuery
  $('.inner').unwrap();

  // Native
  Array.prototype.slice.call(document.querySelectorAll('.inner')).forEach(function(el){
    Array.prototype.slice.call(el.childNodes).forEach(function(child){
      el.parentNode.insertBefore(child, el);
    });
    el.parentNode.removeChild(el);
  });
  ```

- [3.13](#3.13) <a name='3.13'></a> replaceWith

  セレクタにマッチしたエレメントの内容を与えられた内容に置き換える。

  ```js
  // jQuery
  $('.inner').replaceWith('<div class="outer"></div>');

  // Native
  Array.prototype.slice.call(document.querySelectorAll('.inner')).forEach(function(el){
    var outer = document.createElement('div');
    outer.className = 'outer';
    el.parentNode.insertBefore(outer, el);
    el.parentNode.removeChild(el);
  });
  ```


**[⬆ back to top](#目次)**

## Ajax

[Fetch API](https://fetch.spec.whatwg.org/)はXMLHttpRequestを置き換える新たな規格です。ChromeとFirefoxで動きます。レガシーなブラウザでもpolyfillを使えます。

IE9以上なら[github/fetch](http://github.com/github/fetch)、IE8以上なら[fetch-ie8](https://github.com/camsong/fetch-ie8/)、jsonpを利用したいなら[fetch-jsonp](https://github.com/camsong/fetch-jsonp)を試してみてください。

- [4.1](#4.1) <a name='4.1'></a> マッチしたエレメントをサーバから取得したHTMLに置き換える。

  ```js
  // jQuery
  $(selector).load(url, completeCallback)

  // Native
  fetch(url).then(data => data.text()).then(data => {
    document.querySelector(selector).innerHTML = data
  }).then(completeCallback)
  ```

**[⬆ back to top](#目次)**

## イベント

名前空間(namespace)と委譲（delegation）を利用した完全な代替手段が必要なら、 https://github.com/oneuijs/oui-dom-events を参照してください。

- [5.0](#5.0) <a name='5.0'></a> ドキュメントが読み込まれたときの動作(`DOMContentLoaded`)

  ```js
  // jQuery
  $(document).ready(eventHandler);

  // Native
  // DOMContentLoadedがすでに完了していないか確認する
  if (document.readyState !== 'loading') {
    eventHandler();
  } else {
    document.addEventListener('DOMContentLoaded', eventHandler);
  }
  ```

- [5.1](#5.1) <a name='5.1'></a> イベントをバインドする(`on`)

  ```js
  // jQuery
  $el.on(eventName, eventHandler);

  // Native
  el.addEventListener(eventName, eventHandler);
  ```

- [5.2](#5.2) <a name='5.2'></a> イベントをアンバインドする(`off`)

  ```js
  // jQuery
  $el.off(eventName, eventHandler);

  // Native
  el.removeEventListener(eventName, eventHandler);
  ```

- [5.3](#5.3) <a name='5.3'></a> イベントを発火させる(`trigger`)

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

**[⬆ back to top](#目次)**

## ユーティリティ関数

殆どのユーティリティ関数はネイティブのAPIで置き換えることができます。表記の一貫性やパフォーマンスを重視した他のライブラリを使う選択肢もあります。[lodash](https://lodash.com)がおすすめです。


- [6.1](#6.1) <a name='6.1'></a> 基本的なユーティリティ関数

  + isArray

  配列かどうか判定する。

  ```js
  // jQuery
  $.isArray(array);

  // Native
  Array.isArray(array);
  ```

  + isWindow

  windowかどうか判定する。

  ```js
  // jQuery
  $.isWindow(obj);

  // Native
  function isWindow(obj) {
    return obj != null && obj === obj.window;
  }
  ```

  + inArray

  配列の中で、指定された値が最初に現れたインデックスを返す。（見つからなければ-1を返す）。

  ```js
  // jQuery
  $.inArray(item, array);

  // Native
  Array.indexOf(item);
  ```

  + isNumeric

  数値かどうか判定する。
  `typeof`を使ってください。ライブラリを使う場合、`typeof`は正確でない場合があります。

  ```js
  // jQuery
  $.isNumeric(item);

  // Native
  function isNumeric(item) {
    return typeof item === 'number';
  }
  ```

  + isFunction

  JavaScript関数オブジェクトかどうか判定する。

  ```js
  // jQuery
  $.isFunction(item);

  // Native
  function isFunction(item) {
    return typeof item === 'function';
  }
  ```

  + isEmptyObject

  空のオブジェクトである（列挙できる要素がない）か判定する。

  ```js
  // jQuery
  $.isEmptyObject(obj);

  // Native
  function isEmptyObject(obj) {
    for (let key in obj) {
      return false;
    }
    return true;
  }
  ```

  + isPlainObject

  `{}`もしくは`new Object`で生成されたオブジェクトであるか判定する。

  ```js
  // jQuery
  $.isPlainObject(obj);

  // Native
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

  二つ以上のオブジェクトをマージする。
  `object.assign`はECMAScript6のAPIですが、[polyfill](https://github.com/ljharb/object.assign)も利用できます。

  ```js
  // jQuery
  $.extend({}, defaultOpts, opts);

  // Native
  Object.assign({}, defaultOpts, opts);
  ```

  + trim

  前後の空白を除去する。

  ```js
  // jQuery
  $.trim(string);

  // Native
  string.trim();
  ```

  + map

  配列やオブジェクトを新しい配列に変換する。

  ```js
  // jQuery
  $.map(array, function(value, index) {
  });

  // Native
  array.map(function(value, index) {
  });
  ```

  + each

  配列やオブジェクトに対して繰り返し処理を行う。

  ```js
  // jQuery
  $.each(array, function(value, index) {
  });

  // Native
  array.forEach(function(value, index) {
  });
  ```

  + grep

  フィルター関数に合致したエレメントだけを返す。

  ```js
  // jQuery
  $.grep(array, function(value, index) {
  });

  // Native
  array.filter(function(value, index) {
  });
  ```

  + type

  JavaScript「クラス」名を判定します。

  ```js
  // jQuery
  $.type(obj);

  // Native
  Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
  ```

  + merge

  二つの配列をマージする。

  ```js
  // jQuery
  $.merge(array1, array2);

  // Native
  // 重複した要素は削除されない
  function merge() {
    return Array.prototype.concat.apply([], arguments)
  }
  ```

  + now

  現在の時刻を返す。

  ```js
  // jQuery
  $.now();

  // Native
  Date.now();
  ```

  + proxy

  関数内で実行されるthisを任意のオブジェクトに変更する。

  ```js
  // jQuery
  $.proxy(fn, context);

  // Native
  fn.bind(context);
  ```

  + makeArray

  配列形式のオブジェクトを配列に変換する。

  ```js
  // jQuery
  $.makeArray(arrayLike);

  // Native
  Array.prototype.slice.call(arrayLike);

  // ES6なら
  Array.from(arrayLike);
  ```

- [6.2](#6.2) <a name='6.2'></a> contains

  ある要素が他の要素の子孫であるか判定する。

  ```js
  // jQuery
  $.contains(el, child);

  // Native
  el !== child && el.contains(child);
  ```

- [6.3](#6.3) <a name='6.3'></a> globaleval

  JavaScriptコードをグローバル空間で実行する。

  ```js
  // jQuery
  $.globaleval(code);

  // Native
  function Globaleval(code) {
    let script = document.createElement('script');
    script.text = code;

    document.head.appendChild(script).parentNode.removeChild(script);
  }

  // evalはcurrentコンテキストで実行される。$.globalevalのコンテキストはグローバルである。
  eval(code);
  ```

- [6.4](#6.4) <a name='6.4'></a> parse

  + parseHTML

  文字列をDOM nodeの配列として返します。

  ```js
  // jQuery
  $.parseHTML(htmlString);

  // Native
  function parseHTML(string) {
    const tmp = document.implementation.createHTMLDocument();
    tmp.body.innerHTML = string;
    return tmp.body.children;
  }
  ```

  + parseJSON

  JSON文字列をJavaScriptに変換します。

  ```js
  // jQuery
  $.parseJSON(str);

  // Native
  JSON.parse(str);
  ```

**[⬆ back to top](#目次)**

## Promise

promiseは非同期処理の最終的な処理結果を表します。jQueryにはpromiseを扱うための独自の方法があります。ネイティブのJavaScriptでは[Promises/A+](http://promises-aplus.github.io/promises-spec/)規格に則り、薄く、最小限のAPIを実装しています。

- [7.1](#7.1) <a name='7.1'></a> done, fail, always

  `done`はpromiseが成功(resolved)したとき、`fall`は失敗(rejected)したとき、`always`はどちらの場合も呼び出されます。

  ```js
  // jQuery
  $promise.done(doneCallback).fail(failCallback).always(alwaysCallback)

  // Native
  promise.then(doneCallback, failCallback).then(alwaysCallback, alwaysCallback)
  ```

- [7.2](#7.2) <a name='7.2'></a> when

  `when`は複数のpromiseを扱うときに使います。すべてのpromiseの結果が返ったときに成功となります（失敗が含まれてても成功となります）。

  ```js
  // jQuery
  $.when($promise1, $promise2).done((promise1Result, promise2Result) => {})

  // Native
  Promise.all([$promise1, $promise2]).then([promise1Result, promise2Result] => {});
  ```

- [7.3](#7.3) <a name='7.3'></a> Deferred

  `Deferred`はpromiseを作成する方法の一つです。

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

  // Native
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

  // Deferred way
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

**[⬆ back to top](#目次)**

## アニメーション

- [8.1](#8.1) <a name='8.1'></a> show、hide

  ```js
  // jQuery
  $el.show();
  $el.hide();

  // Native
  // show関数の詳細を見たければ次のURLを参照してください
  // https://github.com/oneuijs/oui-dom-utils/blob/master/src/index.js#L363
  el.style.display = ''|'inline'|'inline-block'|'inline-table'|'block';
  el.style.display = 'none';
  ```

- [8.2](#8.2) <a name='8.2'></a> toggle

  エレメントが表示されていないなら表示し、表示されているなら非表示にします。

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

- [8.3](#8.3) <a name='8.3'></a> fadeIn、fadeOut

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

- [8.4](#8.4) <a name='8.4'></a> fadeTo

  エレメントのopacityを調整してください。

  ```js
  // jQuery
  $el.fadeTo('slow',0.15);
  // Native
  el.style.transition = 'opacity 3s'; // 'slow'は3秒だということにしている
  el.style.opacity = '0.15';
  ```

- [8.5](#8.5) <a name='8.5'></a> fadeToggle

  フェードイン・フェードアウトを伴ってエレメントの表示・非表示を切り替えます。

  ```js
  // jQuery
  $el.fadeToggle();

  // Native
  el.style.transition = 'opacity 3s';
  let { opacity } = el.ownerDocument.defaultView.getComputedStyle(el, null);
  if (opacity === '1') {
    el.style.opacity = '0';
  }
  else {
    el.style.opacity = '1';
  }
  ```

- [8.6](#8.6) <a name='8.6'></a> スライドアップ、スライドダウン

  ```js
  // jQuery
  $el.slideUp();
  $el.slideDown();

  // Native
  let originHeight = '100px';
  el.style.transition = 'height 3s';
  // slideUp
  el.style.height = '0px';
  // slideDown
  el.style.height = originHeight;
  ```

- [8.7](#8.7) <a name='8.7'></a> slideToggle

  スライドを伴って、エレメントの表示・非表示を切り替えます。

  ```js
  // jQuery
  $el.slideToggle();

  // Native
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

- [8.8](#8.8) <a name='8.8'></a> animate

  CSSプロパティで定義されたアニメーションを表示します。

  ```js
  // jQuery
  $el.animate({params}, speed);

  // Native
  el.style.transition = 'all' + speed;
  Object.keys(params).forEach(function(key) {
    el.style[key] = params[key];
  })
  ```

## 選択肢

* [You Might Not Need jQuery](http://youmightnotneedjquery.com/) - ネイティブのJavaScriptでイベント、エレメント、Ajaxを扱うサンプル集(英語)
* [npm-dom](http://github.com/npm-dom) and [webmodules](http://github.com/webmodules) - npmで利用できるDOMモジュールを集めたOrganizationです

## 対応ブラウザ

![Chrome][chrome-image] | ![Firefox][firefox-image] | ![IE][ie-image] | ![Opera][opera-image] | ![Safari][safari-image]
--- | --- | --- | --- | ---
Latest ✔ | Latest ✔ | 10+ ✔ | Latest ✔ | 6.1+ ✔

# ライセンス

MIT

[chrome-image]: https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png
[firefox-image]: https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png
[ie-image]: https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png
[opera-image]: https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png
[safari-image]: https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png
