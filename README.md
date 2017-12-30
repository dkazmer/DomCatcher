# nodeListener
React to specific changes in the DOM tree.

This plugin makes use of [MutationObserver](https://developer.mozilla.org/en/docs/Web/API/MutationObserver) and is designed to make it much easier for developers to "react to changes in a DOM;" eliminating the need to use performance-hindering intervals and recursive timeouts!

A function that accepts 3 parameters: a CSS selector (string - what you're observing), a node (element - where you're observing it), and a callback function. The callback will return 2 arguments: each of them an array of elements that match your criteria. (Version 2 \[beta] is supported only by modern browsers, requires only the first param, and uses the `obey` method to handle your callback.)

It incorporates the use of `Element.matches()` and `Element.querySelectorAll()`, both native to Javascript. This plugin is standalone and requires no dependency.


### Usage
```
nodeListener('#selector', targetElem, callback);
// or
var myObserver = nodeListener('#selector', targetElem, function(nodesAddedArray, nodesRemovedArray){
	if (nodesAddedArray[0]){
		myObserver.disconnect();	// option to stop listening
		alert('Found!');
	}
});
// or v2.beta
nodeListener('#selector').obey(callback);
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
