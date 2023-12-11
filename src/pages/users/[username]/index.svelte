<!-- The profile page, now with viewing others' profiles. -->
<script>
	import ProfileView from "../../../lib/ProfileView.svelte";
	import Loading from "../../../lib/Loading.svelte";
	import Container from "../../../lib/Container.svelte";
	import PFP from "../../../lib/PFP.svelte";

	import BasicModal from "../../../lib/modals/Basic.svelte";
	import AddMemberProfileModal from "../../../lib/modals/chats/AddMember_Profile.svelte";
	import BlockUserModal from "../../../lib/modals/safety/BlockUser.svelte";

	import {relationships, user} from "../../../lib/stores.js";
	import {userRestrictions, isRestricted} from "../../../lib/bitField.js";
	import {profileCache} from "../../../lib/loadProfile.js";
	import {apiUrl, encodeApiURLParams} from "../../../lib/urls.js";
	import * as modals from "../../../lib/modals.js";
	import * as clm from "../../../lib/clmanager.js";

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

		{#if $user.name == data._id}
			<Container>
				<h3>Quote</h3>
				<input
					type="text"
					class="modal-input white"
					style="font-style: italic"
					placeholder="Write something..."
					maxlength="360"
					disabled={isRestricted(userRestrictions.EDITING_QUOTE)}
					bind:value={$user.quote}
					on:change={() => clm.updateProfile({quote: $user.quote})}
				/>
			</Container>
		{:else if data.quote}
			<Container>
				<h3>Quote</h3>
				<p>"<i>{data.quote}</i>"</p>
			</Container>
		{/if}

		{#if pfpSwitcher}
			<Container>
				<h2>Profile Picture</h2>
				<div id="pfp-list">
					{#if pfpOverflow && $user.pfp_data < 0}
						<button
							on:click={() => (pfpSwitcher = false)}
							class="pfp selected"
							><PFP
								online={false}
								icon={$user.pfp_data}
								alt="Profile picture {$user.pfp_data}"
							/></button
						>
					{/if}
					{#each pfps as pfp}
						<button
							on:click={() => {
								if ($profileCache[$user.name])
									delete $profileCache[$user.name];
								clm.updateProfile({pfp_data: pfp});
								pfpSwitcher = false;
							}}
							class="pfp"
							class:selected={$user.pfp_data === pfp}
							><PFP
								online={false}
								icon={pfp}
								alt="Profile picture {pfp}"
							/></button
						>
					{/each}
					{#if pfpOverflow && $user.pfp_data > 0}
						<button
							on:click={() => (pfpSwitcher = false)}
							class="pfp selected"
							><PFP
								online={false}
								icon={$user.pfp_data}
								alt="Profile picture {$user.pfp_data}"
							/></button
						>
					{/if}
				</div>
			</Container>
		{:else if $user.name === data._id}
			<button
				class="long"
				title="Change Profile Picture"
				on:click={() => {
					modals.showModal(BasicModal, {
						title: "Subscription",
						desc: "This requires Meower Plus.",
					});
				}}
				>Change Profile Picture</button
			>
		{/if}

		<button
			class="long"
			title="View Recent Posts"
			on:click={() => {
				modals.showModal(BasicModal, {
					title: "Subscription",
					desc: "This requires Meower Pro.",
				});
			}}>View Recent Posts</button
		>

		{#if $user.name && $user.name !== data._id}
			{#if $relationships[data._id] !== 2}
				<button
					class="long"
					on:click={() =>
						{
							modals.showModal(BasicModal, {
								title: "Subscription",
								desc: "This requires Meower Orange.",
							});
						}}>Add to Chat</button
				>
			{/if}
			<button
				class="long"
				title="{$relationships[data._id] === 2 ? 'Unb' : 'B'}lock User"
				on:click={() =>
					{
						modals.showModal(BasicModal, {
							title: "Subscription",
							desc: "This requires Meower Premium.",
						});
					}}
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

	.pfp {
		padding: 0.2em;
		margin: 0.2em;
		border-radius: 1.45em;
		display: inline-block;
		background: none;
		border: none;
	}
	:global(main.input-hover) .pfp:hover,
	:global(main.input-touch) .pfp:active {
		background-color: var(--orange-light);
	}
	/* cst todo: fix shadow appearing when activating then unhovering because i gtg*/
	:global(:root main.input-hover) .pfp:active {
		background-color: var(--orange-dark);
	}
	:global(main) .pfp.selected {
		background-color: var(--orange);
	}
	#pfp-list {
		display: flex;
		flex-wrap: wrap;
	}
</style>
