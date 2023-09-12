<script>
	import Modal from "../Modal.svelte";
	import {authHeader, userToMod} from "../stores.js";
	import {apiUrl} from "../urls.js";
	import * as modals from "../modals.js";
	import sleep from "../sleep";

	let clearStatus = "";
</script>

<Modal on:close={() => modals.showModal("moderateUser")}>
	<h2 slot="header">Clear {$userToMod}'s Quote</h2>
	<div slot="default">
		<form
			on:submit|preventDefault={async () => {
				try {
					clearStatus = "Clearing quote...";
					const resp = await fetch(
						`${apiUrl}users/${$userToMod}/admin/quote`,
						{
							method: "DELETE",
							headers: $authHeader,
						}
					);
					if (!resp.ok) {
						throw new Error(
							"Response code is not OK; code is " + resp.status
						);
					}
					modals.showModal("moderateUser");
				} catch (e) {
					console.error(e);
					clearStatus = "Error: " + e;
				}
			}}
		>
			<p>Are you sure? This action is irreversible!</p>
			{#if clearStatus}<b>{clearStatus}</b><br /><br />{/if}
			<div class="modal-buttons">
				<button
					type="button"
					on:click={() => modals.showModal("moderateUser")}
					>Cancel</button
				>
				{#await sleep(1500)}
					<button disabled type="submit">Clear Quote</button>
				{:then}
					<button type="submit">Clear Quote</button>
				{/await}
			</div>
		</form>
	</div>
</Modal>
