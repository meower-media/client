// Literally a way to make 2 lines of code into one line of code

import {
	modalShown,
	modalPage,
	basicModalDesc,
	basicModalTitle,
} from "./stores.js";

export function showModal(modal, title, description) {
	if (modal === "basic") {
		if (!title) throw new Error("No title set");
		if (!description) throw new Error("No description set");

		basicModalTitle.set(title);
		basicModalDesc.set(description);
	}

	modalPage.set(modal);
	modalShown.set(true);
}

export function closeModal() {
	modalShown.set(false);
}
