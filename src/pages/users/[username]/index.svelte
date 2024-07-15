<!-- The profile page, now with viewing others' profiles. -->
<script>
	import ProfileView from "../../../lib/ProfileView.svelte";
	import Loading from "../../../lib/Loading.svelte";
	import Container from "../../../lib/Container.svelte";

	import AddMemberProfileModal from "../../../lib/modals/chats/AddMember_Profile.svelte";
	import BlockUserModal from "../../../lib/modals/safety/BlockUser.svelte";

	import {relationships, user} from "../../../lib/stores.js";
	import {apiUrl, encodeApiURLParams} from "../../../lib/urls.js";
	import * as modals from "../../../lib/modals.js";

	import {params, goto} from "@roxi/routify";

	const PFP_COUNT = 34;

	const pfps = new Array(PFP_COUNT).fill().map((_, i) => i + 1);
	let pfpSwitcher = false;

	async function loadProfile() {
		let path = `users/${$params.username}`;
		if (encodeApiURLParams) path = encodeURIComponent(path);
		const resp = await fetch(`${apiUrl}${path}`);
		if (!resp.ok) {
			throw new Error("Response code is not OK; code is " + resp.status);
		}
		const json = await resp.json();
		return json;
	}

	let pfpOverflow = false;
	$: {
		const pfp = $user.pfp_data;
		pfpOverflow = pfp < 0 || pfp > PFP_COUNT;
	}
</script>

<div>
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
		<ProfileView username={$params.username} />
	{/await}
</div>

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
