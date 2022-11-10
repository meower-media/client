<!-- The profile page, now with viewing others' profiles. -->
<script>
	import {
		modalPage, modalShown,
		ulist,
		profileClicked, user,
		mainPage as page
	} from "../lib/stores.js";

	import {profileCache} from "../lib/loadProfile.js";

    import PFP from "../lib/PFP.svelte";
    import Loading from "../lib/Loading.svelte";
    import Container from "../lib/Container.svelte";
    import * as clm from "../lib/clmanager.js";
    import {levels} from "../lib/formatting.js";

	import {tick} from "svelte";
	import {apiUrl, encodeApiURLParams} from "../lib/urls";
    import { dataset_dev } from "svelte/internal";
	
	const pfps = new Array(28).fill().map((_,i) => i+1);
	let pfpSwitcher = false;

	async function loadProfile() {
		let path = `users/${$profileClicked}`;
		if (encodeApiURLParams) path = encodeURIComponent(path);
		const resp = await fetch(
			`${apiUrl}${path}`
		);
		if (!resp.ok) {
			throw new Error("Response code is not OK; code is " + resp.status);
		}
		const json = await resp.json();
		return json;
	}

	/**
	 * Saves the user profile, and also clears its cache entry.
	 */
	function save() {
		if ($profileCache[$user.name]) {
			const _profileCache = $profileCache;
			delete _profileCache[$user.name];
			profileCache.set(_profileCache);
		}

		clm.updateProfile();
	}
</script>

<svelte:head>
	<title>{$profileClicked} - Meower</title>
</svelte:head>

<div class="OtherProfile">
{#await loadProfile()}
	<div class="fullcenter">
		<Loading />
	</div>
{:then data}
		<Container>
			<div class="profile-header">
				<PFP
					online={$ulist.includes(data._id)}
					icon={
						$profileClicked === $user.name ?
							$user.pfp_data : data.pfp_data
					}
					alt="{data._id}'s profile picture"
					size={1.4}
				></PFP>
				<div class="profile-header-info">
					<h1 class="profile-username">{data._id}</h1>
					<div class="profile-active">{
						$ulist.includes(data._id) ? "Online" : "Offline"
					}</div>
					<div class="profile-role">
						{levels[data.lvl] || "Unknown"}
					</div>
				</div>
			</div>
		</Container>

		{#if data.quote}
			<Container>
				<h3>Quote</h3>
				<p>"<i>{data.quote}</i>"</p>
			</Container>
		{/if}

		{#if pfpSwitcher}
			<Container>
				<h2>Profile Picture</h2>
				<div id="pfp-list">
					{#each pfps as pfp}
						<span
							on:click={() => {
								pfpSwitcher = false;
								$user.pfp_data = pfp;
								save();
							}}
							class="pfp"
							class:selected={$user.pfp_data === pfp}
						><PFP
							online={false}
							icon={pfp}
							alt="Profile picture {pfp}"
						></PFP></span>
					{/each}
				</div>
			</Container>
		{:else if $profileClicked === $user.name}
			<button
				class="long"
				title="Change Profile Picture"
				on:click={() => pfpSwitcher = true}
			>Change Profile Picture</button>
			<button
				class="long"
				title={data.quote ? "Update Quote" : "Set Quote"}
				on:click={() => {
					modalPage.set("setQuote");
					modalShown.set(true);
				}}
			>{data.quote ? "Update Quote" : "Set Quote"}</button>
		{/if}

		<button
			class="long"
			title="View Recet Posts"
			on:click={()=>{
				window.scrollTo(0,0);
				page.set("blank");
				tick().then(() => page.set("recent"));
			}}
		>View recent posts</button>

		{#if $user.name && $profileClicked !== $user.name}
			<button
				class="long"
				title="Report User"
				on:click={()=>{
					modalPage.set("reportUser");
					modalShown.set(true);
				}}
			>Report User</button>
		{/if}
	{:catch e}
		<Container>
			<div class="profile-header">
				<PFP
					online={$ulist.includes($profileClicked)}
					icon={-2}
					alt="{$profileClicked}'s profile picture"
					size={1.4}
				></PFP>
				<div class="profile-header-info">
					<h1 class="profile-username">{$profileClicked}</h1>
					<div class="profile-active">{
						$ulist.includes($profileClicked) ? "Online" : "Offline"
					}</div>
					<div class="profile-role">Unknown</div>
				</div>
			</div>
		</Container>
		<Container>
			<h2>Error</h2>
			We couldn't get this user's profile info.
			<pre><code>{e}</code></pre>
			Try again. If this issue persists,
			<a
				href="https://github.com/Meower-Media-Co/Meower-Svelte/issues/new"
			>create an issue on Meower Svelte's issue tracker</a> with the error code shown above.
		</Container>
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

    .long {
        width: 100%;
        margin: 0;
		margin-bottom: -2px;
    }

	.pfp {
		padding: 0.2em;
		margin: 0.2em;
		border-radius: 1.45em;
		display: inline-block;
	}
	.pfp:hover {
		background-color: var(--orange-light);
	}
	.pfp.selected {
		background-color: var(--orange);
	}
	#pfp-list {
		display: flex;
		flex-wrap: wrap;
	}
</style>
