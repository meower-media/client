<script>
	import Modal from "../Modal.svelte";

	import GCMemberModal from "./GCMember.svelte";

	import {authHeader, profileClicked_GC, chat, user} from "../stores.js";
	import {permissions, hasPermission} from "../adminPermissions.js";
	import {apiUrl} from "../urls.js";
	import * as modals from "../modals.js";

	let loading, error;

	$: {
		if ($chat.owner !== $user.name && !hasPermission(permissions.EDIT_CHATS)) {
			if ($chat.members.includes($profileClicked_GC)) {
				modals.showModal(GCMemberModal);
			} else {
				modals.closeLastModal();
			}
		}
	}
</script>

<Modal
	on:close={() => modals.showModal(GCMemberModal)}
>
	<h2 slot="header">Remove {$profileClicked_GC}</h2>
	<div slot="default">
		<form
			on:submit|preventDefault={async () => {
				loading = true;
				try {
					const resp = await fetch(`${apiUrl}chats/${$chat._id}/members/${$profileClicked_GC}`, {
						method: "DELETE",
						headers: $authHeader,
					});
					if (!resp.ok) {
						if (resp.status === 429) {
							throw new Error("Too many requests! Try again later.");
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
			Are you sure you want to remove {$profileClicked_GC} from {$chat.nickname}?
			{#if error}
				<p style="color: crimson;">{error}</p>
			{:else}
				<br /><br />
			{/if}
			<div class="modal-buttons">
				<button
					type="button"
					disabled={loading}
					on:click|preventDefault={() => modals.showModal(GCMemberModal)}>Cancel</button
				>
				<button type="submit" disabled={loading}>Remove member</button>
			</div>
		</form>
	</div>
</Modal>