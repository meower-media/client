<script>
	import Modal from "../Modal.svelte";
	import ProfileView from "../ProfileView.svelte";

	import RemoveMemberModal from "./RemoveMember.svelte";
	import TransferChatOwnershipModal from "./TransferChatOwnership.svelte";

	import {profileClicked_GC, user, chat} from "../stores.js";
	import {adminPermissions, hasPermission} from "../bitField.js";
	import * as modals from "../modals.js";

	import {goto} from "@roxi/routify";

	$: {
		if (!$chat.members.includes($profileClicked_GC))
			modals.closeLastModal();
	}
</script>

<Modal on:close={modals.closeLastModal}>
	<h2 slot="header">{$profileClicked_GC}'s Profile</h2>
	<div slot="default">
		<ProfileView
			username={$profileClicked_GC}
			canClick={true}
			canDoActions={true}
		/>
		<button
			class="long"
			on:click={() => {
				modals.closeLastModal();
				$goto(`/users/${$profileClicked_GC}`);
			}}>View full profile</button
		>
		{#if ($chat.owner == $user.name && $profileClicked_GC != $user.name) || hasPermission(adminPermissions.EDIT_CHATS)}
			<button
				class="long"
				on:click={() => modals.showModal(RemoveMemberModal)}
			>
				Remove from chat
			</button>
			<button
				class="long"
				on:click={() => modals.showModal(TransferChatOwnershipModal)}
			>
				Make owner of chat
			</button>
		{/if}
		<button
			class="long"
			on:click={() => {
				modals.closeLastModal();
			}}>Close</button
		>
	</div>
</Modal>

<style>
	.long {
		width: 100%;
		margin: 0;
		margin-bottom: 0.2em;
	}
</style>
