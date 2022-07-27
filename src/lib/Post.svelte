<!-- A post. Profile pictures not appearing while not logged in is intentional. -->

<script>
	import Container from "../lib/Container.svelte";
	import PFP from "../lib/PFP.svelte";
	import FormattedDate from "./FormattedDate.svelte";

	import {profileData, user, ulist} from "../lib/stores.js";
	import * as clm from "../lib/clmanager.js";
	
	import {onMount} from "svelte";
	export let post = {};

	/**
	 * Initialize this post's user profile - gets profile info from the cache or fetches it.
	 */
	function initPostUser() {
		if (!post.user) return;
		if (!($user.name)) return;

		const userName = post.user;

		/**
		 * Fetch the user profile and store it in the cache.
		 */
		const getProfile = () => {
			let _profileData = $profileData;
			_profileData[userName] = {
				pfp_data: -1,
			};
			profileData.set(_profileData);

			clm.meowerRequest({
				cmd: "direct",
				val: {
					cmd: "get_profile",
					val: userName,
				},
				listener: "get_profile_" + userName,
			}).then(val => {
				// Ding dong! The data has arrived.
				_profileData[userName] = val.payload;
				profileData.set(_profileData);
			}).catch(e => {
				// Uh oh - something has gone wrong.
				_profileData[userName] = {
					error: true,
					pfp_data: -2,
					temporary: true,
				};
				profileData.set(_profileData);
			})
		}

		// Do we have a stored profile?
		const _profileData = $profileData;
		if (_profileData[userName]) {
			// Reuse the cached data if the profile isn't temporary
			if (_profileData[userName].temporary) {
				getProfile();
			}
		} else {
			// Get the profile!
			getProfile();
		}
	};
	onMount(initPostUser);
</script>

<Container>
	<div class="post-header">
		{#if $user.name}
			<div class="pfp">
				<PFP
					icon={$profileData[post.user] ? $profileData[post.user].pfp_data : -1}
					alt="{post.user}'s profile picture"
					online={$ulist.includes(post.user)}
				></PFP>
			</div>
		{/if}
		<div class="creator">
			<h2 class="creator">{post.user}</h2>
			<FormattedDate date={post.date}></FormattedDate>
		</div>
	</div>
	<p>{post.content}</p>
</Container>

<style>
	.pfp {
		margin-right: 0.2em;
	}
	.post-header {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}
	.creator {
		display: inline;
		max-width: 100%;
		margin-left: 0.5em;
	}
	.creator h2 {
		display: block;
		font-size: 200%;
		margin: 0;
	}
</style>