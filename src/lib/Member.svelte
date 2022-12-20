<script>
	import PFP from "../lib/PFP.svelte";

	import {ulist} from "../lib/stores.js";

	import {onMount} from "svelte";
	import loadProfile from "./loadProfile.js";
	export let member = "";

	let pfp = 0;

	// TODO: make bridged tag a setting

	let error;

	/**
	 * Initialize this post's user profile - gets profile info from the cache or fetches it.
	 */
	async function initPostUser() {
		try {
			pfp = (await loadProfile(member)).pfp_data;
		} catch (e) {
			error = e;
			pfp = -2;
		}
	}
	onMount(initPostUser);
</script>

{#if !error}
	<div class="member">
		<div class="member-pfp">
			<PFP
				icon={pfp}
				alt="{member}'s profile picture"
				online={$ulist.includes(member)}
				size={0.5}
			/>
		</div>
		<p class="member-name">{member}</p>
	</div>
{:else}
	<div class="error">error loading member {member}: {error}</div>
{/if}

<style>
	.member {
		display: flex;
		flex-wrap: nowrap;
		flex-direction: row;
		align-items: center;

		width: 100%;
		height: 2.5em;
		gap: 0.5em;
		padding: 0 0.5em;
		box-sizing: border-box;
	}

	.member-name {
		flex-grow: 1;
		flex-shrink: 1;

		text-align: left;
		text-overflow: clip;
		overflow: hidden;
	}

	.error {
		padding: 0.25em;
		font-style: italic;
		font-size: 80%;
	}
</style>
