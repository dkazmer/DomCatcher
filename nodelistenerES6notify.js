/*global window:false, console:false, document:false, event:false, jQuery:false */

/***********************************************************************************

author:		Daniel Kazmer - http://webshifted.com
version:	2.0.0
created:	03.08.2017
modified:	17.12.2017

React to a change in the DOM. (Do something when a specific element changes the DOM tree where specified.)
This iteration of nodeListener ES6/obey (observe.obey) is experimental; use with caution.

github:		https://github.com/dkazmer/nodeListener
npm:		https://www.npmjs.com/package/nodelistener
license:	MIT

version history:
	2.0.0	added 'obey' method to MutationObserver's prototype; target param now optional: default is document.body (17.12.2017)
	1.0.1	added nodeType checker (15.08.2017)
	1.0.0	born; added logic in checkers for child nodes (03.08.2017)

***********************************************************************************/

function nodeListener(selector, target){
	var aNodes = [],	// added nodes
		rNodes = [];	// removed nodes

	const CHECK_ADDED_NODES = arr => {
		arr.forEach(item => {
			if (item.nodeType === 1){	// ensure ELEMENT_NODE
				if (item.matches(selector)){	// parent doesn't match selector (of course)
					aNodes.push(item);
				} else if (item.querySelectorAll(selector).length > 0){
					// if child matches exist
					let arrChildren = item.querySelectorAll(selector);
					arrChildren.forEach(child => aNodes.push(child));
				}
			}
		});
	};

	const CHECK_REMOVED_NODES = el => {
		// enabled subtree to get kids
		if (el.nodeType === 1 && el.matches(selector)) rNodes.push(el);
	};

	// create an observer instance
	var observer = new MutationObserver(mutations => {
		mutations.forEach(mutation => {
			// added nodes
			if (mutation.addedNodes.length > 0)
				CHECK_ADDED_NODES(mutation.addedNodes);

			// removed nodes
			if (mutation.removedNodes.length > 0)	// length never exceeds 1
				CHECK_REMOVED_NODES(mutation.removedNodes[0]);
		});

		if (aNodes.length > 0 || rNodes.length > 0)
			document.dispatchEvent(event);

		// clear
		setTimeout(() => {
			aNodes = [];
			rNodes = [];
		}, 0);
	});

	// create 'obey' method & associated event listener
	const event = new Event('nodeListenerEvent'+selector);

	{
		let callback = null;
		let notifier = fn => callback = fn;
		document.addEventListener('nodeListenerEvent'+selector, () => callback.call(observer, aNodes, rNodes));
		MutationObserver.prototype.obey = notifier;
	}

	// configuration of the observer:
	const CONFIG = { 'attributes': true, 'childList': true, 'characterData': true, 'subtree': true };

	// CONFIG.attributeOldValue = true; CONFIG.characterDataOldValue = true;
	// CONFIG.attributeFilter = [];

	// pass in the target node, as well as the observer options
	observer.observe((target || document.body), CONFIG);

	// to disconnect at any time
	return observer;
}