/*global window:false, console:false, document:false, event:false, jQuery:false */

/***********************************************************************************

author:		Daniel Kazmer - http://webshifted.com
created:	03.08.2017
version:	1.0.0

Do something when a specific element changes the DOM tree where specified.

version history:
	1.0.0	born; added logic in checkers for child nodes (03.08.2017)

Accepted arguments:
	@selector String: CSS selector
	@target Element: element within which to listen
	@callback Function: do something on success (returns 2 args)

usage:
	nodeListener('#selector', targetElem, callback);
	var myObserver = nodeListener('#selector', targetElem, function(nodesAddedArray, nodesRemovedArray){
		if (nodesAddedArray[0]){
			alert('Found!');
			myObserver.disconnect();
		}
	});

***********************************************************************************/

function nodeListener(selector, target, callback){
	var aNodes = [],	// added nodes
		rNodes = [],	// removed nodes
		isFound = false,
		isRemoved = false;

	var checkAddedNodes = function(arr){
		for (var i = 0; i < arr.length; i++){
			if (arr[i].matches(selector)){	// parent doesn't match selector (or course)
				isFound = true;
				aNodes.push(arr[i]);
			} else if (arr[i].querySelectorAll(selector).length > 0){
				// if child matches exist
				isFound = true;
				var arrChildren = arr[i].querySelectorAll(selector);
				for (var j = 0; j < arrChildren.length; j++){
					aNodes.push(arrChildren[j]);
				}
			}
		}
	};

	var checkRemovedNode = function(el){
		// enabled subtree to get kids
		if (el.matches(selector)){
			isRemoved = true;
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

		if (isFound || isRemoved)
			callback(aNodes, rNodes);

		// clear
		setTimeout(function(){
			aNodes = [];
			rNodes = [];
			isFound = false;
			isRemoved = false;
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