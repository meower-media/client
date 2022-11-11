<!-- The profile page, now with viewing others' profiles. -->
<script>
	import {
		modalPage, modalShown,
		ulist,
		profileClicked, user,
		mainPage as page
	} from "../lib/stores.js";

	import {profileCache} from "../lib/loadProfile.js";

	import Profile from "../lib/Profile_View.svelte"

    import PFP from "../lib/PFP.svelte";
    import Loading from "../lib/Loading.svelte";
    import Container from "../lib/Container.svelte";
    import * as clm from "../lib/clmanager.js";
    import {levels} from "../lib/formatting.js";

	import {tick} from "svelte";
	import {apiUrl, encodeApiURLParams} from "../lib/urls";
    import { dataset_dev } from "svelte/internal";
    import ProfileView from "../lib/Profile_View.svelte";
	
	const pfps = new Array(34).fill().map((_,i) => i+1);
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

<div class="OtherProfile">
{#await loadProfile()}
	<div class="fullcenter">
		<Loading />
	</div>
{:then data}
		<ProfileView username={$profileClicked}></ProfileView>

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
			title="View Recent Posts"
			on:click={()=>{
				window.scrollTo(0,0);
				page.set("blank");
				tick().then(() => page.set("recent"));
			}}
		>View recent posts</button>

		<button 
			class="long" 
			disabled
		>Add To Chat</button>

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
		<ProfileView username={$profileClicked}></ProfileView>
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
