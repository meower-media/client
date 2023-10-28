<script>
	import Modal from "../../Modal.svelte";
	import FormattedDate from "../../FormattedDate.svelte";
	import AdminNotes from "../../AdminNotes.svelte";

	import * as modals from "../../modals.js";

	import {authHeader, chat} from "../../stores.js";
	import {apiUrl} from "../../urls.js";
	import {adminPermissions, hasPermission} from "../../bitField.js";

	let loading, error;

	async function deleteChat() {
		error = "";
		loading = true;
		try {
			const resp = await fetch(`${apiUrl}admin/chats/${$chat._id}`, {
				method: "DELETE",
				headers: $authHeader,
			});
			if (!resp.ok) {
				throw new Error(
					"Response code is not OK; code is " + resp.status
				);
			}
			$chat = await resp.json();
			loading = false;
		} catch (e) {
			loading = false;
			error = e;
		}
	}

	async function restoreChat() {
		error = "";
		loading = true;
		try {
			const resp = await fetch(
				`${apiUrl}admin/chats/${$chat._id}/restore`,
				{
					method: "POST",
					headers: $authHeader,
				}
			);
			if (!resp.ok) {
				throw new Error(
					"Response code is not OK; code is " + resp.status
				);
			}
			$chat = await resp.json();
			loading = false;
		} catch (e) {
			loading = false;
			error = e;
		}
	}

	$: {
		if (!$chat._id) modals.closeLastModal();
	}
</script>

<Modal showClose={true} on:close={modals.closeLastModal}>
	<h2 slot="header">
		Moderate {$chat.type === 0 ? $chat.nickname : $chat._id}
	</h2>
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
			{#if $chat.deleted}
				<button
					class="action-button"
					disabled={loading}
					on:click={restoreChat}
				>
					Restore chat
				</button>
			{:else}
				<button
					class="action-button"
					disabled={loading}
					on:click={deleteChat}
				>
					Delete chat
				</button>
			{/if}
			{#if error}
				<p style="color: crimson;">{error}</p>
			{:else}
				<br /><br />
			{/if}
		{/if}
	</div></Modal
>

<style>
	.action-button {
		margin-right: 0.25em;
		margin-bottom: 0.25em;
	}
</style>
