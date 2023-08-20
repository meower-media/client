<script>
	import Modal from "../Modal.svelte";

	import * as modals from "../modals.js";

	import {goto} from "@roxi/routify";
</script>

<Modal
	on:close={() => {
		modals.closeModal();
	}}
>
	<h2 slot="header">Logout</h2>
	<div slot="default">
		<span>Are you sure you would like to logout?</span>
		<br /><br />
		<div class="modal-buttons">
			<button
				on:click={() => {
					modals.closeModal();
				}}>Cancel</button
			>
			<button
				on:click={() => {
					$goto("/logout");
				}}>Logout</button
			>
		</div>
	</div>
</Modal>
