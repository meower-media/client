<!-- RIP -->
<script>
	import {
		mainPage as page,
		user,
		profileClicked,
		chatid,
		modalShown,
		modalPage,
		modPanelOpen,
		sidebarLocked
	} from "../lib/stores.js";
	import {shiftHeld} from "../lib/keyDetect.js";

	import * as clm from "../lib/clmanager.js";
	import PFP from "../lib/PFP.svelte";

	import {tick} from "svelte";

	import logo from "../assets/logo.svg";
	import home from "../assets/home.svg";
	import gc from "../assets/chat.svg";
	import mail from "../assets/mail.svg";
	import profile from "../assets/profile.svg";
	import settings from "../assets/settings.svg";
	import logout from "../assets/logout.svg";
	import search from "../assets/search.svg";
	import changelog from "../assets/changelog.svg";
	import shield from "../assets/shield.svg";

	let popupShown = false;
	let popupDebounce = false;

	/**
	 * @param {any} newPage Goes to a page while also refreshing it.
	 */
	function goto(newPage, resetScroll = true) {
		popupShown = false;
		if (
			!$user.name &&
			newPage !== "home" &&
			newPage !== "settings" &&
			newPage !== "changelog" &&
			newPage !== "about" &&
			newPage !== "search"
		) {
			modalPage.set("signup");
			modalShown.set(true);
			return;
		}
		if (resetScroll) {
			window.scrollTo(0, 0);
		}
		if ($page === "groupchat") {
			clm.meowerRequest({
				cmd: "direct",
				val: {
					cmd: "set_chat_state",
					val: {
						state: 0,
						chatid: $chatid,
					},
				},
			});
		}
		chatid.set("");
		page.set("blank");
		tick().then(() => page.set(newPage));
	}
</script>

<!-- Wait, isn't it a topbar on old layout? -->

<svelte:body on:click={() => (popupShown = false)} />

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click|stopPropagation class="sidebar" in:fade={{duration: 800}}>
	{#if $sidebarLocked}
		<div class="locked"></div>
	{/if}
	<div class="logo">
		<button class="logo-inner"  style="border: none;" title="Home" on:click={() => goto("home")}>
			<img
				alt="Meower"
				src={logo}
				draggable={false}
				height="100%"
				width="auto"
			/>
		</button>
	</div>
	<button on:click={() => goto("home")} title="Home">
		<img src={home} alt="Home" draggable={false} />
	</button>
	<button
		on:click={() => goto("inbox")}
		title="The Inbox"
		class:new-msgs={$user.unread_inbox}
	>
		<img src={mail} alt="Inbox Messages" draggable={false} />
	</button>
	<button
		on:click={() => {
			if (shiftHeld) {
				goto("groupcat");
			} else {
				goto("chatlist");
			}
		}}
		title="Group Chats"
	>
		<img src={gc} alt="Group chats" draggable={false} />
	</button>
	<button on:click={() => goto("search")} title="Search">
		<img
			src={search}
			alt="Search"
			width="90%"
			height="auto"
			draggable={false}
		/>
	</button>
	{#if $user.lvl >= 1}
		<button
			on:click={() => ($modPanelOpen = !$modPanelOpen)}
			title="Moderator Panel"
		>
			<img
				src={shield}
				alt="Open/close moderator panel"
				height="auto"
				draggable={false}
			/>
		</button>
	{/if}
	<div class="padding" />
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
			size={1}
			alt="Open/close more options"
			icon={$user.name ? $user.pfp_data : -3}
		/>
	</button>
</div>
{#if popupShown}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		on:click|stopPropagation
		class="popup"
	>
		<button
			on:click={() => {
				$profileClicked = $user.name;
				goto("profile");
			}}
			title = "Profile"
		>
			<img src={profile} alt="Profile" draggable={false} />
			<span class="label">Profile</span>
		</button>
		<button on:click={() => goto("settings")}>
			<img src={settings} alt="Settings" draggable={false} />
			<span class="label">Settings</span>
		</button>
		<!-- still WIP
			<button on:click={() => goto("about")} class="about-btn round">
				<img src={info} alt="About" draggable={false} />
				<span class="label">About</span>
			</button>
		-->
		<button on:click={() => goto("changelog")} class="changelog-btn round">
			<img
				src={changelog}
				alt="changelog"
				height="auto"
				draggable={false}
			/>
			<span class="label">Changelog</span>
		</button>
		<button
			on:click={() => {
				popupShown = true;
				modalPage.set("logout");
				modalShown.set(true);
			}}
			class="logout-btn round"
		>
			<img src={logout} alt="Log out" draggable={false} />
			<span class="label">Log out</span>
		</button>
	</div>
{/if}

<style>
	button {
		position: relative;
		/* Hack to center icons */
		line-height: 0;
	}

	.sidebar {
		background-color: var(--orange);

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
		width: 2.8em;
		height: 2.8em;
		min-width: 0;
		min-height: 0;

		margin: 0;
		flex-shrink: 1;

		padding: 0.5em;
	}
	.sidebar > button > img {
		width: 90%;
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

	.logo {
		display: none;
		flex-grow: 1;
		height: 100%;
	}
	.padding {
		flex-grow: 1;
		display: none;
	}
	.logo img {
		box-sizing: border-box;
		padding: 0.75em;
		filter: brightness(0) invert(1);
	}
	.logo-inner {
		display: inline-block;
		height: 100%;
		background: none;
		border: none;
		padding: 0;
		margin: 0;
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

	:global(main.input-hover) .logo-inner:hover,
	:global(main.input-touch) .logo-inner:active {
		background-color: var(--orange-dark);
	}

	:global(main:not(.layout-old)) .padding,
	:global(main.layout-mobile) .padding {
		display: block;
	}

	:global(main.layout-old) .sidebar {
		flex-direction: row;
		padding: 0;
		padding-inline-end: 0.5em;
	}
	:global(main.layout-old:not(.layout-mobile)) .logo {
		display: block;
	}
	:global(main.layout-old:not(.layout-mobile)) .home-btn {
		display: none;
	}

	:global(main.layout-mobile) .sidebar {
		padding-inline-start: 0.5em;
		padding-inline-end: 0.5em;
		gap: 0.25em;
	}
	:global(main.layout-mobile:not(.layout-old)) .sidebar {
		padding: 0;
		padding-block-start: 0.5em;
		padding-block-end: 0.5em;
		gap: 0.25em;
	}

	button.toggle-popup {
		padding: 0.1em;
		background-color: var(--pfp-bg) !important;
		border: solid 1.5px;
		overflow: hidden;
	}

	:global(main.input-hover) button.toggle-popup:hover:not(:active),
	:global(main.input-touch) button.toggle-popup:active,
	button.toggle-popup:focus-visible {
		transform: scale(1.1);
	}

	.popup {
		background: var(--orange);
		padding: 0.5em;
		padding-top: 0.25em;
		border-radius: 0 0 0 0.5em;

		position: absolute;
		right: 0;
		z-index: 99;

		display: inline-flex;
		flex-direction: column;
		align-items: stretch;
		gap: 0.4em;
	}
	:global(main:not(.layout-old)) .popup {
		right: unset;
		left: 100%;
		bottom: 0;

		border-radius: 0 0.5em 0 0;
		padding-top: 0.5em;
		padding-left: 0.25em;
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
		border-radius: 10px;
		border: 2px solid var(--orange-dark);
	}
	.popup > button > img {
		width: 1.5em;
		height: 1.5em;
		object-fit: contain;
	}

	.sidebar button {
		border-color: var(--orange-dark);
		border-radius: 10px;
		outline: none;
		box-shadow: none;
		border: 2px solid var(--orange-dark);
	}
</style>
