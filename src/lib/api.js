import { browser } from '$app/environment';

export let serverurl = (localStorage.getItem("") && browser) || "wss://server.meower.org"