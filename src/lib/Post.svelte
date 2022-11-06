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

	let img1;

	// TODO: make bridged tag a setting

	// TODO: more then 1 img + optimize getimgs function

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

		if (post.content.includes("[") && post.content.includes("]")) {
			var squareb_1 = post.content.indexOf("[")
			var squareb_2 = post.content.indexOf("]")

			var img_content = post.content.slice(squareb_1+1,squareb_2)
			post.content = post.content.replace(post.content.slice(squareb_1,squareb_2+1),'')
			var sep_img = img_content.split(": ")
			var img_url = sep_img[1]
			var urls = ["go.meower.org","assets.meower.org","api.meower.org","cubeupload.com","imgbb.com","meower.org"]
			if (urls.some(element => {
				if (img_url.includes(element)) {
					return true;
				}

				return false;
			})) {
				var img_name = sep_img[0]

				img1.className = "image_1"
				img1.alt = img_name
				img1.src = img_url
			}
			
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
					{#if !post.isvbot}
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

			{#if post.isvbot}
				<i>[VERIFIED BOT]</i>
			{/if}

			{#if post.isuvbot}
				<i>[UNVERIFIED BOT]</i>
			{/if}

			{#if post.ownsbot}
				<i>[BOT OWNER]</i>
			{/if}
		</div>
	</div>
	<img src="" alt="hi" class="post-image-hide image_1" bind:this={img1}>
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
	.post-image-hide {position: absolute; visibility: hidden;}

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
