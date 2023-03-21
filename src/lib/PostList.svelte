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

	Slots:
	- error and empty: These slots unction the same as PagedList (see its comment).
		There are no "loaded" or "item" slots.
	
	Events:
	- loaded: Fired when the list loads for the first time.
-->
<script>
	import {authHeader, user, spinner, lastTyped} from "./stores.js";
	import {shiftHeld} from "./keyDetect.js";
	import {playNotification} from "./sounds.js";
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

	// @ts-ignore
	import {autoresize} from "svelte-textarea-autoresize";

	import {fly} from "svelte/transition";
	import {flip} from "svelte/animate";
	import {onDestroy, onMount} from "svelte";

	let id = 0;
	let postErrors = "";

	let postInput, submitBtn;

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

		let path = `${fetchUrl}?autoget&page=`;
		if (encodeApiURLParams) path = encodeURIComponent(path);
		const resp = await fetch(`${apiUrl}${path}${page}`, {
			headers: $authHeader,
		});

		if (!resp.ok) {
			throw new Error("Response code is not OK; code is " + resp.status);
		}
		/**
		 * @type {import("./types.js").ServerPostList}
		 */
		const json = await resp.json();

		const isInbox = fetchUrl === "inbox";

		/**
		 * @type {Array<import("./types.js").ListPost | import("./types.js").User>}
		 */
		result = json.autoget.map(post => {
			if ("lower_username" in post) {
				/** @type import("./types.js").User */
				// @ts-ignore
				const user = {
					id: id++,
					...post,
				};
				return user;
			}
			if (isInbox) {
				if (post.u === "Server") {
					post.u = "Announcement";
				} else {
					post.u = "Notification";
				}
			}
			return {
				id: id++,
				_id: post._id,
				post_id: post.post_id,
				user: post.u,
				content: post.p,
				date: post.t.e,
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

	function post(url = "", data = {}) {
		fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
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
			if (!isGC || cmd.val.state === 2) {
				if (!cmd.val.post_id) return;
				if (cmd.val.post_origin !== postOrigin) return;

				list.addItem({
					id: id++,
					post_id: cmd.val._id,
					user: cmd.val.u,
					content: cmd.val.p,
					date: cmd.val.t.e,
				});
			}
			if (isGC && cmd.val.state === 0 && cmd.val.chatid === postOrigin) {
				list.addItem({
					id: id++,
					post_id: "",
					user: "Server",
					content: `${cmd.val.u} left ${chatName}.`,
					date: Date.now() / 1000,
				});
			}
			if (isGC && cmd.val.state === 1 && cmd.val.chatid === postOrigin) {
				list.addItem({
					id: id++,
					post_id: "",
					user: "Server",
					content: `${cmd.val.u} joined ${chatName}!`,
					date: Date.now() / 1000,
				});
			}
			if (
				$user.sfx &&
				cmd.val.u !== $user.name &&
				cmd.val.mode !== "delete"
			) {
				playNotification();
			}
			if (cmd.val.mode === "delete") {
				items = items.filter(post => post.post_id !== cmd.val.id);
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

				spinner.set(true);

				submitBtn.disabled = true;
				if ($user.name) {
					clm.meowerRequest({
						cmd: "direct",
						val: {
							cmd:
								postOrigin === "home"
									? "post_home"
									: "post_chat",
							val:
								postOrigin === "home"
									? content
									: {
											p: content,
											chatid: postOrigin,
									  },
						},
					}).then(data => {
						submitBtn.disabled = false;

						if (data === "I:100 | OK" || !data) {
							input.value = "";
							input.rows = "1";
							input.style.height = "45px";
						} else if (data === "E:106 | Too many requests") {
							postErrors = "You're posting too fast!";
						} else {
							postErrors = "Unexpected " + data + " error!";
						}
					});
					return false;
				} else {
					post("https://webhooks.meower.org/post/home", {
						post: content,
					});
					submitBtn.disabled = false;
					input.value = "";
					input.rows = "1";
					input.style.height = "45px";
					spinner.set(false);
				}
			}}
		>
			<textarea
				type="text"
				class="white"
				placeholder="Write something..."
				name="input"
				autocomplete="false"
				maxlength="360"
				rows="1"
				use:autoresize
				on:input={() => {
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
						submitBtn.click();
					}
				}}
				bind:this={postInput}
			/>
			<button bind:this={submitBtn} name="submit">Post</button>
		</form>
	{/if}
	<div class="post-errors">{postErrors}</div>
	{#if postOrigin}
		<TypingIndicator forPage={postOrigin} />
	{/if}
	<PagedList maxItems={50} bind:items {loadPage} bind:this={list}>
		<svelte:fragment slot="loaded" let:items={_items}>
			{#each _items as post (post.id)}
				<div
					class="item"
					transition:fly|local={{y: -50, duration: 250}}
					animate:flip={{duration: 250}}
				>
					{#if post.lower_username}
						<ProfileView
							canClick={true}
							small={true}
							profile={post}
						/>
					{:else}
						<Post
							canDoActions={fetchUrl !== "reports"}
							{post}
							input={postInput}
						/>
					{/if}
					{#if fetchUrl === "reports"}
						<div class="settings-controls">
							<button
								class="circle close"
								title="Close report"
								on:click={async () => {
									try {
										await clm.meowerRequest({
											cmd: "direct",
											val: {
												cmd: "close_report",
												val: post._id
											}
										});
										items = items.filter((p) => p._id !== post._id);
									} catch(e) {
										console.error(e);
									}
								}}
							/>
						</div>
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
					{#if $user.name}
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
		display: flex;
		margin-bottom: 0.5em;
	}
	.createpost textarea {
		flex-grow: 1;
		margin-right: 0.25em;
		resize: none;
		max-height: 300px;
	}

	.post-errors {
		color: red;
		font-size: 75%;
		font-weight: bold;
		margin: 0.25em 0;
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
</style>
