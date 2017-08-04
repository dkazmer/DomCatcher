# nodeListener
Do something when a specific element changes the DOM tree where specified.

This plugin is designed to make use of [MutationObserver](https://developer.mozilla.org/en/docs/Web/API/MutationObserver)
and to make it much easier for developers to "react to changes in a DOM." This eliminates the need to use performance-hindering looping timeouts or intervals!

It's a simple function that accepts 3 parameters: a CSS selector (string - what you're observing), an node (element - where you're observing it), and a callback function. The callback will return 2 arguments: each of them an array of elements that match your critera.

It incorporates the use of `Element.matches()` and `Element.querySelectorAll()`, both native to Javascript. This plugin is standalone and requires no dependency.


### Usage
```
nodeListener('#selector', targetElem, callback);
// or
var myObserver = nodeListener('#selector', targetElem, function(nodesAddedArray, nodesRemovedArray){
	if (nodesAddedArray[0]){
		alert('Found!');
		myObserver.disconnect();	// to stop listening
	}
});
```


### Polyfill
Some older browsers don't support `Element.matches()`, so a polyfill may be necessary.
```
if (!Element.prototype.matches){
	Element.prototype.matches = 
		Element.prototype.matchesSelector || 
		Element.prototype.mozMatchesSelector ||
		Element.prototype.msMatchesSelector || 
		Element.prototype.oMatchesSelector || 
		Element.prototype.webkitMatchesSelector ||
		function(s){
			var matches = (this.document || this.ownerDocument).querySelectorAll(s),
				i = matches.length;
			while (--i >= 0 && matches.item(i) !== this) {}
			return i > -1;
		};
}
```
