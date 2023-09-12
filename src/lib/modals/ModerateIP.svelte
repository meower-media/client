<script>
	import Modal from "../Modal.svelte";
	import Loading from "../Loading.svelte";
	import FormattedDate from "../FormattedDate.svelte";

	import * as modals from "../modals.js";
	import * as clm from "../clmanager.js";

	import {
		authHeader,
		user as authedUser,
		ipToMod,
		modPanelOpen,
	} from "../stores.js";
	import {permissions, hasPermission} from "../adminPermissions.js";
	import {apiUrl, encodeApiURLParams} from "../urls.js";

	import {goto} from "@roxi/routify";

	let ip, notes, noteSavingStatus, blockStatus;

	async function getIPData() {
		const ipData = await clm.meowerRequest({
			cmd: "direct",
			val: {
				cmd: "get_ip_data",
				val: $ipToMod,
			},
		});
		ip = ipData.payload;
	}

	async function getNotes() {
		// hash IP for extra security
		const msgUint8 = new TextEncoder().encode(ip._id);
		const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		const hashHex = hashArray
			.map(b => b.toString(16).padStart(2, "0"))
			.join("");

		const resp = await fetch(`${apiUrl}notes/${hashHex}`, {
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

	async function blockIP() {
		blockStatus = "Blocking...";
		try {
			await clm.meowerRequest({
				cmd: "direct",
				val: {
					cmd: "block",
					val: ip._id,
				},
			});
			ip.banned = true;
			blockStatus = "Blocked!";
		} catch (e) {
			blockStatus = "Error: " + e;
		}
	}

	async function unblockIP() {
		blockStatus = "Unblocking...";
		try {
			await clm.meowerRequest({
				cmd: "direct",
				val: {
					cmd: "unblock",
					val: ip._id,
				},
			});
			ip.banned = false;
			blockStatus = "Unblocked!";
		} catch (e) {
			blockStatus = "Error: " + e;
		}
	}
</script>

<Modal
	on:close={() => {
		modals.closeModal();
	}}
>
	<h2 slot="header">Moderate {$ipToMod}</h2>
	<div slot="default">
		{#await getIPData()}
			<Loading />
		{:then}
			<h2>IP Info</h2>
			<b>IP:</b>
			{ip._id}<br />
			<b>Last user:</b>
			{ip.last_user}<br />
			<b>Blocked?</b>
			{ip.banned ? "yes" : "no"}<br />
			<b>Last used:</b>
			<FormattedDate date={ip.last_used} /><br />
			<b>Users:</b>
			<ul>
				{#each ip.users as username}
					<li>
						<a
							href="/"
							on:click|preventDefault={() =>
								$goto(`/users/${username}`)}>{username}</a
						>
					</li>
				{/each}
			</ul>

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
						{#if noteSavingStatus}<b>{noteSavingStatus}</b><br
							/>{/if}
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

			{#if hasPermission(permissions.BLOCK_IPS)}
				<h2>Danger Zone</h2>
				{#if blockStatus}
					<b>{blockStatus}</b>
					<br /><br />
				{/if}
				{#if ip.banned}
					<button
						class="action-button"
						on:click={async () => await unblockIP()}
					>
						Unblock IP
					</button>
				{:else}
					<button
						class="action-button"
						on:click={async () => await blockIP()}
					>
						Block IP
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
		{:catch e}
			Error getting IP data: {e}
			<br /><br />
			<div class="modal-buttons">
				<button
					type="button"
					on:click={() => {
						modals.closeModal();
					}}>Close</button
				>
			</div>
		{/await}
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
