<!-- Wait, isn't it a topbar on old layout? -->

<script>
	import {
		mainPage as page,
		setupPage,
		screen,
		user,
	} from "../lib/stores.js";
	import unloadedProfile from "../lib/unloadedprofile.js";

	import {tick} from "svelte";

	import logo from "../assets/logo.svg";
	import home from "../assets/home.svg";
	import profile from "../assets/profile.svg";
	import settings from "../assets/settings.svg";
	import logout from "../assets/logout.svg";

	/**
	* @param {any} newPage Goes to a page while also refreshing it.
	*/
	function goto(newPage) {
		page.set("blank");
		tick().then(() => page.set(newPage));
	}
</script>

<div class="sidebar">
	<div class="logo" on:click={()=>goto("home")}>
		<span class="logo-inner">
			<img
				alt="Meower"
				src={logo}
				draggable={false}
				height="100%"
				width="auto"
			/>
		</span>
	</div>
	<button on:click={()=>goto("home")} class="home-btn round">
		<img
			src={home}
			alt="Home"
			width="90%"
			height="auto"
			draggable={false}
		/>
	</button>
	{#if $user.name}
		<button on:click={()=>goto("profile")} class="profile-btn round">
			<img
				src={profile}
				alt="Profile"
				width="90%"
				height="auto"
				draggable={false}
			/>
		</button>
		<button on:click={()=>goto("settings")} class="settings-btn round">
			<img
				src={settings}
				alt="Settings"
				width="90%"
				height="auto"
				draggable={false}
			/>
		</button>
	{/if}
	<button on:click={async () => {
		screen.set("setup");
		await tick();
		setupPage.set("reconnect");

		user.set(unloadedProfile());
	}} class="logout-btn round">
		<img
			src={logout}
			alt="Log out"
			width="90%"
			height="auto"
			draggable={false}
		/>
	</button>
</div>

<style>
	button {
		/* Hack to center icons */
		line-height: 0;
	}

	.sidebar {
		background-color: var(--orange);
		
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		user-select: none;

		width: 100%;
		height: 100%;
	}
	.sidebar > button {
		margin-bottom: 0.5em;
		width: 2.8em;
		height: 2.8em;
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
	}
	.logo-inner:hover {
		background-color: var(--orange-dark);
	}


	:global(main.layout-old) .sidebar {
		flex-direction: row;
	}
	:global(main.layout-old) .sidebar > button {
		margin-bottom: 0;
		margin-right: 0.5em;
	}
	:global(main.layout-old) .logo {
		display: block;
	}
	:global(main.layout-old) .home-btn {
		display: none;
	}

	@media only screen and (max-aspect-ratio: 1/1) {
		.sidebar {
			flex-direction: row;
		}
		.sidebar > button {
			margin-bottom: 0;
			margin-right: 0.5em;
		}
	}
</style>