<script>	
	import Modal from "../lib/lib/Modal.svelte";

	import {modalShown, mainPage as page,profileClicked_GC,chatName,chatid, modalPage} from "../lib/lib/stores.js";

    import {tick} from "svelte";

    import * as clm from "../lib/lib/clmanager.js";
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