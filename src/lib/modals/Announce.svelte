<script>
	import Modal from "../Modal.svelte";
	import {modalShown, announcementToSend} from "../stores.js";
	import * as clm from "../clmanager.js";
	import sleep from "../sleep";

	let sendStatus = "";
</script>

<Modal
	on:close={() => {
		$modalShown = false;
	}}
>
	<h2 slot="header">Send Announcement</h2>
	<div slot="default">
		<form
			on:submit|preventDefault={async e => {
				try {
					sendStatus = "Sending...";
					await clm.meowerRequest({
						cmd: "direct",
						val: {
							cmd: "announce",
							val: $announcementToSend,
						},
					});
					sendStatus = "";
					$modalShown = false;
				} catch (e) {
					console.error(e);
					sendStatus = "Error: " + e;
				}
			}}
		>
			<p>Are you sure? This will send a message to EVERYONE's inbox!</p>
			<div class="send-status">{sendStatus}</div>
			<div class="modal-buttons">
				<button
					type="button"
					on:click={() => {
						$modalShown = false;
					}}>Cancel</button
				>
				{#await sleep(1500)}
					<button disabled type="submit">Send</button>
				{:then}
					<button type="submit">Send</button>
				{/await}
			</div>
		</form>
	</div>
</Modal>

<style>
	.send-status {
		display: block;
		font-size: 75%;
		font-weight: bold;
		margin: 0.25em 0;
	}
</style>
