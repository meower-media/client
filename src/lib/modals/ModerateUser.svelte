<script>
	import Modal from "../Modal.svelte";
	import Loading from "../Loading.svelte";
	import FormattedDate from "../FormattedDate.svelte";

	import * as modals from "../modals.js";
	import * as clm from "../clmanager.js";

	import {
		authHeader,
		user as authedUser,
		userToMod,
		modPanelOpen,
	} from "../stores.js";
	import {permissions, hasPermission} from "../adminPermissions.js";
	import {apiUrl, encodeApiURLParams} from "../urls.js";

	import {goto} from "@roxi/routify";

	let user,
		notes,
		noteSavingStatus,
		alertText,
		alertStatus,
		banStateChanged,
		banSavingStatus,
		kickStatus;

	let formattedBanExpires = "";
	$: {
		if (
			hasPermission(permissions.VIEW_BAN_STATE) &&
			user &&
			user.ban.expires !== 0
		) {
			const date = new Date(user.ban.expires * 1000); // Convert to milliseconds

			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, "0");
			const day = String(date.getDate()).padStart(2, "0");
			const hours = String(date.getHours()).padStart(2, "0");
			const minutes = String(date.getMinutes()).padStart(2, "0");

			formattedBanExpires = `${year}-${month}-${day}T${hours}:${minutes}`;
		}
	}

	async function getUserdata() {
		const resp = await fetch(`${apiUrl}users/${$userToMod}/admin`, {
			headers: $authHeader,
		});
		if (!resp.ok) {
			throw new Error("Response code is not OK; code is " + resp.status);
		}
		user = await resp.json();
	}

	async function getNotes() {
		const resp = await fetch(`${apiUrl}notes/${user.uuid}`, {
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

	async function sendAlert() {
		alertStatus = "Sending alert...";
		try {
			await clm.meowerRequest({
				cmd: "direct",
				val: {
					cmd: "alert",
					val: {
						username: user._id,
						p: alertText,
					},
				},
			});
			alertStatus = "Alert sent!";
		} catch (e) {
			alertStatus = "Error sending alert: " + e;
		}
	}

	async function saveBan() {
		banSavingStatus = "Saving...";
		try {
			await clm.meowerRequest({
				cmd: "direct",
				val: {
					cmd: "ban",
					val: {
						username: user._id,
						state: user.ban.state,
						expires: user.ban.expires,
						reason: user.ban.reason,
					},
				},
			});
			banStateChanged = false;
			banSavingStatus = "Saved!";
		} catch (e) {
			banSavingStatus = "Error saving ban: " + e;
		}
	}

	async function kick() {
		kickStatus = "Kicking...";
		try {
			await clm.meowerRequest({
				cmd: "direct",
				val: {
					cmd: "kick",
					val: user._id,
				},
			});
			kickStatus = "Kicked!";
		} catch (e) {
			if (e === "E:103 | ID not found") {
				kickStatus = "User isn't online!";
			} else {
				kickStatus = "Error: " + e;
			}
		}
	}

	async function forceKick() {
		kickStatus = "Kicking...";
		try {
			await clm.meowerRequest({
				cmd: "direct",
				val: {
					cmd: "force_kick",
					val: user._id,
				},
			});
			kickStatus = "Kicked!";
		} catch (e) {
			if (e === "E:103 | ID not found") {
				kickStatus = "User isn't online!";
			} else {
				kickStatus = "Error: " + e;
			}
		}
	}
</script>

<Modal
	on:close={() => {
		modals.closeModal();
	}}
>
	<h2 slot="header">Moderate {$userToMod}</h2>
	<div slot="default">
		{#await getUserdata()}
			<Loading />
		{:then}
			<h2>User Info</h2>
			<b>Username:</b>
			{user._id}<br />
			<b>UUID:</b>
			{user.uuid}<br />
			<b>Pfp:</b>
			{user.pfp_data}<br />
			<b>Quote:</b> <i>"{user.quote}"</i><br />
			<b>Permissions:</b>
			{user.permissions}<br />
			<b>Created:</b>
			<FormattedDate date={user.created} /><br />
			<b>Last seen:</b>
			<FormattedDate date={user.last_seen} />
			{#if user.unread_inbox}
				<br />
				<b>Unread inbox:</b>
				{user.unread_inbox ? "yes" : "no"}
			{/if}
			{#if user.last_ip}
				<br />
				<b>Last IP:</b>
				{user.last_ip}
			{/if}

			<br /><br />

			{#if user.alts}
				<h2>Alts</h2>
				This list is based on every IP address they've recently used. This
				may not be accurate.
				<ul>
					{#each user.alts as username}
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
			{/if}

			{#if user.ips}
				<h2>Recent IPs</h2>
				<ul>
					{#each user.ips as ip}
						<li>
							<a
								href="/"
								on:click|preventDefault={() =>
									$goto(`/users/${ip}`)}>{ip}</a
							>
						</li>
					{/each}
				</ul>

				<br /><br />
			{/if}

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

			{#if hasPermission(permissions.SEND_ALERTS)}
				<h2>Send Alert</h2>
				<textarea
					class="white"
					placeholder="Write something..."
					bind:value={alertText}
				/>
				{#if alertStatus}<b>{alertStatus}</b>{/if}
				<button
					style="float: right;"
					on:click={async () => {
						await sendAlert();
					}}>Send</button
				>

				<br /><br />
			{/if}

			{#if user.ban}
				<h2>Ban State</h2>
				<b>State:</b>
				<select
					class="grow"
					disabled={!hasPermission(permissions.EDIT_BAN_STATE)}
					bind:value={user.ban.state}
					on:change={() => {
						banStateChanged = true;
					}}
				>
					<option value="None" selected={user.ban.state === "None"}>
						None
					</option>

					<option
						value="TempRestriction"
						selected={user.ban.state === "TempRestriction"}
					>
						Temporarily restricted
					</option>
					<option
						value="PermRestriction"
						selected={user.ban.state === "PermRestriction"}
					>
						Permanently restricted
					</option>

					<option
						value="TempSuspension"
						selected={user.ban.state === "TempSuspension"}
					>
						Temporarily suspended
					</option>
					<option
						value="PermSuspension"
						selected={user.ban.state === "PermSuspension"}
					>
						Permanently suspended
					</option>

					<option
						value="TempBan"
						selected={user.ban.state === "TempBan"}
					>
						Temporarily banned
					</option>
					<option
						value="PermBan"
						selected={user.ban.state === "PermBan"}
					>
						Permanently banned
					</option>
				</select>
				<br /><br />
				{#if user.ban.state === "None"}
					This applies no restrictions to the user.
				{:else if user.ban.state === "TempRestriction" || user.ban.state === "PermRestriction"}
					This prevents the user from creating new chats and adding
					members to chats. This is mainly for future use.
				{:else if user.ban.state === "TempSuspension" || user.ban.state === "PermSuspension"}
					This prevents the user from creating new posts, creating new
					chats, and adding members to chats.
				{:else if user.ban.state === "TempBan" || user.ban.state === "PermBan"}
					This prevents the user from logging in.
				{/if}

				{#if user.ban.state.includes("Temp")}
					<br /><br />
					<b>Expires (in your local time):</b>
					<input
						class="grow"
						type="datetime-local"
						disabled={!hasPermission(permissions.EDIT_BAN_STATE)}
						bind:value={formattedBanExpires}
						on:change={() => {
							user.ban.expires = Math.floor(
								new Date(formattedBanExpires).getTime() / 1000
							);
							banStateChanged = true;
						}}
					/>
					{#if user.ban.expires !== 0 && user.ban.expires < Date.now() / 1000}
						<br />
						<i style="color: crimson;">
							This
							{#if user.ban.state === "TempRestriction"}
								restriction
							{:else if user.ban.state === "TempSuspension"}
								suspension
							{:else if user.ban.state === "TempBan"}
								ban
							{/if}
							has expired.
						</i>
					{/if}
				{/if}

				{#if user.ban.state !== "None"}
					<br /><br />
					<b>Reason (will be shown to user):</b><br />
					<textarea
						class="white"
						placeholder="Reason text here..."
						disabled={!hasPermission(permissions.EDIT_BAN_STATE)}
						bind:value={user.ban.reason}
						on:change={() => {
							banStateChanged = true;
						}}
					/>
				{/if}

				{#if banSavingStatus && !(banStateChanged && banSavingStatus === "Saved!")}
					<br />
					<b>{banSavingStatus}</b>
				{/if}
				{#if banStateChanged && hasPermission(permissions.EDIT_BAN_STATE)}
					<br />
					<b
						>The ban state has changed, you must save your changes
						before the new ban state is applied!</b
					><br />
					<button
						disabled={banSavingStatus === "Saving..."}
						on:click={async () => {
							await saveBan();
						}}>Save ban state</button
					>
				{/if}

				<br /><br />
			{/if}

			<h2>Other Actions</h2>
			{#if hasPermission(permissions.VIEW_INBOXES)}
				<button
					class="action-button"
					on:click={() => {
						$goto(`/inbox?user=${user._id}`);
						$modPanelOpen = false;
						modals.closeModal();
					}}
				>
					View inbox
				</button>
			{/if}
			{#if hasPermission(permissions.VIEW_CHATS)}
				<button
					class="action-button"
					on:click={() => {
						$goto(`/chats?user=${user._id}`);
						$modPanelOpen = false;
						modals.closeModal();
					}}
				>
					View chats
				</button>
			{/if}
			{#if hasPermission(permissions.KICK_USERS)}
				<button
					class="action-button"
					on:click={async () => await kick()}
				>
					Kick
				</button>
				<button
					class="action-button"
					on:click={async () => await forceKick()}
				>
					Force kick
				</button>
			{/if}
			{#if hasPermission(permissions.CLEAR_USER_QUOTES)}
				<button
					class="action-button"
					on:click={() => modals.showModal("clearQuote")}
				>
					Clear quote
				</button>
			{/if}
			{#if hasPermission(permissions.DELETE_POSTS)}
				<button
					class="action-button"
					on:click={() => modals.showModal("clearPosts")}
				>
					Delete all posts
				</button>
			{/if}
			{#if hasPermission(permissions.IMPERSONATE_USERS)}
				<button
					class="action-button"
					on:click={() => modals.showModal("impersonateUser")}
				>
					Impersonate
				</button>
			{/if}
			<button
				class="action-button"
				on:click={() => modals.showModal("setAdminPermissions")}
			>
				{#if hasPermission(permissions.SET_USER_PERMISSIONS)}
					Set permissions
				{:else}
					View permissions
				{/if}
			</button>
			{#if hasPermission(permissions.DELETE_USERS)}
				<button
					class="action-button"
					on:click={() => modals.showModal("deleteAccount")}
				>
					Delete account
				</button>
			{/if}

			{#if kickStatus}
				<br />
				<b>{kickStatus}</b>
			{/if}

			<br /><br /><br />

			<div class="modal-buttons">
				<button
					type="button"
					on:click={() => {
						modals.closeModal();
					}}>Close</button
				>
			</div>
		{:catch e}
			Error getting userdata: {e}
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
