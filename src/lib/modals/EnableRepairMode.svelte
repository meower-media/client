<script>
	import Modal from "../Modal.svelte";

	import * as modals from "../modals.js";
	import * as clm from "../clmanager.js";
	import sleep from "../sleep";
</script>

<Modal
	on:close={() => {
		modals.closeModal();
	}}
>
	<h2 slot="header">Enable Repair Mode</h2>
	<div slot="default">
		<form
			on:submit|preventDefault={async e => {
				try {
					await clm.meowerRequest({
						cmd: "direct",
						val: {
							cmd: "repair_mode",
							val: "",
						},
					});
					modals.closeModal();
				} catch (e) {
					console.error(e);
				}
			}}
		>
			<p>Are you sure? This will disconnect everyone and prevent anyone from being able to reconnect!</p>
			<div class="modal-buttons">
				<button
					type="button"
					on:click={() => {
						modals.closeModal();
					}}>Cancel</button
				>
				{#await sleep(1500)}
					<button disabled type="submit">Confirm</button>
				{:then}
					<button type="submit">Confirm</button>
				{/await}
			</div>
		</form>
	</div>
</Modal>