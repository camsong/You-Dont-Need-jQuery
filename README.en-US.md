## You Don't Need jQuery

Frontend environment develops repaidly nowadays, modern browsers have already implemented a great deal of DOM/BOM APIs which are good enough. We don't have to learn jQuery from scratch for DOM manipulation or events. In the meantime, thanks to the prevail of frontend libraries like React, Angular and Vue, manipulating DOM directly becomes anti-pattern, jQuery has never been less important. This project summarized most of the jQuery method alternatives in native implementation, with IE 10+ support.

## Catalog

* [Query Selector](#query-selector)
* [CSS & Style](#css-style)
* [DOM Manipulation](#dom-manipulation)
* [Ajax](#ajax)
* [Events](#events)
* [Form](#form)
* [Utilities](#utilities)
* [Browser Support](#browser-support)

## Query Selector

Common selectors like class, id or attribute we can use `document.querySelector` or `document.querySelectorAll` for substitution. The differences lie in:
* `document.querySelector` returns the first matched Element
* `document.querySelectorAll` returns all matched Elements as NodeList. It can be converted to Array using `[].slice.call`
* If no element matched, jQuery would return `[]` whereas these DOM API will return `null`. Pay attention to Null Pointer Exception.


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

#### closest
return the first matched element by provided selector, traversing from current element to document.

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

#### parentsUntil
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

#### iframe contents

`$('iframe').contents()` returns `contentDocument` for this specific iframe


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

#### width, height
Width and Height are theoretically identical, take Height as example:

```js
// window height
$(window).height();
// without scrollbar, behaves like jQuery
window.document.documentElement.clientHeight
// with scrollbar
window.innerHeight

// document height
$(document).height();
document.documentElement.scrollHeight

// el height
$el.height();
// behaves like jQuery
function getHeight(el) {
  const styles = this.getComputedStyles(el);
  const height = el.offsetHeight;
  const borderTopWidth = parseFloat(styles.borderTopWidth);
  const borderBottomWidth = parseFloat(styles.borderBottomWidth);
  const paddingTop = parseFloat(styles.paddingTop);
  const paddingBottom = parseFloat(styles.paddingBottom);
  return height - borderBottomWidth - borderTopWidth - paddingTop - paddingBottom;
}
// accurate to integer（when `border-box`, it's `height`; when `content-box`, it's `height + padding + border`）
el.clientHeight
// accurate to decimal（when `border-box`, it's `height`; when `content-box`, it's `height + padding + border`）
el.getBoundingClientRect().height
```

#### position, offset

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

#### append
append child element after the last child of parent element

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

#### prepend

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

#### insertBefore
Insert a new node before the selected elements

jQuery
```js
$newEl.insertBefore(queryString);
```

Native
```js
newEl.insertBefore(document.querySelector(queryString))
```

#### insertAfter
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

#### scrollTop

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

#### trigger

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


// get index of e.currentTarget between `.radio` 
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
