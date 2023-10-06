<script>
	import Modal from "../../Modal.svelte";
	import Container from "../../Container.svelte";
	import PostList from "../../PostList.svelte";
	import Loading from "../../Loading.svelte";
	import FormattedDate from "../../FormattedDate.svelte";
	import AdminNotes from "../../AdminNotes.svelte";

	import DeleteAccountModal from "./DeleteAccount.svelte";

	import network from "../../../assets/network.svg";
	import shieldx from "../../../assets/shield-x.svg";
	import userx from "../../../assets/user-x.svg";

	import {
		authHeader,
		userToMod,
	} from "../../stores.js";
	import {userFlags} from "../../userFlags.js";
	import {
		permissions,
		permissionsList,
		hasPermission,
	} from "../../adminPermissions.js";
	import {apiUrl} from "../../urls.js";
	import * as modals from "../../modals.js";

	import {goto} from "@roxi/routify";
	import {tick} from "svelte";

	let user;
	let system, deleted;
	let alertText, alertStatus;
	let banState, banExpired, formattedBanExpires, banSaving, banSaveError;
	let kickStatus;
	let viewPosts, postOrigin = "all", chatId, reloadingPosts;
	let confirmDeletePosts, deletingPosts, deletePostsError;
	let confirmClearQuote, clearingQuote, clearQuoteError;
	let bitFieldPermissions = [], setPermissions, canSetPermissions, permissionsSaving, permissionsSaveError;

	$: {
		if (!$userToMod) modals.closeLastModal();

		if (banState && banState.expires) {
			banExpired = (banState.state.includes("Temp") && banState.expires < (Date.now() / 1000));

			const date = new Date(banState.expires * 1000); // Convert to milliseconds
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, "0");
			const day = String(date.getDate()).padStart(2, "0");
			const hours = String(date.getHours()).padStart(2, "0");
			const minutes = String(date.getMinutes()).padStart(2, "0");
			formattedBanExpires = `${year}-${month}-${day}T${hours}:${minutes}`;
		}

		for (let permission of permissionsList) {
			if (
				permission.dependsOn &&
				bitFieldPermissions.includes(permission.value) &&
				!bitFieldPermissions.includes(permission.dependsOn)
			) {
				bitFieldPermissions.splice(
					bitFieldPermissions.indexOf(permission.value),
					1
				);
			}
		}

		canSetPermissions =
			user && hasPermission(permissions.SYSADMIN) &&
			!(
				(user.permissions & permissions.SYSADMIN) ===
				permissions.SYSADMIN
			);
	}

	async function getUserdata() {
		const resp = await fetch(`${apiUrl}admin/users/${$userToMod}`, {
			headers: $authHeader,
		});
		if (!resp.ok) {
			if (resp.status === 404) throw new Error(`${$userToMod} does not exist!`);
			throw new Error("Response code is not OK; code is " + resp.status);
		}
		user = await resp.json();
		system = (user.flags & userFlags.SYSTEM) === userFlags.SYSTEM;
		deleted = (user.flags & userFlags.DELETED) === userFlags.DELETED;
		if (user.ban) banState = Object.assign({}, user.ban);
	}

	async function saveBanState() {
		banSaving = true;
		try {
			const resp = await fetch(`${apiUrl}admin/users/${user._id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					...$authHeader,
				},
				body: JSON.stringify({
					ban: {
						state: banState.state,
						expires: banState.expires,
						reason: banState.reason,
					},
				}),
			});
			if (!resp.ok) {
				throw new Error(
					"Response code is not OK; code is " + resp.status
				);
			}
			user.ban = Object.assign({}, banState);
			banSaving = false;
		} catch (e) {
			banSaveError = e;
			banSaving = false;
		}
	}

	async function deleteAllPosts() {
		deletePostsError = "";
		deletingPosts = true;
		try {
			const resp = await fetch(`${apiUrl}admin/users/${user._id}/posts/${postOrigin}`, {
				method: "DELETE",
				headers: $authHeader,
			});
			if (!resp.ok) {
				throw new Error(
					"Response code is not OK; code is " + resp.status
				);
			}
			deletingPosts = false;
			confirmDeletePosts = false;
		} catch (e) {
			deletePostsError = e;
			deletingPosts = false;
		}
	}

	async function kick(force = false) {
		kickStatus = "Kicking...";
		try {
			const resp = await fetch(`${apiUrl}admin/users/${user._id}/kick${force ? "?force=1" : ""}`, {
				method: "POST",
				headers: $authHeader,
			});
			if (!resp.ok) {
				throw new Error(
					"Response code is not OK; code is " + resp.status
				);
			}
			kickStatus = "Kicked!";
		} catch (e) {
			kickStatus = e;
		}
	}

	async function clearQuote() {
		clearQuoteError = "";
		clearingQuote = true;
		try {
			const resp = await fetch(`${apiUrl}admin/users/${user._id}/quote`, {
				method: "DELETE",
				headers: $authHeader,
			});
			if (!resp.ok) {
				throw new Error(
					"Response code is not OK; code is " + resp.status
				);
			}
			clearingQuote = false;
			confirmClearQuote = false;
		} catch (e) {
			clearQuoteError = e;
			clearingQuote = false;
		}
	}

	async function savePermissions() {
		permissionsSaveError = "";
		permissionsSaving = true;
		try {
			let permissionsBitField = 0;
			for (let permission of bitFieldPermissions) {
				permissionsBitField |= permission;
			}
			const resp = await fetch(`${apiUrl}admin/users/${$userToMod}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					...$authHeader,
				},
				body: JSON.stringify({
					permissions: permissionsBitField,
				}),
			});
			if (!resp.ok) {
				throw new Error(
					"Response code is not OK; code is " + resp.status
				);
			}
			permissionsSaving = false;
			setPermissions = false;
		} catch (e) {
			permissionsSaveError = e;
			permissionsSaving = false;
		}
	}

	async function deleteAccount(mode) {
		let attemptedUsername = prompt(`Please confirm the user's username (${user._id}):`);
		if (attemptedUsername !== user._id) {
			throw new Error("Invalid username!");
		}
		if (!confirm("This action can be very destructive! By confirming this, you acknowledge and take responsibility for the consequences of this action. Are you absolutely sure you wish to continue?")) {
			modals.closeLastModal();
			return;
		}
		const resp = await fetch(`${apiUrl}admin/users/${user._id}?mode=${mode}`, {
			method: "DELETE",
			headers: $authHeader,
		});
		if (!resp.ok) {
			throw new Error(
				"Response code is not OK; code is " + resp.status
			);
		}
	}
</script>

<Modal
	on:close={() => {
		$userToMod = "";
		modals.closeLastModal();
	}}
>
	<h2 slot="header">Moderate {$userToMod}</h2>
	<div slot="default">
		{#await getUserdata()}
			<Loading />
		{:then}
			{#if deleted}
				<Container warning={true}>
					This account has been deleted. Deleted accounts cannot be recovered. {#if hasPermission(permissions.DELETE_ACCOUNTS)}You may release the username by purging the account.{/if}
				</Container>
			{:else if user.delete_after}
				<Container warning={true}>
					This account is scheduled to be deleted after <FormattedDate date={user.delete_after} />.
				</Container>
			{/if}
			<h2>User Info</h2>
			<b>Username:</b>
			{user._id}<br />
			<b>UUID:</b>
			{user.uuid}<br />
			{#if !system && !deleted}
				<b>Pfp:</b>
				{user.pfp_data}<br />
				<b>Quote:</b> <i>"{user.quote}"</i><br />
				<b>Permissions:</b>
				{user.permissions}<br />
			{/if}
			<b>Created:</b>
			<FormattedDate date={user.created} /><br />
			{#if user.last_seen}
				<b>Last seen:</b>
				<FormattedDate date={user.last_seen} />
			{/if}
			{#if user.unread_inbox}
				<br />
				<b>Unread inbox:</b>
				{user.unread_inbox ? "yes" : "no"}
			{/if}

			<br /><br />

			{#if user.alts}
				<h2>Alts</h2>
				This list is based on users from their recent IPs. This list may not be accurate.
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

			{#if user.recent_ips}
				<h2>Recent IPs</h2>
				<table>
					<tr>
						<th>IP Address</th>
						<th>Last Used</th>
						<th>Flags</th>
					</tr>
					{#each user.recent_ips as ip}
						<tr>
							<td>{ip.netinfo.ip}</td>
							<td><FormattedDate date={ip.last_used} relative={true} /></td>
							<td>
								<div class="flags">
									{#if ip.netinfo.vpn}
										<img
											src={network}
											alt="Detected VPN/proxy"
											title="Detected VPN/proxy"
										/>
									{/if}
									{#if ip.blocked}
										<img
											src={shieldx}
											alt="Blocked"
											title="Blocked"
										/>
									{/if}
									{#if ip.registration_blocked}
										<img
											src={userx}
											alt="Registration blocked"
											title="Registration blocked"
										/>
									{/if}
								</div>
							</td>
						</tr>
					{/each}
				</table>

				<br /><br />
			{/if}

			{#if hasPermission(permissions.VIEW_NOTES)}
				<h2>Notes</h2>
				<AdminNotes identifier={user.uuid} />
				<br /><br />
			{/if}

			{#if !system && !deleted && hasPermission(permissions.SEND_ALERTS)}
				<h2>Send Alert</h2>
				<textarea
					class="white"
					placeholder="Write something..."
					bind:value={alertText}
					on:change={() => alertStatus = ""}
				/>
				{#if alertStatus}
					<b>{alertStatus}</b>
				{/if}
				<button
					style="float: right;"
					disabled={!alertText || alertStatus === "Alert sent!"}
					on:click={async () => {
						alertStatus = "Sending alert...";
						try {
							const resp = await fetch(`${apiUrl}admin/users/${user._id}/inbox`, {
								method: "POST",
								headers: {
									"Content-Type": "application/json",
									...$authHeader,
								},
								body: JSON.stringify({content: alertText}),
							});
							if (!resp.ok) {
								throw new Error(
									"Response code is not OK; code is " + resp.status
								);
							}
							alertStatus = "Alert sent!";
						} catch (e) {
							alertStatus = "Error sending alert: " + e;
						}
					}}>Send</button
				>

				<br /><br />
			{/if}

			{#if banState}
				<h2>Ban State</h2>
				{#if !banExpired && !["None", "Protected"].includes(user.ban.state) && JSON.stringify(banState) === JSON.stringify(user.ban)}
					<Container warning={true}>
						{user._id} is
						{#if user.ban.state.includes("Perm")}
							permanently
						{/if}
						{#if user.ban.state.includes("Restriction")}
							restricted
						{:else if user.ban.state.includes("Suspension")}
							suspended
						{:else if user.ban.state.includes("Ban")}
							banned
						{/if}
						{#if user.ban.state.includes("Temp")}
							until <FormattedDate date={user.ban.expires} />
						{/if}
					</Container>
				{/if}
				<label for="state"><b>State</b></label><br />
				<select
					id="state"
					class="grow"
					style="width: 100%; margin-bottom: 0.25em;"
					disabled={!hasPermission(permissions.EDIT_BAN_STATES) || (banState.state === "Protected" && !hasPermission(permissions.SYSADMIN))}
					bind:value={banState.state}
				>
					<option value="None" selected={banState.state === "None"}>
						None
					</option>

					<option
						value="TempRestriction"
						selected={banState.state === "TempRestriction"}
					>
						Temporarily restricted
					</option>
					<option
						value="PermRestriction"
						selected={banState.state === "PermRestriction"}
					>
						Permanently restricted
					</option>

					<option
						value="TempSuspension"
						selected={banState.state === "TempSuspension"}
					>
						Temporarily suspended
					</option>
					<option
						value="PermSuspension"
						selected={banState.state === "PermSuspension"}
					>
						Permanently suspended
					</option>

					<option
						value="TempBan"
						selected={banState.state === "TempBan"}
					>
						Temporarily banned
					</option>
					<option
						value="PermBan"
						selected={banState.state === "PermBan"}
					>
						Permanently banned
					</option>
					{#if banState.state === "Protected" || hasPermission(permissions.SYSADMIN)}
						<option
							value="Protected"
							selected={banState.state === "Protected"}
						>
							Protected
						</option>
					{/if}
				</select><br />
				{#if banState.state === "None"}
					This applies no restrictions to the user.
				{:else if banState.state.includes("Restriction")}
					This prevents the user from starting DMs, creating group chats, and adding
					members to group chats.
				{:else if banState.state.includes("Suspension")}
					This prevents the user from creating posts, starting DMs, creating group chats, and adding
					members to group chats.
				{:else if banState.state.includes("Ban")}
					This prevents the user from logging in.
				{:else if banState.state === "Protected"}
					This prevents the user's ban state from being changed unless requested by a sysadmin.
				{/if}

				{#if banState.state.includes("Temp")}
					<br /><br />
					<label for="expires" style={banExpired ? "color: crimson;" : ""}>
						<b>Expires (in your local timezone)</b>
						{#if banExpired}<i> - this time has passed</i>{/if}
					</label><br />
					<input
						id="expires"
						class="grow"
						style="width: 100%;"
						type="datetime-local"
						disabled={!hasPermission(permissions.EDIT_BAN_STATES)}
						bind:value={formattedBanExpires}
						on:change={() => {
							banState.expires = Math.floor(
								new Date(formattedBanExpires).getTime() / 1000
							);
						}}
					/>
				{/if}

				{#if banState.state !== "None"}
					<br /><br />
					<label for="reason"><b>Reason{#if banState.state !== "Protected"}(will be shown to user){/if}</b></label><br />
					<textarea
						id="reason"
						class="white"
						placeholder="Reason text here..."
						disabled={!hasPermission(permissions.EDIT_BAN_STATES)}
						bind:value={banState.reason}
					/>
				{/if}

				{#if JSON.stringify(banState) !== JSON.stringify(user.ban)}
					<br /><br />
					<Container warning={true}>
						<b>WARNING!</b><br />
						The ban state has changed. You must save the new ban state before it's applied.
						<br /><br />
						<button disabled={banSaving} on:click={saveBanState}>
							Save ban state
						</button>
						{#if banSaveError}
							<p>{banSaveError}</p>
						{/if}
					</Container>
				{/if}

				<br /><br />
			{/if}
			
			{#if !system && (!deleted || hasPermission(permissions.DELETE_ACCOUNTS))}
				<h2>Other Actions</h2>
				{#if !system && !deleted && hasPermission(permissions.VIEW_POSTS)}
					<button
						class="action-button"
						on:click={() => viewPosts = true}
					>
						View posts
					</button>
				{/if}
				{#if !system && !deleted && hasPermission(permissions.KICK_USERS)}
					<button
						class="action-button"
						on:click={() => kick(false)}
					>
						Kick
					</button>
					<button
						class="action-button"
						on:click={() => kick(true)}
					>
						Force kick
					</button>
				{/if}
				{#if !system && !deleted && hasPermission(permissions.CLEAR_USER_QUOTES)}
					<button
						class="action-button"
						on:click={() => confirmClearQuote = true}
					>
						Clear quote
					</button>
				{/if}
				{#if !system && !deleted}
					<button
						class="action-button"
						on:click={() => setPermissions = true}
					>
						{#if hasPermission(permissions.SYSADMIN)}
							Set permissions
						{:else}
							View permissions
						{/if}
					</button>
				{/if}
				{#if hasPermission(permissions.DELETE_ACCOUNTS)}
					<button
						class="action-button"
						on:click={() => modals.showModal(DeleteAccountModal, {
							deleted,
							deleteAfter: user.delete_after,
							deleteAccountCallback: deleteAccount
						})}
					>
						Delete account
					</button>
				{/if}

				{#if kickStatus}
					<br />
					<b>{kickStatus}</b>
				{/if}

				<br /><br /><br />
			{/if}

			<div class="modal-buttons">
				<button
					type="button"
					on:click={() => {
						$userToMod = "";
						modals.closeLastModal();
					}}>Close</button
				>
			</div>
		{:catch error}
			{error}
			<br /><br />
			<div class="modal-buttons">
				<button
					type="button"
					on:click={() => {
						$userToMod = "";
						modals.closeLastModal();
					}}>Close</button
				>
			</div>
		{/await}
		<div />
	</div></Modal
>

<!-- modals -->
{#if confirmDeletePosts}
	<Modal on:close={() => confirmDeletePosts = false}>
		<h2 slot="header">
			Delete {$userToMod}'s Posts
		</h2>
		<div slot="default">
			<p>Are you sure? This action is irreversible!</p>
			{#if deletePostsError}
				<p style="color: crimson;">{deletePostsError}</p>
			{:else}
				<br />
			{/if}
			<div class="modal-buttons">
				<button
					type="button"
					on:click={() => confirmDeletePosts = false}
					>Cancel</button
				>
				<button
					type="button"
					on:click={deleteAllPosts}
					>Delete</button
				>
			</div>
		</div>
	</Modal>
{:else if viewPosts}
	<Modal on:close={() => viewPosts = false}>
		<h2 slot="header">
			{$userToMod}'s Posts
		</h2>
		<div slot="default">
			<label for="post-origin"><b>Post Origin</b></label><br />
			<select
				id="post-origin"
				class="modal-input grow"
				style="width: 100%; margin-bottom: 0.25em;"
				bind:value={postOrigin}
				on:change={async () => {
					reloadingPosts = true;
					await tick();
					reloadingPosts = false;
				}}
			>
				<option value="all" selected={postOrigin === "all"}>Any</option>
				<option value="home" selected={postOrigin === "home"}>Home</option>
				<option value="inbox" selected={postOrigin === "inbox"}>Inbox</option>
				<option value="chat" selected={postOrigin === "chat"}>Chat</option>
			</select><br />
			{#if postOrigin === "chat"}
				<label for="chat-id"><b>Chat ID</b></label><br />
				<input
					id="chat-id"
					type="text"
					class="modal-input white"
					style="margin-bottom: 0.25em;"
					placeholder="Chat ID..."
					bind:value={chatId}
					on:change={async () => {
						reloadingPosts = true;
						await tick();
						reloadingPosts = false;
					}}
				/><br />
			{/if}
			{#if !reloadingPosts && (postOrigin !== "chat" || chatId)}
				<button
					class="long"
					title="Delete All Posts"
					on:click={() => confirmDeletePosts = true}>Delete All Posts</button
				><br />
				<PostList
					fetchUrl={`admin/users/${$userToMod}/posts/${postOrigin === "chat" ? chatId : postOrigin}`}
					postOrigin={null}
					canPost={false}
					instantDelete={true}
				/>
			{/if}
			<div class="modal-buttons">
				<button
					type="button"
					on:click={() => viewPosts = false}
					>Close</button
				>
			</div>
		</div>
	</Modal>
{:else if confirmClearQuote}
	<Modal on:close={() => confirmClearQuote = false}>
		<h2 slot="header">
			Clear {$userToMod}'s Quote
		</h2>
		<div slot="default">
			<p>Are you sure? This action is irreversible!</p>
			{#if clearQuoteError}
				<p style="color: crimson;">{clearQuoteError}</p>
			{:else}
				<br />
			{/if}
			<div class="modal-buttons">
				<button
					type="button"
					disabled={clearingQuote}
					on:click={() => confirmClearQuote = false}
					>Cancel</button
				>
				<button
					type="submit"
					disabled={clearingQuote}
					on:click={clearQuote}
					>Clear Quote</button
				>
			</div>
		</div>
	</Modal>
{:else if setPermissions}
	<Modal on:close={() => setPermissions = false}>
		<h2 slot="header">
			{$userToMod}'s Admin Permissions
		</h2>
		<div slot="default">
			{#if bitFieldPermissions.includes(permissions.SYSADMIN)}
				<label class="permission-label">
					<input type="checkbox" class="permission" disabled checked />
					Sysadmin
				</label><br />
				Allows access to every permission possible.<br /><br />
			{:else}
				{#each permissionsList as permission}
					<label class="permission-label">
						<input
							type="checkbox"
							class="permission"
							value={permission.value}
							disabled={!canSetPermissions ||
								(permission.dependsOn &&
									!bitFieldPermissions.includes(
										permission.dependsOn
									))}
							bind:group={bitFieldPermissions}
						/>
						{permission.name}
					</label><br />
					{@html permission.description}<br /><br />
				{/each}
			{/if}
			{#if permissionsSaveError}
				<p style="color: crimson;">{permissionsSaveError}</p>
			{:else}
				<br />
			{/if}
			<div class="modal-buttons">
				<button
					type="button"
					disabled={permissionsSaving}
					on:click={() => setPermissions = false}
					>Close</button
				>
				{#if canSetPermissions}
					<button
						type="submit"
						disabled={permissionsSaving}
						on:click={savePermissions}
						>Save Permissions</button
					>
				{/if}
			</div>
		</div>
	</Modal>
{/if}

<style>
	textarea {
		width: 100%;
		margin-bottom: 0.25em;
	}

	.action-button {
		margin-right: 0.25em;
		margin-bottom: 0.25em;
	}

	table {
		width: 100%;
		max-width: 100%;
		text-align: center;
		border-collapse: collapse;
		overflow: hidden;
	}

	th, td {
		border: solid 2px var(--orange);
		padding: 0.35em;
		outline: none;
		word-break: break-all;
	}

	.flags {
		display: flex;
		align-items: center;
		justify-content: space-evenly;
	}

	.long {
		width: 100%;
		margin: 0;
		margin-bottom: 0.2em;
	}

	.permission,
	.permission-label {
		vertical-align: middle;
	}
</style>
