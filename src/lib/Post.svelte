<!-- A post. Profile pictures not appearing while not logged in is intentional. -->
<script>
	import Container from "../lib/Container.svelte";
	import PFP from "../lib/PFP.svelte";
	import FormattedDate from "./FormattedDate.svelte";
	import Badge from "./Badge.svelte";
	import LiText from "./LiText.svelte";

	import ConfirmHyperlinkModal from "./modals/ConfirmHyperlink.svelte";
	import DeletePostModal from "./modals/DeletePost.svelte";
	import ReportPostModal from "./modals/safety/ReportPost.svelte";
	import ModeratePostModal from "./modals/moderation/ModeratePost.svelte";

	import {authHeader, user, chat, ulist} from "../lib/stores.js";
	import {adminPermissions, hasPermission} from "../lib/bitField.js";
	import {apiUrl} from "./urls.js";
	import {shiftHeld} from "../lib/keyDetect.js";
	import * as modals from "./modals.js";

	import {IMAGE_HOST_WHITELIST} from "./hostWhitelist.js";

	import {default as loadProfile} from "../lib/loadProfile.js";

	// @ts-ignore
	import {autoresize} from "svelte-textarea-autoresize";
	import twemoji from "twemoji";
	import * as marked from "marked";
	import DOMPurify from "dompurify";
	import {goto} from "@roxi/routify";
	import {onMount, tick} from "svelte";

	export let post = {};
	export let buttons = true;
	export let input = null;
	export let adminView = false;

	let bridged = false;
	let webhook = false;

	let images = [];

	let editing = false;
	let editError = "";
	let editContentInput, editSaveButton;

	let deleteButton;

	let adminDeleteButton, adminRestoreButton;

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

			if (
				IMAGE_HOST_WHITELIST.some(o =>
					result.value[2].toLowerCase().startsWith(o.toLowerCase())
				)
			) {
				images.push({
					title: result.value[1],
					url: result.value[2],
				});
				// Prevent flooding
				if (images.length >= 3) break;
			}
		}
	}

	function confirmHyperlink(event, link) {
		event.preventDefault();
		modals.showModal(ConfirmHyperlinkModal, {link});
	}
	// @ts-ignore
	window.confirmHyperlink = confirmHyperlink;

	function addFancyElements(content) {
		// escape HTML tags
		content = content.replaceAll(/<(.+?)>/gms, "&lt;$1&gt;");

		// markdown
		content = marked.parse(
			content
				.replaceAll(/\[([^\]]+?): (https:\/\/[^\]]+?)\]/gs, "")
				.replaceAll(/\*\*\*\*/gs, "\\*\\*\\*\\*"),
			{breaks: true}
		);
		content = DOMPurify.sanitize(content, {
			ALLOWED_TAGS: [
				"strong",
				"em",
				"ul",
				"li",
				"h1",
				"h2",
				"h3",
				"h4",
				"h5",
				"h6",
				"blockquote",
				"br",
			],
			ALLOWED_ATTR: [],
		});

		// line breaks
		content = content.replaceAll("\n", "<br>");

		// add quote containers to blockquotes
		content = content.replaceAll(
			/<blockquote>(.+?)<\/blockquote>/gms,
			'<div class="quote-container"><blockquote>$1</blockquote></div>'
		);

		// hyperlinks
		content = content.replaceAll(
			/(https?:\/\/[^\s]+)/g,
			'<a href="/" onclick="confirmHyperlink(event, \'$1\')">$1</a>'
		);
		content = content.replaceAll(
			/@([a-zA-Z0-9-_]{1,20})/g,
			'<a href="/users/$1">@$1</a>'
		);

		// remove additional line breaks
		content = content.replaceAll("<blockquote><br>", "<blockquote>");
		content = content.replaceAll("<br></blockquote>", "</blockquote>");
		if (content.startsWith("<br>")) content = content.slice(0, 4);
		if (content.endsWith("<br>")) content = content.slice(0, -4);

		// sanitize (now with <div> and <a> tags)
		content = DOMPurify.sanitize(content, {
			ALLOWED_TAGS: [
				"strong",
				"em",
				"ul",
				"li",
				"h1",
				"h2",
				"h3",
				"h4",
				"h5",
				"h6",
				"blockquote",
				"code",
				"br",
				"div",
				"a",
			],
			ALLOWED_ATTR: ["class", "href", "onclick"],
		});

		// twemoji
		content = twemoji.parse(content, {
			folder: "svg",
			ext: ".svg",
			size: 20,
		});

		return content;
	}

	async function adminDelete() {
		adminDeleteButton.disabled = true;
		try {
			const resp = await fetch(`${apiUrl}admin/posts/${post.post_id}`, {
				method: "DELETE",
				headers: $authHeader,
			});
			if (!resp.ok) {
				throw new Error(
					"Response code is not OK; code is " + resp.status
				);
			}
			post.isDeleted = true;
			post.mod_deleted = true;
			post.deleted_at = Math.floor(Date.now() / 1000);
		} catch (e) {
			editError = e;
		}
		adminDeleteButton.disabled = false;
	}

	async function adminRestore() {
		adminRestoreButton.disabled = true;
		try {
			const resp = await fetch(
				`${apiUrl}admin/posts/${post.post_id}/restore`,
				{
					method: "POST",
					headers: $authHeader,
				}
			);
			if (!resp.ok) {
				throw new Error(
					"Response code is not OK; code is " + resp.status
				);
			}
			post.isDeleted = false;
			post.mod_deleted = null;
			post.deleted_at = null;
		} catch (e) {
			editError = e;
		}
		adminRestoreButton.disabled = false;
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
			{#if buttons && hasPermission(adminPermissions.VIEW_POSTS)}
				<button
					class="circle admin"
					on:click={() =>
						modals.showModal(ModeratePostModal, {
							postid: post.post_id,
						})}
				/>
			{/if}
			{#if buttons && $user.name && $chat._id !== "livechat" && post.user !== "Server" && !editing}
				{#if input && !input.disabled && post.user === $user.name}
					<button
						class="circle pen"
						on:click={async () => {
							editError = "";
							editing = true;
							await tick();
							editContentInput.value =
								post.unfiltered_content || post.content;
							editContentInput.focus();
							autoresize(editContentInput);
						}}
					/>
				{/if}
				{#if input && !input.disabled && post.user !== "Notification" && post.user !== "Announcement"}
					<button
						class="circle reply"
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
				{#if adminView && hasPermission(adminPermissions.DELETE_POSTS)}
					{#if post.isDeleted}
						<button
							class="circle restore"
							title="Restore post"
							bind:this={adminRestoreButton}
							on:click={adminRestore}
						/>
					{:else}
						<button
							class="circle trash"
							title="Delete post"
							bind:this={adminDeleteButton}
							on:click={adminDelete}
						/>
					{/if}
				{:else if post.user === $user.name || (post.post_origin === $chat._id && $chat.owner === $user.name)}
					<button
						class="circle trash"
						bind:this={deleteButton}
						on:click={async () => {
							if (shiftHeld) {
								deleteButton.disabled = true;
								try {
									const resp = await fetch(
										`${apiUrl}posts?id=${post.post_id}`,
										{
											method: "DELETE",
											headers: $authHeader,
										}
									);
									if (!resp.ok) {
										if (resp.status === 429) {
											throw new Error(
												"Too many requests! Try again later."
											);
										}
										throw new Error(
											"Response code is not OK; code is " +
												resp.status
										);
									}
								} catch (e) {
									editError = e;
								}
								deleteButton.disabled = false;
							} else {
								modals.showModal(DeletePostModal, {post});
							}
						}}
					/>
				{:else}
					<button
						class="circle report"
						on:click={() =>
							modals.showModal(ReportPostModal, {post})}
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
				<i
					>(<FormattedDate
						date={post.edited_at}
						customText="edited"
					/>)</i
				>
			{/if}
			{#if post.isDeleted && post.mod_deleted}
				<i
					>(<FormattedDate
						date={post.deleted_at}
						customText="deleted by moderator"
					/>)</i
				>
			{:else if post.isDeleted}
				<i
					>(<FormattedDate
						date={post.deleted_at}
						customText="self-deleted"
					/>)</i
				>
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
			<button on:click={() => (editing = false)}>Cancel</button>
			<button
				bind:this={editSaveButton}
				on:click={async () => {
					if (editContentInput.value.trim() === "") {
						modals.showModal(DeletePostModal, {post});
						return;
					}

					editing = false;
					try {
						const resp = await fetch(
							`${apiUrl}posts?id=${post.post_id}`,
							{
								method: "PATCH",
								headers: {
									"Content-Type": "application/json",
									...$authHeader,
								},
								body: JSON.stringify({
									content: editContentInput.value,
								}),
							}
						);
						if (!resp.ok) {
							if (resp.status === 429) {
								throw new Error(
									"Too many requests! Try again later."
								);
							}
							throw new Error(
								"Response code is not OK; code is " +
									resp.status
							);
						}
					} catch (e) {
						editError = e;
					}
				}}>Save</button
			>
		</div>
	{:else}
		<p class="post-content" style="border-left-color: #4b5563;">
			{@html addFancyElements(post.content)}
		</p>
	{/if}
	{#if editError}
		<p style="color: crimson;">Error while editing/deleting: {editError}</p>
	{/if}
	{#if !editing}
		<div class="post-images">
			{#each images as { title, url }}
				<a href={url} target="_blank" rel="noreferrer"
					><img src={url} alt={title} {title} class="post-image" />
				</a>
			{/each}
		</div>
	{/if}
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
