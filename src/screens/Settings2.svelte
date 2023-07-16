<!-- Brand new settings experience! -->
<script>
	import {mobile} from "../lib/responsiveness.js";
	import {user, modalShown, modalPage} from "../lib/stores.js";

	import {
		User,
		Paintbrush,
		Lock,
		Smartphone,
		KeyRound,
		Gavel,
		Fingerprint,
		Bot,
		Book,
		LogOut,
	} from "lucide-svelte";

	import Profile from "./settings/Profile.svelte";
	import Theme from "./settings/Theme.svelte";
	import Security from "./settings/Security.svelte";
	import Changelog from "./settings/Changelog.svelte";

	let showTabs = !$mobile;
	let hoveringTab = "";
	let selectedTab = "profile";
</script>

<div class="settings">
	<div id="tabs">
		<div id="tabs-inner">
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
			>

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
				><Book
					color={!$user.mode ||
					selectedTab == "changelog" ||
					hoveringTab == "changelog"
						? "#fff"
						: "#000"}
					strokeWidth="2.5"
				/>Changelog</button
			>
			<button
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
			>
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
	:global(#main.layout-mobile) #chat:not(.active) {
		display: none;
	}

	.settings {
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

		padding: 5px;
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
