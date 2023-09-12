<script>
	import Modal from "../Modal.svelte";
	import {authHeader, userToMod} from "../stores.js";
	import {apiUrl} from "../urls.js";
	import * as modals from "../modals.js";
	import sleep from "../sleep";

	let impersonateStatus = "";
</script>

<Modal on:close={() => modals.showModal("moderateUser")}>
	<h2 slot="header">Impersonate {$userToMod}</h2>
	<div slot="default">
		<form
			on:submit|preventDefault={async () => {
				try {
					impersonateStatus = "Getting token...";
					const resp = await fetch(
						`${apiUrl}users/${$userToMod}/impersonate`,
						{
							headers: $authHeader,
						}
					);
					if (!resp.ok) {
						throw new Error(
							"Response code is not OK; code is " + resp.status
						);
					}
					const json = await resp.json();
					impersonateStatus = "Logging in...";
					authHeader.set({
						username: json.username,
						token: json.token,
					});
					window.location.reload();
				} catch (e) {
					console.error(e);
					impersonateStatus = "Error: " + e;
				}
			}}
		>
			<p>Are you sure? You will be logged into their account!</p>
			{#if impersonateStatus}<b>{impersonateStatus}</b><br /><br />{/if}
			<div class="modal-buttons">
				<button
					type="button"
					on:click={() => modals.showModal("moderateUser")}
					>Cancel</button
				>
				{#await sleep(1500)}
					<button disabled type="submit">Impersonate</button>
				{:then}
					<button type="submit">Impersonate</button>
				{/await}
			</div>
		</form>
	</div>
</Modal>
