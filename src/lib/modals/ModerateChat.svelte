<script>
	import Modal from "../Modal.svelte";
	import Loading from "../Loading.svelte";
	import FormattedDate from "../FormattedDate.svelte";

	import * as modals from "../modals.js";
	import * as clm from "../clmanager.js";

	import {authHeader, user as authedUser, chat} from "../stores.js";
	import {permissions, hasPermission} from "../adminPermissions.js";
	import {apiUrl, encodeApiURLParams} from "../urls.js";

	import {goto} from "@roxi/routify";

	let notes, noteSavingStatus, deleteStatus;

	async function getNotes() {
		const resp = await fetch(`${apiUrl}notes/${$chat._id}`, {
			headers: $authHeader,
		});
		if (!resp.ok) {
			throw new Error("Response code is not OK; code is " + resp.status);
		}
		notes = await resp.json();
	}

	async function saveNotes() {
		noteSavingStatus = "Saving...";
		try {
			const resp = await fetch(`${apiUrl}notes/${notes._id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					...$authHeader,
				},
				body: JSON.stringify({notes: notes.notes}),
			});
			if (!resp.ok) {
				throw new Error(
					"Response code is not OK; code is " + resp.status
				);
			}
			notes = await resp.json();
			noteSavingStatus = "Saved!";
		} catch (e) {
			noteSavingStatus = "Error saving notes: " + e;
		}
	}

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
</script>

<Modal
	on:close={() => {
		modals.closeModal();
	}}
>
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

		{#if hasPermission(permissions.VIEW_NOTES)}
			<h2>Notes</h2>
			{#await getNotes()}
				<Loading />
			{:then}
				<textarea
					class="white"
					placeholder="Write something..."
					disabled={!hasPermission(permissions.EDIT_NOTES)}
					bind:value={notes.notes}
					on:change={async () => {
						await saveNotes();
					}}
				/>
				{#if notes.last_modified_at}
					{#if noteSavingStatus}<b>{noteSavingStatus}</b><br />{/if}
					<b>Last modified at:</b>
					<FormattedDate date={notes.last_modified_at} /><br />
					<b>Last modified by:</b>
					{notes.last_modified_by}
				{/if}
			{:catch e}
				Error loading notes: {e}
			{/await}

			<br /><br />
		{/if}

		{#if hasPermission(permissions.EDIT_CHATS)}
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
					modals.closeModal();
				}}>Close</button
			>
		</div>
		<div />
	</div></Modal
>

<style>
	textarea {
		display: block;
		margin-top: 0.25em;
		margin-bottom: 0.25em;
		resize: vertical;
		width: 100%;
	}

	.action-button {
		margin-right: 0.25em;
		margin-bottom: 0.25em;
	}
</style>
