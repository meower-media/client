<script>
	import {
		screen,
		setupPage,
		user,
		authHeader,
	} from "../lib/stores.js";
	import unloadedProfile from "../lib/unloadedprofile.js";
	import * as modals from "../lib/modals.js";

	import {goto} from "@roxi/routify";
	import {onMount, tick} from "svelte";

	onMount(async () => {
		localStorage.removeItem("meower_savedusername");
		localStorage.removeItem("meower_savedpassword");
		localStorage.removeItem("meower_savedconfig");
		user.set(unloadedProfile());
		authHeader.set({});
		modals.closeModal();
		$goto("/");
		screen.set("setup");
		await tick();
		setupPage.set("reconnect");
	});
</script>
