<script>	
	import Modal from "../Modal.svelte";

	import {modalShown,modalPage} from "../stores.js";
</script>

<Modal on:close={() => {$modalShown = false}}>
    <h2 slot="header">Error Loading Modal</h2>
    <div slot="default">
		<p>Moderateuser input test</p>
	</div>
</Modal>

<style>

</style>