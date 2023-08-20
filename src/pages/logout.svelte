<script>
	import {
		screen,
		setupPage,
		modalShown,
		user,
		authHeader,
	} from "../lib/stores.js";
	//import unloadedProfile from "../lib/unloadedProfile.js";
	import {systemDarkMode} from "../lib/responsiveness.js";

	import {goto} from "@roxi/routify";
	import {onMount, tick} from "svelte";

	onMount(async () => {
		localStorage.clear();
		user.set({
			name: null,
			lvl: 0,
			unread_inbox: false,
			theme: "orange",
			mode: !systemDarkMode(),
			sfx: true,
			bgm: false,
			bgm_song: 2,
			layout: "new",
			pfp_data: 1,
			quote: "",
		});
		authHeader.set({});
		modalShown.set(false);
		$goto("/");
		screen.set("setup");
		await tick();
		setupPage.set("reconnect");
	});
</script>
