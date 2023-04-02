<!-- The profile page, now with viewing others' profiles. -->
<script>
	import {
		modalPage,
		modalShown,
		profileClicked,
		user,
		mainPage as page,
	} from "../lib/stores.js";

	import {profileCache} from "../lib/loadProfile.js";

	import ProfileView from "../lib/ProfileView.svelte";

	import PFP from "../lib/PFP.svelte";
	import Loading from "../lib/Loading.svelte";
	import Container from "../lib/Container.svelte";
	import * as clm from "../lib/clmanager.js";
	import {apiUrl, encodeApiURLParams} from "../lib/urls.js";

	import LiText from "../lib/LiText.svelte";

	import {tick} from "svelte";

	const PFP_COUNT = 34;

	const pfps = new Array(PFP_COUNT).fill().map((_, i) => i + 1);
	let pfpSwitcher = false;

	async function loadProfile() {
		let path = `users/${$profileClicked}`;
		if (encodeApiURLParams) path = encodeURIComponent(path);
		const resp = await fetch(`${apiUrl}${path}`);
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

	let pfpOverflow = false;
	$: {
		const pfp = $user.pfp_data;
		pfpOverflow = pfp < 0 || pfp > PFP_COUNT;
	}
</script>

<div class="OtherProfile">
	{#await loadProfile()}
		<div class="fullcenter">
			<Loading />
		</div>
	{:then data}
		<ProfileView username={$profileClicked} />

		{#if data.quote}
			<Container>
				<h3>Quote</h3>
				<LiText text={makeid(30)} />
			</Container>
		{/if}

		<button class="long" disabled>Add to Chat</button>

		{#if $user.name && $profileClicked !== $user.name}
			<button
				class="long"
				title="Report User"
				on:click={() => {
					modalPage.set("reportUser");
					modalShown.set(true);
				}}>Report User</button
			>
		{/if}
	{:catch e}
		<ProfileView username={$profileClicked} />
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
