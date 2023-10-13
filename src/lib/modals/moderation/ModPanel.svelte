<script>
	import Modal from "../../Modal.svelte";
	import Loading from "../../Loading.svelte";
	import Container from "../../Container.svelte";
	import PagedList from "../../PagedList.svelte";
	import Report from "../../Report.svelte";

	import ModerateUserModal from "./ModerateUser.svelte";
	import ModerateIPModal from "./ModerateIP.svelte";
	import ModeratePostModal from "./ModeratePost.svelte";
	import RecemtUsersModal from "./RecentUsers.svelte";
	import RecentNetblocksModal from "./RecentNetblocks.svelte";
	import SendAnnouncementModal from "./SendAnnouncement.svelte";
	import KickAllUsersModal from "./KickAllUsers.svelte";
	import RestartServerModal from "./RestartServer.svelte";
	import EnableRepairModeModal from "./EnableRepairMode.svelte";

	import {authHeader} from "../../stores.js";
	import {adminPermissions, hasPermission} from "../../bitField.js";
	import {apiUrl} from "../../urls.js";
	import * as modals from "../../modals.js";

	import {goto} from "@roxi/routify";
	import {createEventDispatcher, tick} from "svelte";

	const dispatch = createEventDispatcher();

	let announceMsg = "";

	let serverStatus = {};
	let registrationToggleStatus = "";

	let reportFilterStatus = "pending";
	let reportFilterType = null;
	let reloadingReports = false;

	let reports = [];

	let firstLoad = true;

	async function getServerStatus() {
		const resp = await fetch(`${apiUrl}status`);
		if (!resp.ok) {
			throw new Error("Response code is not OK; code is " + resp.status);
		}
		serverStatus = await resp.json();
	}

	async function toggleRegistration() {
		if (serverStatus.registrationEnabled) {
			registrationToggleStatus = "Disabling registration...";
		} else {
			registrationToggleStatus = "Enabling registration...";
		}

		try {
			const resp = await fetch(
				`${apiUrl}admin/server/registration/${
					serverStatus.registrationEnabled ? "disable" : "enable"
				}`,
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
			registrationToggleStatus = `Successfully ${
				serverStatus.registrationEnabled ? "disabled" : "enabled"
			} registration!`;
			serverStatus.registrationEnabled =
				!serverStatus.registrationEnabled;
		} catch (e) {
			console.error(e);
			registrationToggleStatus = `Failed ${
				serverStatus.registrationEnabled ? "disabling" : "enabling"
			} registration: ${e}`;
		}
	}

	async function reloadReports() {
		reloadingReports = true;
		reports = [];
		await tick();
		reloadingReports = false;
	}

	async function loadReportsPage(page = 1) {
		const resp = await fetch(
			`${apiUrl}admin/reports?autoget=1&page=${page}${
				reportFilterStatus ? `&status=${reportFilterStatus}` : ""
			}${reportFilterType ? `&type=${reportFilterType}` : ""}`,
			{
				headers: $authHeader,
			}
		);
		if (!resp.ok) {
			throw new Error("Response code is not OK; code is " + resp.status);
		}
		const json = await resp.json();
		const numPages = json["pages"];
		const result = json["autoget"];

		if (firstLoad) dispatch("loaded");
		firstLoad = true;

		return {
			numPages,
			result,
		};
	}
</script>

<Modal showClose={true} on:close={modals.closeLastModal}>
	<div slot="header">
		<h1>Moderation Panel</h1>
	</div>
	<div slot="default">
		<h2>Moderate User</h2>
		<form
			on:submit|preventDefault={async e => {
				/** @type {HTMLFormElement} */
				// @ts-ignore
				const f = e.target;
				modals.showModal(ModerateUserModal, {
					// @ts-ignore
					username: f.elements[0].value,
				});
			}}
		>
			<div class="input-row">
				<input
					class="grow white"
					type="text"
					placeholder="Username..."
				/>
				<button class="static">Submit</button>
			</div>
		</form>
		<button
			class="long"
			style="margin-top: 0.25em;"
			on:click={() => modals.showModal(RecemtUsersModal)}
			>View Recent Users</button
		>
		{#if hasPermission(adminPermissions.VIEW_IPS)}
			<h2>Moderate IP</h2>
			<form
				on:submit|preventDefault={async e => {
					/** @type {HTMLFormElement} */
					// @ts-ignore
					const f = e.target;
					modals.showModal(ModerateIPModal, {
						// @ts-ignore
						ip: f.elements[0].value,
					});
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
			<button
				class="long"
				style="margin-top: 0.25em;"
				on:click={() => modals.showModal(RecentNetblocksModal)}
				>View Recent Netblocks</button
			>
		{/if}
		{#if hasPermission(adminPermissions.VIEW_POSTS)}
			<h2>Moderate Post</h2>
			<form
				on:submit|preventDefault={async e => {
					/** @type {HTMLFormElement} */
					// @ts-ignore
					const f = e.target;
					modals.showModal(ModeratePostModal, {
						// @ts-ignore
						postid: f.elements[0].value,
					});
				}}
			>
				<div class="input-row">
					<input
						class="grow white"
						type="text"
						placeholder="Post ID..."
					/>
					<button class="static">Submit</button>
				</div>
			</form>
		{/if}
		{#if hasPermission(adminPermissions.VIEW_CHATS)}
			<h2>Moderate Chat</h2>
			<form
				on:submit|preventDefault={async e => {
					/** @type {HTMLFormElement} */
					// @ts-ignore
					const f = e.target;
					// @ts-ignore
					$goto(`/chats/${f.elements[0].value}?admin=true`);
				}}
			>
				<div class="input-row">
					<input
						class="grow white"
						type="text"
						placeholder="Chat ID..."
					/>
					<button class="static">Submit</button>
				</div>
			</form>
		{/if}
		{#if hasPermission(adminPermissions.SEND_ANNOUNCEMENTS)}
			<h2>Send Announcement</h2>
			<form
				on:submit|preventDefault={() =>
					modals.showModal(SendAnnouncementModal, {
						announcement: announceMsg,
					})}
			>
				<textarea
					class="announce-textarea white"
					placeholder="Announcement text here..."
					bind:value={announceMsg}
				/>
				<div class="announce-buttons">
					<button class="align-right" disabled={!announceMsg}
						>Send</button
					>
				</div>
			</form>
		{/if}
		{#if hasPermission(adminPermissions.SYSADMIN)}
			<h2>Manage Server</h2>
			{#await getServerStatus()}
				<Loading />
			{:then}
				{#if !serverStatus.registrationEnabled}
					<Container warning={true}>
						Registration is currently disabled! New users will be
						blocked from joining Meower until registration is
						re-enabled.
					</Container>
				{/if}
				<button
					style="margin-right: 0.25em; margin-bottom: 0.25em;"
					on:click={() => modals.showModal(KickAllUsersModal)}
					>Kick all users</button
				>
				<button
					style="margin-right: 0.25em; margin-bottom: 0.25em;"
					on:click={() => modals.showModal(RestartServerModal)}
					>Restart server</button
				>
				<button
					style="margin-right: 0.25em; margin-bottom: 0.25em;"
					on:click={() => modals.showModal(EnableRepairModeModal)}
					>Enable repair mode</button
				>
				{#if serverStatus.registrationEnabled}
					<button on:click={toggleRegistration}
						>Disable registration</button
					>
				{:else}
					<button on:click={toggleRegistration}
						>Enable registration</button
					>
				{/if}
				{#if registrationToggleStatus}
					<br />
					<b>{registrationToggleStatus}</b>
				{/if}
			{/await}
		{/if}
		{#if hasPermission(adminPermissions.VIEW_REPORTS)}
			<h2>Reports</h2>
			<label for="report-status"><b>Status</b></label><br />
			<select
				id="state"
				class="grow"
				style="width: 100%; margin-bottom: 0.25em;"
				bind:value={reportFilterStatus}
				on:change={reloadReports}
			>
				<option value={null} selected={!reportFilterStatus}>
					Any
				</option>
				<option
					value="pending"
					selected={reportFilterStatus === "pending"}
				>
					Pending
				</option>
				<option
					value="no_action_taken"
					selected={reportFilterStatus === "no_action_taken"}
				>
					Completed with no action taken
				</option>
				<option
					value="action_taken"
					selected={reportFilterStatus === "action_taken"}
				>
					Completed with action taken
				</option>
			</select><br />
			<label for="report-type"><b>Type</b></label><br />
			<select
				id="state"
				class="grow"
				style="width: 100%; margin-bottom: 0.25em;"
				bind:value={reportFilterType}
				on:change={reloadReports}
			>
				<option value={null} selected={!reportFilterType}> Any </option>
				<option value="post" selected={reportFilterType === "post"}>
					Post
				</option>
				<option value="user" selected={reportFilterType === "user"}>
					User
				</option>
			</select><br />
			{#if !reloadingReports}
				<PagedList bind:items={reports} loadPage={loadReportsPage}>
					<svelte:fragment slot="loaded" let:items={_reports}>
						{#each _reports as report}
							<Report {report} />
						{/each}
					</svelte:fragment>
					<slot nam="error" slot="error" let:error {error}>
						Error loading reports. Please try again.
						<pre><code>{error}</code></pre>
					</slot>
					<slot name="empty" slot="empty">
						{#if reportFilterStatus === "pending"}
							Yay, there are no pending reports!
						{:else}
							No reports found. Check back later!
						{/if}
					</slot>
				</PagedList>
			{/if}
		{/if}

		<br />
	</div>
</Modal>

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

	.announce-buttons {
		min-height: 2em;
	}

	.align-right {
		float: right;
	}

	.long {
		width: 100%;
		margin: 0;
		margin-bottom: 0.2em;
	}
</style>
