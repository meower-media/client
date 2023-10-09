<script>
	import Modal from "../../Modal.svelte";

	import {authHeader, chat, user} from "../../stores.js";
	import {adminPermissions, hasPermission} from "../../bitField.js";
	import {apiUrl} from "../../urls.js";
	import * as modals from "../../modals.js";

	import {focus} from "@roxi/routify";

	export let modalData;

	let { username } = modalData;

	let loading, error;

	$: {
		if (
			$chat.owner !== $user.name &&
			!hasPermission(adminPermissions.EDIT_CHATS)
		) {
			modals.closeLastModal();
		}
	}
</script>

<Modal on:close={modals.closeLastModal}>
	<h2 slot="header">Remove {username}</h2>
	<div slot="default">
		<form
			on:submit|preventDefault={async () => {
				loading = true;
				try {
					const resp = await fetch(
						`${apiUrl}chats/${$chat._id}/members/${username}`,
						{
							method: "DELETE",
							headers: $authHeader,
						}
					);
					if (!resp.ok) {
						if (resp.status === 429) {
							throw new Error(
								"Too many requests! Try again later."
							);
						}
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
			Are you sure you want to remove {username} from {$chat.nickname}?
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
				<button type="submit" disabled={loading} use:focus>Remove member</button>
			</div>
		</form>
	</div>
</Modal>
