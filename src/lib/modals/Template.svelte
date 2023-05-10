<script>
	import Modal from "../Modal.svelte";

	import {modalShown, modalPage} from "../stores.js";
</script>

<Modal
	on:close={() => {
		$modalShown = false;
	}}
>
	<h2 slot="header">Template Modal</h2>
	<div slot="default">
		<p>Template</p>
		<small class="smol">(PS to developers: your code is working!!!!)</small>
		<div class="modal-buttons">
			<button
				on:click={() => {
					$modalShown = false;
				}}>Close</button
			>
		</div>
	</div>
</Modal>

<style>
	.smol {
		font-size: 8px;
	}
</style>
