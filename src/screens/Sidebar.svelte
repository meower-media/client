<!-- RIP -->
<script>
	import {
		mainPage as page,
		user,
		profileClicked,
		chatid,
		modalShown,
		modalPage,
	} from "../lib/stores.js";
	import {shiftHeld} from "../lib/keyDetect.js";

	import * as clm from "../lib/clmanager.js";

	import {tick} from "svelte";
	import {fade} from "svelte/transition";

	import logo from "../assets/logo.svg";
	import home from "../assets/home.svg";
	import gc from "../assets/chat.svg";
	import mail from "../assets/mail.svg";
	import profile from "../assets/profile.svg";
	import settings from "../assets/settings.svg";
	import logout from "../assets/logout.svg";
	import search from "../assets/search.svg";
	import changelog from "../assets/changelog.svg";

	/**
	 * @param {any} newPage Goes to a page while also refreshing it.
	 */
	function goto(newPage, resetScroll = true) {
		if (
			!$user.name &&
			newPage !== "home" &&
			newPage !== "settings" &&
			newPage !== "changelog" &&
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

<div class="sidebar" in:fade={{duration: 800}}>
	<div class="logo">
		<button class="logo-inner" on:click={() => goto("home")}>
			<img
				alt="Meower"
				src={logo}
				draggable={false}
				height="100%"
				width="auto"
			/>
		</button>
	</div>
	<button on:click={() => goto("home")} class="home-btn round">
		<img src={home} alt="Home" draggable={false} />
	</button>
	<button
		on:click={() => goto("inbox")}
		class="inbox-btn round"
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
		class="gc-btn round"
	>
		<img src={gc} alt="Group Chats" draggable={false} />
	</button>
	<button on:click={() => goto("search")} class="search-btn round">
		<img
			src={search}
			alt="search"
			width="90%"
			height="auto"
			draggable={false}
		/>
	</button>
	<button on:click={() => goto("changelog")} class="changelog-btn round">
		<img
			src={changelog}
			alt="changelog"
			width="90%"
			height="auto"
			draggable={false}
		/>
	</button>
	<button
		on:click={() => {
			$profileClicked = $user.name;
			goto("profile");
		}}
		class="profile-btn round"
	>
		<img src={profile} alt="Profile" draggable={false} />
	</button>
	<button on:click={() => goto("settings")} class="settings-btn round">
		<img src={settings} alt="Settings" draggable={false} />
	</button>
	<button
		on:click={() => {
			modalPage.set("logout");
			modalShown.set(true);
		}}
		class="logout-btn round"
	>
		<img src={logout} alt="Log out" draggable={false} />
	</button>
</div>

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

	.logo {
		display: none;
		flex-grow: 1;
		height: 100%;
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

	:global(main.layout-old) .sidebar {
		flex-direction: row;
		padding-right: 0.5em;
	}
	:global(main.layout-old:not(.layout-mobile)) .logo {
		display: block;
	}
	:global(main.layout-old:not(.layout-mobile)) .home-btn {
		display: none;
	}

	:global(main.layout-mobile) .sidebar {
		padding: 0;
		gap: 0.25em;
	}

	.round {
		overflow: hidden;
	}

	@media screen and (prefers-reduced-motion: no-preference) {
		.round > img {
			transition: transform 0.6s cubic-bezier(0.33, 1, 0.68, 1);
		}

		.home-btn:hover > img {
			transform: rotateY(180deg) rotateX(360deg) scale(1.1);
		}
		.inbox-btn:hover > img {
			transform: perspective(2em) rotateX(360deg) scale(1.1);
		}
		.gc-btn:hover > img {
			transform: skewY(175deg) scale(1.1);
		}
		.search-btn:hover > img {
			transform: rotate(360deg)  scale(1.1);
		}
		.changelog-btn:hover > img {
			transform: perspective(2em) rotateY(180deg) scale(1.1);
		}
		.settings-btn:hover > img {
			transform: rotate(360deg) scale(1.1);
		}
		.profile-btn:hover > img {
			transform: rotate(360deg) scale(1.1);
		}
		.logout-btn:hover > img {
			transform: perspective(2em) rotateY(380deg) scale(1.1);
		}
	}

</style>
