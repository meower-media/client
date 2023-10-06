<script>
	import Modal from "../../Modal.svelte";
	import Loading from "../../Loading.svelte";
	import FormattedDate from "../../FormattedDate.svelte";
	import AdminNotes from "../../AdminNotes.svelte";

	import ModerateUserModal from "./ModerateUser.svelte";

	import * as modals from "../../modals.js";
	import * as clm from "../../clmanager.js";

	import {
		userToMod,
		ipToMod,
	} from "../../stores.js";
	import {permissions, hasPermission} from "../../adminPermissions.js";

	let ip, blockStatus;

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

	$: { if (!$ipToMod) modals.closeLastModal() }
</script>

<Modal
	on:close={() => {
		$ipToMod = "";
		modals.closeLastModal();
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
							on:click|preventDefault={async () => {
								$userToMod = username;
								modals.showModal(ModerateUserModal);
							}}>{username}</a
						>
					</li>
				{/each}
			</ul>

			<br /><br />

			{#if hasPermission(permissions.VIEW_NOTES)}
				<h2>Notes</h2>
				<AdminNotes identifier={ip._id} />
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
						$ipToMod = "";
						modals.closeLastModal();
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
						$ipToMod = "";
						modals.closeLastModal();
					}}>Close</button
				>
			</div>
		{/await}
		<div />
	</div></Modal
>

<style>
	.action-button {
		margin-right: 0.25em;
		margin-bottom: 0.25em;
	}
</style>
