<script>
	import Modal from "../../Modal.svelte";

	import {authHeader} from "../../stores.js";
	import {apiUrl} from "../../urls.js";
	import * as modals from "../../modals.js";

	import {focus} from "@roxi/routify";

	export let modalData;

	let {cidr} = modalData;

	let type;
	let loading, error;
</script>

<Modal on:close={modals.closeLastModal}>
	<h2 slot="header">Create Netblock</h2>
	<div slot="default">
		<form
			on:change={() => (error = "")}
			on:submit|preventDefault={async () => {
				loading = true;
				try {
					const resp = await fetch(
						`${apiUrl}admin/netblocks/${btoa(cidr)}`,
						{
							method: "PUT",
							headers: {
								"Content-Type": "application/json",
								...$authHeader,
							},
							body: JSON.stringify({type}),
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
			<label for="cidr" style={error ? "color: crimson;" : ""}
				><b>CIDR</b>
				{#if error}<i>- {error}</i>{/if}</label
			>
			<input
				id="cidr"
				type="text"
				class="modal-input white"
				placeholder="CIDR..."
				disabled={loading}
				bind:value={cidr}
				use:focus
			/><br /><br />
			<label for="netblock-type"><b>Type</b></label><br />
			<select
				id="netblock-type"
				class="modal-input grow"
				style="width: 100%; margin-bottom: 0.25em;"
				bind:value={type}
			>
				<option value={0} selected={type === 0}>Full</option>
				<option value={1} selected={type === 1}>Registration</option>
			</select><br />
			{#if type === 0}
				This blocks any connection request to Meower's CloudLink server
				and blocks any REST API request.
			{:else if type === 1}
				This blocks new accounts from being created.
			{/if}
			<br /><br />
			<div class="modal-buttons">
				<button
					type="button"
					disabled={loading}
					on:click={modals.closeLastModal}>Cancel</button
				>
				<button type="submit" disabled={!cidr || loading}
					>Create Netblock</button
				>
			</div>
		</form>
	</div>
</Modal>
