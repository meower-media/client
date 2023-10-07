<script>
	import Modal from "../../Modal.svelte";

	import {authHeader} from "../../stores.js";
	import {adminPermissions, hasPermission} from "../../bitField.js";
	import {apiUrl} from "../../urls.js";
	import * as modals from "../../modals.js";

	import {onMount} from "svelte";

	const permissions = [
		{
			value: adminPermissions.VIEW_REPORTS,
			name: "View reports",
			description: "Allows viewing all pending and completed reports.",
		},
		{
			value: adminPermissions.EDIT_REPORTS,
			name: "Edit reports",
			description:
				"Allows changing the status of reports.<br />(requires 'View reports' permission",
		},
	];

	export let modalData;

	let {user, selectedRestrictions} = modalData;
</script>

<Modal on:close={modals.closeLastModal}>
	<h2 slot="header">
		{user._id}'s Restrictions
	</h2>
	<div slot="default">
		{#each permissions as permission}
			<label>
				<input
					type="checkbox"
					value={permission.value}
					disabled={!hasPermission(adminPermissions.EDIT_BAN_STATES)}
					bind:group={selectedRestrictions}
				/>
				{permission.name}
			</label><br />
			{@html permission.description}<br /><br />
		{/each}
		<div class="modal-buttons">
			<button
				type="button"
				on:click={() => {
					selectedRestrictions;
					modals.closeLastModal;
				}}>Close</button
			>
			{#if hasPermission(adminPermissions.SYSADMIN)}
				<button type="submit" on:click={modals.closeLastModal}
					>Save</button
				>
			{/if}
		</div>
	</div>
</Modal>

<style>
	label,
	input[type="checkbox"] {
		vertical-align: middle;
	}
</style>
