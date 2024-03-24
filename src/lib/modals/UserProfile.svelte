<script>
	import Modal from "../Modal.svelte";
    import UserPosts from "./UserPosts.svelte";

	import * as modals from "../modals.js";

	export let modalData;

	let {username,gc} = modalData;
    import ProfileView from "../ProfileView.svelte";
	import Loading from "../Loading.svelte";
	import Container from "../Container.svelte";

	import AddMemberProfileModal from "./chats/AddMember_Profile.svelte";
    import RemoveMemberModal from "./chats/RemoveMember.svelte";
    import TransferChatOwnershipModal from "./chats/TransferChatOwnership.svelte";
	import BlockUserModal from "./safety/BlockUser.svelte";

	import {relationships, user, chat} from "../stores.js";
	import {apiUrl, encodeApiURLParams} from "../urls.js";
    import {adminPermissions, hasPermission} from "../bitField.js";

	async function loadProfile() {
		let path = `users/${username}`;
		if (encodeApiURLParams) path = encodeURIComponent(path);
		const resp = await fetch(`${apiUrl}${path}`);
		if (!resp.ok) {
			throw new Error("Response code is not OK; code is " + resp.status);
		}
		const json = await resp.json();
		return json;
	}
</script>

<Modal on:close={modals.closeLastModal}>
	<h2 slot="header">Profile of {username}</h2>
	<div slot="default">
		{#await loadProfile()}
            <Loading />
        {:then data}
            <ProfileView profile={data} Showedit={true} canDoActions={true} />

            <Container>
                <h3>Quote</h3>
                <p>"{data.quote}"</p>
            </Container>

            <button
                class="long"
                title="View Recent Posts"
                on:click={() => modals.showModal(UserPosts, username)}>View Recent Posts</button
            >

            {#if $user.name && $user.name !== data._id}
                {#if $relationships[data._id] !== 2}
                    <button
                        class="long"
                        on:click={() =>
                            modals.showModal(AddMemberProfileModal, {
                                username: data._id,
                            })}>Add to Chat</button
                    >
                {/if}
                <button
                    class="long"
                    title="{$relationships[data._id] === 2 ? 'Unb' : 'B'}lock User"
                    on:click={() =>
                        modals.showModal(BlockUserModal, {username: data._id})}
                    >{$relationships[data._id] === 2 ? "Unb" : "B"}lock User</button
                >
            {/if}
            {#if gc && (($chat.owner == $user.name && username != $user.name) || hasPermission(adminPermissions.EDIT_CHATS))}
                <button
                    class="long"
                    on:click={() =>
                        modals.showModal(RemoveMemberModal, {username})}
                >
                    Remove from chat
                </button>
                <button
                    class="long"
                    on:click={() =>
                        modals.showModal(TransferChatOwnershipModal, {
                            username,
                        })}
                >
                    Make owner of chat
                </button>
            {/if}
        {:catch}
            <ProfileView username={username} />
        {/await}
	</div>
</Modal>

<style>
	.long {
		width: 100%;
		margin: 0;
		margin-bottom: 0.2em;
	}
</style>

