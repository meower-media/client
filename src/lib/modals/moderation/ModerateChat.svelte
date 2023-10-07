<script>
	import Modal from "../../Modal.svelte";
	import FormattedDate from "../../FormattedDate.svelte";
	import AdminNotes from "../../AdminNotes.svelte";

	import * as modals from "../../modals.js";
	import * as clm from "../../clmanager.js";

	import {chat} from "../../stores.js";
	import {adminPermissions, hasPermission} from "../../bitField.js";

	let deleteStatus;

	async function deleteChat() {
		deleteStatus = "Deleting...";
		try {
			await clm.meowerRequest({
				cmd: "direct",
				val: {
					cmd: "update_chat",
					val: {
						chatid: $chat._id,
						deleted: true,
					},
				},
			});
			$chat.deleted = true;
			deleteStatus = "Deleted!";
		} catch (e) {
			deleteStatus = "Error deleting chat: " + e;
		}
	}

	async function reinstateChat() {
		deleteStatus = "Reinstating...";
		try {
			await clm.meowerRequest({
				cmd: "direct",
				val: {
					cmd: "update_chat",
					val: {
						chatid: $chat._id,
						deleted: false,
					},
				},
			});
			$chat.deleted = false;
			deleteStatus = "Reinstated!";
		} catch (e) {
			deleteStatus = "Error reinstating chat: " + e;
		}
	}

	$: {
		if (!$chat._id) modals.closeLastModal();
	}
</script>

<Modal on:close={modals.closeLastModal}>
	<h2 slot="header">Moderate {$chat.nickname}</h2>
	<div slot="default">
		<h2>Chat Info</h2>
		<b>UUID:</b>
		{$chat._id}<br />
		<b>Nickname:</b>
		{$chat.nickname}<br />
		<b>Owner:</b>
		{$chat.owner}<br />
		<b>Members:</b>
		{$chat.members.length}<br />
		<b>Created:</b>
		<FormattedDate date={$chat.created} /><br />
		<b>Last active:</b>
		<FormattedDate date={$chat.last_active} /><br />
		<b>Deleted?</b>
		{$chat.deleted ? "yes" : "no"}

		<br /><br />

		{#if hasPermission(adminPermissions.VIEW_NOTES)}
			<h2>Notes</h2>
			<AdminNotes identifier={$chat._id} />
			<br /><br />
		{/if}

		{#if hasPermission(adminPermissions.EDIT_CHATS)}
			<h2>Danger Zone</h2>
			{#if deleteStatus}
				<b>{deleteStatus}</b>
				<br /><br />
			{/if}
			{#if $chat.deleted}
				<button
					class="action-button"
					on:click={async () => await reinstateChat()}
				>
					Reinstate chat
				</button>
			{:else}
				<button
					class="action-button"
					on:click={async () => await deleteChat()}
				>
					Delete chat
				</button>
			{/if}
			<br /><br />
		{/if}

		<div class="modal-buttons">
			<button
				type="button"
				on:click={() => {
					modals.closeLastModal();
				}}>Close</button
			>
		</div>
		<div />
	</div></Modal
>

<style>
	.action-button {
		margin-right: 0.25em;
		margin-bottom: 0.25em;
	}
</style>
