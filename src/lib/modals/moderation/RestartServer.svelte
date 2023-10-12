<script>
	import Modal from "../../Modal.svelte";

	import {authHeader} from "../../stores.js";
	import {apiUrl} from "../../urls.js";
	import * as modals from "../../modals.js";

	import sleep from "../../sleep";

	let loading, error;
</script>

<Modal on:close={modals.closeLastModal}>
	<h2 slot="header">Restart Server</h2>
	<div slot="default">
		<form
			on:submit|preventDefault={async () => {
				loading = true;
				try {
					const resp = await fetch(`${apiUrl}admin/server/restart`, {
						method: "POST",
						headers: $authHeader,
					});
					if (!resp.ok) {
						if (resp.status === 501) {
							throw new Error(
								"Server doesn't have a restart command set!"
							);
						}
						throw new Error(
							"Response code is not OK; code is " + resp.status
						);
					}
					modals.closeLastModal();
				} catch (e) {
					error = e;
					loading = false;
				}
			}}
		>
			<p>Are you sure you would like to restart the server?</p>
			{#if error}
				<p style="color: crimson;">{error}</p>
			{:else}
				<br />
			{/if}
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
