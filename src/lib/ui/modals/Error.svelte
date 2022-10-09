<script>	
	import Modal from "../Modal.svelte";

	import {modalShown, modalPage} from "../../stores.js";
</script>

<Modal on:close={() => {$modalShown = false}}>
    <h2 slot="header">Invalid modalPage string</h2>
    <div slot="default">
		<p>{"Invalid modalPage string for '" + $modalPage + "'"}</p>
		<small class="smol">PS to devlopers, Your code may be working!</small>
	</div>
</Modal>

<style>
	.smol {
		font-size: 8px;
	}
</style>