<script>	
	import Modal from "../Modal.svelte";

	import {modalShown, mainPage as page,profileClicked_GC,chatName,chatid, modalPage, chatMembers} from "../stores.js";

    import {tick} from "svelte";

    import * as clm from "../clmanager.js";
    import { append } from "svelte/internal";
</script>

<!--
    <form
                on:submit|preventDefault={e => {					
                    
            }}
		>
            <input
                type="text"
                class="white"
                placeholder="Add Via Search"
                    id="postinput"
                    name="postinput"
                autocomplete="false"
                maxlength="360"
            >
            <button>Add member</button>
        </form>
-->

<Modal on:close={() => {$modalShown = false}}>
    <h2 slot="header">{"Add Member To '" + $chatName + "'? - By Name"}</h2>
    <div slot="default">
        <form
            on:submit|preventDefault={e => {					
                clm.meowerRequest({
                    cmd: "direct", 
                    val: {
                        cmd: "add_to_chat", 
                        val: {chatid: $chatid, username: e.target[0].value}
                    }
                })
                $chatMembers.push(e.target[0].value)
                $modalShown = false
                page.set("blank");
                tick().then(() => page.set("groupchat"))
            }}
		>
            <input
                type="text"
                class="long white"
                placeholder="Add Via Search"
                    id="postinput"
                    name="postinput"
                autocomplete="false"
                maxlength="360"
            >
            <br><br>
            <button class="long">Add member</button>
        </form>
    </div>
</Modal>

<style>
    .long {
        width: 100%;
        margin: 0;
		margin-bottom: -2px;
    }
</style>