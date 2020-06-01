/*global window:false, console:false, document:false, event:false, jQuery:false */

/***********************************************************************************

author:		Daniel Kazmer - http://webshifted.com
version:	1.0.2
created:	03.08.2017
modified:	18.12.2017

React to specific changes in the DOM tree.
This plugin makes use of [MutationObserver](https://developer.mozilla.org/en/docs/Web/API/MutationObserver) and is designed to make it much easier for developers to "react to changes in a DOM;" eliminating the need to use performance-hindering intervals and recursive timeouts!
A function that accepts 3 parameters: a CSS selector (string - what you're observing), a node (element - where you're observing it), and a callback function. The callback will return 2 arguments: each of them an array of elements that match your criteria.
It incorporates the use of `Element.matches()` and `Element.querySelectorAll()`, both native to Javascript. This plugin is standalone and requires no dependency.

github:		https://github.com/dkazmer/nodeListener
npm:		https://www.npmjs.com/package/nodelistener
license:	MIT

version history:
	1.0.2	removed extraneous "found" & "removed" variables (18.12.2017)
	1.0.1	added nodeType checker (15.08.2017)
	1.0.0	born; added logic in checkers for child nodes (03.08.2017)

***********************************************************************************/

function nodeListener(selector, target, callback){
	var aNodes = [],	// added nodes
		rNodes = [];	// removed nodes

	var checkAddedNodes = function(arr){
		for (var i = 0; i < arr.length; i++){
			if (arr[i].nodeType === 1){	// ensure ELEMENT_NODE
				if (arr[i].matches(selector)){	// parent doesn't match selector (of course)
					aNodes.push(arr[i]);
				} else if (arr[i].querySelectorAll(selector).length > 0){
					// if child matches exist
					var arrChildren = arr[i].querySelectorAll(selector);
					for (var j = 0; j < arrChildren.length; j++){
						aNodes.push(arrChildren[j]);
					}
				}
			}
		}
	};

	var checkRemovedNode = function(el){
		// enabled subtree to get kids
		if (el.nodeType === 1 && el.matches(selector)){
			rNodes.push(el);
		}
	};

	// create an observer instance
	var observer = new MutationObserver(function(mutations){
		mutations.forEach(function(mutation){
			// added nodes
			if (mutation.addedNodes.length > 0)
				checkAddedNodes(mutation.addedNodes);

			// removed nodes
			if (mutation.removedNodes.length > 0)	// length never exceeds 1
				checkRemovedNode(mutation.removedNodes[0]);
		});

		if (aNodes.length > 0 || rNodes.length > 0)
			callback(aNodes, rNodes);

		// clear
		setTimeout(function(){
			aNodes = [];
			rNodes = [];
		}, 0);
	});

	// configuration of the observer:
	var config = { 'attributes': true, 'childList': true, 'characterData': true, 'subtree': true };

	// config.attributeOldValue = true; config.characterDataOldValue = true;
	// config.attributeFilter = [];

	// pass in the target node, as well as the observer options
	observer.observe(target, config);

	// to disconnect at any time
	return observer;
}