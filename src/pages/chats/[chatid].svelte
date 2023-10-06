<!--
	Home but it's a group chat.
-->
<script>
	import BasicModal from "../../lib/modals/Basic.svelte";
	import ChangeChatNicknameModal from "../../lib/modals/ChangeChatNickname.svelte";
	import GCMemberModal from "../../lib/modals/GCMember.svelte";
	import AddMemberModeModal from "../../lib/modals/AddMember_Mode.svelte";
	import AccountBannedModal from "../../lib/modals/moderation/AccountBanned.svelte";
	import ModerateChatModal from "../../lib/modals/moderation/ModerateChat.svelte";

	import {
		chats,
		user,
		userRestricted,
		userSuspended,
		chat,
		profileClicked_GC,
	} from "../../lib/stores.js";
	import {permissions, hasPermission} from "../../lib/adminPermissions.js";
	import * as modals from "../../lib/modals.js";
	import {mobile} from "../../lib/responsiveness.js";
	import ProfileView from "../../lib/ProfileView.svelte";
	import Member from "../../lib/Member.svelte";
	import Container from "../../lib/Container.svelte";
	import * as clm from "../../lib/clmanager.js";
	import PostList from "../../lib/PostList.svelte";

	import {params, goto} from "@roxi/routify";
	import {onMount, onDestroy} from "svelte/internal";

	let showMembers = !$mobile;

	$: {
		if ($params.chatid === "livechat") {
			chat.set({
				_id: "livechat",
				type: 0,
				nickname: "Livechat",
				owner: "",
				members: [],
				created: 0,
				last_active: 0,
				deleted: false,
			});
		} else if (!$chat._id) {
			let _chat = $chats.find(_chat => _chat._id === $params.chatid);
			if (_chat) {
				chat.set(_chat);
			} else {
				clm.meowerRequest({
					cmd: "direct",
					val: {
						cmd: "get_chat_data",
						val: $params.chatid,
					},
				}).then(data => $chat = data.payload).catch(code => {
					if ($chat._id) {
						if (code === "E:103 | ID not found") {
							modals.showModal(BasicModal, {
								title: "Chat not found",
								desc: `The chat you requested (${$params.chatid}) doesn't exist or you don't have access to it.`
							});
						} else {
							modals.showModal(BasicModal, {
								title: "Failed to get chat",
								desc: `Unexpected ${code} error while getting requested chat (${$params.chatid})!`
							});
						}
					}

					if (!hasPermission(permissions.VIEW_CHATS)) $goto("/chats");
				});
			}
		}
	}

	onMount(() => {
		if ($params.chatid === "livechat") {
			clm.link.send({
				cmd: "direct",
				val: {
					cmd: "set_chat_state",
					val: {
						state: 1,
						chatid: "livechat",
					},
				},
			});
		}
	});

	onDestroy(() => {
		if ($chat._id === "livechat") {
			clm.link.send({
				cmd: "direct",
				val: {
					cmd: "set_chat_state",
					val: {
						state: 0,
						chatid: "livechat",
					},
				},
			});
		}

		chat.set({
			_id: "",
			type: 0,
			nickname: "",
			owner: "",
			members: [],
			created: 0,
			last_active: 0,
			deleted: false,
		});
	});
</script>

<!--
	so {cmd: direct, val: {cmd: add_to_chat, val: {chatid: "", username: ""}}}?
	also  remove_from_chat
-->

<div class="groupchat">
	<div id="chat" class:active={!showMembers}>
		{#if $chat.type === 0}
			<Container>
				<h1 class="chat-name">
					{$chat.nickname}
					<span class="chat-id">(<code>{$params.chatid}</code>)</span>
				</h1>
				{#if hasPermission(permissions.VIEW_CHATS)}
					{#if !$chat.members.includes($user.name) && $chat._id !== "livechat"}
						<p style="margin-bottom: 0; color: crimson;"><b>You are not a member of this chat! Please only view other people's chats for the purpose of moderation/administration. Viewing chats for any other reason will result in you losing admin permissions.</b></p>
					{/if}
					{#if $chat.deleted}
						<p style="margin-bottom: 0; color: crimson;"><b>This chat is currently soft-deleted! No one can access it other than admins while it's soft-deleted. To reinstate it, open the chat mod panel and click 'Reinstate chat'.</b></p>
					{/if}
				{/if}
				{#if $chat._id !== "livechat"}
					<div class="settings-controls">
						{#if $user.permissions && $chat._id !== "livechat"}
							<button
								class="circle admin"
								on:click={() => modals.showModal(ModerateChatModal)}
							/>
						{/if}
						{#if $chat.owner === $user.name || hasPermission(permissions.EDIT_CHATS)}
							<button
								class="circle settings"
								on:click={() => {
									if ($userSuspended) {
										modals.showModal(AccountBannedModal);
									} else {
										modals.showModal(ChangeChatNicknameModal);
									}
								}}
							/>
						{/if}
						<button
							class="circle members"
							on:click={() => (showMembers = !showMembers)}
						/>
					</div>
				{/if}
			</Container>
		{:else if $chat.type === 1}
			<ProfileView
				username={$chat.members.filter(username => username !== ($params.user ? $params.user : $user.name))[0]}
				small={true}
				canClick={true}
			/>
		{/if}
		<PostList
			fetchUrl={$params.chatid === "livechat"
				? null
				: `posts/${$params.chatid}`}
			postOrigin={$params.chatid}
			chatName={$chat.nickname}
			canPost={$chat._id === "livechat" ||
				$chat.members.includes($user.name) && !$chat.deleted}
		/>
	</div>
	{#if showMembers && $chat._id !== "livechat" && $chat.type === 0}
		<div id="members">
			<div id="members-inner">
				{#each $chat.members as chatmember}
					<button
						class="member-button"
						on:click={() => {
							modals.showModal(GCMemberModal);
							profileClicked_GC.set(chatmember);
						}}
					>
						<Member
							member={chatmember}
							owner={chatmember === $chat.owner}
						/>
					</button>
				{/each}
			</div>
			<div class="top">
				<h2 class="members-title">
					Members <span class="small">({$chat.members.length})</span>
				</h2>
				<div class="settings-controls">
					{#if $chat.members.includes($user.name) || hasPermission(permissions.EDIT_CHATS)}
						<button
							class="circle plus"
							on:click={() => {
								if ($userRestricted || $userSuspended) {
									modals.showModal(AccountBannedModal);
								} else {
									modals.showModal(AddMemberModeModal);
								}
							}}
						/>
					{/if}
					{#if $mobile && $chat._id !== "livechat"}
						<button
							class="circle join"
							on:click={() => {
								showMembers = !showMembers;
							}}
						/>
					{/if}
				</div>
			</div>
		</div>
	{/if}
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
	:global(#main.layout-mobile) #chat:not(.active) {
		display: none;
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
		border-radius: 5px;
		box-sizing: border-box;

		position: sticky;
		top: 0;

		flex-shrink: 0;
		flex-grow: 0;
	}
	:global(#main.layout-mobile) #members {
		width: 100%;
	}
	#members-inner {
		position: relative;

		overflow-y: auto;
		overflow-x: hidden;
		overscroll-behavior: none;

		height: calc(100% - 2.25em);
		margin-top: 2.25em;
	}

	.top {
		position: absolute;
		top: 0;
		width: 100%;
	}

	.chat-name {
		margin: 0;
	}
	.chat-id {
		font-weight: normal;
		color: #7f7f7f;
		font-size: 1rem;
	}

	.settings-controls {
		position: absolute;
		top: 0.25em;
		right: 0.25em;
		display: flex;
		gap: 0.25em;
	}
	.members-title {
		margin: 0.25em;
	}

	.small {
		font-size: 75%;
	}
</style>
