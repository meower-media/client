<script>
	import Modal from "../../Modal.svelte";

	import * as modals from "../../modals.js";
	import * as clm from "../../clmanager.js";

	import sleep from "../../sleep";

	let status;
</script>

<Modal on:close={modals.closeLastModal}>
	<h2 slot="header">Enable Repair Mode</h2>
	<div slot="default">
		<form
			on:submit|preventDefault={async () => {
				status = "Enabling repair mode...";
				try {
					await clm.meowerRequest({
						cmd: "direct",
						val: {
							cmd: "repair_mode",
							val: "",
						},
					});
					modals.closeLastModal();
				} catch (e) {
					console.error(e);
					status = "Error: " + e;
				}
			}}
		>
			<p>
				Are you sure? This will disconnect everyone and prevent anyone
				from being able to reconnect!
			</p>
			{#if status}<b>{status}</b><br /><br />{/if}
			<div class="modal-buttons">
				<button type="button" on:click={modals.closeLastModal}
					>Cancel</button
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
