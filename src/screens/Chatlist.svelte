<!--
	The chat list
	The part before the group chats™
	
	Or:

	Home but it's a list of group chats.
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
	import PagedList from "../lib/PagedList.svelte";
	import Container from "../lib/Container.svelte";
	import * as clm from "../lib/clmanager.js";

	import {fly} from "svelte/transition";
	import {flip} from "svelte/animate";

	import {tick} from "svelte";
	import Modal from "../lib/Modal.svelte";


	let items;
	let toLeaveChat = false;

	/**
	 * Loads a page.
	 * @param {number} page
	 * @returns {Promise<{
	 * 	numPages: number,
	 * 	result: *
	 * }>}
	 */
	async function loadPage(page) {
		if (page !== undefined) {
			let ev, result, numPages;
			
			try {
				ev = clm.link.on("direct", cmd => {
					if (cmd.val.mode === "chats") {
						result = cmd.val.payload.all_chats;
						numPages = cmd.val.payload.pages;
					}
				});
				await clm.meowerRequest({
					cmd: "direct",
					val: {
						cmd: "get_chat_list",
						val: {
							page: page,
						},
					},
				});
				if (!result || numPages === undefined) throw "This message should not appear";
				return {result, numPages};
			} finally {
				if (ev) clm.link.off(ev);
			}
		}
		return {
			numPages: 1,
			result: []
		};
	}
</script>

<div class="chats">
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
	<PagedList bind:items {loadPage}>
		<svelte:fragment slot="loaded" let:items>
			{#each items as chat (chat._id)}
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
		</svelte:fragment>
		<Container slot="error" let:error>
			Error loading posts. Please try again.
			<pre><code>{error}</code></pre>
		</Container>
	</PagedList>
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
							items = items.filter(v => v._id !== $chatid);
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
