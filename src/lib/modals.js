// Literally a way to make 2 lines of code into one line of code

import {modalStack} from "./stores.js";

let _modalStack = [];
modalStack.subscribe(v => (_modalStack = v));

export function showModal(modal, data) {
	_modalStack.unshift({modal, data});
	modalStack.set(_modalStack);
}

export function replaceLastModal(modal, data) {
	_modalStack.splice(0, 1);
	_modalStack.unshift({modal, data});
	modalStack.set(_modalStack);
}

export function closeLastModal() {
	_modalStack.splice(0, 1);
	modalStack.set(_modalStack);
}

export function closeAllModals() {
	modalStack.set([]);
}
