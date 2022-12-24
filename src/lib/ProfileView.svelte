<script>
	import loadProfile from "./loadProfile.js";
	import {ulist, user} from "./stores.js";
	import Loading from "./Loading.svelte";
	import Container from "./Container.svelte";
	import PFP from "./PFP.svelte";
	import {levels} from "./formatting.js";

	export let username = "";
</script>

<div>
	{#await loadProfile(username)}
		<div class="center">
			<Loading />
		</div>
	{:then data}
		<Container>
			<div class="profile-header">
				<PFP
					online={$ulist.includes(data._id)}
					icon={username === $user.name
						? $user.pfp_data
						: data.pfp_data}
					alt="{username}'s profile picture"
					size={1.4}
				/>
				<div class="profile-header-info">
					<h1 class="profile-username">{username}</h1>
					<div class="profile-active">
						{#if data.banned == false}
							{$ulist.includes(username) ? "Online" : "Offline"}
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

	.profile-header {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}
</style>
