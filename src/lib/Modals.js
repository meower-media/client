// Literally a way to make 2 lines of code into one line of code

import {
    modalShown,
    modalPage,
    BasicModalDesc,
    BasicModalTitle
} from "./stores.js";

export function ShowModal(Modal, Title, Description) {
    BasicModalTitle.set("")
    BasicModalDesc.set("")
    if (Modal == "BasicModal") {
        if (!Title) {console.warn("No title set")}
        if (!Description) {console.warn("No description set")}
        BasicModalTitle.set(Title)
        BasicModalDesc.set(Description)
    }
    // Save a bit of processing time removing that else statement
    // Of course we dont need to sqeeze out performance.

    modalPage.set(Modal)
    modalShown.set(true)
}

export function CloseModal() {
    modalShown.set(false)
}