// thanks https://github.com/vitejs/vite/issues/2248#issuecomment-899020512
import {precacheAndRoute} from "workbox-precaching";

if (typeof is_vite_preview === "undefined") {
	precacheAndRoute(self.__WB_MANIFEST);
}
