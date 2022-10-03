<script>	
	import Modal from "../Modal.svelte";

	import {
		modalShown, mainPage as page,
		profileClicked_GC,
		chatName, chatid, chatMembers
	} from "../stores.js";

    import {tick} from "svelte";

    import * as clm from "../clmanager.js";

    function filter1(v) {
        return v !== $profileClicked_GC;
    }
</script>

<Modal on:close={() => {$modalShown = false}}>
    <h2 slot="header">Remove {$profileClicked_GC} from {$chatName}?</h2>
    <div slot="default">
		<div class="modal-buttons">
			<button on:click={() => {
				$modalShown = false;
			}}>Cancel</button>
			<button on:click={() => {
				clm.meowerRequest({
					cmd: "direct", 
					val: {
						cmd: "remove_from_chat", 
						val: {chatid: $chatid, username: $profileClicked_GC}
					}
				})
				$chatMembers = $chatMembers.filter(filter1);
				$modalShown = false;
				page.set("blank");
				tick().then(() => page.set("groupchat"))
			}}>Remove</button>
		</div>
	</div>
</Modal>

<style></style>