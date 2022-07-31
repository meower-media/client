<!-- Meower Svelte, the app itself. -->

<script>
	import Main from "./screens/Main.svelte";
	import Setup from "./screens/Setup.svelte";
	import Spinner from "./lib/Spinner.svelte";
	import {apiUrl} from "./lib/urls.js";
	import {link} from "./lib/clmanager.js";

	import {
		screen, setupPage,
		disconnected, disconnectReason,
		user, spinner,
		useCustomTheme, customTheme,
	} from "./lib/stores.js";

	import {tick} from "svelte";
	screen.set("setup");
	setupPage.set("start");
</script>

<main
	id="main"
	class:theme-orange={$user.theme==="orange"}
	class:theme-blue={$user.theme==="blue"}
	class:mode-light={!($user.mode === false)}
	class:mode-dark={$user.mode === false}
	class:layout-old={$user.layout === "old"}

	style:--orange={$user.name && $useCustomTheme ? $customTheme.orange : null}
	style:--orange-button={$user.name && $useCustomTheme ? $customTheme.orangeButton : null}
	style:--orange-light={$user.name && $useCustomTheme ? $customTheme.orangeLight : null}
	style:--orange-dark={$user.name && $useCustomTheme ? $customTheme.orangeDark : null}
	style:--background={$user.name && $useCustomTheme ? $customTheme.background : null}
	style:--foreground={$user.name && $useCustomTheme ? $customTheme.foreground : null}
	style:--foreground-orange={$user.name && $useCustomTheme ? $customTheme.foregroundOrange : null}
>
	{#if $disconnected}
		<div class="disconnected">
			<div class="disconnected-inner">
				<h1>Me-owch.</h1>
				{#if $disconnectReason === ""}
					You have been disconnected.
					Reconnect using the below button:
				{:else if $disconnectReason === "E:119 | IP Blocked"}
					The server has blocked your IP address ({link.ip}).
					<br />
					This might be due to an extension blocking the URL used to get your IP
					<br />
					address ({apiUrl}ip), or the Meower team actually blocking your IP.
					<br />
					Attempt reconnecting using the below button:
				{:else}
					We ran into an error trying to connect to the server.
					<pre><code>{$disconnectReason}</code></pre>
					Reconnect using the below button:
				{/if}
				<br /><br />
				<button 
					on:click={async () => {
						screen.set("setup");
						disconnected.set(false);
						await tick();
						setupPage.set("reconnect");
					}}
				>
					Reconnect!
				</button>
			</div>
		</div>
	{:else}
		{#if $screen === "setup"}
			<Setup />
		{:else}
			<Main />
		{/if}
	{/if}

	{#if $spinner}
		<div class="spinner-container">
			<Spinner />
		</div>
	{/if}
</main>

<style>
	.disconnected {
		background-color: var(--orange);
		color: var(--foreground-orange);

		width: 100%;
		height: 100%;

		position: absolute;
		top: 0;
		left: 0;
		z-index: 1000000;

		display: flex;
		align-items: center;
		justify-content: center;

		text-align: center;
		font-size: 150%;
	}

	.spinner-container {
		position: fixed;
		right: 27px;
		bottom: 25px;
		z-index: 10000;
	}

	#main {
		width: 100%;
		height: 100%;

		font-family: Simvoni, sans-serif;

		--orange: #f9a636;
		--orange-button: var(--orange);
		--orange-light: #ffce8c;
		--orange-dark: #b46d34;
		--background: white;
		--foreground: black;
		--foreground-orange: white;

		--pfp-bg: white;
		--pfp-outline: #d9d9d9;

		background-color: var(--background);
		color: var(--foreground);
		font-size: 15pt;
	}

	#main.theme-orange.mode-dark {
		--orange: #b35305;
		--orange-light: #dd7f14;
		--orange-dark: #ac4718;
		--background: #020010;
		--foreground: #eef;
		--foreground-orange: #eef;
	}
	#main.theme-blue {
		--orange: #4d97ff;
		--orange-light: #79b7ff;
		--orange-dark: #3685eb;
		--background: white;
		--foreground: black;
		--foreground-orange: white;
	}
	#main.theme-blue.mode-dark {
		--background: #202020;
		--foreground: white;
		--foreground-orange: white;
	}
</style>
