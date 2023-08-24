<!-- Meower Svelte, the app itself. -->
<script>
	import Setup from "../lib/Setup.svelte";
	import Modals from "../lib/Modals.svelte";

	import OOBE from "../lib/OOBE/Main.svelte";

	import Sidebar from "../lib/Sidebar.svelte";

	import Spinner from "../lib/Spinner.svelte";
	import {mobile, touch} from "../lib/responsiveness.js";
	import * as BGM from "../lib/BGM.js";

	import {
		screen,
		reconnecting,
		OOBERunning,
		user,
		spinner,
		customTheme,
		useCustomTheme
	} from "../lib/stores.js";
</script>

<!-- routify:options bundle=true -->

<main
	id="main"
	style:--orange={$user.name && $useCustomTheme ? $customTheme.orange : null}
	style:--orange-button={$user.name && $useCustomTheme ? $customTheme.orange : null}
	style:--orange-light={$user.name && $useCustomTheme ? $customTheme.orangeLight : null}
	style:--orange-dark={$user.name && $useCustomTheme ? $customTheme.orangeDark : null}
	style:--background={$user.name && $useCustomTheme ? $customTheme.background : null}
	style:--foreground={$user.name && $useCustomTheme ? $customTheme.foreground : null}
	style:--foreground-orange={$user.name && $useCustomTheme ? $customTheme.foregroundOrange : null}
	class:theme-orange={$user.theme === "orange"}
	class:theme-blue={$user.theme === "blue"}
	class:mode-light={!($user.mode === false)}
	class:mode-dark={$user.mode === false}
	class:layout-old={$user.layout === "old"}
	class:layout-mobile={$mobile}
	class:input-touch={$touch}
	class:input-hover={!$touch}
	on:mousedown={() => BGM.canPlayNow()}
	on:keydown={() => BGM.canPlayNow()}
>
	<Modals />

	{#if $screen === "blank"}
		<div id="blank" />
	{:else if $screen === "setup"}
		<Setup />
	{:else}
		<div class="main-screen">
			<div class="transition" />
			<div class="sidebar">
				<Sidebar />
			</div>
			<div class="view">
				{#if $OOBERunning}
					<OOBE />
				{:else}
					<slot />
				{/if}
			</div>
		</div>
	{/if}

	{#if $spinner || $reconnecting}
		<div class="spinner-container">
			<Spinner />
		</div>
	{/if}
</main>

<style>
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
		--orange-scrollbar-back: #a15d04;
		--background: white;
		--foreground: black;
		--foreground-orange: white;

		--pfp-bg: white;
		--pfp-outline: #d9d9d9;

		background-color: var(--background);
		color: var(--foreground);
		scrollbar-color: var(--orange) var(--orange-scrollbar-back);
		font-size: 15pt;
	}

	#main.theme-orange.mode-dark {
		--orange: #e48b26;
		--orange-light: #f9a535;
		--orange-dark: #ac5b18;
		--orange-scrollbar-back: rgb(131, 45, 5);
		--background: #181818;
		--foreground: #eef;
		--foreground-orange: #eef;
	}
	#main.theme-blue {
		/*--orange: #aa0000;
		--orange-light: #aa0000;
		--orange-dark: #aa0000;
		--orange-scrollbar-back: #aa0000;*/
		--orange: #4d97ff;
		--orange-light: #79b7ff;
		--orange-dark: #3685eb;
		--orange-scrollbar-back: #374eb1;
		--background: white;
		--foreground: black;
		--foreground-orange: white;
		scrollbar-color: unset;
	}
	#main.theme-blue.mode-dark {
		--background: #181818;
		--foreground: white;
		--foreground-orange: white;
	}

	.main-screen {
		box-sizing: border-box;

		display: flex;
		flex-direction: row;
		gap: 0;

		width: 100vw;
		height: 100vh;
		overflow: hidden;
	}

	.transition {
		background-color: var(--orange);
		height: 100%;
		width: 100%;
		position: absolute;
		animation-fill-mode: forwards;
		animation-timing-function: ease;
		z-index: 2;
	}

	:global(main:not(layout-old)) .transition {
		animation-name: transition;
		animation-duration: 0.7s;
	}

	:global(main.layout-old) .transition {
		animation-name: transitionOld;
		animation-duration: 0.6s;
	}

	@keyframes transition {
		from {
			width: 100%;
		}
		to {
			width: 3.5em;
		}
	}

	@keyframes transitionOld {
		from {
			height: 100%;
		}
		to {
			height: 3.5em;
		}
	}

	.sidebar {
		width: 3.5em;
		height: auto;

		z-index: 100;
		position: relative;

		flex-shrink: 0;
		flex-grow: 0;
		z-index: 3;
	}

	.view {
		flex-grow: 1;
		flex-shrink: 1;

		padding: 0.33em;
		box-sizing: border-box;
		overflow: auto;

		--view-height: calc(100vh - 0.66em);

		background-color: var(--background);
	}

	:global(main.layout-old) .main-screen {
		flex-direction: column;
	}
	:global(main.layout-old) .sidebar {
		width: auto;
		height: 3.5em;
	}
	:global(main.layout-old) .view {
		--view-height: calc(100vh - 3.5em - 0.66em);
	}
</style>
