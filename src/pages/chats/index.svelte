<!--
	The chat list
	The part before the group chats™
	
	Or:

	Home but it's a list of group chats.
-->
<script>
	import {
		authHeader,
		userRestricted,
		userSuspended,
		chat as currentChat,
	} from "../../lib/stores.js";
	import {permissions, hasPermission} from "../../lib/adminPermissions.js";
	import * as modals from "../../lib/modals.js";
	import Modal from "../../lib/Modal.svelte";
	import PagedList from "../../lib/PagedList.svelte";
	import Container from "../../lib/Container.svelte";
	import * as clm from "../../lib/clmanager.js";
	import {apiUrl, encodeApiURLParams} from "../../lib/urls.js";

	import {fly} from "svelte/transition";
	import {flip} from "svelte/animate";

	import {params, goto} from "@roxi/routify";
	import {onMount} from "svelte";

	let items, toLeaveChat;

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
			let result, numPages;

			let path = `chats?page=${page}${
				$params.user ? `&user=${$params.user}&include_deleted` : ""
			}`;
			if (encodeApiURLParams) path = encodeURIComponent(path);
			const resp = await fetch(`${apiUrl}${path}`, {
				headers: $authHeader,
			});
			const json = await resp.json();
			result = json.all_chats;
			numPages = json.pages;
			return {result, numPages};
		}
		return {
			numPages: 1,
			result: [],
		};
	}

	onMount(() => {
		if ($params.user && !hasPermission(permissions.VIEW_CHATS)) {
			$goto("/chats");
		}
	});
</script>

<div class="chats">
	<Container>
		{#if $params.user}
			<h1>{$params.user}'s Chats</h1>
			Here are {$params.user}'s chats.
		{:else}
			<h1>Chats</h1>
			Here are your chats. Press the chat button to enter a chat, and the plus
			to create one.
			<div class="settings-controls">
				<button
					class="circle plus"
					on:click={() => {
						if ($userRestricted || $userSuspended) {
							modals.showModal("banned");
						} else {
							modals.showModal("createChat");
						}
					}}
				/>
			</div>
		{/if}
	</Container>
	{#if !$params.user}
		<Container>
			<div class="settings-controls">
				<button
					class="circle join"
					on:click={() => {
						currentChat.set({
							_id: "livechat",
							nickname: "Livechat",
							owner: "",
							members: [],
							created: 0,
							last_active: 0,
							deleted: false,
						});
						$goto("/chats/livechat");
					}}
				/>
			</div>

			<h1>Livechat</h1>
			Post history isn't saved here.
		</Container>
	{/if}
	<PagedList bind:items {loadPage}>
		<svelte:fragment slot="loaded" let:items>
			{#each items as chat (chat._id)}
				<div
					transition:fly|local={{y: -50, duration: 250}}
					animate:flip={{duration: 250}}
				>
					<Container>
						<div class="settings-controls">
							{#if !$params.user}
								<button
									class="circle close"
									on:click={() => (toLeaveChat = chat)}
								/>
							{/if}
							<button
								class="circle join"
								on:click={() => {
									currentChat.set(chat);
									$goto(`/chats/${chat._id}`);
								}}
							/>
						</div>

						<h1>{chat.nickname}</h1>
						Members: {chat.members.length > 100
							? chat.members.slice(0, 99).join(", ") + "..."
							: chat.members.join(", ")}

						{#if chat.deleted}
							<br /><br />
							<span style="color: crimson;"
								><b>This chat is currently deleted.</b></span
							>
						{/if}
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
		<Modal on:close={() => (toLeaveChat = null)}>
			<h2 slot="header">Leave Chat</h2>
			<div slot="default">
				<span
					>Are you sure you want to leave {toLeaveChat.nickname}?</span
				>
				<br /><br />
				<div class="modal-buttons">
					<button on:click={() => (toLeaveChat = null)}>No</button>
					<button
						on:click={() => {
							clm.meowerRequest({
								cmd: "direct",
								val: {
									cmd: "leave_chat",
									val: toLeaveChat._id,
								},
							}).then(() => {
								items = items.filter(
									v => v._id !== toLeaveChat._id
								);
								toLeaveChat = null;
							});
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
