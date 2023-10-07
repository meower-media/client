<!--
	The chat list
	The part before the group chats™
	
	Or:

	Home but it's a list of group chats.
-->
<script>
	import Container from "../../lib/Container.svelte";
	import Modal from "../../lib/Modal.svelte";
	import ProfileView from "../..//lib/ProfileView.svelte";

	import BasicModal from "../../lib/modals/Basic.svelte";
	import AccountBannedModal from "../../lib/modals/moderation/AccountBanned.svelte";
	import CreateChatModal from "../../lib/modals/CreateChat.svelte";

	import {authHeader, chats, user} from "../../lib/stores.js";
	import {restrictions, isRestricted} from "../../lib/bitField.js";
	import {apiUrl} from "../../lib/urls.js";
	import * as modals from "../../lib/modals.js";
	import * as clm from "../../lib/clmanager.js";

	import {fly} from "svelte/transition";
	import {flip} from "svelte/animate";

	import {goto} from "@roxi/routify";

	let favoritedChats, nonFavoritedChats, sortedChats, toLeaveChat, leaveError;

	$: {
		favoritedChats = $chats
			.filter(_chat => $user.favorited_chats.includes(_chat._id))
			.sort((a, b) => {
				//return $user.favorited_chats.indexOf(a._id) - $user.favorited_chats.indexOf(b._id);
				return b.last_active - a.last_active;
			});

		nonFavoritedChats = $chats
			.filter(_chat => !$user.favorited_chats.includes(_chat._id))
			.sort((a, b) => {
				return b.last_active - a.last_active;
			});

		sortedChats = favoritedChats.concat(nonFavoritedChats);
	}
</script>

<div class="chats">
	<Container>
		<h1>Chats</h1>
		Here are your chats. Press the chat button to enter a chat, and the plus
		to create one.
		<div class="settings-controls">
			<button
				class="circle plus"
				on:click={() => {
					if (isRestricted(restrictions.NEW_CHATS)) {
						modals.showModal(AccountBannedModal, {
							feature: "creating group chats",
						});
					} else {
						modals.showModal(CreateChatModal);
					}
				}}
			/>
		</div>
	</Container>
	<Container>
		<div class="settings-controls">
			<button class="circle join" on:click={$goto("/chats/livechat")} />
		</div>

		<h1>Livechat</h1>
		Post history isn't saved here.
	</Container>
	{#each sortedChats as chat (chat._id)}
		<div
			transition:fly|local={{y: -50, duration: 250}}
			animate:flip={{duration: 250}}
		>
			{#if chat.type === 0}
				<Container>
					<div class="settings-controls">
						<button
							class="circle star {$user.favorited_chats.includes(
								chat._id
							)
								? 'filled'
								: ''}"
							on:click={() => {
								if ($user.favorited_chats.includes(chat._id)) {
									$user.favorited_chats.splice(
										$user.favorited_chats.indexOf(chat._id),
										1
									);
									clm.updateProfile({
										favorited_chats: $user.favorited_chats,
									});
								} else {
									$user.favorited_chats =
										$user.favorited_chats.filter(chatId => {
											return $chats.some(
												_chat => _chat._id === chatId
											);
										});
									if ($user.favorited_chats.length >= 50) {
										modals.showModal(BasicModal, {
											title: "Too many chats!",
											desc: "Sorry, you can only have up to 50 favorited chats!",
										});
									} else {
										$user.favorited_chats.push(chat._id);
										clm.updateProfile({
											favorited_chats:
												$user.favorited_chats,
										});
									}
								}
							}}
						/>
						{#if !$user.favorited_chats.includes(chat._id)}
							<button
								class="circle close"
								on:click={() => (toLeaveChat = chat)}
							/>
						{/if}
						<button
							class="circle join"
							on:click={$goto(`/chats/${chat._id}`)}
						/>
					</div>

					<h1>{chat.nickname}</h1>
					Members: {chat.members.length > 100
						? chat.members.slice(0, 99).join(", ") + "..."
						: chat.members.join(", ")}
				</Container>
			{:else if chat.type === 1}
				<ProfileView
					username={chat.members.filter(
						username => username !== $user.name
					)[0]}
					small={true}
					canClick={true}
					canDoActions={true}
					dmChat={chat}
				/>
			{/if}
		</div>
	{/each}
	{#if toLeaveChat}
		<Modal on:close={() => (toLeaveChat = null)}>
			<h2 slot="header">Leave Chat</h2>
			<div slot="default">
				Are you sure you want to leave {toLeaveChat.nickname}?
				{#if leaveError}
					<p style="color: crimson;">{leaveError}</p>
				{:else}
					<br /><br />
				{/if}
				<div class="modal-buttons">
					<button on:click={() => (toLeaveChat = null)}>Cancel</button
					>
					<button
						on:click={async () => {
							try {
								const resp = await fetch(
									`${apiUrl}chats/${toLeaveChat._id}`,
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
								toLeaveChat = null;
							} catch (e) {
								leaveError = e;
							}
						}}>Leave</button
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
