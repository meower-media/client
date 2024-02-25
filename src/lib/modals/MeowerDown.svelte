<script>
	import Modal from "../Modal.svelte";
    import ServerSelectorModal from "./ServerSelector.svelte";

	import * as modals from "../modals.js";
    import * as key from "../keyDetect.js";
</script>

<Modal>
	<h2 slot="header">Connection error</h2>
	<div slot="default">
		<p>Sorry, but we couldn't connect to Meower. The server might be down, or you might not be connected to the internet.</p>
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
