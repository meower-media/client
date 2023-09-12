<script>
	import PostList from "./PostList.svelte";
	import {
		userToMod,
		ipToMod,
		modPanelOpen,
		announcementToSend,
	} from "./stores.js";
	import * as modals from "./modals.js";
	import {
		permissions,
		hasPermission,
		hasAnyPermission,
	} from "./adminPermissions.js";

	let announceMsg = "";

	let items = [];
</script>

<div class="ModPanel">
	<p>
		NOTE: Performing an action on a user/post closes that user/post's
		report, if there's one.
	</p>
	<h2>Moderate User</h2>
	<form
		on:submit|preventDefault={async e => {
			/** @type {HTMLFormElement} */
			// @ts-ignore
			const f = e.target;
			// @ts-ignore
			$userToMod = f.elements[0].value;
			modals.showModal("moderateUser");
		}}
	>
		<div class="input-row">
			<input class="grow white" type="text" placeholder="Username..." />
			<button class="static">Submit</button>
		</div>
	</form>
	{#if hasPermission(permissions.VIEW_IPS)}
		<h2>Moderate IP</h2>
		<form
			on:submit|preventDefault={async e => {
				/** @type {HTMLFormElement} */
				// @ts-ignore
				const f = e.target;
				// @ts-ignore
				$ipToMod = f.elements[0].value;
				modals.showModal("moderateIP");
			}}
		>
			<div class="input-row">
				<input
					class="grow white"
					type="text"
					placeholder="IP address..."
				/>
				<button class="static">Submit</button>
			</div>
		</form>
	{/if}
	{#if hasPermission(permissions.SEND_ANNOUNCEMENTS)}
		<h2>Send Announcement</h2>
		<form
			on:submit|preventDefault={async e => {
				/** @type {HTMLFormElement} */
				// @ts-ignore
				const f = e.target;
				// @ts-ignore
				const text = f.elements[0].value;

				if (!text) {
					announceMsg = "You need to enter some text!";
					return;
				}
				announceMsg = "";
				$announcementToSend = text;
				modals.showModal("announce");
			}}
		>
			<textarea
				class="announce-textarea white"
				placeholder="Announcement text here..."
			/>
			<div class="announce-buttons">
				<button class="align-right">Send</button>
				{#if announceMsg}
					<div class="msg">{announceMsg}</div>
				{/if}
			</div>
		</form>
	{/if}
	{#if hasPermission(permissions.SYSADMIN)}
		<h2>Manage Server</h2>
		<button
			style="margin-right: 0.25em; margin-bottom: 0.25em;"
			on:click={() => modals.showModal("kickAllUsers")}
			>Kick all users</button
		>
		<button on:click={() => modals.showModal("enableRepairMode")}
			>Enable repair mode</button
		>
	{/if}
	{#if hasAnyPermission( [permissions.DELETE_POSTS, permissions.CLEAR_USER_QUOTES, permissions.SEND_ALERTS, permissions.EDIT_BAN_STATE] )}
		<h2>Reports</h2>
		<PostList bind:items fetchUrl="reports" postOrigin="" canPost={false}>
			<div slot="error" let:error>
				Error loading the report queue. Please close and reopen it.
				<pre><code>{error}</code></pre>
			</div>
			<div slot="empty">Yay, the report queue is empty!</div>
		</PostList>
	{/if}

	<br />

	<button on:click={() => modPanelOpen.set(false)}>Close</button>
</div>

<style>
	h2 {
		margin-top: 0.5em;
	}

	.announce-textarea {
		display: block;
		margin-bottom: 0.25em;
		resize: vertical;
		width: 100%;
	}
	.input-row {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		gap: 0.25em;
		justify-content: stretch;
	}
	.grow {
		flex-grow: 1;
		flex-shrink: 1;
	}
	.static {
		flex-grow: 0;
		flex-shrink: 0;
	}

	.msg {
		display: block;
		font-size: 75%;
		font-weight: bold;
		margin: 0.25em 0;
	}

	.announce-buttons {
		min-height: 2em;
	}

	.align-right {
		float: right;
	}
</style>
