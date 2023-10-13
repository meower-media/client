<script>
	import Modal from "../Modal.svelte";

	import * as modals from "../modals.js";

	export let modalData;

	let {title, desc} = modalData;
</script>

<Modal on:close={modals.closeLastModal}>
	<h2 slot="header">{title}</h2>
	<div slot="default">
		<p>{desc}</p>
		<div class="modal-buttons">
			<button on:click={modals.closeLastModal}>Close</button>
		</div>
	</div>
</Modal>
