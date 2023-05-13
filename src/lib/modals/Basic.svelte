<script>
	import Modal from "../Modal.svelte";

	import {modalShown, BasicModalDesc, BasicModalTitle} from "../stores.js";

	let Desc = ($BasicModalDesc != "") && $BasicModalDesc || "Error Loading Description"
	let Title = ($BasicModalTitle != "") && $BasicModalTitle || "Error Loading Title"
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
	.smol {
		font-size: 8px;
	}
</style>
