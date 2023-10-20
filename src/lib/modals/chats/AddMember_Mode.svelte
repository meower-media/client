<script>
	import Modal from "../../Modal.svelte";

	import AddMemberModal from "./AddMember.svelte";
	import AddMemberSearchModal from "./AddMember_Search.svelte";

	import * as modals from "../../modals.js";
</script>

<Modal showClose={true} on:close={modals.closeLastModal}>
	<h2 slot="header">Add Member</h2>
	<div slot="default">
		<button
			class="long"
			on:click={() => modals.replaceLastModal(AddMemberModal)}
		>
			Enter Username
		</button><br />
		<button
			class="long"
			on:click={() => modals.replaceLastModal(AddMemberSearchModal)}
		>
			Search for Users
		</button>
	</div>
</Modal>

<style>
	.long {
		width: 100%;
		margin-bottom: 0.2em;
	}
</style>
