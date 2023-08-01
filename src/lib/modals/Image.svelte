<script>
	import Modal from "../Modal.svelte";

	import {modalShown, modalPage, imageClicked} from "../stores.js";
    console.log(imageClicked)
</script>

<Modal
	on:close={() => {
		$modalShown = false;
	}}
>
	<image src={imageClicked}>
</Modal>

<style>
</style>
