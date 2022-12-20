<!--
	Home, but for group chats.
	(we should probably move the shared post list stuff into a separate component)
-->
<script>
	import {
		authHeader,
		user,
		chatName,
		chatMembers,
		chatid,
		spinner,
		mainPage as page,
		modalShown,
		modalPage,
		profileClicked_GC,
		lastTyped,
	} from "../lib/stores.js";
	import {shiftHeld} from "../lib/keyDetect.js";
	import {playNotification} from "../lib/sounds.js";
	import Post from "../lib/Post.svelte";
	import Member from "../lib/Member.svelte";
	import Container from "../lib/Container.svelte";
	import Loading from "../lib/Loading.svelte";
	import TypingIndicator from "../lib/TypingIndicator.svelte";
	import * as clm from "../lib/clmanager.js";
	import {link} from "../lib/clmanager.js";
	import {apiUrl, encodeApiURLParams} from "../lib/urls.js";

	import {autoresize} from "svelte-textarea-autoresize";

	import {fly} from "svelte/transition";
	import {flip} from "svelte/animate";

	let id = 0;
	export let posts = [];

	let pagesLoaded = 0;
	let pageLoading = false;
	let numPages = null;
	let postErrors = "";

	let postInput;

	// As we use a Load More button and the home is sorted newest-first,
	// we need an offset for posts to be continuous.
	let postOffset = 0;

	let showMembers = true;

	/**
	 * Loads a page, with offset and overflow calculations.
	 *
	 * @param {number} [page] The page to load. If not present, simply clears the posts.
	 * @returns {Promise<array>} The posts array.
	 */
	async function loadPage(page) {
		if ($chatid === "livechat") {
			clm.meowerRequest({
				cmd: "direct",
				val: {
					cmd: "set_chat_state",
					val: {
						state: 1,
						chatid: $chatid,
					},
				},
			});
			return;
		}
		pageLoading = true;
		if (page === undefined) {
			posts = [];
		} else {
			// 25 posts per page...
			let realPage = page + Math.floor(postOffset / 25);
			let realOffset = postOffset % 25;

			try {
				let path = `posts/${$chatid}?autoget&page=`;
				if (encodeApiURLParams) path = encodeURIComponent(path);
				const resp = await fetch(`${apiUrl}${path}${realPage}`, {
					headers: $authHeader,
				});
				if (!resp.ok) {
					throw new Error(
						"Response code is not OK; code is " + resp.status
					);
				}
				const json = await resp.json();

				let realPosts = json.autoget;
				realPosts.splice(0, realOffset);

				numPages = json.pages;

				let overflowResp, overflowJson;
				if (realOffset > 0 && pagesLoaded < numPages) {
					overflowResp = await fetch(
						`${apiUrl}${path}${realPage + 1}`,
						{headers: $authHeader}
					);
					if (!resp.ok) {
						throw new Error(
							"Overflow response code is not OK; code is " +
								resp.status
						);
					}
					overflowJson = await overflowResp.json();

					realPosts = realPosts.concat(
						overflowJson.autoget.slice(0, realOffset)
					);
				}

				for (const post of realPosts) {
					posts.push({
						id: id++,
						post_id: post.post_id,
						user: post.u,
						content: post.p,
						date: post.t.e,
					});
				}
				pagesLoaded = page;
			} catch (e) {
				pageLoading = false;
				throw e;
			}
		}
		clm.meowerRequest({
			cmd: "direct",
			val: {
				cmd: "set_chat_state",
				val: {
					state: 1,
					chatid: $chatid,
				},
			},
		});
		posts = posts;
		pageLoading = false;
		return posts;
	}

	/**
	 * Adds a post to the list.
	 *
	 * @param {object} post
	 */
	function addPost(post) {
		posts.unshift({
			id: id++,
			...post,
		});
		posts = posts;
	}

	/**
	 * Adds events to listen for live post updates and possible chat deletions.
	 */
	function listenOnLink() {
		link.on("direct", cmd => {
			if ($page === "groupchat" && cmd.val.state === 2) {
				if (!(cmd.val.post_origin === $chatid)) return;
				addPost({
					post_id: cmd.val._id,
					user: cmd.val.u,
					content: cmd.val.p,
					date: cmd.val.t.e,
				});
				postOffset++;
				posts = posts;
				if ($user.sfx && cmd.val.u !== $user.name) {
					playNotification();
				}
			}
			if ($page === "groupchat" && cmd.val.state === 0) {
				if (!(cmd.val.chatid === $chatid)) return;
				addPost({
					post_id: id++,
					user: "Server",
					content: `${cmd.val.u} left ${$chatName}.`,
					date: new Date().getTime() / 1000,
				});
			}
			if ($page === "groupchat" && cmd.val.state === 1) {
				if (!(cmd.val.chatid === $chatid)) return;
				addPost({
					post_id: id++,
					user: "Server",
					content: `${cmd.val.u} joined ${$chatName}!`,
					date: new Date().getTime() / 1000,
				});
			}
			if (cmd.val.mode === "delete") {
				posts = posts.filter(post => post.post_id !== cmd.val.id);
			}
		});
	}
	if (link.ws.readyState === 1) {
		listenOnLink();
	} else {
		link.ws.addEventListener("open", listenOnLink);
	}
</script>

<!--
	so {cmd: direct, val: {cmd: add_to_chat, val: {chatid: "", username: ""}}}?
	also  remove_from_chat
-->

<div class="groupchat">
	{#await loadPage(1)}
		<div class="fullcenter">
			<Loading />
		</div>
	{:then}
		<div id="chat">
			<Container>
				<h1>{$chatName}</h1>
				Chat ID: {$chatid}
				{#if $chatid !== "livechat"}
					<div class="settings-controls">
						<button
							class="circle members"
							on:click={() => {
								showMembers = !showMembers;
							}}
						/>
					</div>
				{/if}
			</Container>
			{#if $user.name}
				<form
					class="createpost"
					autocomplete="off"
					on:submit|preventDefault={e => {
						postErrors = "";
						if (!e.target[0].value.trim()) {
							postErrors = "You cannot send an empty post!";
							return false;
						}

						spinner.set(true);

						e.target[1].disabled = true;
						link.send({
							cmd: "direct",
							val: {
								cmd: "post_chat",
								val: {
									p: e.target[0].value,
									chatid: $chatid,
								},
							},
							listener: "post_chat",
						});
						const postListener = link.on("statuscode", cmd => {
							if (cmd.listener !== "post_chat") return;
							link.off(postListener);
							spinner.set(false);

							e.target[1].disabled = false;

							if (cmd.val === "I:100 | OK") {
								e.target[0].value = "";
								e.target[0].rows = "1";
								e.target[0].style.height = "45px";
							} else if (
								cmd.val === "E:106 | Too many requests"
							) {
								postErrors = "You're posting too fast!";
							} else {
								postErrors =
									"Unexpected " + cmd.val + " error!";
							}
						});
						return false;
					}}
				>
					<textarea
						type="text"
						class="white"
						placeholder="Write something..."
						id="postinput"
						name="postinput"
						autocomplete="false"
						maxlength="360"
						rows="1"
						use:autoresize
						on:input={() => {
							if ($lastTyped + 1500 < +new Date()) {
								lastTyped.set(+new Date());
								link.send({
									cmd: "direct",
									val: {
										cmd: "set_chat_state",
										val: {
											chatid: $chatid,
											state: 100,
										},
									},
									listener: "typing_indicator",
								});
							}
						}}
						on:keydown={event => {
							if (event.key == "Enter" && !shiftHeld) {
								event.preventDefault();
								document.getElementById("submitpost").click();
							}
						}}
						bind:this={postInput}
					/>
					<button id="submitpost">Post</button>
				</form>
				<div class="post-errors">{postErrors}</div>
			{/if}
			<TypingIndicator />
			{#if posts.length < 1}
				{#if $user.name}
					No posts here. Check back later or be the first to post!
				{:else}
					No posts here. Check back later!
				{/if}
			{:else}
				{#each posts as post (post.id)}
					<div
						transition:fly|local={{y: -50, duration: 250}}
						animate:flip={{duration: 250}}
					>
						<Post {post} input={postInput} />
					</div>
				{/each}

				<div class="center">
					{#if pageLoading}
						<Loading />
					{:else if numPages && numPages > pagesLoaded}
						<button
							class="load-more"
							on:click={() => loadPage(pagesLoaded + 1)}
						>
							Load More
						</button>
					{/if}
				</div>
			{/if}
		</div>
		{#if showMembers && $chatid !== "livechat"}
			<div id="members">
				<div id="members-inner">
					{#each $chatMembers as chatmember}
						<button
							class="member-button"
							on:click={() => {
								modalPage.set("gcMember");
								modalShown.set(true);
								profileClicked_GC.set(chatmember);
							}}
						>
							<Member member={chatmember} />
						</button>
					{/each}
				</div>
				<div class="top">
					<h2 class="members-title">
						Members <span class="small"
							>({$chatMembers.length})</span
						>
					</h2>
					<div class="settings-controls">
						<button
							class="circle plus"
							on:click={() => {
								modalPage.set("addMember");
								modalShown.set(true);
							}}
						/>
					</div>
				</div>
			</div>
		{/if}
	{:catch error}
		<Container>
			<h1>{chatName}</h1>
			Error loading posts. Please try again.
			<pre><code>{error}</code></pre>
		</Container>
	{/await}
</div>

<style>
	.member-button {
		padding: 0;
		margin: 0;

		width: 100%;

		background-color: transparent;
		color: var(--foreground);
		border: none;

		position: relative;
		text-align: left;
	}

	/* repetition because of CSS specificity */
	:global(main.input-hover) .member-button.member-button:hover,
	.member-button.member-button:focus-visible {
		background-color: #7773;
	}
	:global(#main) .member-button.member-button:active {
		background-color: #7776;
	}

	.groupchat {
		display: flex;
		flex-wrap: nowrap;
		flex-direction: row;
		gap: 0.4em;
	}
	#chat {
		flex-shrink: 1;
		flex-grow: 1;
		overflow: hidden;
	}
	#members {
		height: var(--view-height);
		width: min(45%, 12em);

		background-color: var(--background);
		border: solid 2px var(--orange);
		border-radius: 1px;
		box-sizing: border-box;

		position: sticky;
		top: 0;

		flex-shrink: 0;
		flex-grow: 0;
	}
	#members-inner {
		position: relative;
		overflow-y: auto;
		overflow-x: hidden;
		height: calc(100% - 2.25em);
		margin-top: 2.25em;
	}

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

	.center {
		text-align: center;
	}
	.load-more {
		width: 100%;
		margin-bottom: 1.88em;
	}
	.fullcenter {
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;

		width: 100vw;
		height: 100vh;

		position: fixed;
		top: 0;
		left: 0;
	}

	.post-errors {
		color: red;
		font-size: 75%;
		font-weight: bold;
		margin: 0.25em 0;
	}

	.top {
		position: absolute;
		top: 0;
		width: 100%;
	}

	.settings-controls {
		position: absolute;
		top: 0.25em;
		right: 0.25em;
	}
	.members-title {
		margin: 0.25em;
	}

	.small {
		font-size: 75%;
	}
</style>
