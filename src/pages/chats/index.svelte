<!--
	The chat list
	The part before the group chats™
	
	Or:

	Home but it's a list of group chats.
-->
<script>
	import Container from "../../lib/Container.svelte";
	import ProfileView from "../..//lib/ProfileView.svelte";

	import BasicModal from "../../lib/modals/Basic.svelte";
	import AccountBannedModal from "../../lib/modals/safety/AccountBanned.svelte";
	import CreateChatModal from "../../lib/modals/chats/CreateChat.svelte";
	import LeaveChatModal from "../../lib/modals/chats/LeaveChat.svelte";

	import {chats, user} from "../../lib/stores.js";
	import {userRestrictions, isRestricted} from "../../lib/bitField.js";
	import * as modals from "../../lib/modals.js";
	import * as clm from "../../lib/clmanager.js";

	import {fly} from "svelte/transition";
	import {flip} from "svelte/animate";

	import {goto} from "@roxi/routify";

	let favoritedChats, nonFavoritedChats, sortedChats;

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
					modals.showModal(BasicModal, {
						title: "Subscription",
						desc: "This requires Meower Plus.",
					});
				}}
			/>
		</div>
	</Container>
	<Container>
		<div class="chat">
			<div class="settings-controls">
				<button
					class="circle join"
					on:click={() => {
						modals.showModal(BasicModal, {
							title: "Subscription",
							desc: "This requires Meower premium.",
						});
					}}
				/>
			</div>

			<h1>Livechat</h1>
			Post history isn't saved here.
		</div>
	</Container>
	{#each sortedChats as chat (chat._id)}
		<div
			transition:fly|local={{y: -50, duration: 250}}
			animate:flip={{duration: 250}}
		>
			{#if chat.type === 0}
				<Container>
					<div class="chat">
						<div class="settings-controls">
							<button
								class="circle star"
								class:filled={$user.favorited_chats.includes(
									chat._id
								)}
								on:click={() => {
									modals.showModal(BasicModal, {
										title: "Subscription",
										desc: "This requires Meower Orange.",
									});
								}}
							/>
							{#if !$user.favorited_chats.includes(chat._id)}
								<button
									class="circle close"
									on:click={() =>
										modals.showModal(BasicModal, {
											title: "Subscription",
											desc: "This requires Meower Premium.",
										})
									}
								/>
							{/if}
							<button
								class="circle join"
								on:click={() =>
									modals.showModal(BasicModal, {
										title: "Subscription",
										desc: "This requires Meower Pro.",
									})
								}
							/>
						</div>

						<h1>{chat.nickname}</h1>
						Members: {chat.members.length > 100
							? chat.members.slice(0, 99).join(", ") + "..."
							: chat.members.join(", ")}
					</div>
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
</div>

<style>
	.chats {
		height: 100%;
	}
	.chat {
		min-height: 4.5em;
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
