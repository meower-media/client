<script>
	import Modal from "../Modal.svelte";

	import * as modals from "../modals.js";
	import {basicModalTitle, basicModalDesc} from "../stores.js";
</script>

<Modal
	on:close={() => {
		modals.closeModal();
	}}
>
	<h2 slot="header">{$basicModalTitle}</h2>
	<div slot="default">
		<p>{$basicModalDesc}</p>
		<div class="modal-buttons">
			<button
				on:click={() => {
					modals.closeModal();
				}}>Close</button
			>
		</div>
	</div>
</Modal>

<style>
</style>
