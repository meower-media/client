<script>	
	import Modal from "../Modal.svelte";

	import {modalShown,modalPage} from "../stores.js";
</script>

<Modal on:close={() => {$modalShown = false}}>
    <h2 slot="header">Unknown Modal</h2>
    <div slot="default">
		<p>{"Unknown Modal, Requested Modal name '" + $modalPage + "'"}</p>
		<small class="smol">PS to devlopers, Your code may be working!</small>
	</div>
</Modal>

<style>
	.smol {
		font-size: 8px;
	}
</style>
