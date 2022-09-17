<script>	
	import Modal from "../Modal.svelte";

	import {modalShown, mainPage as page,profileClicked_GC,chatName,chatid, modalPage} from "../stores.js";

    import {tick} from "svelte";

    import * as clm from "../clmanager.js";
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
    <h2 slot="header">{"Add Member To '" + $chatName + "'?"}</h2>
    <div slot="default">
        <button class="long"on:click={() => {
            modalPage.set("AddMemberBN");
        }}>Add Member By Name</button>
    </div>
</Modal>

<style>
    .long {
        width: 100%;
        margin: 0;
		margin-bottom: -2px;
    }
</style>