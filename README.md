# nodeListener
React to specific changes in the DOM tree.

This plugin makes use of [MutationObserver](https://developer.mozilla.org/en/docs/Web/API/MutationObserver) and is designed to make it much easier for developers to "react to changes in a DOM;" eliminating the need to use performance-hindering intervals and recursive timeouts!

Accepts two parameters: a CSS selector (string - what you're observing - required), and a node (ancestral element - where you're observing it - optional). The second param defaults to `document.body`, but it's recommended to narrow the observer scope when possible. And in most cases it's best to set this up _after_ your page has rendered.

It incorporates the use of `Element.matches()` and `Element.querySelectorAll()`, both native to Javascript. No dependencies.

### Methods
- `then` : accepts only a callback, which returns both added and removed sets of elements in separate arrays in two arguments; also returns observer context `this`.

- `on` : accepts two parameters: 1. event (`add` or `remove`), and 2. callback, which returns one set of elements as an array; also returns observer context `this`.


### Usage
```js
// example 1
nodeListener('.selector', targetElem).then((added, removed) => {});

// example 2
var myObserver = nodeListener('#selector', parentElem).on('add', addedArray => {
	if (addedArray[0]){
		myObserver.disconnect();	// stop observing / listening
		alert('Found!');
	}
});

// example 3
nodeListener('#selector').on('remove', function(arr){
	if (arr.length > 0) this.disconnect();
});
```


### Browser Support
This plugin is coded in ES6 Javascript. Version 3 is supported by modern browsers only. **For IE support use v1.x**; a polyfill for `Element.matches()` may be required.
