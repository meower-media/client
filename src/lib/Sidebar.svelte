<!-- RIP -->
<script>
	import PFP from "./PFP.svelte";

	import SignupModal from "./modals/Signup.svelte";
	import DebugModal from "./modals/Debug.svelte";
	import ModPanelModal from "./modals/moderation/ModPanel.svelte";
	import LogoutModal from "./modals/Logout.svelte";

	import {user, OOBERunning} from "../lib/stores.js";
	import {shiftHeld} from "./keyDetect.js";
	import * as modals from "./modals.js";

	import logo from "../assets/logo.svg";
	import home from "../assets/home.svg";

	import mail from "../assets/mail.svg";
	import gc from "../assets/chat.svg";
	import search from "../assets/search.svg";
	import terminal from "../assets/terminal.svg";
	import shield from "../assets/shield.svg";
	import profile from "../assets/profile.svg";
	import settings from "../assets/settings.svg";
	import logout from "../assets/logout.svg";
	import menu from "../assets/menu.svg";
	import changelog from "../assets/changelog.svg";
	import info from "../assets/info.svg";

	import {fade} from "svelte/transition";
	import {goto, page} from "@roxi/routify";
	import UserProfile from "./modals/UserProfile.svelte";

	let currentpage = $page.parent.title || $page.title

	let popupShown = false;
	let popupDebounce = false;
</script>

<svelte:body on:click={() => (popupShown = false)} />

<!-- Merge debug, profile, settings and logout into a popup menu with the user's profile picture as the icon -->

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click|stopPropagation class="sidebar" in:fade={{duration: 800}}>
	{#if $OOBERunning}
		<div class="locked" />
	{/if}
	<button on:click={() => $goto("/home")} title="Home" class="home-btn">
		<img src={home} alt="Home" draggable={false} />
		<!--<p class="label">Home</p>-->
	</button>
	<button
		on:click={() => {
			if (!$user.name) {
				modals.showModal(SignupModal);
				return;
			}
			$goto("/inbox");
		}}
		class="round"
		title="Inbox"
		class:new-msgs={$user.unread_inbox}
	>
		<img src={mail} style="margin-bottom: 0.3em;" alt="Inbox Messages" draggable={false} />
	</button>
	<!--<button
		on:click={() => {
			if (shiftHeld) {
				$goto("/groupcat");
			} else {
				if (!$user.name) {
					modals.showModal(SignupModal);
					return;
				}
				$goto("/chats");
			}
		}}
		title="Group Chats"
		class="gc-btn round"
	></button>-->
	<button
		on:click={() => $goto("/search")}
		title="Search"
		class="search-btn round"
	>
		<img
			src={search}
			alt="Search"
			width="90%"
			height="auto"
			draggable={false}
		/>
	</button>
	<button
		class="toggle-popup round"
		on:click={() => {
			if (popupDebounce) return;
			popupShown = !popupShown;
			popupDebounce = true;
			setTimeout(() => (popupDebounce = false), 150);
		}}
	>
		<PFP
			raw={true}
			size={1.5}
			alt="Open/close more options"
			userdata = {$user}
		/>
		{#if popupShown}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div on:click|stopPropagation class="popup">
				<button
					on:click={() => {
						if (!$user.name) {
							modals.showModal(SignupModal);
							return;
						}
						modals.showModal(UserProfile, {username: $user.name, gc: false})
						popupShown = false;
					}}
					class="profile-btn round"
					title="Profile"
				>
					<img src={profile} alt="Profile" draggable={false} />
					<span class="label">Profile</span>
				</button>
				<button
					on:click={() => {
						$goto("/settings");
						popupShown = false;
					}}
					class="settings-btn round"
				>
					<img src={settings} alt="Settings" draggable={false} />
					<span class="label">Settings</span>
				</button>
				{#if $user.debug}
					<button
						on:click={() => modals.showModal(DebugModal)}
						class="debugpanel-btn round"
						title="Debug Panel"
					>
						<img
							src={terminal}
							alt="Open debug panel"
							height="auto"
							draggable={false}
						/>
						<span class="label">Debug</span>
					</button>
				{/if}
				{#if $user.permissions}
					<button
						on:click={() => modals.showModal(ModPanelModal)}
						class="modpanel-btn round"
						title="Moderator Panel"
					>
						<img
							src={shield}
							alt="Open moderator panel"
							height="auto"
							draggable={false}
						/>
						<span class="label">Mod Panel</span>
					</button>
				{/if}
				<button
					on:click={() => {
						popupShown = true;
						modals.showModal(LogoutModal);
					}}
					class="logout-btn round"
				>
					<img src={logout} alt="Log out" draggable={false} />
					<span class="label">Log out</span>
				</button>
			</div>
		{/if}
	</button>
</div>


<style>
	button {
		position: relative;
		/* Hack to center icons */
	}

	.sidebar > button:hover {
		background-color: var(--sidebar-hover);
		transition: 0.1s;
	}

	.sidebar > button:active {
		background-color: var(--sidebar-active);
		transition: 0.075s;
	}

	.sidebar {
		transition: 0.15s;

		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		flex-wrap: nowrap;

		margin: 0;

		-webkit-box-sizing: border-box;

		gap: 0.5em;
		padding-block-start: 0.5em;
		padding-block-end: 0.5em;
		box-sizing: border-box;

		user-select: none;

		width: 100vw;
		height: 100%;
		background-color: var(--sidebar);
	}

	.sidebar > button {
		background-color: var(--sidebar-bg) !important;
		border: 2px solid var(--foreground) !important;
		height: 3em;

		width: 3em;
		border-radius: 15%;
		transition: 0.1s;

		display: flex;
		flex-direction: row;

		margin: 0;
		flex-shrink: 1;

		padding: 0.5em;
		background: none;
		border: none;
	}
	.sidebar > button > img {
		object-fit: contain;
		width: 80%;
		height: 80%;
		left: 50%;
		top: 50%;
		-webkit-transform: translate(-50%,-50%); /* will this work, probably not */
		position: relative;
		transform: translate(-50%,-50%);
	}

	.sidebar > button > p {
		margin: 0;
		margin-top: 0.5em;
		font-size: 80%;
		left: 50%;
		transform: translate(-50%,0);
		text-align: left;
		position: relative;
	}

	.locked {
		height: 100%;
		width: 100%;
		z-index: 10;
		position: absolute;
		background-color: var(--background);
		opacity: 0.33;
	}

	.sidebar {
		flex-direction: row;
		padding: 0;
		padding-inline-start: 0.5em;
		padding-inline-end: 0.5em;
		border-bottom: 2px;
		border-color: #fff;
	}

	.new-msgs::after {
		content: "";
		display: inline-block;

		width: 0.5em;
		height: 0.5em;
		border-radius: 50%;

		position: absolute;
		right: 0.5em;
		top: 0.5em;

		background: var(--foreground-orange);
	}

	button.toggle-popup {
		padding: 0;
		background: none !important;
		border: none !important;
	}

	:global(main.input-hover) button.toggle-popup:hover:not(:active),
	:global(main.input-touch) button.toggle-popup:active,
	button.toggle-popup:focus-visible {
		transform: scale(1.1);
		background: none !important;
	}

	button.toggle-popup:hover > .popup {
		transform: scale(0.9) translate(-5%, -5%);
		transition: 0.1s;
	}

	.popup {
		transition: 0.1s;
		background: #1D1D1D;
		padding: 0.5em;
		padding-top: 0.25em;
		border-radius: 0 0 0 0.5em;

		position: absolute;
		top: 100%;
		z-index: 1;

		display: inline-flex;
		flex-direction: column;
		align-items: stretch;
		gap: 0.4em;
	}

	.popup > button {
		text-align: left;
		line-height: normal;

		padding: 0.3em 0.5em;
		margin: 0;
		box-sizing: border-box;

		display: inline-flex;
		align-items: center;
		gap: 0.5em;
		border: none;
		background-color: #1D1D1D;
		color: #fff;

	}
	.popup > button > img {
		width: 1.5em;
		height: 1.5em;
		object-fit: contain;
	}

</style>
