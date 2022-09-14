<script>	
	import Modal from "../lib/Modal.svelte";
    import Container from "../lib/Container.svelte";
    import PFP from "../lib/PFP.svelte";

    import * as clm from "../lib/clmanager.js";

	import {modalShown, chatClicked} from "../lib/stores.js";

    let addStatus = "";
</script>

<Modal on:close={() => {$modalShown = false}}>
    <h2 slot="header">
        Members of {$chatClicked.nickname}
    </h2>
    <div slot="default">
        <form
			on:submit|preventDefault={e => {
				if (!e.target[0].value) {
					addStatus = "You must specify a nickname to create the chat!";
					return false;
				}
				return false;
			}}
		>
			{#if addStatus}
			<span class="status">{addStatus}</span><br />
			{/if}
			<input type="text" class="modal-input white" style="width: 87%;" placeholder="Enter username..." maxlength="20"> <button width="auto">Add</button><br /><br />
		</form>
        <div class="modal-buttons">
            <button on:click={() => {$modalShown = false}}>Close</button>
        </div>
    </div>
</Modal>

<style>
    .status {
        color: red;
        font-size: 105%;
		display: inline-block;
		height: 0;
		overflow: visible;
	}
</style>