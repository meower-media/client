<!-- Brand new settings experience! -->
<script>
	// @ts-nocheck
	
		import {mobile} from "../lib/responsiveness.js";
		import {user} from "../lib/stores.js";
		import Container from "../lib/Container.svelte";
		import * as clm from "../lib/clmanager.js"
		import * as modals from "../lib/modals.js"

		import BasicModal from "../lib/modals/Basic.svelte";
		import SwitchThemeModal from "../lib/modals/settings/SwitchTheme.svelte";
		import SwitchBGMSFXModal from "../lib/modals/settings/SwitchBGMSFX.svelte";
		import ChangePasswordModal from "../lib/modals/settings/ChangePassword.svelte";
		import LogoutEverywhereModal from "../lib/modals/settings/LogoutEverywhere.svelte";
		import DeleteAccountModal from "../lib/modals/settings/DeleteAccount.svelte";
	
		import {
			User,
			Paintbrush,
			Lock,
			Smartphone,
			KeyRound,
			Gavel,
			Fingerprint,
			Bot,
			Info,
			LogOut,
		} from "lucide-svelte";
	
		import Profile from "../lib/settings/Profile.svelte";
		import Theme from "../lib/settings/Theme.svelte";
		import Security from "../lib/settings/Security.svelte";
		import Changelog from "./about.svelte";
	
		let showTabs = !$mobile;
		let hoveringTab = "";
		let selectedTab = $user.name ? "profile" : "appearance";
	</script>
	
	<div class="settings-mobile">
		<Container>
			<h1>Settings</h1>
			You can change your settings here. These will save to your account, so they will
			carry over into other clients.
		</Container>
		<Container>
			<div class="settings-controls">
				<button
					class="circle settings"
					on:click={() =>
						clm.updateProfile({
							layout: $user.layout === "new" ? "old" : "new",
						})}
				/>
			</div>
		
			<h2>Layout</h2>
			The layout is currently set to {$user.layout}.
		</Container>
		<Container>
			<div class="settings-controls">
				<button
					class="circle settings"
					on:click={() => modals.showModal(SwitchThemeModal)}
				/>
			</div>
		
			<h2>Theme</h2>
			{#if !$user.theme.startsWith("custom:")}
				The theme is currently set to {$user.theme} ({$user.mode
					? "light"
					: "dark"}).
			{:else}
				You are currently using a custom theme! How cool is that!
			{/if}
		</Container>
		<Container>
			<div class="settings-controls">
				<input
					type="checkbox"
					bind:checked={$user.sfx}
					on:change={() => clm.updateProfile({sfx: $user.sfx})}
				/>
			</div>
		
			<h2>Sound Effects</h2>
			Sound effects (for new messages) are currently {!$user.sfx
				? "disabled"
				: "enabled"}.
		</Container>
		<Container>
			<div class="settings-controls">
				<input
					type="checkbox"
					bind:checked={$user.embeds_enabled}
					on:change={() =>
						clm.updateProfile({embeds_enabled: $user.embeds_enabled})}
				/>
			</div>
		
			<h2>YouTube embeds</h2>
			Displaying YouTube embeds from URLs is currently {!$user.embeds_enabled
				? "disabled"
				: "enabled"}.
		</Container>
		<Container>
			<div class="settings-controls">
				{#if $user.bgm}
					<button
						class="circle settings"
						on:click={() => modals.showModal(SwitchBGMSFXModal)}
					/>
				{/if}
				<input
					type="checkbox"
					bind:checked={$user.bgm}
					on:change={() => clm.updateProfile({bgm: $user.bgm})}
				/>
			</div>
		
			<h2>Background Music</h2>
			Background music is currently {!$user.bgm ? "disabled" : "enabled"}.
			{#if $user.bgm}
				Click the cog button to change the song.
			{/if}
		</Container>
		{#if $user.name}
			<Container>
				<div class="settings-controls">
					<input
						type="checkbox"
						bind:checked={$user.hide_blocked_users}
						on:change={() => {
							if ($user.hide_blocked_users) {
								modals.showModal(BasicModal, {
									title: "Hide Blocked Users",
									desc: "This setting can have undesirable consequences! We usually try to show 25 posts per page, but pages that include posts made by people you have blocked will have fewer posts. It may also make it harder to keep up with conversations without the context of posts made by people you have blocked.",
								});
							}
							clm.updateProfile({
								hide_blocked_users: $user.hide_blocked_users,
							});
						}}
					/>
				</div>
		
				<h2>Hide Blocked Users</h2>
				You {$user.hide_blocked_users ? "are" : "are not"} currently hiding posts
				from people you have blocked.
			</Container>
			<Container>
				<div class="settings-controls">
					<button
						class="circle settings"
						on:click={() => modals.showModal(ChangePasswordModal)}
					/>
				</div>
		
				<h2>Change Password</h2>
				Change your account password.
			</Container>
			<Container>
				<div class="settings-controls">
					<button
						class="circle settings"
						on:click={() => modals.showModal(LogoutEverywhereModal)}
					/>
				</div>
		
				<h2>Logout Everywhere</h2>
				Revoke all logged in sessions.
			</Container>
			<Container>
				<div class="settings-controls">
					<button
						class="circle settings"
						on:click={() => modals.showModal(DeleteAccountModal)}
					/>
				</div>
		
				<h2>Delete Account</h2>
				Permanently delete your Meower account.
				<b class="important">THIS CANNOT BE UNDONE!</b>
			</Container>
		{/if}
	</div>
	
	<div class="settings-desktop">
		<div id="tabs">
			<div id="tabs-inner">
				{#if $user.name}
				<button
					class="tab-button {selectedTab == 'profile' ? 'selected' : ''}"
					style={hoveringTab == "profile" ? "color: #fff;" : ""}
					on:click={() => {
						selectedTab = "profile";
					}}
					on:mouseenter={() => {
						hoveringTab = "profile";
					}}
					on:mouseleave={() => {
						hoveringTab = "";
					}}
					><User
						color={!$user.mode ||
						selectedTab == "profile" ||
						hoveringTab == "profile"
							? "#fff"
							: "#000"}
						strokeWidth="2.5"
					/>Profile</button
				>
				{/if}
				<button
					class="tab-button {selectedTab == 'appearance'
						? 'selected'
						: ''}"
					style={hoveringTab == "appearance" ? "color: #fff;" : ""}
					on:click={() => {
						selectedTab = "appearance";
					}}
					on:mouseenter={() => {
						hoveringTab = "appearance";
					}}
					on:mouseleave={() => {
						hoveringTab = "";
					}}
					><Paintbrush
						color={!$user.mode ||
						selectedTab == "appearance" ||
						hoveringTab == "appearance"
							? "#fff"
							: "#000"}
						strokeWidth="2.5"
					/>Appearance</button
				>
	
				{#if $user.name}
				<hr style="width: 90%;" />
	
				<button
					class="tab-button {selectedTab == 'security' ? 'selected' : ''}"
					style={hoveringTab == "security" ? "color: #fff;" : ""}
					on:click={() => {
						selectedTab = "security";
					}}
					on:mouseenter={() => {
						hoveringTab = "security";
					}}
					on:mouseleave={() => {
						hoveringTab = "";
					}}
					><Lock
						color={!$user.mode ||
						selectedTab == "security" ||
						hoveringTab == "security"
							? "#fff"
							: "#000"}
						strokeWidth="2.5"
					/>Security & Privacy</button
				>
				<!-- 
				<button
					class="tab-button {selectedTab == 'sessions' ? 'selected' : ''}"
					style={hoveringTab == "sessions" ? "color: #fff;" : ""}
					on:click={() => {
						selectedTab = "sessions";
					}}
					on:mouseenter={() => {
						hoveringTab = "sessions";
					}}
					on:mouseleave={() => {
						hoveringTab = "";
					}}
					><Smartphone
						color={!$user.mode ||
						selectedTab == "sessions" ||
						hoveringTab == "sessions"
							? "#fff"
							: "#000"}
						strokeWidth="2.5"
					/>Sessions</button
				>
				<button
					class="tab-button {selectedTab == 'authorizedApps'
						? 'selected'
						: ''}"
					style={hoveringTab == "authorizedApps" ? "color: #fff;" : ""}
					on:click={() => {
						selectedTab = "authorizedApps";
					}}
					on:mouseenter={() => {
						hoveringTab = "authorizedApps";
					}}
					on:mouseleave={() => {
						hoveringTab = "";
					}}
					><KeyRound
						color={!$user.mode ||
						selectedTab == "authorizedApps" ||
						hoveringTab == "authorizedApps"
							? "#fff"
							: "#000"}
						strokeWidth="2.5"
					/>Authorized Apps</button
				>
	
				<hr style="width: 88%;" />
	
				<button
					class="tab-button {selectedTab == 'moderation'
						? 'selected'
						: ''}"
					style={hoveringTab == "moderation" ? "color: #fff;" : ""}
					on:click={() => {
						selectedTab = "moderation";
					}}
					on:mouseenter={() => {
						hoveringTab = "moderation";
					}}
					on:mouseleave={() => {
						hoveringTab = "";
					}}
					><Gavel
						color={!$user.mode ||
						selectedTab == "moderation" ||
						hoveringTab == "moderation"
							? "#fff"
							: "#000"}
						strokeWidth="2.5"
					/>Reports & Strikes</button
				>
	
				<hr style="width: 88%;" />
	
				<button
					class="tab-button {selectedTab == 'oauth2Apps'
						? 'selected'
						: ''}"
					style={hoveringTab == "oauth2Apps" ? "color: #fff;" : ""}
					on:click={() => {
						selectedTab = "oauth2Apps";
					}}
					on:mouseenter={() => {
						hoveringTab = "oauth2Apps";
					}}
					on:mouseleave={() => {
						hoveringTab = "";
					}}
					><Fingerprint
						color={!$user.mode ||
						selectedTab == "oauth2Apps" ||
						hoveringTab == "oauth2Apps"
							? "#fff"
							: "#000"}
						strokeWidth="2.5"
					/>OAuth2 Apps</button
				>
				<button
					class="tab-button {selectedTab == 'bots' ? 'selected' : ''}"
					style={hoveringTab == "bots" ? "color: #fff;" : ""}
					on:click={() => {
						selectedTab = "bots";
					}}
					on:mouseenter={() => {
						hoveringTab = "bots";
					}}
					on:mouseleave={() => {
						hoveringTab = "";
					}}
					><Bot
						color={!$user.mode ||
						selectedTab == "bots" ||
						hoveringTab == "bots"
							? "#fff"
							: "#000"}
						strokeWidth="2.5"
					/>Bots</button
				> -->
				{/if}
	
				<hr style="width: 88%;" />
	
				<button
					class="tab-button {selectedTab == 'changelog'
						? 'selected'
						: ''}"
					style={hoveringTab == "changelog" ? "color: #fff;" : ""}
					on:click={() => {
						selectedTab = "changelog";
					}}
					on:mouseenter={() => {
						hoveringTab = "changelog";
					}}
					on:mouseleave={() => {
						hoveringTab = "";
					}}
					><Info
						color={!$user.mode ||
						selectedTab == "changelog" ||
						hoveringTab == "changelog"
							? "#fff"
							: "#000"}
						strokeWidth="2.5"
					/>About</button
				>
				<!-- <button
					class="tab-button"
					style={hoveringTab == "logout" ? "color: #fff;" : ""}
					on:click={() => {
						$modalPage = "logout";
						$modalShown = true;
					}}
					on:mouseenter={() => {
						hoveringTab = "logout";
					}}
					on:mouseleave={() => {
						hoveringTab = "";
					}}
					><LogOut
						color={!$user.mode || hoveringTab == "logout"
							? "#fff"
							: "#000"}
						strokeWidth="2.5"
					/>Logout</button
				> -->
			</div>
			<div class="top">
				<h2 class="tabs-title">Settings</h2>
			</div>
		</div>
		<div id="chat" class:active={!showTabs}>
			{#if selectedTab == "profile"}
				<Profile />
			{:else if selectedTab == "appearance"}
				<Theme />
			{:else if selectedTab == "security"}
				<Security />
			{:else if selectedTab == "changelog"}
				<Changelog />
			{/if}
		</div>
	</div>
	
	<style>
		@media only screen and (min-width: 771px) {
			.settings-mobile {display: none}
		}
		@media only screen and (max-width: 770px) {
			.settings-desktop {display: none !important}
		}
		.settings-desktop {
			height: 100vh;
		}
		.tab-button {
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
			color: var(--foreground-orange);
		}
	
		/* repetition because of CSS specificity */
		:global(main.input-hover) .tab-button.tab-button:hover,
		.tab-button.tab-button:focus-visible {
			background-color: #7773;
		}
		:global(#main) .tab-button.tab-button:active {
			background-color: #7776;
		}
		/* :global(#main.layout-mobile) #chat:not(.active) {
			display: none;
		} */
	
		.settings-desktop {
			display: flex;
			flex-wrap: nowrap;
			flex-direction: row;
			gap: 0.4em;
		}
		#chat {
			flex-shrink: 1;
			flex-grow: 1;
			overflow: auto;
		}
		#tabs {
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
		:global(#main.layout-mobile) #tabs {
			width: 100%;
		}
		#tabs-inner {
			position: relative;
	
			overflow-y: auto;
			overflow-x: hidden;
			overscroll-behavior: none;
	
			height: calc(100% - 2.25em);
			margin-top: 2.25em;
	
			padding-inline: 5px;
		}
	
		.top {
			position: absolute;
			top: 0;
			width: 100%;
		}
	
		.tabs-title {
			margin: 0.25em;
		}
	</style>