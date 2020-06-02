/*global window:false, console:false, document:false, event:false, jQuery:false */

/***********************************************************************************

author:		Daniel B. Kazmer (webshifted.com)
version:	4.0.0
created:	03.08.2017
modified:	31.05.2020

React to a change in the DOM. (Do something when a specific element changes the DOM tree where specified.)

version history:
	4.0.0	renamed, modularized, class, re-did callbacks, general refactoring, added history tracker; added destroy method (31.05.2020)
	3.1.0	removed event listeners for better, non-conflicting callback handling (07.02.2018)
	3.0.0	removed 'obey' method to favour 'on' & 'then' methods, the former accepting 2 params: event type & callback (03.02.2018)
	2.0.0	added 'obey' method to MutationObserver's prototype; target param now optional: default is document.body (17.12.2017)
	1.0.1	added nodeType checker (15.08.2017)
	1.0.0	born; added logic in checkers for child nodes (03.08.2017)

***********************************************************************************/

export class NodeWatcher {
	constructor (selector, target) {
		const aNodes	= [];	// added nodes
		const rNodes	= [];	// removed nodes
		const callbacks = {};
		const history	= {added: [], removed: []};	// all history

		this.get = {
			get callbacks() { return callbacks },
			get watcher() { return observer },
			get history() { return history }
		};

		const checkNodes = {
			added(arr) {
				var exists = false;
				arr.forEach(item => {
					if (item.nodeType === 1) {	// ensure ELEMENT_NODE
						if (item.matches(selector)) {	// parent doesn't match selector (of course)
							aNodes.push(item);
							exists = true;
						} else if (item.querySelectorAll(selector).length) {
							// if child matches exist
							let arrChildren = item.querySelectorAll(selector);
							arrChildren.forEach(child => aNodes.push(child));
							exists = true;
						}
					}
				});
				if (exists) setTimeout(finish, 0);
			},
			removed(el) {
				// enabled subtree to get kids
				if (el.nodeType === 1 && el.matches(selector)) {
					rNodes.push(el);
					setTimeout(finish, 0);
				}
			}
		}

		const array = {
			/**
			 * @param {any[]} arr
			 */
			clear(arr) {
				while (arr.length) {
					arr.splice(0, 1);
				}
			},
			/**
			 * @param {any[]} arr
			 */
			clone(arr) {
				return [...arr];
				// return Object.assign([], arr);
			}
		};

		const fire = () => {
			if (callbacks.add && aNodes.length) callbacks.add(array.clone(aNodes));
			if (callbacks.remove && rNodes.length) callbacks.remove(array.clone(rNodes));
			if (callbacks.then && (aNodes.length || rNodes.length)) callbacks.then(array.clone(aNodes), array.clone(rNodes));
		};

		const finish = () => {
			fire();

			// add to history
			if (aNodes.length) history.added.push(array.clone(aNodes));
			if (rNodes.length) history.removed.push(array.clone(rNodes));

			// clear
			array.clear(aNodes);
			array.clear(rNodes);
		};

		// create an observer instance
		const observer = new MutationObserver(mutations => {
			mutations.forEach(mutation => {
				// added nodes
				if (mutation.addedNodes.length)
					checkNodes.added(mutation.addedNodes);

				// removed nodes
				if (mutation.removedNodes.length)	// length never exceeds 1
					checkNodes.removed(mutation.removedNodes[0]);
			});
		});

		// configuration of the observer:
		const config = { attributes: true, childList: true, characterData: true, subtree: true };

		// pass in the target node, as well as the observer options
		observer.observe((target || document.body), config);
	}

	on(name, fn) {
		switch (name) {
			case 'add': case 'remove':
				this.get.callbacks[name] = e => fn.call(this, e); break; // passing "this" provides context
			default: {
				console.warn('NodeWatcher.on: "'+name+'" is not an accepted event; stopped watching');
				setTimeout(this.stopWatching, 0);
			}
		}

		return this;
	}

	then(fn) {
		if (fn instanceof Function)
			this.get.callbacks.then = (aNodes, rNodes) => fn.call(this, aNodes, rNodes);
		else
			console.warn('NodeWatcher.then: method only accepts a function');

		return this;
	}

	destroy() {
		this.get.watcher.disconnect();
		for (let i in this) delete this[i];
	}
}