<script>
	import Modal from "../Modal.svelte";

	import * as modals from "../modals.js";

	import {goto, focus} from "@roxi/routify";
</script>

<Modal on:close={modals.closeLastModal}>
	<h2 slot="header">Logout</h2>
	<div slot="default">
		<span>Are you sure you would like to logout?</span>
		<br /><br />
		<div class="modal-buttons">
			<button on:click={modals.closeLastModal}>Cancel</button>
			<button on:click={() => $goto("/logout")} use:focus>Logout</button>
		</div>
	</div>
</Modal>
