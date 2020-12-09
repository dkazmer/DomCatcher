# DomCatcher
React to specific changes in the DOM tree.

```js
new DomCatcher('.my-selector');
```

DomCatcher wraps [MutationObserver](https://developer.mozilla.org/en/docs/Web/API/MutationObserver) and makes it user friendly and actually usable. It's designed to make it much easier for developers to "react to changes in a DOM."


### Parameters
Param. | Type | Desc. | Required
--- | --- | --- | ---
(1) CSS selector | String | what you're observing | yes
(2) ancestral element | HTMLElement | where you're observing it (defaults to `document.body`) | no

It _is_ recommended to narrow the observer scope when possible. And in most cases it's best to set this up _after_ your page has rendered.


### Methods
- `then` : accepts only a callback, which receives both added and removed sets of elements in two arguments of arrays
- `on` : accepts two parameters: 1. event string (`add` or `remove`), and 2. callback, which receives one set of elements as an array
- `destroy` : disconnects the observer and destroys the wrapper instance
- `history` : getter; provides full history of instance activity


### Usage
```js
// example 1
new DomCatcher('.selector, .another-selector', parentElem).then((added, removed) => {});

// -----------------------------------------------
// example 2
let myCatcher = new DomCatcher('#id-selector', parentElem);

myCatcher.on('add', addedArray => {
	if (addedArray[0]){
		myCatcher.destroy();
		alert('Element created!');
	}
});

// -----------------------------------------------
// example 3
new DomCatcher('#selector').on('remove', function(arr){
	if (arr.length) this.destroy();
});
```


### Browser Support
Modern browsers only; that is, no IE support. (The legacy browser is dead!)