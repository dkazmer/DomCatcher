/*global window:false, console:false, document:false, event:false, jQuery:false */

/***********************************************************************************

author:		Daniel B. Kazmer (webshifted.com)
version:	3.0.0
created:	03.08.2017
modified:	03.02.2018

React to a change in the DOM. (Do something when a specific element changes the DOM tree where specified.)

github:		https://github.com/dkazmer/nodeListener
npm:		https://www.npmjs.com/package/nodelistener
license:	MIT

version history:
	3.0.0	removed 'obey' method to favour 'on' & 'then' methods, the former accepting 2 params: event type & callback (03.02.2018)
	2.0.0	added 'obey' method to MutationObserver's prototype; target param now optional: default is document.body (17.12.2017)
	1.0.1	added nodeType checker (15.08.2017)
	1.0.0	born; added logic in checkers for child nodes (03.08.2017)

***********************************************************************************/

function nodeListener(selector, target){
	var aNodes	= [],	// added nodes
		rNodes	= [],	// removed nodes
		stamp	= Math.round((new Date()).getTime() / 1000),	// unix
		eventID	= 'nodeListenerEvent.' + selector + stamp;		// try to make it super unique to minimize risk of conflict

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

	const DISPATCH_EVENTS = () => {
		if (aNodes.length > 0 || rNodes.length > 0){
			document.dispatchEvent(event);

			if (aNodes.length > 0)
				document.dispatchEvent(eventAdd);

			if (rNodes.length > 0)
				document.dispatchEvent(eventRemove);
		}
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

		DISPATCH_EVENTS();

		// clear
		setTimeout(() => {
			aNodes = [];
			rNodes = [];
		}, 0);
	});

	// create 'on' method & associated event listener
	const event			= new Event(eventID);			// then
	const eventAdd		= new Event(eventID+'.add');	// on add
	const eventRemove	= new Event(eventID+'.remove');	// on remove

	{
		const notifierOn = (t, fn) => {
			const set = (eID, fn2) => document.addEventListener(eID, fn2);

			switch (t){	// type
				case 'add': set(eventID+'.add', () => fn.call(observer, aNodes)); break;
				case 'remove': set(eventID+'.remove', () => fn.call(observer, rNodes)); break;
				default: console.warn('nodeListener: unaccepted or no event specified for \'on\' method'); setTimeout(() => observer.disconnect(), 0);
			}
		};

		const notifierThen = fn => {
			if (fn instanceof Function)
				document.addEventListener(eventID, () => fn.call(observer, aNodes, rNodes));
			else
				console.warn('nodeListener: \'then\' method only accepts a function');
		};

		MutationObserver.prototype.then	= notifierThen;
		MutationObserver.prototype.on	= notifierOn;
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