<script>
	import Modal from "../Modal.svelte";

	import * as modals from "../modals.js";

	export let modalData;

	let username = modalData;
    import ProfileView from "../ProfileView.svelte";
	import Loading from "../Loading.svelte";
	import Container from "../Container.svelte";

	import AddMemberProfileModal from "./chats/AddMember_Profile.svelte";
	import BlockUserModal from "./safety/BlockUser.svelte";

	import {relationships, user} from "../stores.js";
	import {apiUrl, encodeApiURLParams} from "../urls.js";

	import {goto} from "@roxi/routify";

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
            <div class="fullcenter">
                <Loading />
            </div>
        {:then data}
            <ProfileView profile={data} canDoActions={true} />

            <Container>
                <h3>Quote</h3>
                <p>"<i>{data.quote}</i>"</p>
            </Container>

            <button
                class="long"
                title="View Recent Posts"
                on:click={() => $goto("./posts")}>View Recent Posts</button
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
        {:catch}
            <ProfileView username={username} />
        {/await}
	</div>
</Modal>

<style>
	.fullcenter {
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;

		width: 100vw;
		height: 100vh;

		position: fixed;
		top: 0;
		left: 0;
	}

	.long {
		width: 100%;
		margin: 0;
		margin-bottom: 0.2em;
	}
</style>

