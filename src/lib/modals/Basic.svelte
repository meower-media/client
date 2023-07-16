<script>
	import Modal from "../Modal.svelte";

	import {modalShown, basicModalDesc, basicModalTitle} from "../stores.js";

	let Desc =
		($basicModalDesc != "" && $basicModalDesc) ||
		"Error loading description.";
	let Title =
		($basicModalTitle != "" && $basicModalTitle) || "Error loading title";
</script>

<Modal
	on:close={() => {
		$modalShown = false;
	}}
>
	<h2 slot="header">{Title}</h2>
	<div slot="default">
		<p>{Desc}</p>
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
</style>
