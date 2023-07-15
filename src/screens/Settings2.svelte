<!--
	Home but it's a group chat.

	Wait, no, this is meant to be settings... it's still work in progress, this will be cleaned up eventually
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
	import ProfileView from "../lib/ProfileView.svelte";

	import Changelog from "../screens/Changelog.svelte";

	import ProfileIcon from "../assets/profile.svg";
	import KeyIcon from "../assets/key.svg";
	import PaintbrushIccon from "../assets/paintbrush.svg";
	import LockIcon from "../assets/lock.svg";
	import SmartphoneIcon from "../assets/smartphone.svg";
	import GavelIcon from "../assets/gavel.svg";
	import FingerprintIcon from "../assets/fingerprint.svg";
	import BotIcon from "../assets/bot.svg";
	import ChangelogIcon from "../assets/changelog.svg";
	import LogoutIcon from "../assets/logout.svg";

	let showMembers = !$mobile;
	let selectedTab = "profile";
</script>

<!--
	so {cmd: direct, val: {cmd: add_to_chat, val: {chatid: "", username: ""}}}?
	also  remove_from_chat
-->

<div class="groupchat">
    <div id="members">
        <div id="members-inner">
			<button
				class="member-button {selectedTab === 'profile' ? 'selected' : ''}"
				on:click={() => {selectedTab = "profile"}}
			><img src="{ProfileIcon}" alt="" />Profile</button>
			<button
				class="member-button {selectedTab === 'appearance' ? 'selected' : ''}"
				on:click={() => {selectedTab = "appearance"}}
			><img src="{PaintbrushIccon}" alt="" />Appearance</button>
			<hr style="width: 90%;" />
			<button
				class="member-button {selectedTab === 'security' ? 'selected' : ''}"
				on:click={() => {selectedTab = "security"}}
			><img src="{LockIcon}" alt="" />Security & Privacy</button>
			<button
				class="member-button {selectedTab === 'sessions' ? 'selected' : ''}"
				on:click={() => {selectedTab = "sessions"}}
			><img src="{SmartphoneIcon}" alt="" />Sessions</button>
			<button
				class="member-button {selectedTab === 'authorized' ? 'selected' : ''}"
				on:click={() => {selectedTab = "authorized"}}
			><img src="{KeyIcon}" alt="" />Authorized Apps</button>
			<hr style="width: 90%;" />
			<button
				class="member-button {selectedTab === 'moderation' ? 'selected' : ''}"
				on:click={() => {selectedTab = "moderation"}}
			><img src="{GavelIcon}" alt="" />Reports & Strikes</button>
			<hr style="width: 90%;" />
			<button
				class="member-button {selectedTab === 'developer' ? 'selected' : ''}"
				on:click={() => {selectedTab = "developer"}}
			><img src="{FingerprintIcon}" alt="" />OAuth2 Apps</button>
			<button
				class="member-button {selectedTab === 'developer' ? 'selected' : ''}"
				on:click={() => {selectedTab = "developer"}}
			><img src="{BotIcon}" alt="" />Bots</button>
			<hr style="width: 90%;" />
			<button
				class="member-button {selectedTab === 'changelog' ? 'selected' : ''}"
				on:click={() => {selectedTab = "changelog"}}
			><img src="{ChangelogIcon}" alt="" />Changelog</button>
			<button
				class="member-button"
				on:click={() => {}}
			><img src="{LogoutIcon}" alt="" />Logout</button>
        </div>
        <div class="top">
			<h2 class="members-title">
				Settings
			</h2>
			<div class="settings-controls">
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
	<div id="chat" class:active={!showMembers}>
		{#if selectedTab === "changelog"}
		<Changelog />
		{:else if selectedTab === "profile"}
		<ProfileView username={"tnix"} />
		{:else if selectedTab === "security"}
		<Container>
			<div class="settings-controls">
				<button
					class="circle settings"
					on:click={() => {
						$modalPage = "changePassword";
						$modalShown = true;
					}}
				/>
			</div>
	
			<h2>Change Password</h2>
			Change your account password.
		</Container>

		<Container>
			<h2>Multi-factor Authentication</h2>
			<Container>
				<div class="settings-controls">
					<button
						class="circle close"
						on:click={() => {
							$modalPage = "changePassword";
							$modalShown = true;
						}}
					/>
				</div>
		
				<h2>My Phone</h2>
				<i>Authenticator app</i>
			</Container>
		</Container>
		

		<Container>
			<div class="settings-controls">
				<button
					class="circle settings"
					on:click={() => {
						$modalPage = "changePassword";
						$modalShown = true;
					}}
				/>
			</div>

			<h2>Export data</h2>
			Export all data associated with your account.
		</Container>
		<Container>
			<div class="settings-controls">
				<button
					class="circle settings"
					on:click={() => {
						$modalPage = "changePassword";
						$modalShown = true;
					}}
				/>
			</div>
	
			<h2>Delete account</h2>
			Delete your account and all of its data.
		</Container>
		{:else if selectedTab === "appearance"}
		<Container>
			<div class="settings-controls">
				<button
					class="circle settings"
					on:click={() => {
						const _user = $user;
						_user.layout = _user.layout === "new" ? "old" : "new";
						user.set(_user);
		
						clm.updateProfile();
					}}
				/>
			</div>
		
			<h2>Layout</h2>
			The layout is currently set to {$user.layout}.
		</Container>
		<Container>
			<div class="settings-controls">
				<button
					class="circle settings"
					on:click={() => {
						Modals.showModal("switchTheme");
					}}
				/>
			</div>
		
			<h2>Theme</h2>
			The theme is currently set to {$user.theme} ({$user.mode ? "light" : "dark"}).
		</Container>
		<Container>
			<div class="settings-controls">
				<input
					type="checkbox"
					checked={$user.sfx}
					on:change={() => {
						const _user = $user;
						_user.sfx = !_user.sfx;
						user.set(_user);
		
						clm.updateProfile();
					}}
				/>
			</div>
		
			<h2>Sound Effects</h2>
			Sound effects (for new messages) are currently {!$user.sfx
				? "disabled"
				: "enabled"}.
		</Container>
		<Container>
			<div class="settings-controls">
				{#if $user.bgm}
					<button
						class="circle settings"
						on:click={() => {
							Modals.showModal("switchBGM");
						}}
					/>
				{/if}
				<input
					type="checkbox"
					checked={$user.bgm}
					on:change={() => {
						const _user = $user;
						_user.bgm = !_user.bgm;
						user.set(_user);
						BGM.playBGM(_user.bgm_song);
		
						clm.updateProfile();
					}}
				/>
			</div>
		
			<h2>Background Music</h2>
			Background music is currently {!$user.bgm ? "disabled" : "enabled"}.
			{#if $user.bgm}
				Click the cog button to change the song.
			{/if}
		</Container>
		{/if}
	</div>
</div>

<style>
	.member-button {
		width: 100%;

		background-color: transparent;
		color: var(--foreground);
		border: none;

		position: relative;
		text-align: left;

		cursor: pointer;

		display: flex;
		align-items: center;
		gap: 6px;
		flex-grow: 1;
		min-width: 0;

		margin: 0;

		margin-bottom: 4px;
	}

	.selected {
		background-color: var(--orange);
		cursor: default;
	}

	.member-button img {
		margin-right: 7px;
		height: auto;
		width: 20px;
		overflow: hidden;
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
