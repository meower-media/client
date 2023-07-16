<script>
	import Modal from "../Modal.svelte";

	import {modalShown, modalPage} from "../stores.js";
	import * as Modals from "../modals.js";
</script>

<Modal
	on:close={() => {
		$modalShown = false;
	}}
>
	<h2 slot="header">Add Member</h2>
	<div slot="default">
		<button
			class="long"
			on:click={() => {
				Modals.showModal("addMember");
			}}
		>
			Enter Username
		</button>
		<button
			class="long"
			on:click={() => {
				Modals.showModal("addMemberSearch");
			}}
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
