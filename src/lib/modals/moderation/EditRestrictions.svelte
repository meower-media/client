<script>
	import Modal from "../../Modal.svelte";

	import {pendingBanState} from "../../stores.js";
	import {
		adminPermissions,
		hasPermission,
		userRestrictions,
	} from "../../bitField.js";
	import * as modals from "../../modals.js";

	import {onMount} from "svelte";

	const restrictions = [
		{
			value: userRestrictions.HOME_POSTS,
			name: "Block home posts",
			description: "Blocks creating new home posts.",
		},
		{
			value: userRestrictions.CHAT_POSTS,
			name: "Block chat posts",
			description: "Blocks creating new chat posts.",
		},
		{
			value: userRestrictions.NEW_CHATS,
			name: "Block new chats",
			description: "Blocks creating new group chats and starting DMs.",
		},
		{
			value: userRestrictions.EDITING_CHAT_NICKNAMES,
			name: "Block editing group chat nicknames",
			description: "Blocks editing group chat nicknames.",
		},
		{
			value: userRestrictions.EDITING_QUOTE,
			name: "Block editing quote",
			description: "Blocks editing their quote.",
		},
	];

	export let modalData;

	let {username} = modalData;

	let selectedRestrictions = [];

	onMount(() => {
		selectedRestrictions = [];
		for (let restriction of restrictions) {
			if (
				($pendingBanState.restrictions & restriction.value) ===
				restriction.value
			) {
				selectedRestrictions.push(restriction.value);
			}
		}
	});

	async function saveRestrictions() {
		let restrictionsBitField = 0;
		for (let restriction of selectedRestrictions) {
			restrictionsBitField |= restriction;
		}
		$pendingBanState.restrictions = restrictionsBitField;
		modals.closeLastModal();
	}
</script>

<Modal on:close={modals.closeLastModal}>
	<h2 slot="header">
		{username}'s Restrictions
	</h2>
	<div slot="default">
		{#each restrictions as restriction}
			<label>
				<input
					type="checkbox"
					value={restriction.value}
					disabled={!hasPermission(adminPermissions.EDIT_BAN_STATES)}
					bind:group={selectedRestrictions}
				/>
				{restriction.name}
			</label><br />
			{@html restriction.description}<br /><br />
		{/each}
		<div class="modal-buttons">
			<button type="button" on:click={modals.closeLastModal}>Close</button
			>
			{#if hasPermission(adminPermissions.EDIT_BAN_STATES)}
				<button type="submit" on:click={saveRestrictions}>Save</button>
			{/if}
		</div>
	</div>
</Modal>

<style>
	label,
	input[type="checkbox"] {
		vertical-align: middle;
	}

	input[type="checkbox"] {
		border: none;
	}
</style>
