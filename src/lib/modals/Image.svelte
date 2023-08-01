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
        <img src={$imageClicked.url} title="image.png" />
        <center>
            <a href={$imageClicked.url} target="black" style="max-width: 100%">Open the original image</a>
        </center>
    </div>
</Modal>

<style>
</style>
