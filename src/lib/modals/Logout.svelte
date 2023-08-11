<script>
	import Modal from "../Modal.svelte";

	import {screen, setupPage, modalShown, authHeader} from "../stores.js";

	import {goto} from "@roxi/routify";
	import {tick} from "svelte";
</script>

<Modal
	on:close={() => {
		$modalShown = false;
	}}
>
	<h2 slot="header">Logout</h2>
	<div slot="default">
		<span>Are you sure you would like to logout?</span>
		<br /><br />
		<div class="modal-buttons">
			<button
				on:click={() => {
					$modalShown = false;
				}}>Cancel</button
			>
			<button
				on:click={async () => {
					localStorage.clear();
					authHeader.set({});
					modalShown.set(false);
					$goto("/");
					screen.set("setup");
					await tick();
					setupPage.set("reconnect");
				}}>Logout</button
			>
		</div>
	</div>
</Modal>
