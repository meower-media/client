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
	import changelog from "../assets/changelog.svg";
	import info from "../assets/info.svg";

	import {fade} from "svelte/transition";
	import {goto} from "@roxi/routify";
	import UserProfile from "./modals/UserProfile.svelte";

	let popupShown = false;
	let popupDebounce = false;
</script>

<svelte:body on:click={() => (popupShown = false)} />

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click|stopPropagation class="sidebar" in:fade={{duration: 800}}>
	{#if $OOBERunning}
		<div class="locked" />
	{/if}
	<button on:click={() => $goto("/home")} title="Home" class="home-btn">
		<img src={home} alt="Home" draggable={false} />
	</button>
	<div class="padding" />
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
		<img src={mail} alt="Inbox Messages" draggable={false} />
		<span class="label">Inbox</span>
	</button>
	<button
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
	>
		<img src={gc} alt="Group chats" draggable={false} />
	</button>
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
		<span class="label">Search</span>
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
			<span class="label">Debug Panel</span>
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
			<span class="label">Moderator Panel</span>
		</button>
	{/if}
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

<style>
	button {
		position: relative;
		/* Hack to center icons */
	}

	.label {
		text-align: center;
		height: 100%;
		flex-grow: 1;
		line-height: 1.5em;
	}

	.home-btn {
		background: none !important;
		width: 3em !important;
		border-radius: 100%;
		transition: 0.1s;
	}

	.home-btn > img {
		width: 80% !important;
		height: 80% !important;
		left: 50%;
		top: 50%;
		position: relative;
		transform: translate(-50%,-50%);
	}

	.home-btn:hover {
		background-color: #252525 !important;
		transition: 0.1s;
	}

	.home-btn:active {
		background-color: #151515 !important;
		transition: 0.1s;
	}

	.sidebar {
		transition: 0.15s;

		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		flex-wrap: nowrap;

		gap: 0.5em;
		padding-block-start: 0.5em;
		padding-block-end: 0.5em;
		box-sizing: border-box;

		user-select: none;

		width: 100%;
		height: 100%;
	}
	.sidebar > button {
		width: 13em;
		height: 2.8em;

		display: flex;
		flex-direction: row;

		margin: 0;
		flex-shrink: 1;

		padding: 0.5em;
		background-color: #1D1D1D;
		border: none;
	}
	.sidebar > button > img {
		width: 20%;
		height: 90%;
		object-fit: contain;
	}

	.locked {
		height: 100%;
		width: 100%;
		z-index: 10;
		position: absolute;
		background-color: var(--background);
		opacity: 0.33;
	}

	.home-btn {
		
	}

	.padding {
		flex-grow: 1;
		display: none;
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

	:global(main:not(.layout-old)) .padding,
	:global(main.layout-mobile) .padding {
		display: block;
	}
</style>
