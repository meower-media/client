<script>
	import Modal from "../../Modal.svelte";
	import AdminNotes from "../../AdminNotes.svelte";

	import * as modals from "../../modals.js";

	export let modalData;

	let {reportid} = modalData;
</script>

<Modal showClose={true} on:close={modals.closeLastModal}>
	<h2 slot="header">Notes for {reportid}</h2>
	<div slot="default">
		<AdminNotes identifier={btoa(reportid)} />
		<div />
	</div>
</Modal>
