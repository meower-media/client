<script>
	import Modal from "../Modal.svelte";

	import {
		setupPage,
		screen,
		modalShown,
		disconnectReason,
		disconnected,
	} from "../stores.js";

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
					$modalShown = false;
					disconnectReason.set("Intentional disconnect");
					disconnected.set(false);
					screen.set("setup");
					await tick();
					setupPage.set("reconnect");
				}}>Logout</button
			>
		</div>
	</div>
</Modal>
