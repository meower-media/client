<script>
	import Modal from "../../Modal.svelte";
	import PagedList from "../../PagedList.svelte";

	import CreateNetblockModal from "./CreateNetblock.svelte";
	import DeleteNetblockModal from "./DeleteNetblock.svelte";
	import NetblockNotesModal from "./NetblockNotes.svelte";

	import {authHeader} from "../../stores.js";
	import {adminPermissions, hasPermission} from "../../bitField.js";
	import {apiUrl} from "../../urls.js";
	import * as modals from "../../modals.js";

	import {createEventDispatcher} from "svelte";

	const dispatch = createEventDispatcher();

	let netblocks = [];

	let firstLoad = true;

	async function loadNetblocksPage(page = 1) {
		const resp = await fetch(
			`${apiUrl}admin/netblocks?autoget=1&page=${page}`,
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
	<h2 slot="header">Recent Netblocks</h2>
	<div slot="default">
		<PagedList bind:items={netblocks} loadPage={loadNetblocksPage}>
			<svelte:fragment slot="loaded" let:items={_netblocks}>
				<button
					class="long"
					disabled={!hasPermission(adminPermissions.BLOCK_IPS)}
					on:click={() =>
						modals.showModal(CreateNetblockModal, {cidr: ""})}
					>Create Netblock</button
				>
				<table>
					<tr>
						<th>CIDR</th>
						<th>Type</th>
						<th>Actions</th>
					</tr>
					{#each _netblocks as netblock}
						<tr>
							<td>{netblock._id}</td>
							<td>{["Full", "Registration"][netblock.type]}</td>
							<td>
								<div class="action-buttons">
									<button
										class="circle white scroll"
										title="View/edit notes"
										disabled={!hasPermission(
											adminPermissions.VIEW_NOTES
										)}
										on:click={() =>
											modals.showModal(
												NetblockNotesModal,
												{cidr: netblock._id}
											)}
									/>
									<button
										class="circle close"
										title="Delete netblock"
										disabled={!hasPermission(
											adminPermissions.BLOCK_IPS
										)}
										on:click={() =>
											modals.showModal(
												DeleteNetblockModal,
												{cidr: netblock._id}
											)}
									/>
								</div>
							</td>
						</tr>
					{/each}
				</table>
			</svelte:fragment>
			<slot nam="error" slot="error" let:error {error}>
				Error loading netblocks. Please try again.
				<pre><code>{error}</code></pre>
			</slot>
			<slot name="empty" slot="empty">
				<button
					class="long"
					disabled={!hasPermission(adminPermissions.BLOCK_IPS)}
					on:click={() =>
						modals.showModal(CreateNetblockModal, {cidr: ""})}
					>Create Netblock</button
				>
				No netblocks found. Check back later!
			</slot>
		</PagedList>
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
