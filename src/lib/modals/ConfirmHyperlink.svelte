<script>
	import Modal from "../Modal.svelte";

	import * as modals from "../modals.js";

	export let modalData;

	let {link} = modalData;
</script>

<Modal on:close={modals.closeLastModal}>
	<h2 slot="header">External Link</h2>
	<div slot="default">
		<p>
			Are you sure you wish to go to {link}? If you confirm this action,
			it will be opened in a new tab.
		</p>
		<div class="modal-buttons">
			<button on:click={modals.closeLastModal}>Cancel</button>
			<button
				on:click={() => {
					window.open(link, "_blank");
					modals.closeLastModal();
				}}>Yes</button
			>
		</div>
	</div>
</Modal>
