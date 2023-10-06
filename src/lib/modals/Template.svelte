<script>
	import Modal from "../Modal.svelte";

	import * as modals from "../modals.js";
</script>

<Modal on:close={modals.closeLastModal}>
	<h2 slot="header">Template Modal</h2>
	<div slot="default">
		<p>blah blah blah</p>
		<div class="modal-buttons">
			<button
				on:click={() => {
					modals.closeLastModal();
				}}>Close</button
			>
		</div>
	</div>
</Modal>
