<script>
	import Modal from "../../Modal.svelte";

	import {authHeader} from "../../stores.js";
	import {apiUrl} from "../../urls.js";
	import * as modals from "../../modals.js";

	import {focus} from "@roxi/routify";

	export let modalData;

	let {cidr} = modalData;

	let loading, error;
</script>

<Modal on:close={modals.closeLastModal}>
	<h2 slot="header">Delete {cidr} Netblock</h2>
	<div slot="default">
		<form
			on:submit|preventDefault={async () => {
				loading = true;
				try {
					const resp = await fetch(
						`${apiUrl}admin/netblocks/${btoa(cidr)}`,
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
					modals.closeLastModal();
				} catch (e) {
					loading = false;
					error = e;
				}
			}}
		>
			Are you sure you want to delete {cidr} netblock?
			{#if error}
				<p style="color: crimson;">{error}</p>
			{:else}
				<br /><br />
			{/if}
			<div class="modal-buttons">
				<button
					type="button"
					disabled={loading}
					on:click={modals.closeLastModal}>Cancel</button
				>
				<button type="submit" disabled={loading} use:focus
					>Delete</button
				>
			</div>
		</form>
	</div>
</Modal>
