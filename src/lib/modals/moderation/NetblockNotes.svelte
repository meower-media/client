<script>
	import Modal from "../../Modal.svelte";
	import AdminNotes from "../../AdminNotes.svelte";

	import * as modals from "../../modals.js";

	export let modalData;

	let {cidr} = modalData;
</script>

<Modal showClose={true} on:close={modals.closeLastModal}>
	<h2 slot="header">Notes for {cidr}</h2>
	<div slot="default">
		<AdminNotes identifier={btoa(cidr)} />
		<div />
	</div>
</Modal>
