## jQuery'e İhtiyacınız Yok

Önyüz ortamları bugünlerde çok hızlı gelişiyor, öyle ki modern tarayıcılar DOM/DOM APİ'lere ait önemli gereklilikleri çoktan yerine getirdiler. DOM işleme ve olaylar için, en baştan jQuery ögrenmemize gerek kalmadı. Bu arada, üstünlükleri ile jQuery'i önemsizleştiren ve doğrudan DOM değişikliklerinin bir Anti-pattern olduğunu gösteren, React, Angular ve Vue gibi gelişmiş önyüz kütüphanelerine ayrıca teşekkür ederiz. Bu proje, çoğunluğu jQuery yöntemlerine alternatif olan yerleşik uygulamaları içerir.

Kod örnekleri, sürekli güncellenen (evergreen) tarayıcıların güncel sürümlerini hedefler (Chrome, Edge, Firefox, Safari). Internet Explorer artık Microsoft tarafından desteklenmediği için IE'ye özgü yedek (fallback) kodlar kaldırıldı. Bunlara hâlâ ihtiyacınız varsa, [IE uyumlu son sürüme](https://github.com/camsong/You-Dont-Need-jQuery/tree/c4e00b3) göz atabilirsiniz.

## İçerik Tablosu

1. [Çeviriler](#Çeviriler)
1. [Sorgu seçiciler](#sorgu-seçiciler)
1. [CSS & Stil](#css--stil)
1. [DOM düzenleme](#dom-düzenleme)
1. [Ajax](#ajax)
1. [Olaylar](#olaylar)
1. [Araçlar](#araçlar)
1. [Alternatifler](#alternatifler)
1. [Tarayıcı desteği](#tarayıcı-desteği)

## Çeviriler

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

## Sorgu seçiciler

Yaygın olan class, id ve özellik seçiciler yerine, `document.querySelector` yada `document.querySelectorAll` kullanabiliriz. Ayrıldıkları nokta:
* `document.querySelector` ilk seçilen öğeyi döndürür
* `document.querySelectorAll` Seçilen tüm öğeleri statik bir NodeList olarak geri döndürür. NodeList `forEach` metodunu destekler ve `Array.from(document.querySelectorAll(selector))` kullanarak bir diziye dönüştürülebilir.
* Herhangi bir öğe seçilemezse, jQuery boş bir jQuery nesnesi ve `document.querySelectorAll` boş bir NodeList döndürürken, `document.querySelector` `null` döndürür.

> Uyarı: `document.getElementById`, `document.getElementsByClassName` ve `document.getElementsByTagName`, `querySelector*` metodlarından biraz daha hızlıdır; ancak `getElementsBy*` metodları, DOM değiştikçe kendiliğinden güncellenen *canlı* (live) bir HTMLCollection döndürür. Ölçerek tespit ettiğiniz bir darboğaz yoksa `querySelector*` metodlarını tercih ediniz.

- [1.0](#1.0) <a name='1.0'></a> Seçici ile sorgu

  ```js
  // jQuery
  $('selector');

  // Yerleşik
  document.querySelectorAll('selector');
  ```

- [1.1](#1.1) <a name='1.1'></a> Sınıf ile sorgu

  ```js
  // jQuery
  $('.class');

  // Yerleşik
  document.querySelectorAll('.class');

  // yada
  document.getElementsByClassName('class');
  ```

- [1.2](#1.2) <a name='1.2'></a> Id ile sorgu

  ```js
  // jQuery
  $('#id');

  // Yerleşik
  document.querySelector('#id');

  // yada
  document.getElementById('id');
  ```

- [1.3](#1.3) <a name='1.3'></a> Özellik ile sorgu

  ```js
  // jQuery
  $('a[target=_blank]');

  // Yerleşik
  document.querySelectorAll('a[target=_blank]');
  ```

- [1.4](#1.4) <a name='1.4'></a> Öğe erişimi

  + Node'a erişim

    ```js
    // jQuery
    $el.find('li');

    // Yerleşik
    el.querySelectorAll('li');
    ```

  + Body'e erişim

    ```js
    // jQuery
    $('body');

    // Yerleşik
    document.body;
    ```

  + Özelliğe erişim

    ```js
    // jQuery
    $el.attr('foo');

    // Yerleşik
    el.getAttribute('foo');
    ```

  + Data özelliğine erişim

    ```js
    // jQuery
    $el.data('foo');

    // Yerleşik
    el.dataset.foo;

    // yada
    el.getAttribute('data-foo');
    ```

- [1.5](#1.5) <a name='1.5'></a> Kardeş/Önceki/Sonraki öğeler

  + Kardeş öğeler

    ```js
    // jQuery
    $el.siblings();

    // Yerleşik
    [...el.parentNode.children].filter((child) =>
      child !== el
    );
    ```

  + Önceki öğeler

    ```js
    // jQuery
    $el.prev();

    // Yerleşik
    el.previousElementSibling;
    ```

  + Sonraki öğeler

    ```js
    // jQuery
    $el.next();

    // Yerleşik
    el.nextElementSibling;
    ```

- [1.6](#1.6) <a name='1.6'></a> En yakın

  Verilen seçici ile eşleşen ilk öğeyi döndürür, geçerli öğeden başlayarak document'a kadar geçiş yapar.

  ```js
  // jQuery
  $el.closest(selector);

  // Yerleşik
  el.closest(selector);
  ```

- [1.7](#1.7) <a name='1.7'></a> Önceki atalar

  Verilen seçici ile eşleşen öğe veya DOM node veya jQuery nesnesi hariç, mevcut öğe ile aradaki tüm önceki ataları bir set dahilinde verir.

  ```js
  // jQuery
  $el.parentsUntil(selector, filter);

  // Yerleşik
  function parentsUntil(el, selector, filter) {
    const result = [];

    // eşleştirme, atadan başlar
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

    // Yerleşik
    document.querySelector('#my-input').value;
    ```

  + e.currentTarget ile `.radio` arasındaki dizini verir

    ```js
    // jQuery
    $('.radio').index(e.currentTarget);

    // Yerleşik
    [...document.querySelectorAll('.radio')].indexOf(e.currentTarget);
    ```

- [1.9](#1.9) <a name='1.9'></a> Iframe İçeriği

  Mevcut Iframe için `$('iframe').contents()` yerine `contentDocument` döndürür.

  + Iframe İçeriği

    ```js
    // jQuery
    $iframe.contents();

    // Yerleşik
    iframe.contentDocument;
    ```

  + Iframe seçici

    ```js
    // jQuery
    $iframe.contents().find('.css');

    // Yerleşik
    iframe.contentDocument.querySelectorAll('.css');
    ```

**[⬆ üste dön](#İçerik-tablosu)**

## CSS & Stil

- [2.1](#2.1) <a name='2.1'></a> CSS

  + Stili verir

    ```js
    // jQuery
    $el.css('color');

    // Yerleşik
    // NOT: Çözümlenmiş değeri döndürür, örneğin '#f01' yerine 'rgb(255, 0, 17)'
    getComputedStyle(el).color;
    ```

  + Stil değiştir

    ```js
    // jQuery
    $el.css({ color: '#f01' });

    // Yerleşik
    el.style.color = '#f01';
    ```

  + Birden fazla stili değiştir

    ```js
    // jQuery
    $el.css({ color: '#f01', 'border-color': '#f02' });

    // Yerleşik
    Object.assign(el.style, { color: '#f01', borderColor: '#f02' });
    ```

  + Sınıf ekle

    ```js
    // jQuery
    $el.addClass(className);

    // Yerleşik
    el.classList.add(className);
    ```

  + Sınıf çıkart

    ```js
    // jQuery
    $el.removeClass(className);

    // Yerleşik
    el.classList.remove(className);
    ```

  + sınfı var mı?

    ```js
    // jQuery
    $el.hasClass(className);

    // Yerleşik
    el.classList.contains(className);
    ```

  + Sınfı takas et

    ```js
    // jQuery
    $el.toggleClass(className);

    // Yerleşik
    el.classList.toggle(className);
    ```

- [2.2](#2.2) <a name='2.2'></a> Genişlik ve Yükseklik

  Genişlik ve Yükseklik teorik olarak aynı şekilde, örnek olarak Yükseklik veriliyor

  + Window Yüksekliği

    ```js
    // jQuery
    $(window).height();

    // kaydırma çubuğu olmaksızın, jQuery ile aynı
    window.document.documentElement.clientHeight;

    // kaydırma çubuğu ile birlikte
    window.innerHeight;
    ```

  + Document yüksekliği

    ```js
    // jQuery
    $(document).height();

    // Yerleşik
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

  + Öğe yüksekliği

    ```js
    // jQuery
    $el.height();

    // Yerleşik
    function getHeight(el) {
      const styles = window.getComputedStyle(el);
      const height = el.offsetHeight;
      const borderTopWidth = parseFloat(styles.borderTopWidth);
      const borderBottomWidth = parseFloat(styles.borderBottomWidth);
      const paddingTop = parseFloat(styles.paddingTop);
      const paddingBottom = parseFloat(styles.paddingBottom);
      return height - borderBottomWidth - borderTopWidth - paddingTop - paddingBottom;
    }

    // Tamsayı olarak daha doğru olanı (`border-box` iken, `height - border` esas; `content-box` ise, `height + padding` esas alınır)
    el.clientHeight;

    // Ondalık olarak daha doğru olanı (`border-box` iken, `height` esas; `content-box` ise, `height + padding + border` esas alınır)
    el.getBoundingClientRect().height;
    ```

- [2.3](#2.3) <a name='2.3'></a> Pozisyon ve Ara-Açıklığı

  + Pozisyon

    ```js
    // jQuery
    $el.position();

    // Yerleşik
    const position = { left: el.offsetLeft, top: el.offsetTop };
    ```

  + Ara-Açıklığı

    ```js
    // jQuery
    $el.offset();

    // Yerleşik
    function getOffset (el) {
      const box = el.getBoundingClientRect();

      return {
        top: box.top + window.scrollY,
        left: box.left + window.scrollX
      };
    }
    ```

- [2.4](#2.4) <a name='2.4'></a> Üste kaydır

  ```js
  // jQuery
  $(window).scrollTop();

  // Yerleşik
  window.scrollY;
  ```

**[⬆ üste dön](#İçerik-tablosu)**

## DOM düzenleme

- [3.1](#3.1) <a name='3.1'></a> Çıkartma
  ```js
  // jQuery
  $el.remove();

  // Yerleşik
  el.remove();
  ```

- [3.2](#3.2) <a name='3.2'></a> Metin

  + Get text

    ```js
    // jQuery
    $el.text();

    // Yerleşik
    el.textContent;
    ```

  + Set text

    ```js
    // jQuery
    $el.text(string);

    // Yerleşik
    el.textContent = string;
    ```

- [3.3](#3.3) <a name='3.3'></a> HTML

  + HTML'i alma

    ```js
    // jQuery
    $el.html();

    // Yerleşik
    el.innerHTML;
    ```

  + HTML atama

    ```js
    // jQuery
    $el.html(htmlString);

    // Yerleşik
    el.innerHTML = htmlString;
    ```

- [3.4](#3.4) <a name='3.4'></a> Sona ekleme

  Ata öğenin son çocuğundan sonra öğe ekleme

  ```js
  // jQuery: DOMString ve Node nesneleri için ortak söz dizimi
  $parent.append(newEl | '<div id="container">Hello World</div>');

  // Yerleşik (Element veya metin): dizeler HTML olarak ayrıştırılmaz, düz metin olarak eklenir
  parent.append(newEl | 'Hello World');

  // Yerleşik (HTML dizesi)
  parent.insertAdjacentHTML('beforeend', '<div id="container">Hello World</div>');
  ```

- [3.5](#3.5) <a name='3.5'></a> Öne ekleme

  ```js
  // jQuery: DOMString ve Node nesneleri için ortak söz dizimi
  $parent.prepend(newEl | '<div id="container">Hello World</div>');

  // Yerleşik (Element veya metin): dizeler HTML olarak ayrıştırılmaz, düz metin olarak eklenir
  parent.prepend(newEl | 'Hello World');

  // Yerleşik (HTML dizesi)
  parent.insertAdjacentHTML('afterbegin', '<div id="container">Hello World</div>');
  ```

- [3.6](#3.6) <a name='3.6'></a> Öncesine Ekleme

  Seçili öğeden önceki yere yeni öğe ekleme

  ```js
  // jQuery
  $newEl.insertBefore(selector);

  const el = document.querySelector(selector);

  // Yerleşik (Element)
  el.before(newEl);

  // Yerleşik (HTML dizesi)
  el.insertAdjacentHTML('beforebegin', '<div id="container">Hello World</div>');
  ```

- [3.7](#3.7) <a name='3.7'></a> Sonrasına ekleme

  Seçili öğeden sonraki yere yeni öğe ekleme

  ```js
  // jQuery
  $newEl.insertAfter(selector);

  const el = document.querySelector(selector);

  // Yerleşik (Element)
  el.after(newEl);

  // Yerleşik (HTML dizesi)
  el.insertAdjacentHTML('afterend', '<div id="container">Hello World</div>');
  ```

- [3.8](#3.8) <a name='3.8'></a> eşit mi?

  Sorgu seçici ile eşleşiyor ise `true` döner

  ```js
  // jQuery için not: `is` aynı zamanda `function` veya `elements` için de geçerlidir fakat burada bir önemi bulunmuyor
  $el.is(selector);

  // Yerleşik
  el.matches(selector);
  ```
- [3.9](#3.9) <a name='3.9'></a> Klonlama

  Mevcut öğenin bir derin kopyasını oluşturur

  ```js
  // jQuery. Olay işleyicilerini ve verileri de kopyalamak için `true` parametresi veriniz.
  $el.clone();

  // Yerleşik. Derin kopya için `true` parametresi veriniz; olay dinleyicileri hiçbir zaman kopyalanmaz.
  el.cloneNode(true);
  ```

**[⬆ üste dön](#İçerik-tablosu)**

## Ajax

[Fetch API](https://fetch.spec.whatwg.org/), ajax için XMLHttpRequest yerine kullanılan standarttır ve tüm modern tarayıcılarda çalışır. `$.ajax`'ın aksine `fetch`, 404 veya 500 gibi HTTP hata durumlarında promise'i **reddetmez**; `response.ok` değerini kendiniz kontrol etmelisiniz. JSONP istekleri için [fetch-jsonp](https://github.com/camsong/fetch-jsonp) deneyiniz.

- [4.0](#4.0) <a name='4.0'></a> JSON verisi alma

  ```js
  // jQuery
  $.getJSON(url).done(handleData).fail(handleError);

  // Yerleşik
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

- [4.0.1](#4.0.1) <a name='4.0.1'></a> JSON verisi gönderme (POST)

  ```js
  // jQuery
  $.ajax({
    url,
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(data),
  });

  // Yerleşik
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  ```

- [4.0.2](#4.0.2) <a name='4.0.2'></a> İsteği iptal etme ve zaman aşımı

  ```js
  // jQuery
  const jqXHR = $.ajax({ url, timeout: 5000 });
  jqXHR.abort();

  // Yerleşik
  const controller = new AbortController();
  fetch(url, { signal: controller.signal });
  controller.abort();

  // Yerleşik (zaman aşımı)
  fetch(url, { signal: AbortSignal.timeout(5000) });
  ```

- [4.1](#4.1) <a name='4.1'></a> Sunucudan veri yükleme ve dönen HTML'i eşleşen öğenin içine yerleştirme

  ```js
  // jQuery
  $(selector).load(url, completeCallback)

  // Yerleşik
  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      document.querySelector(selector).innerHTML = html;
    })
    .then(completeCallback);
  ```

**[⬆ üste dön](#İçerik-tablosu)**

## Olaylar

- [5.1](#5.1) <a name='5.1'></a> on ile bir öğeye bağlama

  ```js
  // jQuery
  $el.on(eventName, eventHandler);

  // Yerleşik
  el.addEventListener(eventName, eventHandler);
  ```

- [5.1.1](#5.1.1) <a name='5.1.1'></a> one ile bir öğeye yalnızca bir kez bağlama

  ```js
  // jQuery
  $el.one(eventName, eventHandler);

  // Yerleşik
  el.addEventListener(eventName, eventHandler, { once: true });
  ```

- [5.1.2](#5.1.2) <a name='5.1.2'></a> Olay delegasyonu

  ```js
  // jQuery
  $el.on(eventName, selector, eventHandler);

  // Yerleşik
  el.addEventListener(eventName, (event) => {
    const target = event.target.closest(selector);
    if (target && el.contains(target)) {
      eventHandler.call(target, event);
    }
  });
  ```

- [5.2](#5.2) <a name='5.2'></a> off ile bir bağlamayı sonlandırma

  ```js
  // jQuery
  $el.off(eventName, eventHandler);

  // Yerleşik
  el.removeEventListener(eventName, eventHandler);

  // Yerleşik: jQuery namespace'lerinde olduğu gibi birden fazla dinleyiciyi tek seferde kaldırma
  const controller = new AbortController();
  el.addEventListener('click', onClick, { signal: controller.signal });
  el.addEventListener('keydown', onKeydown, { signal: controller.signal });
  controller.abort();
  ```

- [5.3](#5.3) <a name='5.3'></a> Tetikleyici

  ```js
  // jQuery
  $(el).trigger('custom-event', {key1: 'data'});

  // Yerleşik. jQuery olayları üst öğelere doğru yayılır (bubble); yerleşik olaylar ise `bubbles: true` verilmedikçe yayılmaz.
  // Verileri, olay işleyicisi içinde `event.detail` üzerinden okuyunuz.
  const event = new CustomEvent('custom-event', {
    bubbles: true,
    cancelable: true,
    detail: { key1: 'data' },
  });

  el.dispatchEvent(event);
  ```

**[⬆ üste dön](#İçerik-tablosu)**

## Araçlar

- [6.1](#6.1) <a name='6.1'></a> isArray

  ```js
  // jQuery
  $.isArray(array);

  // Yerleşik
  Array.isArray(array);
  ```

- [6.2](#6.2) <a name='6.2'></a> Trim

  ```js
  // jQuery
  $.trim(string);

  // Yerleşik
  string.trim();
  ```

- [6.3](#6.3) <a name='6.3'></a> Nesne atama

  `deep` parametresi olmadan çağrılan `$.extend` gibi, `Object.assign` ve spread söz dizimi de yalnızca yüzeysel (shallow) bir kopya oluşturur.

  ```js
  // jQuery
  $.extend({}, object1, object2);

  // Yerleşik
  Object.assign({}, object1, object2);

  // Yerleşik (spread)
  ({ ...object1, ...object2 });
  ```

  Tek bir nesnenin derin kopyasını oluşturma:

  ```js
  // jQuery
  $.extend(true, {}, object);

  // Yerleşik. Fonksiyonlar ve DOM düğümleri kopyalanamaz
  structuredClone(object);
  ```

- [6.4](#6.4) <a name='6.4'></a> İçerme

  ```js
  // jQuery
  $.contains(el, child);

  // Yerleşik
  el !== child && el.contains(child);
  ```

**[⬆ üste dön](#İçerik-tablosu)**

## Alternatifler

* [jQuery'e İhtiyacınız Yok](https://youmightnotneedjquery.com/) - Yaygın olan olay, öğe ve ajax işlemlerinin yalın Javascript'teki karşılıklarına ait örnekler
* [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) - Burada kullanılan tüm DOM API'leri için başvuru kaynağı
* [Baseline](https://web.dev/baseline) - Hangi web platformu özelliklerinin tarayıcılar arasında güvenle kullanılabileceğini gösterir

## Tarayıcı Desteği

![Chrome][chrome-image] | ![Edge][edge-image] | ![Firefox][firefox-image] | ![Safari][safari-image] | ![Opera][opera-image]
--- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ |

Bazı örnekler daha yeni API'ler kullanır: `Promise.withResolvers()` (2024), `el.replaceChildren()` (2020) ve `AbortSignal.timeout()` (2022). Daha eski tarayıcıları da destekliyorsanız [Baseline](https://web.dev/baseline) üzerinden kontrol ediniz.

# Lisans

MIT

[chrome-image]: https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png
[firefox-image]: https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png
[edge-image]: https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png
[opera-image]: https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png
[safari-image]: https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png
