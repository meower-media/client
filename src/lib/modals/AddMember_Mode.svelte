<script>
	import Modal from "../Modal.svelte";
	
	import * as modals from "../modals.js";
</script>

<Modal
	on:close={() => { modals.closeModal(); }}
>
	<h2 slot="header">Add Member</h2>
	<div slot="default">
		<button
			class="long"
			on:click={() => { modals.showModal("addMember"); }}
		>
			Enter Username
		</button><br />
		<button
			class="long"
			on:click={() => { modals.showModal("addMemberSearch"); }}
		>
			Search for Users
		</button><br />
		<button
			class="long"
			on:click={() => { modals.closeModal(); }}
		>
			Cancel
		</button>
	</div>
</Modal>

<style>
	.long {
		width: 100%;
		margin-bottom: 0.2em;
	}
</style>
