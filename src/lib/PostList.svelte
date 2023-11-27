<!--
	Component that powers lists of posts like home.
	Also customizable!

	Parameters:
	- fetchUrl: The API path to fetch (like "home" for /home). Adds ?autoget and ?page= by default.
		If falsy, a page won't be fetched by default (the list will start empty).
	- postOrigin: A post_origin to listen to for live post updates
		(for example, posts from home have the origin "home").
		If falsy, posts will not be listened to.
	- chatName: Only needed for group chats. Used for join/leave messages.
	- canPost: A boolean which indicates if this list can be posted in or not.
	- queryParams: Additional query parameters, as an object.

	Slots:
	- error and empty: These slots unction the same as PagedList (see its comment).
		There are no "loaded" or "item" slots.
	
	Events:
	- loaded: Fired when the list loads for the first time.
-->
<script>
	import BasicModal from "./modals/Basic.svelte";
	import AccountBannedModal from "./modals/safety/AccountBanned.svelte";
	import BlockUserModal from "./modals/safety/BlockUser.svelte";
	import AddImageModal from "./modals/AddImage.svelte";

	import PFP from "../lib/PFP.svelte";
	import LiText from "../lib/LiText.svelte";

	import {goto} from "@roxi/routify";

	import {
		relationships,
		authHeader,
		user,
		spinner,
		lastTyped,
		chat,
		postInput as postInput_2,
	} from "./stores.js";
	import {userRestrictions, isRestricted} from "../lib/bitField.js";
	import {shiftHeld} from "./keyDetect.js";
	import {playNotification} from "./sounds.js";
	import * as modals from "./modals.js";
	import PagedList from "./PagedList.svelte";
	import Container from "./Container.svelte";
	import Post from "./Post.svelte";
	import TypingIndicator from "./TypingIndicator.svelte";
	import ProfileView from "./ProfileView.svelte";
	import * as clm from "./clmanager.js";
	import {apiUrl, encodeApiURLParams} from "./urls.js";

	import {createEventDispatcher} from "svelte";
	const dispatch = createEventDispatcher();

	export let fetchUrl = "home";
	export let postOrigin = "home";
	export let chatName = "Home";
	export let canPost = true;
	export let queryParams = {};
	export let addToChat = false;
	export let adminView = false;

	// @ts-ignore
	import {autoresize} from "svelte-textarea-autoresize";

	import {fly} from "svelte/transition";
	import {flip} from "svelte/animate";
	import {params} from "@roxi/routify";
	import {onMount, onDestroy} from "svelte";

	let id = 0;
	let postErrors = "";

	let postInput, submitBtn, userRestricted, dmWith;

	let addToChatLoading = {};

	$: {
		userRestricted =
			(postOrigin === "home" &&
				isRestricted(userRestrictions.HOME_POSTS)) ||
			(!["home", "inbox"].includes(postOrigin) &&
				isRestricted(userRestrictions.CHAT_POSTS));

		if ($chat.type === 1) {
			dmWith = $chat.members.filter(
				username => username !== $user.name
			)[0];
		} else {
			dmWith = null;
		}
	}

	// PagedList stuff
	let list;
	export let items = [];

	let firstLoad = true;

	/**
	 * Loads a page.
	 * @param {number} page
	 * @returns {Promise<{
	 * 	numPages: number,
	 * 	result: Array<import("./types.js").ListPost | import("./types.js").User>
	 * }>}
	 */
	async function loadPage(page = 1) {
		if (!fetchUrl) {
			// don't load anything
			if (firstLoad) dispatch("loaded");
			firstLoad = true;
			return {
				numPages: 1,
				result: [],
			};
		}

		let result;

		const params = new URLSearchParams({
			autoget: "1",
			page: page.toString(),
			...queryParams,
		}).toString();

		let path = `${fetchUrl}?${params}`;
		if (encodeApiURLParams) path = encodeURIComponent(path);
		const resp = await fetch(`${apiUrl}${path}`, {
			headers: $authHeader,
		});

		if (!resp.ok) {
			throw new Error("Response code is not OK; code is " + resp.status);
		}
		/**
		 * @type {import("./types.js").ServerPostList}
		 */
		const json = await resp.json();

		let posts = [];
		if (json.autoget) {
			posts = json.autoget;
		} else {
			posts = [json];
		}

		/**
		 * @type {Array<import("./types.js").ListPost | import("./types.js").User>}
		 */
		result = posts.map(post => {
			if ("lower_username" in post) {
				/** @type import("./types.js").User */
				// @ts-ignore
				const user = {
					id: id++,
					...post,
				};
				return user;
			}
			if (post.post_origin === "inbox") {
				if (post.u === "Server") {
					post.u = "Announcement";
				} else {
					post.u =
						fetchUrl === "inbox"
							? "Notification"
							: `Notification to ${post.u}`;
				}
			}
			return {
				id: id++,
				post_id: post._id,
				post_origin: post.post_origin,
				user: post.u,
				content: post.p,
				unfiltered_content: post.unfiltered_p,
				date: post.t.e,
				edited_at: post.edited_at,
				isDeleted: post.isDeleted,
				mod_deleted: post.mod_deleted,
				deleted_at: post.deleted_at,
			};
		});
		const numPages = json["pages"];

		if (firstLoad) dispatch("loaded");
		firstLoad = true;
		return {
			numPages,
			result,
		};
	}

	let destroy = () => {};
	onDestroy(() => destroy());

	/**
	 * Adds events to listen for live post updates.
	 */
	function listenOnLink() {
		const evId = clm.link.on("direct", cmd => {
			if (!cmd.val) return;

			const isGC = postOrigin !== "home";
			if (cmd.val.mode === "delete") {
				if (adminView) return;
				items = items.filter(post => post.post_id !== cmd.val.id);
			} // This needs to be here to even function - Bloctans
			if (cmd.val.mode === "update_post") {
				let itemIndex = items.findIndex(
					post => post.post_id === cmd.val.payload._id
				);
				if (itemIndex !== -1) {
					let post = cmd.val.payload;
					items[itemIndex] = {
						id: items[itemIndex].id,
						post_id: post._id,
						post_origin: post.post_origin,
						user: post.u,
						content: post.p,
						unfiltered_content: post.unfiltered_p,
						date: post.t.e,
						edited_at: post.edited_at,
						isDeleted: post.isDeleted,
						mod_deleted: post.mod_deleted,
						deleted_at: post.deleted_at,
					};
				}
			}
			if (!isGC || cmd.val.state === 2) {
				if (cmd.val.post_origin !== postOrigin) return;
				list.addItem({
					id: id++,
					post_id: cmd.val._id,
					post_origin: cmd.val.post_origin,
					user: cmd.val.u,
					content: cmd.val.p,
					unfiltered_content: cmd.val.unfiltered_p,
					date: cmd.val.t.e,
					edited_at: cmd.val.edited_at,
					isDeleted: cmd.val.isDeleted,
					mod_deleted: cmd.val.mod_deleted,
					deleted_at: cmd.val.deleted_at,
				});
				if ($user.sfx && cmd.val.u !== $user.name) playNotification();
			}
			if (isGC && cmd.val.state === 0 && cmd.val.chatid === postOrigin) {
				list.addItem({
					id: id++,
					post_id: "",
					post_origin: postOrigin || fetchUrl,
					user: "Server",
					content: `@${cmd.val.u} left ${chatName}.`,
					date: Date.now() / 1000,
					isDeleted: false,
				});
				if ($user.sfx && cmd.val.u !== $user.name) playNotification();
			}
			if (isGC && cmd.val.state === 1 && cmd.val.chatid === postOrigin) {
				list.addItem({
					id: id++,
					post_id: "",
					post_origin: postOrigin || fetchUrl,
					user: "Server",
					content: `@${cmd.val.u} joined ${chatName}.`,
					date: Date.now() / 1000,
					isDeleted: false,
				});
				if ($user.sfx) playNotification();
			}
		});
		destroy = () => clm.link.off(evId);
	}
	onMount(() => {
		if (postOrigin) {
			if (clm.link.ws.readyState === 1) {
				listenOnLink();
			} else {
				clm.link.once("connected", listenOnLink);
			}
		}
		if (!fetchUrl) dispatch("loaded");
	});
</script>

<div>
	<!-- I think we discussed that guest posting will not be in
		the official client, due to moderation reasons -->
	{#if canPost && $user.name}
		<Container>
			<div class="profile-header">
				<button
					class="clickable-pfp"
					on:click={$goto(`/users/${$user._id}`)}
				>
					<PFP
						online={true}
						icon={$user.pfp_data}
						alt="{$user._id}'s profile picture"
						size={1}
					/>
				</button>
				<div class="profile-header-info">
					<h2 class="profile-username">
						<LiText text={$user._id} />
					</h2>
				</div>
			</div>
			<br />
			<form
				class="createpost"
				autocomplete="off"
				on:submit|preventDefault={/** @type {SubmitEvent} */ e => {
					postErrors = "";

					// @ts-ignore
					const input = e.target.elements.input;
					// @ts-ignore
					const content = e.target.elements.input.value;

					if (!content.trim()) {
						postErrors = "You cannot send an empty post!";
						return false;
					}

					// substitute command
					if (content.match(/^s\/.+\//gs)) {
						let toReplace = content.split("/")[1];
						let replaceWith = content.replace(`s/${toReplace}/`, "");

						let post = items.find(_post => _post.user === $user.name);
						if (post) {
							setTimeout(async () => {
								let newContent = post.content.replace(
									toReplace,
									replaceWith
								);
								console.log(post);
								if (post.unfiltered_content) {
									newContent = post.unfiltered_content.replace(
										toReplace,
										replaceWith
									);
								}
								if (newContent.trim() === "") {
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
										postErrors = `Error while deleting post: ${e}`;
									}
								} else if (newContent !== post.content) {
									try {
										const resp = await fetch(
											`${apiUrl}posts?id=${post.post_id}`,
											{
												method: "PATCH",
												headers: {
													"Content-Type":
														"application/json",
													...$authHeader,
												},
												body: JSON.stringify({
													content: newContent,
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
										postErrors = e;
									}
								}
							}, 0);
						}

						input.value = "";
						input.rows = "1";
						input.style.height = "45px";
						return;
					}

					spinner.set(true);

					submitBtn.disabled = true;
					clm.meowerRequest({
						cmd: "direct",
						val: {
							cmd: postOrigin === "home" ? "post_home" : "post_chat",
							val:
								postOrigin === "home"
									? content
									: {
											p: content,
											chatid: postOrigin,
									},
						},
					})
						.then(() => {
							input.value = "";
							input.rows = "1";
							input.style.height = "45px";
							submitBtn.disabled = false;
						})
						.catch(code => {
							submitBtn.disabled = false;
							switch (code) {
								case "E:106 | Too many requests":
									postErrors = "You're posting too fast!";
									break;
								case "I:017 | Missing permissions":
									postErrors =
										"Someone’s privacy settings are preventing you from sending messages here.";
									break;
								default:
									postErrors = "Unexpected " + code + " error!";
							}
						});
					return false;
				}}
			>
				<textarea
					type="text"
					class="white"
					placeholder={userRestricted
						? "Your account is currently restricted."
						: $relationships[dmWith] === 2
						? `You have blocked ${dmWith}.`
						: "So, what's on your mind?"}
					name="input"
					autocomplete="off"
					style="border-style: dashed;"
					maxlength="4000"
					rows="1"
					disabled={userRestricted || $relationships[dmWith] === 2}
					use:autoresize
					on:input={() => {
						postErrors = "";
						if ($lastTyped + 1500 < +new Date()) {
							lastTyped.set(+new Date());
							clm.link.send({
								cmd: "direct",
								val: {
									cmd: "set_chat_state",
									val: {
										chatid:
											postOrigin === "home"
												? "livechat"
												: postOrigin,
										state: postOrigin === "home" ? 101 : 100,
									},
								},
								listener: "typing_indicator",
							});
						}
					}}
					on:keydown={event => {
						if (event.key == "Enter" && !shiftHeld) {
							event.preventDefault();
							if (!submitBtn.disabled) submitBtn.click();
						}
					}}
					bind:this={postInput}
				/>
				<div class="buttons">
					{#if userRestricted}
						<button
							on:click|preventDefault={() => {
								modals.showModal(AccountBannedModal, {
									ban: $user.ban,
									feature: `creating ${
										postOrigin === "home" ? "home" : "group chat"
									} posts`,
								});
							}}>View details</button
						>
					{:else if $relationships[dmWith] === 2}
						<button
							on:click|preventDefault={() =>
								modals.showModal(BlockUserModal, {username: dmWith})}
							>Unblock</button
						>
					{:else}
						<button
							class="upload-image"
							name="addImage"
							title="Add an image"
							on:click|preventDefault={() => {
								postInput_2.set(postInput);
								modals.showModal(AddImageModal);
							}}>+</button
						>
						<button
							class="bolden"
							name="Bolden"
							title="Bolden Text"
							on:click|preventDefault={() => {
							}}><b>B</b></button
						>
						<button
							class="italic"
							name="Italizice"
							title="Italizice Text"
							on:click|preventDefault={() => {
							}}><em>I</em></button
						>
						<button
							bind:this={submitBtn}
							name="submit"
							disabled={!postInput}>Post</button
						>
					{/if}
				</div>
			</form>
		</Container>
	{/if}
	<div class="post-errors">{postErrors}</div>
	{#if postOrigin}
		<TypingIndicator forPage={postOrigin} />
	{/if}
	<PagedList maxItems={100} bind:items {loadPage} bind:this={list}>
		<svelte:fragment slot="loaded" let:items={_items}>
			{#each [...new Set(_items)] as post (post.id)}
				<div
					class="item"
					transition:fly|local={{y: -50, duration: 250}}
					animate:flip={{duration: 250}}
				>
					{#if "lower_username" in post}
						{#if !$user.hide_blocked_users || $relationships[post._id] !== 2}
							<ProfileView
								profile={post}
								small={true}
								canClick={true}
								canDoActions={!addToChat}
							/>
							{#if addToChat && !$chat.members.includes(post._id)}
								<div class="settings-controls">
									<button
										class="circle add"
										title="Add to chat"
										disabled={addToChatLoading[post._id]}
										on:click={async () => {
											addToChatLoading[post._id] = true;
											try {
												const resp = await fetch(
													`${apiUrl}${
														$params.admin
															? "admin/"
															: ""
													}chats/${
														$chat._id
													}/members/${post._id}`,
													{
														method: "PUT",
														headers: $authHeader,
													}
												);
												if (!resp.ok) {
													switch (resp.status) {
														case 403:
															throw new Error(
																`Someone's privacy settings are preventing you from adding ${post._id} to ${$chat.nickname}.`
															);
														case 404:
															throw new Error(
																`${post._id} not found.`
															);
														case 409:
															throw new Error(
																`${post._id} is already a member of ${$chat.nickname}.`
															);
														case 429:
															throw new Error(
																"Too many requests! Try again later."
															);
														default:
															throw new Error(
																"Response code is not OK; code is " +
																	resp.status
															);
													}
												}
												if ($params.admin) {
													$chat = await resp.json();
												}
												delete addToChatLoading[
													post._id
												];
											} catch (e) {
												modals.showModal(BasicModal, {
													title: `Failed to add ${post._id} to ${$chat.nickname}`,
													desc: e,
												});
												delete addToChatLoading[
													post._id
												];
											}
										}}
									/>
								</div>
							{/if}
						{/if}
					{:else if !$user.hide_blocked_users || $relationships[post.user] !== 2}
						<Post {post} {adminView} input={postInput} />
					{/if}
				</div>
			{/each}
		</svelte:fragment>
		<slot name="error" slot="error" let:error {error}>
			<Container>
				Error loading posts. Please try again.
				<pre><code>{error}</code></pre>
			</Container>
		</slot>
		<slot name="empty" slot="empty">
			{#if postOrigin === "livechat"}
				{""}
			{:else}
				<Container>
					{#if $user.name && canPost}
						No posts here. Check back later or be the first to post!
					{:else}
						No posts here. Check back later!
					{/if}
				</Container>
			{/if}
		</slot>
	</PagedList>
</div>

<style>
	.createpost {
		top: 0;
		margin-bottom: 0.5em;
		gap: 0.25em;
	}
	.createpost textarea {
		width: 100%;
		resize: none;
		max-height: 300px;
	}
	.createpost .buttons {
		display: flex;
	}
	.createpost button {
		resize: vertical;
		margin-top: 0.5rem;
		margin-right: 0.5rem;
	}

	.post-errors {
		color: crimson;
		font-size: 75%;
		font-weight: bold;
		margin: 0.25em 0;
	}

	.upload-image {
		padding: 0;
		padding-left: 0.8rem;
		padding-right: 0.8rem;
		font-size: 2rem;
	}

	.settings-controls {
		position: absolute;
		top: 0.5em;
		right: 0.5em;
	}

	.item {
		position: relative;
	}

	button.circle {
		border: none;
		margin: 0;
		margin-left: 0.125em;
	}

	.profile-header-info {
		display: flex;
		flex-direction: column;
		align-items: left;
		justify-content: center;
		margin-left: 1em;
		height: 4em;
	}

	.profile-username {
		margin: 0;
		padding: 0;
		display: inline-block;
		max-width: 100%;
		font-size: 3em;
	}
	h2.profile-username {
		font-size: 300%;
	}

	.clickable-pfp {
		padding: 0;
		border: none;
		background: none !important;
		color: inherit;
		box-shadow: none;
	}
	:global(main.input-hover) .clickable-pfp:hover:not(:active) :global(.pfp),
	:global(main.input-touch) .clickable-pfp:active :global(.pfp),
	.clickable-pfp:focus-visible :global(.pfp) {
		transform: scale(1.1);
	}

	.profile-header {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}
</style>
