<!-- A post. Profile pictures not appearing while not logged in is intentional. -->
<script>
	import Container from "../lib/Container.svelte";
	import PFP from "../lib/PFP.svelte";
	import FormattedDate from "./FormattedDate.svelte";
	import Badge from "./Badge.svelte";
	import twemoji from "twemoji";
	import {toHTMLElement} from "./twemoji-utils.js";

	import LiText from "./LiText.svelte";

	import AccountBannedModal from "./modals/moderation/AccountBanned.svelte";
	import DeletePostModal from "./modals/DeletePost.svelte";
	import ReportPostModal from "./modals/moderation/ReportPost.svelte";

	import {authHeader, postClicked, user, userSuspended, chat, ulist} from "../lib/stores.js";
	import {permissions, hasPermission} from "../lib/adminPermissions.js";
	import {apiUrl} from "./urls.js";
	import {shiftHeld} from "../lib/keyDetect.js";
	import * as modals from "./modals.js";

	import {IMAGE_HOST_WHITELIST} from "./hostWhitelist.js";

	import {default as loadProfile} from "../lib/loadProfile.js";

	// @ts-ignore
	import {autoresize} from "svelte-textarea-autoresize";

	import {goto} from "@roxi/routify";
	import {onMount, tick} from "svelte";

	export let post = {};
	export let buttons = true;
	export let input = null;
	export let instantDelete = false;

	let bridged = false;
	let webhook = false;

	let images = [];

	let editing = false;
	let editError = "";
	let editContentInput, editSaveButton;

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

		if (!webhook) loadProfile(post.user);
	}

	$: {
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

			if (IMAGE_HOST_WHITELIST.some(o => result.value[2].toLowerCase().startsWith(o.toLowerCase()))) {
				images.push({
					title: result.value[1],
					url: result.value[2],
				});
				// Prevent flooding
				if (images.length >= 3) break;
			}
		}
		images = images;
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
			{#if buttons && $user.name && $chat._id !== "livechat" && post.user !== "Server" && !editing}
				{#if input && !input.disabled && post.user === $user.name}
					<button
						class="circle pen"
						on:click={async () => {
							if ($userSuspended) {
								modals.showModal(AccountBannedModal);
								return;
							}

							editError = "";
							editing = true;
							await tick();
							editContentInput.value = post.content;
							editContentInput.focus();
							autoresize(editContentInput);
						}}
					/>
				{/if}
				{#if input && !input.disabled && post.user !== "Notification" && post.user !== "Announcement"}
					<button
						class="circle reply"
						on:click={() => {
							if ($userSuspended) {
								modals.showModal(AccountBannedModal);
								return;
							}

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
				{#if post.user === $user.name || (post.post_origin === $chat._id && $chat.owner === $user.name) || hasPermission(permissions.DELETE_POSTS)}
					<button
						class="circle trash"
						on:click={async () => {
							if (instantDelete || shiftHeld) {
								try {
									const resp = await fetch(`${apiUrl}posts?id=${post.post_id}`, {
										method: "DELETE",
										headers: $authHeader,
									});
									if (!resp.ok) {
										if (resp.status === 429) {
											throw new Error("Too many requests! Try again later.");
										}
										throw new Error(
											"Response code is not OK; code is " + resp.status
										);
									}
								} catch (e) {
									editError = e;
								}
							} else {
								postClicked.set(post);
								modals.showModal(DeletePostModal);
							}
						}}
					/>
				{:else}
					<button
						class="circle report"
						on:click={() => {
							postClicked.set(post);
							modals.showModal(ReportPostModal);
						}}
					/>
				{/if}
			{/if}
		</div>
		<button
			class="pfp"
			on:click={async () => {
				if (noPFP) return;
				$goto(`/users/${post.user}`);
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
						text="BRIDGED"
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
			{#if post.edited_at}
				<i>(<FormattedDate date={post.edited_at} customText="edited" />)</i>
			{/if}
			{#if post.isDeleted && post.mod_deleted}
				<i>(<FormattedDate date={post.deleted_at} customText="deleted by moderator" />)</i>
			{:else if post.isDeleted}
				<i>(<FormattedDate date={post.deleted_at} customText="self-deleted" />)</i>
			{/if}
		</div>
	</div>
	{#if editing}
		<textarea
			type="text"
			class="white"
			name="input"
			autocomplete="false"
			maxlength="500"
			rows="1"
			bind:this={editContentInput}
			use:autoresize
			on:keydown={event => {
				if (event.key == "Enter" && !shiftHeld) {
					event.preventDefault();
					if (!editSaveButton.disabled) editSaveButton.click();
				} else if (event.key == "Escape") {
					editing = false;
				}
			}}
		/>
		<div style="display: flex; justify-content: space-between;">
			<button on:click={() => editing = false}>Cancel</button>
			<button bind:this={editSaveButton} on:click={async () => {
				if (editContentInput.value.trim() === "") {
					postClicked.set(post);
					modals.showModal(DeletePostModal);
					return;
				}

				editing = false;
				try {
					const resp = await fetch(`${apiUrl}posts?id=${post.post_id}`, {
						method: "PATCH",
						headers: {
							"Content-Type": "application/json",
							...$authHeader,
						},
						body: JSON.stringify({content: editContentInput.value}),
					});
					if (!resp.ok) {
						if (resp.status === 429) {
							throw new Error("Too many requests! Try again later.");
						}
						throw new Error(
							"Response code is not OK; code is " + resp.status
						);
					}
				} catch (e) {
					editError = e;
				}
			}}>Save</button>
		</div>
	{:else}
		<p class="post-content">
			{@html twemoji.parse(toHTMLElement(post.content).innerText, {
				folder: "svg",
				ext: ".svg",
			})}
		</p>
	{/if}
	{#if editError}
		<p style="color: crimson;">Error while editing/deleting: {editError}</p>
	{/if}
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
		font-size: 200%;
		margin: 0;
		overflow-wrap: anywhere;
	}
	:global(main.input-hover) .pfp:hover:not(:active) :global(.pfp),
	:global(main.input-touch) .pfp:active :global(.pfp),
	.pfp:focus-visible :global(.pfp) {
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

	.post-image {
		max-height: 12em;
		max-width: 100%;
	}

	.post-images {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25em;
	}

	textarea {
		margin-top: 0.5em;
		margin-bottom: 0.5em;
		width: 100%;
	}
</style>
