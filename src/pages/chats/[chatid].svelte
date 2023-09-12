<!--
	Home but it's a group chat.
-->
<script>
	import {
		authHeader,
		user,
		userRestricted,
		userSuspended,
		chat,
		profileClicked_GC,
	} from "../../lib/stores.js";
	import {permissions, hasPermission} from "../../lib/adminPermissions.js";
	import * as modals from "../../lib/modals.js";
	import {mobile} from "../../lib/responsiveness.js";
	import Member from "../../lib/Member.svelte";
	import Container from "../../lib/Container.svelte";
	import * as clm from "../../lib/clmanager.js";
	import PostList from "../../lib/PostList.svelte";
	import {apiUrl} from "../../lib/urls.js";

	import {params, goto} from "@roxi/routify";
	import {onMount, onDestroy} from "svelte/internal";

	let showMembers = !$mobile;

	$: {
		if ($chat.deleted && !hasPermission(permissions.VIEW_CHATS))
			$goto("/chats");
	}

	onMount(async () => {
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

		if (!$chat._id) {
			if ($params.chatid === "livechat") {
				chat.set({
					_id: "livechat",
					nickname: "Livechat",
					owner: "",
					members: [],
					created: 0,
					last_active: 0,
					deleted: false,
				});
			} else {
				try {
					const resp = await fetch(
						`${apiUrl}chats/${$params.chatid}`,
						{
							headers: $authHeader,
						}
					);
					if (resp.ok) {
						$chat = await resp.json();
					} else {
						if (resp.status === 404) {
							modals.showModal(
								"basic",
								"Chat not found",
								`The chat you requested (${$params.chatid}) doesn't exist or you don't have access to it.`
							);
							$goto("/chats");
						} else {
							throw new Error(
								"Response code is not OK; code is " +
									resp.status
							);
						}
					}
				} catch (e) {
					modals.showModal(
						"basic",
						"Failed Getting Chat",
						`Unexpected ${e} error getting chat data!`
					);
					$goto("/chats");
				}
			}
		}

		clm.link.on("direct", cmd => {
			if (cmd.val.mode === "delete" && cmd.val.id === $chat._id) {
				if ($chat.members.includes($user.name)) {
					$goto("/chats");
				}
			}
		});

		clm.link.on("direct", cmd => {
			if (
				cmd.val.mode === "update_chat" &&
				cmd.val.payload._id === $chat._id
			) {
				chat.set(cmd.val.payload);
			}
		});
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
		<Container>
			<h1 class="chat-name">
				{$chat.nickname}
				<span class="chat-id">(<code>{$params.chatid}</code>)</span>
				{#if $chat.deleted}
					<br /><span class="chat-id" style="color: crimson;"
						><b>This chat is currently deleted!</b></span
					>
				{/if}
			</h1>
			{#if $params.chatid !== "livechat"}
				<div class="settings-controls">
					{#if $user.permissions && $chat._id !== "livechat"}
						<button
							class="circle admin"
							on:click={() => modals.showModal("moderateChat")}
						/>
					{/if}
					<button
						class="circle members"
						on:click={() => (showMembers = !showMembers)}
					/>
				</div>
			{/if}
		</Container>
		<PostList
			fetchUrl={$params.chatid === "livechat"
				? null
				: `posts/${$params.chatid}`}
			postOrigin={$params.chatid}
			chatName={$chat.nickname}
			canPost={$chat._id === "livechat" ||
				$chat.members.includes($user.name)}
		/>
	</div>
	{#if showMembers && $chat._id !== "livechat"}
		<div id="members">
			<div id="members-inner">
				{#each $chat.members as chatmember}
					<button
						class="member-button"
						on:click={() => {
							modals.showModal("gcMember");
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
					{#if $chat.members.includes($user.name)}
						<button
							class="circle plus"
							on:click={() => {
								if ($userRestricted || $userSuspended) {
									modals.showModal("banned");
								} else {
									modals.showModal("addMemberMode");
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
	}
	.members-title {
		margin: 0.25em;
	}

	.small {
		font-size: 75%;
	}
</style>
