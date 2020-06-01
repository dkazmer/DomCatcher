# NodeWatcher
React to specific changes in the DOM tree.

```js
new NodeWatcher('.my-selector');
```

NodeWatcher wraps [MutationObserver](https://developer.mozilla.org/en/docs/Web/API/MutationObserver) and makes it user friendly and actually usable. It's designed to make it much easier for developers to "react to changes in a DOM;" eliminating the need to use performance-hindering intervals or recursive timeouts!


### Parameters
Param. | Type | Desc. | Required
--- | --- | --- | ---
(1) CSS selector | String | what you're observing | yes
(2) Node | HTMLElement | ancestral element - where you're observing it (defaults to `document.body`) | no

It __is__ recommended to narrow the observer scope when possible. And in most cases it's best to set this up _after_ your page has rendered.


### Methods
- `then` : accepts only a callback, which returns both added and removed sets of elements in separate arrays in two arguments; also returns observer context `this`.

- `on` : accepts two parameters: 1. event string (`add` or `remove`), and 2. callback, which returns one set of elements as an array; also returns observer context `this`.

- `destroy` : disconnects the observer and destroys the wrapper instance.


### Usage
```js
// example 1
new NodeWatcher('.selector', parentElem).then((added, removed) => {});

// example 2
let myObserver = new NodeWatcher('#selector', parentElem);

myObserver.on('add', addedArray => {
	if (addedArray[0]){
		myObserver.disconnect();	// stop observing / listening
		alert('Element created!');
	}
});

// example 3
new NodeWatcher('#selector').on('remove', function(arr){
	if (arr.length > 0) this.disconnect();
});
```


### Browser Support
Modern browsers only; that is, no IE support. (The era of the legacy browser is over!)
