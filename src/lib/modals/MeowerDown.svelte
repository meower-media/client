<script>
	import Modal from "../Modal.svelte";
    import ServerSelectorModal from "./ServerSelector.svelte";

	import * as modals from "../modals.js";
    import * as key from "../keyDetect.js";
</script>

<Modal>
	<h2 slot="header">Connection error</h2>
	<div slot="default">
		<p>Sorry, But we couldnt connect to Meower or You arent connected to the internet</p>
		<div class="modal-buttons">
			<button on:click={() => {
                if (key.shiftHeld) {
                    modals.showModal(ServerSelectorModal)
                } else {
                    window.location.reload()
                }
            }}>Reload</button>
		</div>
	</div>
</Modal>
