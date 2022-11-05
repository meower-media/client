<script>
    import Modal from "../Modal.svelte";

    import {modalShown} from "../stores.js";
</script>

<Modal on:close={() => {$modalShown = false}}>
    <h2 slot="header">
        CubeUpload Login
    </h2>
    <div slot="default">
        uh
    </div>
</Modal>