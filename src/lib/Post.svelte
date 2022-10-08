<!-- A post. Profile pictures not appearing while not logged in is intentional. -->

<script>
	import Container from "../lib/Container.svelte";
	import PFP from "../lib/PFP.svelte";
	import FormattedDate from "./FormattedDate.svelte";

	import {
		 profileClicked,
		postClicked, user,
		chatid, ulist,
		mainPage as page,
		modalShown, modalPage
	} from "../lib/stores.js";
	import {shiftHeld} from "../lib/keyDetect.js";
	import * as clm from "../lib/clmanager.js";
	
	import {default as loadProfile, profileCache} from "../lib/loadProfile.js";
	
	import {onMount} from "svelte";

	export let post = {};
	export let buttons = true;
	export let input = null;

	let bridged = false;

	// TODO: make bridged tag a setting

	/**
	 * Initialize this post's user profile
	 */
	function initPostUser() {
		if (!post.user) return;

		if (post.user == "Discord" && post.content.includes(":")) {
			bridged = true;
		}

		if (post.user == "Discord" && post.content.includes(":")) {
			post.user = post.content.split(": ")[0];
			post.content = post.content.slice(post.content.indexOf(": ")+1);
		}

		loadProfile(post.user);
	};
	onMount(initPostUser);
</script>

<Container>
	<div class="post-header">
		<div class="settings-controls">
			{#if buttons && $user.name && $chatid !== "livechat" && post.user !== "Server"}	
				{#if input && post.user !== "Notification" && post.user !== "Announcement"}
					<button 
						class="circle join"
						on:click={() => {
							let existingText = input.value;

							const mentionRegex = /^@\w+\s*/i;
							const mention = "@" + post.user + " ";

							if (mentionRegex.test(existingText)) {
								input.value = existingText.trim().replace(
									mentionRegex,
									mention
								);
							} else {
								input.value = mention + existingText.trim();
							}

							input.focus();
						}}
					></button>
				{/if}
				{#if $user.lvl >= 1 || post.user === $user.name}
					<button
						class="circle close"
						on:click={()=>{
							if (shiftHeld) {
								clm.meowerRequest({
									cmd: "direct",
									val: {
										cmd: "delete_post",
										val: post.post_id,
									},
								});
								return;
							}
							postClicked.set(post);
							modalPage.set("deletePost");
							modalShown.set(true);
						}}
					></button>
				{:else}
					<button
						class="circle report"
						on:click={()=>{
							postClicked.set(post);
							modalPage.set("reportPost");
							modalShown.set(true);
						}}
					></button>
				{/if}
			{/if}
		</div>
		<button
			class="pfp" 
			on:click={()=>{
				if (post.user === "Notification" || post.user === "Announcement" || post.user === "Server") return;
				profileClicked.set(post.user);
				page.set("profile");
			}}
		>
			<PFP
				icon={$profileCache[post.user] ? $profileCache[post.user].pfp_data : -3}
				alt="{post.user}'s profile picture"
				online={$ulist.includes(post.user)}
			></PFP>
		</button>
		<div class="creator">
			<h2 class="creator">{post.user}</h2>

			<FormattedDate date={post.date}></FormattedDate>
			{#if bridged}
				<i>[BRIDGED]</i>
			{/if}
		</div>
	</div>
	<p class="post-content">{post.content}</p>
</Container>

<style>
	.pfp {
		margin-right: 0.2em;
		padding: 0;
		border: none;
		background: none !important;
		color: inherit;
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
	.pfp:hover:not(:active) :global(.pfp), .pfp:focus-visible :global(.pfp) {
		transform: scale(1.1);
	}
	.post-content {
		white-space: pre-wrap;
	}
	.settings-controls {
		position: absolute;
		top: 0.25em;
		right: 0.25em;
	}
	button.circle {
		border: none;
		margin: 0;
		margin-left: 0.125em;
	}
</style>
