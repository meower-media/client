<script>	
	import Modal from "../Modal.svelte";

	import {modalShown,modalPage} from "../stores.js";
</script>

<Modal on:close={() => {$modalShown = false}}>
    <h2 slot="header">Change Profile Picture</h2>
    <div slot="default">
		
	</div>
</Modal>

<style>
	
</style>