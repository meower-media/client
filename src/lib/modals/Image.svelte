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
    <div slot="default">
        <image src={$imageClicked.url}></image>
        <center>
            <a href={$imageClicked.url} target="black">Open the original image</a>
        </center>
    </div>
</Modal>

<style>
</style>
