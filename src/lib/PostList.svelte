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
	import {
		authHeader,
		user,
		spinner,
		lastTyped,
		chatid,
		chatMembers,
		postInput as postInput_2,
	} from "./stores.js";
	import {shiftHeld} from "./keyDetect.js";
	import {playNotification} from "./sounds.js";
	import * as Modals from "./modals.js";
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
				_id: post._id,
				post_id: post.post_id,
				user: post.u,
				content: post.p,
				date: post.t.e,
				post_origin: post.post_origin,
				isDeleted: post.isDeleted,
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
			if (cmd.val.mode == "delete") {
				items = items.filter(post => post.post_id !== cmd.val.id);
			} // This needs to be here to even function - Bloctans
			if (!isGC || cmd.val.state === 2) {
				if (cmd.val.post_origin !== postOrigin) return;
				list.addItem({
					id: id++,
					post_id: cmd.val._id,
					user: cmd.val.u,
					content: cmd.val.p,
					date: cmd.val.t.e,
					post_origin: cmd.val.post_origin,
					isDeleted: cmd.val.isDeleted,
				});
				if ($user.sfx && cmd.val.u !== $user.name) playNotification();
			}
			if (isGC && cmd.val.state === 0 && cmd.val.chatid === postOrigin) {
				list.addItem({
					id: id++,
					post_id: "",
					user: "Server",
					content: `${cmd.val.u} left ${chatName}.`,
					date: Date.now() / 1000,
					post_origin: postOrigin || fetchUrl,
					isDeleted: false,
				});
				if ($user.sfx && cmd.val.u !== $user.name) playNotification();
			}
			if (isGC && cmd.val.state === 1 && cmd.val.chatid === postOrigin) {
				list.addItem({
					id: id++,
					post_id: "",
					user: "Server",
					content: `${cmd.val.u} joined ${chatName}!`,
					date: Date.now() / 1000,
					post_origin: postOrigin || fetchUrl,
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
					input.value = "";
					input.rows = "1";
					input.style.height = "45px";
					submitBtn.disabled = false;
				}).catch(code => {
					submitBtn.disabled = false;
					switch (code) {
						case "E:106 | Too many requests":
							postErrors = "You're posting too fast!";
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
				placeholder="Message..."
				name="input"
				autocomplete="false"
				maxlength="500"
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
						if (!submitBtn.disabled) submitBtn.click();
					}
				}}
				bind:this={postInput}
			/>
			<button
				class="upload-image"
				name="addImage"
				title="Add an image"
				on:click|preventDefault={() => {
					postInput_2.set(postInput);
					Modals.showModal("addImg");
				}}>+</button
			>
			<button bind:this={submitBtn} name="submit" disabled={!postInput}>Post</button>
		</form>
	{/if}
	<div class="post-errors">{postErrors}</div>
	{#if postOrigin}
		<TypingIndicator forPage={postOrigin} />
	{/if}
	<PagedList maxItems={50} bind:items {loadPage} bind:this={list}>
		<svelte:fragment slot="loaded" let:items={_items}>
			{#each [...new Set(_items)] as post (post.id)}
				<div
					class="item"
					transition:fly|local={{y: -50, duration: 250}}
					animate:flip={{duration: 250}}
				>
					{#if "lower_username" in post}
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
							{#if !post.lower_username}
								<button
									disabled={post.deleted}
									class="circle trash"
									title="Delete post"
									on:click={async () => {
										try {
											await clm.meowerRequest({
												cmd: "direct",
												val: {
													cmd: "delete_post",
													val: post.post_id,
												},
											});
											if (post.post_origin === "inbox") {
												await clm.meowerRequest({
													cmd: "direct",
													val: {
														cmd: "close_report",
														val: post._id,
													},
												});
											}
											items = items.filter(
												p => p._id !== post._id
											);
										} catch (e) {
											console.error(e);
										}
									}}
								/>
							{/if}
							<button
								class="circle close"
								title="Close report"
								on:click={async () => {
									try {
										await clm.meowerRequest({
											cmd: "direct",
											val: {
												cmd: "close_report",
												val: post._id,
											},
										});
										items = items.filter(
											p => p._id !== post._id
										);
									} catch (e) {
										console.error(e);
									}
								}}
							/>
						</div>
					{/if}
					{#if addToChat && !$chatMembers.includes(post._id)}
						<div class="settings-controls">
							<button
								class="circle add"
								title="Add to chat"
								on:click={async () => {
									clm.meowerRequest({
										cmd: "direct",
										val: {
											cmd: "add_to_chat",
											val: {
												chatid: $chatid,
												username: post._id,
											},
										},
									});
									$chatMembers.push(post._id);
									chatMembers.set($chatMembers);
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
		gap: 0.25em;
	}
	.createpost textarea {
		flex-grow: 1;
		resize: none;
		max-height: 300px;
		border-radius: 10px;
	}

	.post-errors {
		color: red;
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
</style>
