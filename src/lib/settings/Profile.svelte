<script>
	import ProfileView from "../ProfileView.svelte";
	import Container from "../Container.svelte";
	import {profileCache} from "../loadProfile.js";
	import {apiUrl, encodeApiURLParams} from "../urls.js";
	import PFP from "../PFP.svelte";
	import {userRestrictions, isRestricted} from "../bitField.js";
	import * as clm from "../clmanager.js";

	import {user} from "../stores.js";

	const PFP_COUNT = 34;

	const pfps = new Array(PFP_COUNT).fill().map((_, i) => i + 1);
	let pfpSwitcher = false;

	async function loadProfile() {
		let path = `users/${$user._id}`;
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

<ProfileView username={$user.name} canDoActions={true} />

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

{#if !$user.avatar}
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
{:else}
	<p>(You cannot edit your PFP right now, as you have a custom one and the svelte codebase is too terrible to fix everything wrong with PFPS)</p>
{/if}

<style>
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