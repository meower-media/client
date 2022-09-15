<script>	
	import Modal from "../Modal.svelte";

	import {modalShown, mainPage as page,profileClicked_GC,chatName,chatid} from "../stores.js";

    import {tick} from "svelte";

    import * as clm from "../clmanager.js";
</script>

<!--
    clm.meowerRequest({
					cmd: "direct", 
					val: {
						cmd: "remove_from_chat", 
						val: {chatid: $chatid, username: $profileClicked_GC}
					}
				})
				$modalShown = false
				page.set("blank");
				tick().then(() => page.set("groupchat"))
-->

<Modal on:close={() => {$modalShown = false}}>
    <h2 slot="header">{"Remove " + $profileClicked_GC + " From " + $chatName + "?"}</h2>
    <div slot="default">
		<button class="long" on:click={() => {
            clm.meowerRequest({
                cmd: "direct", 
                val: {
                    cmd: "remove_from_chat", 
                    val: {chatid: $chatid, username: $profileClicked_GC}
                }
            })
            $modalShown = false
            page.set("blank");
            tick().then(() => page.set("groupchat"))
        }}>Yes</button>
	</div>
</Modal>

<style>
    .long {
        width: 100%;
        margin: 0;
		margin-bottom: -2px;
    }
</style>