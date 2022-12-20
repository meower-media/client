<!--
	The chat list
	The part before the group chats™
-->
<script>
	import {
		chatName,
		chatid,
		mainPage as page,
		modalPage,
		modalShown,
		chatMembers,
		chatOwner,
	} from "../lib/stores.js";
	import Container from "../lib/Container.svelte";
	import Loading from "../lib/Loading.svelte";
	import * as clm from "../lib/clmanager.js";
	import {link} from "../lib/clmanager.js";

	import {fly} from "svelte/transition";
	import {flip} from "svelte/animate";

	import {tick} from "svelte";
	import Modal from "../lib/Modal.svelte";

	export let chats = [];

	let toLeaveChat = false;

	let pagesLoaded = 0;
	let pageLoading = false;
	let numPages = null;

	// As we use a Load More button and the home is sorted newest-first,
	// we need an offset for chats to be continuous.
	let chatOffset = 0;

	/**
	 * Loads a page, with offset and overflow calculations.
	 *
	 * @param {number} [page] The page to load. If not present, simply clears the chats.
	 */
	async function loadPage(page) {
		pageLoading = true;
		if (page === undefined) {
			chats = [];
		} else {
			// 25 chats per page...
			let realPage = page + Math.floor(chatOffset / 25);

			clm.meowerRequest({
				cmd: "direct",
				val: {
					cmd: "get_chat_list",
					val: {
						page: realPage,
					},
				},
			});
		}
	}

	/**
	 * Adds events to listen for when the chats get sent.
	 */
	function listenOnLink() {
		link.on("direct", cmd => {
			if (cmd.val.mode === "chats") {
				let realOffset = chatOffset % 25;
				let allChats = cmd.val.payload.all_chats;
				allChats.splice(0, realOffset);
				numPages = cmd.val.payload.pages;

				if (realOffset > 0 && pagesLoaded < numPages) {
					let realPage =
						cmd.val.payload["page#"] + Math.floor(chatOffset / 25);
					loadPage(realPage);
				} else {
					pagesLoaded = cmd.val.payload["page#"];
					chats = allChats;
					pageLoading = false;
				}
			}
		});
	}
	if (link.ws.readyState === 1) {
		listenOnLink();
	} else {
		link.ws.addEventListener("open", listenOnLink);
	}

	loadPage(1);
</script>

<div class="chats">
	{#if pageLoading}
		<div class="fullcenter">
			<Loading />
		</div>
	{:else}
		<Container>
			<h1>Chats</h1>
			Here are your chats. Press the chat button to enter a chat.
			<div class="settings-controls">
				<button
					class="circle plus"
					on:click={() => {
						modalPage.set("createChat");
						modalShown.set(true);
					}}
				/>
			</div>
		</Container>
		<Container>
			<div class="settings-controls">
				<button
					class="circle join"
					on:click={() => {
						chatName.set("Livechat");
						chatid.set("livechat");
						chatMembers.set([]);
						chatOwner.set("");
						window.scrollTo(0, 0);
						page.set("blank");
						tick().then(() => page.set("groupchat"));
					}}
				/>
			</div>

			<h1>Livechat</h1>
			This is the public livechat. Messages in this chat don't save.
		</Container>
		{#each chats as chat (chat._id)}
			<div
				transition:fly|local={{y: -50, duration: 250}}
				animate:flip={{duration: 250}}
			>
				<Container>
					<div class="settings-controls">
						<button
							class="circle close"
							on:click={() => {
								chatName.set(chat.nickname);
								chatid.set(chat._id);
								toLeaveChat = true;
							}}
						/>
						<button
							class="circle join"
							on:click={() => {
								chatName.set(chat.nickname);
								chatid.set(chat._id);
								chatMembers.set(chat.members);
								chatOwner.set(chat.owner);
								window.scrollTo(0, 0);
								page.set("blank");
								tick().then(() => page.set("groupchat"));
							}}
						/>
					</div>

					<h1>{chat.nickname}</h1>
					Members: {chat.members.length > 100
						? chat.members.slice(0, 99).join(", ") + "..."
						: chat.members.join(", ")}
				</Container>
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
	{#if toLeaveChat}
		<Modal
			on:close={() => {
				toLeaveChat = false;
			}}
		>
			<h2 slot="header">Leave Chat</h2>
			<div slot="default">
				<span>Are you sure you want to leave {$chatName}?</span>
				<br /><br />
				<div class="modal-buttons">
					<button
						on:click={() => {
							toLeaveChat = false;
						}}>No</button
					>
					<button
						on:click={() => {
							chats = chats.filter(v => v._id !== $chatid);
							clm.meowerRequest({
								cmd: "direct",
								val: {
									cmd: "leave_chat",
									val: $chatid,
								},
							});
							toLeaveChat = false;
						}}>Yes</button
					>
				</div>
			</div>
		</Modal>
	{/if}
</div>

<style>
	.chats {
		height: 100%;
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
