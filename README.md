## You Don't Need jQuery

前端发展很快，现代浏览器原生 API 已经足够好用。我们并不需要为了操作 DOM、Event 等再学习一下 jQuery 的 API。同时由于 React、Angular、Vue 等框架的流行，直接操作 DOM 不再是好的模式，jQuery 使用场景大大减少。本项目总结了大部分 jQuery API 替代的方法，暂时只支持 IE10+ 以上浏览器。

## Query selector

常用的 class、id、属性 选择器都可以使用 `document.querySelector` 或 `document.querySelectorAll` 替代。区别是
* `document.querySelector` 返回第一个匹配的 Element
* `document.querySelectorAll` 返回所有匹配的 Element 组成的 NodeList。它可以通过 `[].slice.call()` 把它转成 Array
* 如果匹配不到任何元素，jQuery 返回空数组 []`，但 `document.querySelector` 返回返回 `null`，注意空指针异常


```js
// query by class
$('.css')
document.querySelectorAll('.css')

// query by id
$('#id')
el.querySelectorAll('#id')

// query by attribute
$('a[target=_blank]')
document.querySelectorAll('a[target=_blank]')
 
// find
$el.find('li')
el.querySelectorAll('li')

// body
$('body')
document.body

// attr
$el.attr('foo')
e.getAttribute('foo')

// data attribute
$el.data('foo')
el.dataset['foo']
// or using getAttribute
el.getAttribute('data-foo');

// siblings
$el.siblings();
[].filter.call(el.parentNode.children, function(child) {
	return child !== el;
})

// prev
$el.prev();
el.previousElementSibling

// next
$el.next();
el.nextElementSibling
```

### closet
closet 获得匹配选择器的第一个祖先元素，从当前元素开始沿 DOM 树向上。

jQuery
```js
$el.closest(queryString)
```

Native
```js
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

### parentsUntil
Get the ancestors of each element in the current set of matched elements, up to but not including the element matched by the selector, DOM node, or jQuery object.

jQuery
```js
$el.parentsUntil(selector, filter)
```

Native
```js
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

### iframe contents

jQuery 对象的 iframe `contents()` 返回的是 iframe 内的 `document`


```js
// contents
$iframe.contents()
iframe.contentDocument

// query
$iframe.contents().find('.css')
iframe.contentDocument.querySelectorAll('.css')
```

## css style

```js
// set css
$el.css('border-width', 20)
el.style.borderWidth = '20px'

// addClass
$el.addClass(className)
el.classList.add(className);

// removeClass
$el.removeClass(className)
el.classList.remove(className);

// hasClass
$el.hasClass(className)
el.classList.contains(className);

// toggleClass
$el.toggleClass(className)
el.classList.toggle(className);

// get style
TODO

// set style
TODO
```

### Width & Height
Width 与 Height 获取方法相同，下面以 Height 为例：

```js
// window height
$(window).height();
// 不含 scrollbar，与 jQuery 行为一致
window.document.documentElement.clientHeight
// 含 scrollbar
window.innerHeight

// document height
$(document).height();
document.documentElement.scrollHeight

// el height
$el.height();
// 与 jQuery 一致（一直为 content 区域的高度）
function getHeight(el) {
  const styles = this.getComputedStyles(el);
  const height = el.offsetHeight;
  const borderTopWidth = parseFloat(styles.borderTopWidth);
  const borderBottomWidth = parseFloat(styles.borderBottomWidth);
  const paddingTop = parseFloat(styles.paddingTop);
  const paddingBottom = parseFloat(styles.paddingBottom);
  return height - borderBottomWidth - borderTopWidth - paddingTop - paddingBottom;
}
// 精确到整数（border-box 时为 height 值，content-box 时为 height + padding + border 值）
el.clientHeight
// 精确到小数（border-box 时为 height 值，content-box 时为 height + padding + border 值）
el.getBoundingClientRect().height

// $iframe .contents() 方法返回 iframe 的 contentDocument
$('iframe').contents().height()
iframe.contentDocument.documentElement.scrollHeight
```

### Position, Offset

```js
// position
$el.position();
{ left: el.offsetLeft, top: el.offsetTop }

// offset
$el.offset();
function getOffset (el) {
  let box = el.getBoundingClientRect();
  return {
	  top: box.top + window.pageYOffset - document.documentElement.clientTop,
    left: box.left + window.pageXOffset - document.documentElement.clientLeft
  }
}
```

## DOM Manipulation

```js
// remove
$el.remove()
el.parentNode.removeChild(el);

// get text
$el.text()
el.textContent

// set text
$el.text(string)
el.textContent = string

// get html
$el.html()
el.innerHTML

// set html
$el.html(htmlString)
el.innerHTML = htmlString
```

### append
append 插入到子节点的末尾

jQuery
```js
$el.append("<div id='container'>hello</div>")
```

Native
```js
let newEl = document.createElement('div');
newEl.setAttribute('id', 'container');
newEl.innerHTML = 'hello';
el.appendChild(newEl)
```

### prepend

jQuery
```js
$el.prepend("<div id='container'>hello</div>")
```

Native
```js
let newEl = document.createElement('div')
newEl.setAttribute('id', 'container')
newEl.innerHTML = 'hello'
el.insertBefore(newEl, el.firstChild)
```

### insertBefore
Insert a new node before the selected elements

jQuery
```js
$newEl.insertBefore(queryString);
```

Native
```js
newEl.insertBefore(document.querySelector(queryString))
```

### insertAfter
Insert a new node after the selected elements

jQuery
```js
$newEl.insertAfter(queryString);
```

Native
```js
function insertAfter(newEl, queryString) {
  var parent = document.querySelector(queryString).parentNode;

  if (parent.lastChild === newEl) {
    parent.appendChild(newEl);
  } else {
    parent.insertBefore(newEl, parent.nextSibling);
  }
},
```

### Scroll

```js
// scrollTop
$(window).scrollTop()
(document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
```


## Ajax

Replace with [fetch](https://github.com/camsong/fetch-ie8) and [fetch-jsonp](https://github.com/camsong/fetch-jsonp)


## Events
For a complete replacement with namespace and delegation, refer to https://github.com/oneuijs/oui-dom-events

```js
// bind an event with on
$el.on(eventName, eventHandler);
el.addEventListener(eventName, eventHandler);

// unbind an event with off
$el.off(eventName, eventHandler);
el.removeEventListener(eventName, eventHandler);
```

### trigger and event

jQuery
```js
$(el).trigger('custom-event', {key1: 'data'});
```

Native
```js
if (window.CustomEvent) {
  var event = new CustomEvent('custom-event', {detail: {key1: 'data'}});
} else {
  var event = document.createEvent('CustomEvent');
  event.initCustomEvent('custom-event', true, true, {key1: 'data'});
}

el.dispatchEvent(event);
```

## Form

```js
$('#my-input').val()
document.querySelector('#my-input').value


// 获取 e.currentTarget 相对于 .radio 选择结果的索引
$(e.currentTarget).index('.radio')
[].indexOf.call(document.querySelectAll('.radio'), e.currentTarget)
```

## Utilities

```js
// isArray IE10+
$.isArray(range)
Array.isArray(range)

// trim
$.trim(string)
String.trim(string)

// extend, use object.assign polyfill https://github.com/ljharb/object.assign
$.extend({}, defaultOpts, opts)
Object.assign({}, defaultOpts, opts)

// contains
$.contains(el, child);
el !== child && el.contains(child);
```


## Browser Support

![Chrome](https://raw.github.com/alrra/browser-logos/master/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/firefox/firefox_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/internet-explorer/internet-explorer_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/opera/opera_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/safari/safari_48x48.png)
--- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | 10+ ✔ | Latest ✔ | 6.1+ ✔ |

# License

MIT