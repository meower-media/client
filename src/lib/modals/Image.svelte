<script>
	import Modal from "../Modal.svelte";

	import {modalShown, modalPage, imageClicked} from "../stores.js";
    console.log($imageClicked.url)
</script>

<Modal
	on:close={() => {
		$modalShown = false;
	}}
>
	<image src={$imageClicked.url}>
    <center><a href={$imageClicked.url} target="black">Open the original image</a></center>
</Modal>

<style>
</style>
