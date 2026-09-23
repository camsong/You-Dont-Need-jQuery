## jQueryは必要ない（You Don't Need jQuery）


フロントエンドの開発環境はめまぐるしく進化していて、最近のブラウザでは十分な質、量のDOM/BOM APIが実装されています。もうDOM操作やイベント処理のためにjQueryを覚える必要はありません。また、ReactやAngularそしてVueなどのフロントエンドライブラリの流行により、DOMを直接操作することはアンチパターンとなりました。jQueryはそれほど重要ではなくなったのです。このプロジェクトは、jQueryでの書き方の代わりとなるネイティブでの書き方をまとめます。

スニペットは現行のエバーグリーンブラウザ（Chrome、Edge、Firefox、Safari）を対象としています。Internet ExplorerはMicrosoftのサポートが終了しているため、IE向けのフォールバックは削除しました。IE対応がまだ必要な場合は、[IEに対応していた最後のバージョン](https://github.com/camsong/You-Dont-Need-jQuery/tree/c4e00b3)を参照してください。

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
* [Polski](./README-pl.md)

## セレクタ

classセレクタ、idセレクタ、属性セレクタのような主要セレクタは`document.querySelector`もしくは`document.querySelectorAll`で代替できます。

jQueryのセレクタと比べて以下の違いがあります。

* `document.querySelector`はセレクタにマッチする最初のエレメントを返す
* `document.querySelectorAll`はセレクタにマッチする全てのエレメントを静的なNodeListとして返す。NodeListは`forEach`に対応しており、`Array.from(document.querySelectorAll(selector))`や[makeArray](#makeArray)で紹介している方法で配列に変換できる。
* セレクタにマッチする要素がなかった場合、jQueryは空のjQueryオブジェクトを、`document.querySelectorAll`は空のNodeListを返すが、`document.querySelector`は`null`を返す。

> 注意：`document.getElementById`、`document.getElementsByClassName`、`document.getElementsByTagName`は`querySelector*`よりわずかに高速ですが、`getElementsBy*`が返すのはDOMの変更に合わせて中身が変わる*ライブ*なHTMLCollectionです。計測してボトルネックだと確認できた場合を除き、`querySelector*`を使うことをおすすめします。


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
    [...el.parentNode.children].filter((child) =>
      child !== el
    );
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

  // Native
  el.closest(selector);
  ```

- [1.7](#1.7) <a name='1.7'></a> Parents Until

  指定要素からセレクタにマッチする祖先要素までdocument方向に遡って走査し、フィルタにマッチする祖先要素を全て取得します。ただし、セレクタで指定された要素は含みません。

  ```js
  // jQuery
  $el.parentsUntil(selector, filter);

  // Native
  function parentsUntil(el, selector, filter) {
    const result = [];

    // parentから走査を開始する
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
    $('.radio').index(e.currentTarget);

    // Native
    [...document.querySelectorAll('.radio')].indexOf(e.currentTarget);
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
    // jQuery
    $el.attr('foo', 'bar');

    // Native
    el.setAttribute('foo', 'bar');
    ```

  + `data-`属性を取得する

    ```js
    // jQuery
    $el.data('foo');

    // Native
    el.dataset.foo;

    // or
    el.getAttribute('data-foo');
    ```

**[⬆ back to top](#目次)**

## CSSとスタイル

- [2.1](#2.1) <a name='2.1'></a> CSS

  + スタイルを取得する

    ```js
    // jQuery
    $el.css('color');

    // Native
    // NOTE: '#f01'ではなく'rgb(255, 0, 17)'のような解決済みの値（resolved value）が返る
    getComputedStyle(el).color;
    ```

  + スタイルを設定する

    ```js
    // jQuery
    $el.css({ color: '#f01' });

    // Native
    el.style.color = '#f01';
    ```

  + 複数のスタイルを一括設定する

    ```js
    // jQuery
    $el.css({ color: '#f01', 'border-color': '#f02' });

    // Native
    Object.assign(el.style, { color: '#f01', borderColor: '#f02' });
    ```

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
    // jQuery
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
    const position = { left: el.offsetLeft, top: el.offsetTop };
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
        top: box.top + window.scrollY,
        left: box.left + window.scrollX
      };
    }
    ```

- [2.4](#2.4) <a name='2.4'></a> スクロール位置

  縦スクロールバーの位置を取得する。

  ```js
  // jQuery
  $(window).scrollTop();

  // Native
  window.scrollY;
  ```

**[⬆ back to top](#目次)**

## DOM操作

- [3.1](#3.1) <a name='3.1'></a> Remove

  DOMからエレメントを削除する。

  ```js
  // jQuery
  $el.remove();

  // Native
  el.remove();
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
  // jQuery: DOMStringとNodeオブジェクトを同じ構文で扱える
  $parent.append(newEl | '<div id="container">Hello World</div>');

  // Native (Elementまたはテキスト): 文字列はHTMLとして解析されず、プレーンテキストとして挿入される
  parent.append(newEl | 'Hello World');

  // Native (HTML文字列)
  parent.insertAdjacentHTML('beforeend', '<div id="container">Hello World</div>');
  ```

- [3.5](#3.5) <a name='3.5'></a> Prepend

  最初の子要素としてエレメントを追加する。

  ```js
  // jQuery: DOMStringとNodeオブジェクトを同じ構文で扱える
  $parent.prepend(newEl | '<div id="container">Hello World</div>');

  // Native (Elementまたはテキスト): 文字列はHTMLとして解析されず、プレーンテキストとして挿入される
  parent.prepend(newEl | 'Hello World');

  // Native (HTML文字列)
  parent.insertAdjacentHTML('afterbegin', '<div id="container">Hello World</div>');
  ```

- [3.6](#3.6) <a name='3.6'></a> insertBefore

  指定要素の前に新しいノードを追加する。

  ```js
  // jQuery
  $newEl.insertBefore(selector);

  const el = document.querySelector(selector);

  // Native (Element)
  el.before(newEl);

  // Native (HTML文字列)
  el.insertAdjacentHTML('beforebegin', '<div id="container">Hello World</div>');
  ```

- [3.7](#3.7) <a name='3.7'></a> insertAfter

  指定要素の後ろに新しいノードを追加する。

  ```js
  // jQuery
  $newEl.insertAfter(selector);

  const el = document.querySelector(selector);

  // Native (Element)
  el.after(newEl);

  // Native (HTML文字列)
  el.insertAdjacentHTML('afterend', '<div id="container">Hello World</div>');
  ```

- [3.8](#3.8) <a name='3.8'></a> is

  セレクタにマッチするなら`true`を返す。

  ```js
  // jQuery - `is`は関数や既存のjQueryオブジェクト、DOM要素も引数に取れるが、ここでは扱わない
  $el.is(selector);

  // Native
  el.matches(selector);
  ```
- [3.9](#3.9) <a name='3.9'></a> clone

  エレメントのディープコピーを生成する。

  ```js
  // jQuery: `true`を渡すと、イベントハンドラとデータもコピーされる
  $el.clone();

  // Native: `true`を渡すとディープコピーになる。イベントリスナーは一切コピーされない
  el.cloneNode(true);
  ```

- [3.10](#3.10) <a name='3.10'></a> empty

  全ての子ノードを削除する。

  ```js
  // jQuery
  $el.empty();

  // Native
  el.replaceChildren();
  ```

- [3.11](#3.11) <a name='3.11'></a> wrap

  エレメントを指定のHTMLで囲む。

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

  セレクタにマッチしたエレメントの親要素をDOMから削除する。マッチしたエレメント自体は残す。

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

  セレクタにマッチしたエレメントの内容を与えられた内容に置き換える。

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


**[⬆ back to top](#目次)**

## Ajax

[Fetch API](https://fetch.spec.whatwg.org/)はXMLHttpRequestを置き換える標準規格で、すべてのモダンブラウザで動きます。`$.ajax`とは異なり、`fetch`は404や500などのHTTPエラーステータスが返ってきても**rejectしません**。`response.ok`を自分で確認してください。jsonpを利用したいなら[fetch-jsonp](https://github.com/camsong/fetch-jsonp)を試してみてください。

- [4.0](#4.0) <a name='4.0'></a> JSONを取得する

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

- [4.0.1](#4.0.1) <a name='4.0.1'></a> JSONをPOSTする

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

- [4.0.2](#4.0.2) <a name='4.0.2'></a> リクエストの中断とタイムアウト

  ```js
  // jQuery
  const jqXHR = $.ajax({ url, timeout: 5000 });
  jqXHR.abort();

  // Native
  const controller = new AbortController();
  fetch(url, { signal: controller.signal });
  controller.abort();

  // Native (タイムアウト)
  fetch(url, { signal: AbortSignal.timeout(5000) });
  ```

- [4.1](#4.1) <a name='4.1'></a> マッチしたエレメントをサーバから取得したHTMLに置き換える。

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

**[⬆ back to top](#目次)**

## イベント

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

  // または、スクリプトを`<script defer>`や`<script type="module">`で読み込む。
  // これらはドキュメントの解析が終わってから実行される。
  ```

- [5.1](#5.1) <a name='5.1'></a> イベントをバインドする(`on`)

  ```js
  // jQuery
  $el.on(eventName, eventHandler);

  // Native
  el.addEventListener(eventName, eventHandler);
  ```

- [5.1.1](#5.1.1) <a name='5.1.1'></a> イベントを一度だけバインドする(`one`)

  ```js
  // jQuery
  $el.one(eventName, eventHandler);

  // Native
  el.addEventListener(eventName, eventHandler, { once: true });
  ```

- [5.1.2](#5.1.2) <a name='5.1.2'></a> イベントの委譲

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

- [5.2](#5.2) <a name='5.2'></a> イベントをアンバインドする(`off`)

  ```js
  // jQuery
  $el.off(eventName, eventHandler);

  // Native
  el.removeEventListener(eventName, eventHandler);

  // Native: jQueryの名前空間のように、複数のリスナーをまとめて解除する
  const controller = new AbortController();
  el.addEventListener('click', onClick, { signal: controller.signal });
  el.addEventListener('keydown', onKeydown, { signal: controller.signal });
  controller.abort();
  ```

- [5.3](#5.3) <a name='5.3'></a> イベントを発火させる(`trigger`)

  ```js
  // jQuery
  $(el).trigger('custom-event', {key1: 'data'});

  // Native: jQueryのイベントはバブリングするが、ネイティブのイベントは`bubbles: true`を指定しない限りバブリングしない。
  // データはハンドラ内で`event.detail`から読み取る。
  const event = new CustomEvent('custom-event', {
    bubbles: true,
    cancelable: true,
    detail: { key1: 'data' },
  });

  el.dispatchEvent(event);
  ```

**[⬆ back to top](#目次)**

## ユーティリティ関数

殆どのユーティリティ関数はネイティブのAPIで置き換えることができます。表記の一貫性やパフォーマンスを重視した他のライブラリを使う選択肢もあります。[Lodash](https://lodash.com)や[es-toolkit](https://es-toolkit.dev)がおすすめです。


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
  array.indexOf(item);
  ```

  配列に指定された値が含まれているか判定する。

  ```js
  // jQuery
  $.inArray(item, array) > -1;

  // Native
  array.indexOf(item) > -1;

  // ES6なら
  array.includes(item);
  ```

  + isNumeric

  数値かどうか判定する。
  型の判定には`typeof`を使うか、より正確に判定したい場合は後述の`type`の例を参考にしてください。

  ```js
  // jQuery
  $.isNumeric(item);

  // Native
  function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  ```

  + isFunction

  JavaScript関数オブジェクトかどうか判定する。

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

  空のオブジェクトである（列挙できる要素がない）か判定する。

  ```js
  // jQuery
  $.isEmptyObject(obj);

  // Native
  function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
  }
  ```

  + isPlainObject

  `{}`もしくは`new Object`で生成されたオブジェクトであるか判定する。

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

  二つ以上のオブジェクトをマージする。
  `deep`を指定しない`$.extend`と同じく、`Object.assign`やスプレッド構文はシャローコピー（浅いコピー）しか行いません。

  ```js
  // jQuery
  $.extend({}, object1, object2);

  // Native
  Object.assign({}, object1, object2);

  // Native (スプレッド構文)
  ({ ...object1, ...object2 });
  ```

  オブジェクトを1つだけディープコピーする場合：

  ```js
  // jQuery
  $.extend(true, {}, object);

  // Native: 関数やDOMノードは複製できない
  structuredClone(object);
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
  $.map(array, (value, index) => {
  });

  // Native
  array.map((value, index) => {
  });
  ```

  + each

  配列やオブジェクトに対して繰り返し処理を行う。

  ```js
  // jQuery (`false`を返すとループを抜ける)
  $.each(array, (index, value) => {
  });

  // Native (途中でループを抜けたい場合は`for...of`か`some`を使う)
  array.forEach((value, index) => {
  });

  // Native (オブジェクトの場合)
  Object.entries(obj).forEach(([key, value]) => {
  });
  ```

  + grep

  フィルター関数に合致したエレメントだけを返す。

  ```js
  // jQuery
  $.grep(array, (value, index) => {
  });

  // Native
  array.filter((value, index) => {
  });
  ```

  + type

  JavaScript「クラス」名を判定します。

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

  二つの配列をマージする。

  ```js
  // jQuery (array1を変更する。重複した要素は削除されない)
  $.merge(array1, array2);

  // Native (array1を変更する。重複した要素は削除されない)
  array1.push(...array2);

  // Native (新しい配列を返す。重複した要素は削除されない)
  function merge(...args) {
    return [].concat(...args);
  }

  // Setを使う方法 (新しい配列を返す。重複した要素は削除される)
  function merge(...args) {
    return Array.from(new Set([].concat(...args)));
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

  <a name="makeArray"></a>+ makeArray

  配列形式のオブジェクトを配列に変換する。

  ```js
  // jQuery
  $.makeArray(arrayLike);

  // Native
  Array.from(arrayLike);

  // ES6なら: スプレッド構文
  [...arrayLike];
  ```

- [6.2](#6.2) <a name='6.2'></a> contains

  ある要素が他の要素の子孫であるか判定する。

  ```js
  // jQuery
  $.contains(el, child);

  // Native
  el !== child && el.contains(child);
  ```

- [6.3](#6.3) <a name='6.3'></a> globalEval

  JavaScriptコードをグローバル空間で実行する。

  ```js
  // jQuery
  $.globalEval(code);

  // Native
  function globalEval(code) {
    const script = document.createElement('script');
    script.text = code;

    document.head.appendChild(script).parentNode.removeChild(script);
  }

  // evalはcurrentコンテキストで実行される。$.globalEvalのコンテキストはグローバルである。
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
    const context = document.implementation.createHTMLDocument();

    // 生成したドキュメントにbase hrefを設定し、パースした要素に含まれるURLが
    // 現在のドキュメントのURLを基準に解決されるようにする
    const base = context.createElement('base');
    base.href = document.location.href;
    context.head.appendChild(base);

    context.body.innerHTML = string;
    return Array.from(context.body.childNodes);
  }
  ```

**[⬆ back to top](#目次)**

## Promise

promiseは非同期処理の最終的な処理結果を表します。jQueryにはpromiseを扱うための独自の方法があります。ネイティブのJavaScriptでは[Promises/A+](https://promisesaplus.com/)規格に則り、薄く、最小限のAPIを実装しています。さらに`async`/`await`を使えば、同期処理のように読みやすく書けます。

- [7.1](#7.1) <a name='7.1'></a> done, fail, always

  `done`はpromiseが成功(resolved)したとき、`fail`は失敗(rejected)したとき、`always`はどちらの場合も呼び出されます。

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

  `when`は複数のpromiseを扱うときに使います。すべてのpromiseが成功したときに成功となり、いずれか1つでも失敗すると失敗となります。

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

  `Deferred`はpromiseを作成する方法の一つです。

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

**[⬆ back to top](#目次)**

## アニメーション

[Web Animations API](https://developer.mozilla.org/ja/docs/Web/API/Web_Animations_API)（`el.animate()`）は、jQueryのエフェクトに最も近いネイティブの機能です。所要時間をミリ秒で指定でき、可能な場合はメインスレッドの外で実行されます。戻り値の`Animation`が持つ`finished` promiseは、アニメーションの終了時にresolveされます。

- [8.1](#8.1) <a name='8.1'></a> show、hide

  ```js
  // jQuery
  $el.show();
  $el.hide();

  // Native
  el.style.display = ''; // スタイルシートで非表示にされている場合は'block'や'inline'などを指定する
  el.style.display = 'none';

  // Native (他の場所で`display`のスタイルが指定されていない場合)
  el.hidden = false;
  el.hidden = true;
  ```

- [8.2](#8.2) <a name='8.2'></a> toggle

  エレメントが表示されていないなら表示し、表示されているなら非表示にします。

  ```js
  // jQuery
  $el.toggle();

  // Native
  if (getComputedStyle(el).display === 'none') {
    el.style.display = ''; // または'block'や'inline'など
  } else {
    el.style.display = 'none';
  }
  ```

- [8.3](#8.3) <a name='8.3'></a> fadeIn、fadeOut

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

- [8.4](#8.4) <a name='8.4'></a> fadeTo

  エレメントのopacityを調整してください。

  ```js
  // jQuery
  $el.fadeTo('slow',0.15);
  // Native (jQueryでは'slow'は600ミリ秒に相当する)
  el.animate([{ opacity: 0.15 }], { duration: 600, fill: 'forwards' });
  ```

- [8.5](#8.5) <a name='8.5'></a> fadeToggle

  フェードイン・フェードアウトを伴ってエレメントの表示・非表示を切り替えます。

  ```js
  // jQuery
  $el.fadeToggle();

  // Native (8.3のfadeInとfadeOutを使う)
  if (getComputedStyle(el).display === 'none') {
    fadeIn(el);
  } else {
    fadeOut(el);
  }
  ```

- [8.6](#8.6) <a name='8.6'></a> スライドアップ、スライドダウン

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

- [8.7](#8.7) <a name='8.7'></a> slideToggle

  スライドを伴って、エレメントの表示・非表示を切り替えます。

  ```js
  // jQuery
  $el.slideToggle();

  // Native (8.6のslideUpとslideDownを使う)
  if (getComputedStyle(el).display === 'none') {
    slideDown(el);
  } else {
    slideUp(el);
  }
  ```

- [8.8](#8.8) <a name='8.8'></a> animate

  CSSプロパティで定義されたアニメーションを表示します。

  ```js
  // jQuery
  $el.animate({ params }, speed);

  // Native (speedはミリ秒で指定する)
  el.animate([params], { duration: speed, fill: 'forwards' });
  ```

## 選択肢

* [You Might Not Need jQuery](https://youmightnotneedjquery.com/) - ネイティブのJavaScriptでイベント、エレメント、Ajaxを扱うサンプル集(英語)
* [MDN Web Docs](https://developer.mozilla.org/ja/docs/Web/API/Document_Object_Model) - このガイドで使っているすべてのDOM APIのリファレンスです
* [Baseline](https://web.dev/baseline) - Webプラットフォームの機能が各ブラウザで安全に使えるかを確認できます

## 対応ブラウザ

![Chrome][chrome-image] | ![Edge][edge-image] | ![Firefox][firefox-image] | ![Safari][safari-image] | ![Opera][opera-image]
--- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ |

一部のスニペットでは比較的新しいAPIを使っています：`Promise.withResolvers()`（2024年）、`el.replaceChildren()`（2020年）、`AbortSignal.timeout()`（2022年）。古いブラウザもサポートする場合は、[Baseline](https://web.dev/baseline)で対応状況を確認してください。

# ライセンス

MIT

[chrome-image]: https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png
[firefox-image]: https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png
[edge-image]: https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png
[opera-image]: https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png
[safari-image]: https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png
