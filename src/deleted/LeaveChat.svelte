<script>	
	import Modal from "../lib/Modal.svelte";

	import {
		modalShown
	} from "../lib/stores.js";
</script>

<Modal on:close={() => {$modalShown = false}}>
    <h2 slot="header">Leave ($chatname)</h2>
    <div slot="default">
		<form
			on:submit|preventDefault={e => {
				
			}}
		>
			<div class="modal-buttons">
				<button type="button" on:click={() => {$modalShown = false}}>Cancel</button>
				<button type="submit">Leave</button>
			</div>
		</form>
	</div>
</Modal>