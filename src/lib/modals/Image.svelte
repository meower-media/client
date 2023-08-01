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
    <center slot="header">
        <img src={$imageClicked.url} alt="An embed viewed in full screen" title="image.png" />
    </center>
    <center slot="default">
        <a href={$imageClicked.url} target="black" style="max-width: 100%"
            >Open the original image</a
        >
    </center>
</Modal>

<style>
</style>
