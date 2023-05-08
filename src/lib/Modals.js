import {
    modalShown,
    modalPage
} from "./stores.js";

export function ShowModal(Modal, Title, Desc) {
    if (Modal == "BasicModal") {
        // Use Title/Desc
    } else {
        modalPage.set(Modal)
        modalShown.set(true)
    }
}

export function CloseModal() {
    modalShown.set(false)
}