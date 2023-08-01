<script>
    import Modal from "../Modal.svelte";

    import { modalShown, modalPage, imageClicked } from "../stores.js";
    console.log($imageClicked.url);
</script>

<Modal
    on:close={() => {
        $modalShown = false;
    }}
>
    <center>
        <img src={$imageClicked.url} title="image.png" />
    </center>
    <div slot="default">
        <center>
            <a href={$imageClicked.url} target="black" style="max-width: 100%"
                >Open the original image</a
            >
        </center>
    </div>
</Modal>

<style>
</style>
