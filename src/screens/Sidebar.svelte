<!-- Wait, isn't it a topbar on old layout? -->
<!-- RIP -->

<script>
	import {
		mainPage as page,
		setupPage,
		screen,
		user,
	} from "../lib/stores.js";
	
	import {tick} from "svelte";

	import logo from "../assets/logo.svg";
	import home from "../assets/home.svg";
	import profile from "../assets/profile.svg";
	import settings from "../assets/settings.svg";
	import logout from "../assets/logout.svg";
	import groupcat from "../assets/meowy.svg";

	import Button from "../lib/ui/form/Button.svelte";

	/**
	* @param {any} newPage Goes to a page while also refreshing it.
	*/
	function goto(newPage) {
		page.set("blank");
		tick().then(() => page.set(newPage));
	}
</script>

<div class="sidebar">
	<div class="logo">
		<Button style="none" on:click={()=>goto("home")}>
			<img
				alt="Meower"
				src={logo}
				draggable={false}
				height="100%"
				width="auto"
			/>
		</Button>
	</div>
	<span class="home-btn">
		<Button style="round" on:click={()=>goto("home")}>
			<img
				src={home}
				alt="Home"
				width="90%"
				height="auto"
				draggable={false}
			/>
		</Button>
	</span>
	{#if $user.name}
		<Button style="round" on:click={()=>goto("profile")}>
			<img
				src={profile}
				alt="Profile"
				width="90%"
				height="auto"
				draggable={false}
			/>
		</Button>
		<Button style="round" on:click={()=>goto("settings")}>
			<img
				src={settings}
				alt="Settings"
				width="90%"
				height="auto"
				draggable={false}
			/>
		</Button>
		<Button style="round" on:click={()=>goto("groupchat")}>
			<img
				src={groupcat}
				alt="Group cat"
				width="90%"
				height="auto"
				draggable={false}
			/>
		</Button>
	{/if}
	<Button style="round" on:click={async () => {
		screen.set("setup");
		await tick();
		setupPage.set("reconnect");
	}}>
		<img
			src={logout}
			alt="Log out"
			width="90%"
			height="auto"
			draggable={false}
		/>
	</Button>
</div>

<style>
	.sidebar :global(button) {
		/* Hack to center icons */
		line-height: 0;

		margin-bottom: 0.5em;
		width: 2.8em;
		height: 2.8em;
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
	.logo > :global(button) {
		display: inline-block;
		height: 100%;

		border: none;
		background: none;
		appearance: none;
		line-height: auto;
	}
	.logo > :global(button):hover {
		background-color: var(--orange-dark);
	}


	:global(main.layout-old) .sidebar {
		flex-direction: row;
	}
	:global(main.layout-old) .sidebar > :global(button) {
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
		.sidebar > :global(button) {
			margin-bottom: 0;
			margin-right: 0.5em;
		}
	}
</style>
