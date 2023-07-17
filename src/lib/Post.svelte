<!-- A post. Profile pictures not appearing while not logged in is intentional. -->
<script>
	import Container from "../lib/Container.svelte";
	import PFP from "../lib/PFP.svelte";
	import FormattedDate from "./FormattedDate.svelte";
	import Badge from "./Badge.svelte";
    import twemoji from "twemoji";
    import { toHTMLElement } from "./twemoji-utils.js";

	import LiText from "./LiText.svelte";

	import {
		profileClicked,
		postClicked,
		user,
		chatid,
		ulist,
		mainPage as page
	} from "../lib/stores.js";
	import {shiftHeld} from "../lib/keyDetect.js";
	import * as clm from "../lib/clmanager.js";
	import * as Modals from "./modals.js";


	import {IMAGE_HOST_WHITELIST} from "./hostWhitelist.js"

	import {default as loadProfile, profileCache} from "../lib/loadProfile.js";

	import {onMount, tick} from "svelte";

	export let post = {};
	export let buttons = true;
	export let input = null;
	export let canDoActions = true;

	let bridged = false;
	let webhook = false;

	let images = [];

	// TODO: make bridged tag a setting

	/**
	 * Initialize this post's special behavior (user profile, images)).
	 */
	export function initPostUser() {
		if (!post.user) return;

		if (post.content.includes(":")) {
			bridged =
				post.user === "Discord" ||
				post.user === "revolt" ||
				post.user === "Revower";
			webhook = post.user == "Webhooks";
		}

		if (bridged || webhook) {
			post.user = post.content.split(": ")[0];
			post.content = post.content.slice(post.content.indexOf(": ") + 2);
		}

		// Match image syntax
		// ([title: https://url])
		const iterator = post.content.matchAll(
			/\[([^\]]+?): (https:\/\/[^\]]+?)\]/gs
		);
		images = [];
		while (true) {
			const result = iterator.next();
			if (result.done) break;

			try {
				new URL(result.value[2]);
			} catch (e) {
				continue;
			}

			if (
				!IMAGE_HOST_WHITELIST.some(o =>
					result.value[2].toLowerCase().startsWith(o.toLowerCase())
				)
			)
				return;

			images.push({
				title: result.value[1],
				url: result.value[2],
			});
			// Prevent flooding
			if (images.length >= 3) break;
		}
		images = images;

		if (!webhook) loadProfile(post.user);
	}
	onMount(initPostUser);
	

	$: noPFP =
		post.user === "Notification" ||
		post.user.startsWith("Notification to ") ||
		post.user === "Announcement" ||
		post.user === "Server" ||
		webhook;
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
								input.value = existingText
									.trim()
									.replace(mentionRegex, mention);
							} else {
								input.value = mention + existingText.trim();
							}

							input.focus();
						}}
					/>
				{/if}
				{#if canDoActions}
					{#if $user.lvl >= 1 || post.user === $user.name}
						<button
							class="circle trash"
							on:click={() => {
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
								Modals.showModal("deletePost")
							}}
						/>
					{:else}
						<button
							class="circle report"
							on:click={() => {
								postClicked.set(post);
								Modals.showModal("reportPost")
							}}
						/>
					{/if}
				{/if}
			{/if}
		</div>
		<button
			class="pfp"
			on:click={async () => {
				if (noPFP) return;
				page.set("");
				await tick();
				profileClicked.set(post.user);
				page.set("profile");
			}}
		>
			{#await noPFP ? Promise.resolve(true) : loadProfile(post.user)}
				<PFP
					icon={-2}
					alt="{post.user}'s profile picture"
					online={$ulist.includes(post.user)}
				/>
			{:then profile}
				<PFP
					icon={noPFP
						? post.user === "Server"
							? 102
							: post.post_origin === "inbox" &&
							  (post.user === "Announcement" ||
									post.user === "Notification" ||
									post.user.startsWith("Notification to"))
							? 101
							: -2
						: profile.pfp_data}
					alt="{post.user}'s profile picture"
					online={$ulist.includes(post.user)}
				/>
			{:catch}
				<PFP
					icon={-2}
					alt="{post.user}'s profile picture"
					online={$ulist.includes(post.user)}
				/>
			{/await}
		</button>
		<div class="creatordate">
			<div class="creator">
				<h2>
					<LiText text={post.user} />
				</h2>

				{#if bridged}
					<Badge
						text=""
						title="This post is bridged from an external service by a bot"
					/>
				{/if}

				{#if webhook}
					<Badge
						text="WEBHOOK"
						title="This post was posted by the @Webhooks bot. The username may not mean the user actually posted it!"
					/>
				{/if}

				<!-- disabled until proper bot badges are added
				{#if post.isvbot && !webhook}
					<Badge
						text="BOT"
						title="This bot has been verified"
						checkmark={true}
					/>
				{/if}

				{#if post.isuvbot && !webhook}
					<Badge text="BOT" title="This bot has not been verified" />
				{/if}
				-->
			</div>

			<FormattedDate date={post.date} />
			{#if post.isDeleted}
				<i>(deleted)</i>
			{/if}
		</div>
	</div>
	<p class="post-content">{@html twemoji.parse(toHTMLElement(post.content).innerText, {
        folder: "svg",
        ext: ".svg"
    })}</p>
	<div class="post-images">
		{#each images as { title, url }}
			<a href={url} target="_blank" rel="noreferrer"
				><img src={url} alt={title} {title} class="post-image" />
			</a>
		{/each}
	</div>
</Container>

<style>
	.pfp {
		padding: 0;
		border: none;
		background: none !important;
		color: inherit;
	}
	.post-header {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		max-width: 100%;
	}

	.creatordate {
		margin-left: 0.5em;
	}
	.creator {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5em;
	}
	.creator h2 {
		font-size: 150%;
		margin: 0;
		overflow-wrap: anywhere;
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

	.post-image {
		max-height: 12em;
		max-width: 100%;
	}

	.post-images {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25em;
	}
</style>
