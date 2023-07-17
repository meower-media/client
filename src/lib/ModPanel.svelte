<script>
	import PostList from "./PostList.svelte";
	import FormattedDate from "./FormattedDate.svelte";
	import * as clm from "./clmanager.js";
	import {levels} from "./formatting.js";
	import {
		mainPage as page,
		userToMod,
		profileClicked,
		announcementToSend,
		user,
	} from "./stores";
	import {tick} from "svelte";
	import * as Modals from "./modals.js";
	import { onMount } from "svelte/internal";

	let ipData = null;
	let infoMsg = "";
	let alertMsg = "";
	let actionMsg = "";
	let announceMsg = "";

	let actionType = "kick";

	const modTypes = [
		{
			cmd: "kick",
			name: "Kick",
			description: "Disconnect this user; they can just reconnect.",
			level: 1,
		},
		{
			cmd: "clear_user_posts",
			name: "Delete all posts",
			description: "Delete all of the user's home posts.",
			level: 1,
		},
		{
			cmd: "ban",
			name: "Ban",
			description:
				"Ban the user; kick them and prevent them from logging in on the account.",
			level: 1,
		},
		{
			cmd: "pardon",
			name: "Unban",
			description: "Unban the user.",
			level: 1,
		},
		{
			cmd: "block",
			name: "Ban IP",
			description:
				"Ban the IP; prevent them from connecting through that IP.",
			level: 2,
		},
		{
			cmd: "unblock",
			name: "Unban IP",
			description: "Unban the IP.",
			level: 2,
		},
		{
			cmd: "terminate",
			name: "Terminate",
			description: "Ban the user and delete all of their posts.",
			level: 3,
		},
	];

	async function gotoProfile(username) {
		page.set("");
		await tick();
		profileClicked.set(username);
		page.set("profile");
	}

	let items = [];

	let getInfoButton;

	onMount(async () => {
		if ($userToMod) getInfoButton.click();
	});
</script>

<div class="ModPanel">
	<h2>Get User Info</h2>
	<form
		on:submit|preventDefault={async e => {
			/** @type {HTMLFormElement} */
			// @ts-ignore
			const f = e.target;
			// @ts-ignore
			const username = f.elements[0].value;

			const isL2 = $user.lvl >= 2;

			const isIP = username.includes(".") || username.includes(":");

			if (!username) {
				infoMsg = "You need to enter a username or IP!";
				return;
			}

			ipData = null;

			try {
				infoMsg = "Submitting...";
				let _ipData = {};
				let ip = username;
				if (isL2) {
					if (!isIP) {
						ip = (
							await clm.meowerRequest({
								cmd: "direct",
								val: {
									cmd: "get_user_ip",
									val: username,
								},
							})
						).payload.ip;
					}
					_ipData = (
						await clm.meowerRequest({
							cmd: "direct",
							val: {
								cmd: "get_ip_data",
								val: ip,
							},
						})
					).payload;
				}
				_ipData.user = (
					await clm.meowerRequest({
						cmd: "direct",
						val: {
							cmd: "get_user_data",
							val: isIP && isL2 ? _ipData.last_user : username,
						},
					})
				).payload;
				ipData = _ipData;
				infoMsg = "";
			} catch (e) {
				console.error(e);
				infoMsg = "Error: " + e;
			}
		}}
	>
		<div class="input-row">
			<input
				class="grow white"
				type="text"
				placeholder="Username/IP..."
				value={$userToMod}
			/>
			<button class="static" bind:this={getInfoButton}>Submit</button>
		</div>
		{#if infoMsg}
			<div class="msg">{infoMsg}</div>
		{/if}
	</form>
	{#if ipData}
		<div class="ip-info">
			{#if $user.lvl < 2}<i
					>Note: IP information is level 2+ ({levels[2]} and above) only.</i
				><br />{/if}
			<b>Username:</b>
			<a
				href="/"
				on:click|preventDefault={() =>
					gotoProfile(ipData.user.username)}>{ipData.user.username}</a
			><br />
			<b>Quote:</b>
			<i>"{ipData.user.quote}"</i><br />
			<b>Created:</b>
			<FormattedDate date={ipData.user.created} /><br />
			<b>Level:</b>
			{ipData.user.lvl} - {levels[ipData.user.lvl] || "Unknown"}<br />
			<b>Banned?</b>
			{ipData.user.banned ? "Yes" : "No"}<br />
			{#if $user.lvl >= 2}
				<b>IP:</b>
				{ipData.ip}<br />
				<b>IP banned?</b>
				{ipData.banned ? "Yes" : "No"}<br />
				<b>Last user on IP:</b>
				<a
					href="/"
					on:click|preventDefault={() =>
						gotoProfile(ipData.last_user)}>{ipData.last_user}</a
				><br />
				<b>Users on IP:</b>
				<ul>
					{#each ipData.users as username}
						<li>
							<a
								href="/"
								on:click|preventDefault={() =>
									gotoProfile(username)}>{username}</a
							>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	{/if}
	<h2>Send Alert</h2>
	<form
		on:submit|preventDefault={async e => {
			/** @type {HTMLFormElement} */
			// @ts-ignore
			const f = e.target;
			// @ts-ignore
			const user = f.elements[0].value;
			// @ts-ignore
			const text = f.elements[2].value;

			if (!user || !text) {
				alertMsg = "You need to enter a username and text!";
				return;
			}
			try {
				actionMsg = "Sending...";
				await clm.meowerRequest({
					cmd: "direct",
					val: {
						cmd: "alert",
						val: {
							username: user,
							p: text,
						},
					},
				});
				items = items.filter(p => p._id !== user);
				alertMsg = "Alert sent!";
			} catch (e) {
				console.error(e);
				alertMsg = "Error: " + e;
			}
		}}
	>
		<div class="input-row">
			<input class="grow white" type="text" placeholder="Username..." value={$userToMod} />
			<button class="static">Send</button>
		</div>
		<textarea
			class="alert-textarea white"
			placeholder="Alert text here..."
		/>
		{#if alertMsg}
			<div class="msg">{alertMsg}</div>
		{/if}
	</form>
	<h2>Send Announcement</h2>
	{#if $user.lvl < 3}
		<p>Level 3+ ({levels[3]} and above) only.</p>
	{:else}
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
				Modals.showModal("announce")
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
	<h2>Moderate User</h2>
	<form
		on:submit|preventDefault={async e => {
			/** @type {HTMLFormElement} */
			// @ts-ignore
			const f = e.target;
			// @ts-ignore
			const user = f.elements[0].value;
			// @ts-ignore
			const type = f.elements[1].value;

			if (!user) {
				actionMsg = "You need to enter a username!";
				return;
			}
			try {
				actionMsg = "Doing it...";
				await clm.meowerRequest({
					cmd: "direct",
					val: {
						cmd: type,
						val: user,
					},
				});
				items = items.filter(p => p._id !== user);
				actionMsg = "Action done!";
			} catch (e) {
				console.error(e);
				actionMsg = "Error: " + e;
			}
		}}
	>
		<div class="input-row wrap">
			<input
				class="grow white moderate-user-input"
				type="text"
				placeholder={["block", "unblock"].includes(actionType)
					? "IP address..."
					: "Username..."}
				value={$userToMod}
			/>
			<div class="input-row grow">
				<select
					class="grow"
					on:change={e => {
						// @ts-ignore
						actionType = e.target.value;
					}}
				>
					{#each modTypes as a}
						<option
							disabled={a.level > $user.lvl}
							selected={a.cmd === "kick"}
							value={a.cmd}>{a.name}</option
						>
					{/each}
				</select>
				<button class="static">Do it!</button>
			</div>
		</div>
		{#if actionType}<p>
				{(modTypes.find(o => o.cmd == actionType) || {}).description ||
					"Could not get description."}
			</p>{/if}
		{#if actionType === "block"}
			<p>
				<b>NOTE:</b> IP bans in CL3 aren't very secure, and can easily be
				bypassed. If you can, please also ask a council member somewhere
				like Discord to also ban the IP through WAF (make sure to send both
				the username and IP).
			</p>
		{/if}
		{#if actionType === "unblock"}
			<p>
				<b>NOTE:</b> If you can, please also ask a council member somewhere
				like Discord to also uban the IP through WAF (make sure to send both
				the username and IP).
			</p>
		{/if}
		{#if actionMsg}
			<div class="msg">{actionMsg}</div>
		{/if}
	</form>
	<h2>Reports</h2>
	<PostList bind:items fetchUrl="reports" postOrigin="" canPost={false}>
		<div slot="error" let:error>
			Error loading the report queue. Please close and reopen it.
			<pre><code>{error}</code></pre>
		</div>
		<div slot="empty">Yay, the report queue is empty!</div>
	</PostList>
</div>

<style>
	h2 {
		margin-top: 0.5em;
	}

	.alert-textarea {
		display: block;
		margin-top: 0.5em;
		resize: vertical;
		width: 100%;
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
	.wrap {
		flex-wrap: wrap;
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

	.ip-info {
		margin: 0.5em 0;
	}

	.moderate-user-input {
		flex-basis: 15em;
	}

	.announce-buttons {
		min-height: 2em;
	}

	.align-right {
		float: right;
	}

	input, button, select {
		border: none;
	}

	a {
		color: var(--orange);
	}

	button {
		max-height: 2em;
	}
</style>
