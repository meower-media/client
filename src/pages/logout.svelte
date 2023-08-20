<script>
	import {
		screen,
		setupPage,
		modalShown,
		user,
		authHeader,
	} from "../lib/stores.js";
	import {unloadedProfile} from "../lib/unloadedProfile.js";

	import {goto} from "@roxi/routify";
	import {onMount, tick} from "svelte";
	
	onMount(async () => {
		localStorage.clear();
		user.set(unloadedProfile);
		authHeader.set({});
		modalShown.set(false);
		$goto("/");
		screen.set("setup");
		await tick();
		setupPage.set("reconnect");
	});
</script>
