<!--
	Profile view thing to make codebase better

	(Arrow I swear if you comment that this makes your life harder)

	Args:
		Username: The profile username
		Profile: Custom profile JSON, Optional
		Small: If True, the View will be shorter
		CanClick: If True, when you click the PFP, it will go to their profile
		CloseCurrentModal (Defaults to true): If false, the current Modal wont close when Clicking the PFP 
-->

<script>
	import loadProfile from "./loadProfile.js";
	import {ulist, user} from "./stores.js";
	import * as modals from "./modals.js";
	import Loading from "./Loading.svelte";
	import Container from "./Container.svelte";
	import PFP from "./PFP.svelte";
	import {levels} from "./formatting.js";
	import LiText from "./LiText.svelte";
	import {goto} from "@roxi/routify";

	export let username = "";
	export let profile = null;
	export let small = false;
	export let canClick = false;
	export let closeCurrentModal = true;

	function load() {
		if (profile) {
			return profile;
		}
		return loadProfile(username, true);
	}
</script>

<div>
	{#await load()}
		<div class="center">
			<Loading />
		</div>
	{:then data}
		<Container>
			<div class="profile-header">
				{#if canClick}
					<button
						class="clickable-pfp"
						on:click={() => {
							if (closeCurrentModal) modals.closeModal();
							$goto(`/users/${data._id}`);
						}}
					>
						<PFP
							online={$ulist.includes(data._id)}
							icon={data._id === $user.name
								? $user.pfp_data
								: data.pfp_data}
							alt="{data._id}'s profile picture"
							size={small ? 1 : 1.4}
						/>
					</button>
				{:else}
					<PFP
						online={$ulist.includes(data._id)}
						icon={data._id === $user.name
							? $user.pfp_data
							: data.pfp_data}
						alt="{data._id}'s profile picture"
						size={small ? 1 : 1.4}
					/>
				{/if}
				<div class="profile-header-info" class:small>
					{#if small}
						<h2 class="profile-username">
							<LiText text={data._id} />
						</h2>
					{:else}
						<h1 class="profile-username">
							<LiText text={data._id} />
						</h1>
					{/if}
					<div class="profile-active">
						{#if data.banned == false}
							{$ulist.includes(data._id) ? "Online" : "Offline"}
						{:else}
							Banned
						{/if}
					</div>
					<div class="profile-role">
						{levels[data.lvl] || "Unknown"}
					</div>
				</div>
			</div>
		</Container>
	{:catch e}
		<Container>
			<h2>Error</h2>
			We couldn't get this user's profile info.
			<pre><code>{e}</code></pre>
			Try again. If this issue persists,
			<a
				href="https://github.com/Meower-Media-Co/Meower-Svelte/issues/new"
				>create an issue on Meower Svelte's issue tracker</a
			> with the error code shown above.
		</Container>
	{/await}
</div>

<style>
	.profile-header-info {
		margin-left: 1em;
		height: 6em;
	}
	.profile-header-info.small {
		height: 4.75em;
	}

	.profile-active {
		font-style: italic;
	}

	.profile-role {
		position: absolute;
		font-size: 90%;
	}

	.profile-username {
		margin: 0;
		display: inline-block;
		max-width: 100%;
		font-size: 3em;
	}
	h2.profile-username {
		font-size: 200%;
	}

	.clickable-pfp {
		padding: 0;
		border: none;
		background: none !important;
		color: inherit;
	}
	:global(main.input-hover) .clickable-pfp:hover:not(:active) :global(.pfp),
	:global(main.input-touch) .clickable-pfp:active :global(.pfp),
	.clickable-pfp:focus-visible :global(.pfp) {
		transform: scale(1.1);
	}

	.profile-header {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}
</style>
