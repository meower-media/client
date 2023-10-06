<script>
	import Modal from "../Modal.svelte";

	import {modalPage} from "../stores.js";

	import * as modals from "../modals.js";
</script>

<Modal on:close={modals.closeLastModal}>
	<h2 slot="header">Error Loading Modal</h2>
	<div slot="default">
		<p>No modal found by the name of {$modalPage}</p>
	</div>
</Modal>
