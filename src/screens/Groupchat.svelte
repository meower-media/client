<!--
	Home but it's a group chat.
-->
<script>
	import {
		chatName,
		chatMembers,
		chatid,
		chatOwner,
		modalShown,
		modalPage,
		user,
		profileClicked_GC,
	} from "../lib/stores.js";
	import {mobile} from "../lib/responsiveness.js";
	import Member from "../lib/Member.svelte";
	import Container from "../lib/Container.svelte";
	import * as clm from "../lib/clmanager.js";
	import PostList from "../lib/PostList.svelte";

	let showMembers = !$mobile;
</script>

<!--
	so {cmd: direct, val: {cmd: add_to_chat, val: {chatid: "", username: ""}}}?
	also  remove_from_chat
-->

<div class="groupchat">
	<div id="chat" class:active={!showMembers}>
		<Container>
			<h1 class="chat-name">
				{$chatName}
				<span class="chat-id">(<code>{$chatid}</code>)</span>
			</h1>
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
		<PostList
			fetchUrl={$chatid === "livechat" ? null : `posts/${$chatid}`}
			postOrigin={$chatid}
			chatName={$chatName}
			canPost={true}
			on:loaded={() => {
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
				} else {
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
				}
			}}
		/>
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
						<Member member={chatmember} owner={chatmember === $chatOwner} />
					</button>
				{/each}
			</div>
			<div class="top">
				<h2 class="members-title">
					Members <span class="small">({$chatMembers.length})</span>
				</h2>
				<div class="settings-controls">
					<button
						class="circle plus"
						on:click={() => {
							modalPage.set("addMember");
							modalShown.set(true);
						}}
					/>
					{#if $mobile && $chatid !== "livechat"}
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
		border-radius: 1px;
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
