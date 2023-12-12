<script>
	import Member from './../../Member.svelte';
	import { authHeader, chat } from './../../stores.js';
	import { apiUrl } from './../../urls.js';
	import Modal from "../../Modal.svelte";
    import * as modals from "../../modals"
	import Spinner from '../../Spinner.svelte';

    async function fetchBannedMembers() {
        const resp = await fetch(`${apiUrl}chats/${$chat._id}/bans`, {
            headers: $authHeader
        })
        if (!resp.ok) {
            if (resp.status === 429) {
                throw new Error("Too many requests! Try again later.")
            }
            throw new Error("Response code is not OK; code is " + resp.status)
        }
        $chat.banned_users = (await resp.json()).bans;
    }



</script>

<Modal on:close={modals.closeLastModal}>
    <h2 slot="header">Banned Users</h2>
    <div slot="default">
    {#await fetchBannedMembers()}
        <Spinner />
    {:then _}


    {#each $chat.banned_users as member}

    <p>
    <Member member={member.username} owner={false} />
        Reason: {member.message}

        <button on:click={() => {
            fetch(`${apiUrl}chats/${$chat._id}/bans/${member.username}`, {
                method: "DELETE",
                headers: $authHeader
            })
            modals.closeLastModal()
        }} >Unban</button>
    </p>
        {/each}
        {/await}
    </div>
    </Modal>

<style>
    p {
        display: flex;
        justify-content: center;
        text-align: center;
    }
</style>