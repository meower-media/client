// Literally a way to make 2 lines of code into one line of code

import {
	modalShown,
	modalPage,
	basicModalDesc,
	basicModalTitle,
} from "./stores.js";

export function showModal(modal, title, description) {
	basicModalTitle.set("");
	basicModalDesc.set("");
	if (modal === "BasicModal") {
		if (!title) throw new Error("No title set");
		if (!description) throw new Error("No description set");

		basicModalTitle.set(title);
		basicModalDesc.set(description);
	}
	// Save a bit of processing time removing that else statement
	// Of course we don't need to sqeeze out performance.

	modalPage.set(modal);
	modalShown.set(true);
}

export function CloseModal() {
	modalShown.set(false);
}
