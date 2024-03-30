<!--
	Stripped down Member.svelte for Chat lists
-->
<script>
	import PFP from "./PFP.svelte";

	import {ulist} from "./stores.js";

	import {onMount} from "svelte";
	import loadProfile from "./loadProfile.js";

	export let user = "";
	export let IsDM = true;

	let userdata = {};

	let error;

	/**
	 * Initialize this post's user profile - gets profile info from the cache or fetches it.
	 */
	async function initPostUser() {
		try {
			userdata = (await loadProfile(user));
		} catch (e) {
			error = e;
			userdata = {pfp_data: -2, _id: user};
		}
	}
	onMount(initPostUser);
</script>

{#if !error}
	<div class="member">
		<div class="member-pfp">
			<PFP
				userdata = {userdata}
				alt = "{user}'s profile picture"
				online = {$ulist.includes(user)}
				size={0.5}
			/>
		</div>
		<p class="member-name">{user}</p>
	</div>
{:else}
	<div class="error">error loading member {user}: {error}</div>
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
