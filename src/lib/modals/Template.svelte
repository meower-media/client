<script>
	import Modal from "../Modal.svelte";

	import * as modals from "../modals.js";
</script>

<Modal
	on:close={() => { modals.closeModal(); }}
>
	<h2 slot="header">Template Modal</h2>
	<div slot="default">
		<p>blah blah blah</p>
		<div class="modal-buttons">
			<button
				on:click={() => { modals.closeModal(); }}>Close</button
			>
		</div>
	</div>
</Modal>
