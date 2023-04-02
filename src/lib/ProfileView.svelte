<script>
	import loadProfile from "./loadProfile.js";
	import {profileClicked, mainPage as page, ulist, user} from "./stores.js";
	import Loading from "./Loading.svelte";
	import Container from "./Container.svelte";
	import PFP from "./PFP.svelte";
	import {levels} from "./formatting.js";
	import LiText from "./LiText.svelte";
	import {tick} from "svelte";

	export let username = "";
	export let profile = null;
	export let small = false;
	export let canClick = false;

	function load() {
		if (profile) {
			return profile;
		}
		return loadProfile(username, true);
	}

	function makeid(length) {
		let result = '';
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
		const charactersLength = characters.length;
		let counter = 0;
		while (counter < length) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
			counter += 1;
		}
		return result;
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
						on:click={async () => {
							page.set("");
							await tick();
							profileClicked.set(data._id);
							page.set("profile");
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
						<h2 class="profile-username"><LiText text={makeid(10)} /></h2>
					{:else}
						<h1 class="profile-username"><LiText text={makeid(10)} /></h1>
					{/if}
					<div class="profile-active">
						{#if data.banned == false}
							Offline
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
				>create an issue on ██████ Svelte's issue tracker</a
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
