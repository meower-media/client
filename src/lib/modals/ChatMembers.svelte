<script>	
	import Modal from "../Modal.svelte";
    import Container from "../Container.svelte";
    import PFP from "../PFP.svelte";

    import * as clm from "../clmanager.js";

	import {modalShown, chatClicked} from "../stores.js";

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