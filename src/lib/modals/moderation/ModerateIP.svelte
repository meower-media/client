<script>
	import Modal from "../../Modal.svelte";
	import Loading from "../../Loading.svelte";
	import Container from "../../Container.svelte";
	import FormattedDate from "../../FormattedDate.svelte";
	import AdminNotes from "../../AdminNotes.svelte";

	import ModerateUserModal from "./ModerateUser.svelte";
	import CreateNetblockModal from "./CreateNetblock.svelte";
	import DeleteNetblockModal from "./DeleteNetblock.svelte";
	import NetblockNotesModal from "./NetblockNotes.svelte";

	import {authHeader} from "../../stores.js";
	import {adminPermissions, hasPermission} from "../../bitField.js";
	import {apiUrl} from "../../urls.js";
	import * as modals from "../../modals.js";

	export let modalData;

	let {ip} = modalData;

	let netinfo, netlogs, netblocks;

	async function getNetinfo() {
		const resp = await fetch(`${apiUrl}admin/netinfo/${ip}`, {
			headers: $authHeader,
		});
		if (!resp.ok) {
			throw new Error("Response code is not OK; code is " + resp.status);
		}
		const json = await resp.json();
		netinfo = json.netinfo;
		netlogs = json.netlogs;
		netblocks = json.netblocks;
	}
</script>

<Modal showClose={true} on:close={modals.closeLastModal}>
	<h2 slot="header">Moderate {ip}</h2>
	<div slot="default">
		{#await getNetinfo()}
			<Loading />
		{:then}
			<h2>Netinfo</h2>
			<b>IP address:</b>
			{ip}<br />
			<b>ASN:</b>
			{netinfo.asn}<br />
			<b>Country:</b>
			{netinfo.country_code} ({netinfo.country_name})<br />
			<b>ISP:</b>
			{netinfo.isp}<br />
			<b>VPN?</b>
			{netlogs.vpn ? "yes" : "no"}

			<br /><br />

			<h2>Netlogs</h2>
			<table>
				<tr>
					<th>User</th>
					<th>Last Used</th>
				</tr>
				{#each netlogs as netlog}
					<tr>
						<td
							><a
								href="/"
								on:click|preventDefault={() => {
									modals.showModal(ModerateUserModal, {
										username: netlog.user,
									});
								}}>{netlog.user}</a
							></td
						>
						<td
							><FormattedDate
								date={netlog.last_used}
								relative={true}
							/></td
						>
					</tr>
				{/each}
			</table>

			<br /><br />

			<h2>Netblocks</h2>
			{#if netblocks.find(_netblock => _netblock.type === 0)}
				<Container warning={true}>
					{ip} is currently fully blocked from accessing Meower's CloudLink
					server and REST API.
				</Container>
			{/if}
			{#if netblocks.find(_netblock => _netblock.type === 1)}
				<Container warning={true}>
					{ip} is currently blocked from creating new Meower accounts.
				</Container>
			{/if}
			<button
				class="long"
				on:click={() =>
					modals.showModal(CreateNetblockModal, {cidr: ip + "/32"})}
				>Create Netblock</button
			>
			<table>
				<tr>
					<th>CIDR</th>
					<th>Type</th>
					<th>Actions</th>
				</tr>
				{#each netblocks as netblock}
					<tr>
						<td>{netblock._id}</td>
						<td>{["Full", "Registration"][netblock.type]}</td>
						<td>
							<div class="action-buttons">
								<button
									class="circle scroll"
									title="View/edit notes"
									disabled={!hasPermission(
										adminPermissions.VIEW_NOTES
									)}
									on:click={() =>
										modals.showModal(NetblockNotesModal, {
											cidr: netblock._id,
										})}
								/>
								<button
									class="circle close"
									title="Delete netblock"
									disabled={!hasPermission(
										adminPermissions.BLOCK_IPS
									)}
									on:click={() =>
										modals.showModal(DeleteNetblockModal, {
											cidr: netblock._id,
										})}
								/>
							</div>
						</td>
					</tr>
				{/each}
			</table>

			<br /><br />

			{#if hasPermission(adminPermissions.VIEW_NOTES)}
				<h2>Notes</h2>
				<AdminNotes identifier={btoa(netinfo._id)} />
				<br /><br />
			{/if}
		{:catch error}
			{error}
		{/await}
		<div />
	</div>
</Modal>

<style>
	table {
		width: 100%;
		max-width: 100%;
		text-align: center;
		border-collapse: collapse;
		overflow: hidden;
	}

	th,
	td {
		border: solid 2px var(--orange);
		padding: 0.35em;
		outline: none;
		word-break: break-all;
	}

	.action-buttons {
		max-width: 7.5em;
		margin-left: auto;
		margin-right: auto;
		display: flex;
		align-items: center;
		justify-content: space-evenly;
	}
	.action-buttons button {
		border: none;
	}

	.long {
		width: 100%;
		margin: 0;
		margin-bottom: 0.2em;
	}
</style>
