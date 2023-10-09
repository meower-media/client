<script>
	import Modal from "../../Modal.svelte";
	import Loading from "../../Loading.svelte";

	import CreateNetblockModal from "./CreateNetblock.svelte";
	import DeleteNetblockModal from "./DeleteNetblock.svelte";

	import {authHeader} from "../../stores.js";
	import {
		adminPermissions,
		hasPermission,
	} from "../../bitField.js";
	import {apiUrl} from "../../urls.js";
	import * as modals from "../../modals.js";

	async function getNetblocks() {
		const resp = await fetch(`${apiUrl}admin/netblocks?autoget=1`, {
			headers: $authHeader,
		});
		if (!resp.ok) {
			throw new Error("Response code is not OK; code is " + resp.status);
		}
		const json = await resp.json();
		return json.autoget;
	}
</script>

<Modal showClose={true}
	on:close={modals.closeLastModal}
>
	<h2 slot="header">Netblocks</h2>
	<div slot="default">
		{#await getNetblocks()}
			<Loading />
		{:then netblocks}
            <button class="long" disabled={!hasPermission(adminPermissions.BLOCK_IPS)} on:click={() => modals.showModal(CreateNetblockModal, { cidr: "" })}>Create Netblock</button>
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
									on:click={() => modals.showModal("", { identifier: btoa(netblock._id) })}
								/>
								<button
									class="circle close"
									title="Delete netblock"
                                    disabled={!hasPermission(adminPermissions.BLOCK_IPS)}
									on:click={() => modals.showModal(DeleteNetblockModal, { cidr: netblock._id })}
								/>
							</div>
						</td>
					</tr>
				{/each}
			</table>
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

	.long {
		width: 100%;
		margin: 0;
		margin-bottom: 0.2em;
	}
</style>
