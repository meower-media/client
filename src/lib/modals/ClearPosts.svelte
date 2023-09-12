<script>
	import Modal from "../Modal.svelte";
	import {userToMod} from "../stores.js";
	import * as modals from "../modals.js";
	import * as clm from "../clmanager.js";
	import sleep from "../sleep";

	let status = "";
</script>

<Modal on:close={() => modals.showModal("moderateUser")}>
	<h2 slot="header">Delete {$userToMod}'s Posts</h2>
	<div slot="default">
		<form
			on:submit|preventDefault={async () => {
				status = "Deleting posts...";
				try {
					await clm.meowerRequest({
						cmd: "direct",
						val: {
							cmd: "clear_user_posts",
							val: $userToMod,
						},
					});
					modals.closeModal();
				} catch (e) {
					console.error(e);
					status = "Error: " + e;
				}
			}}
		>
			<p>Are you sure? This action is irreversible!</p>
			{#if status}<b>{status}</b><br /><br />{/if}
			<div class="modal-buttons">
				<button
					type="button"
					on:click={() => modals.showModal("moderateUser")}
					>Cancel</button
				>
				{#await sleep(1500)}
					<button disabled type="submit">Delete Posts</button>
				{:then}
					<button type="submit">Delete Posts</button>
				{/await}
			</div>
		</form>
	</div>
</Modal>
