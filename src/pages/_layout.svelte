<!-- Meower Svelte, the app itself. -->
<script>
	import Setup from "../lib/Setup.svelte";
	import Modal from "../lib/Modal.svelte";
	import View from "../lib/View.svelte";
	import Sidebar from "../lib/Sidebar.svelte";
	import Spinner from "../lib/Spinner.svelte";
	import MeowerDownModal from "../lib/modals/MeowerDown.svelte";

	import {
		screen,
		modalStack,
		reconnecting,
		user,
		spinner,
		useCustomTheme,
		customTheme,
		showMeowerDown,
	} from "../lib/stores.js";
	import {mobile, touch} from "../lib/responsiveness.js";
	import * as BGM from "../lib/BGM.js";
</script>

<!-- routify:options bundle=true -->

<main
	id="main"
	style:--orange={$useCustomTheme ? $customTheme.orange : null}
	style:--orange-button={$useCustomTheme ? $customTheme.orange : null}
	style:--orange-light={$useCustomTheme ? $customTheme.orangeLight : null}
	style:--orange-dark={$useCustomTheme ? $customTheme.orangeDark : null}
	style:--background={$useCustomTheme ? $customTheme.background : null}
	style:--foreground={$useCustomTheme ? $customTheme.foreground : null}
	style:--foreground-orange={$useCustomTheme
		? $customTheme.foregroundOrange
		: null}
	class:theme-orange={$user.theme === "orange"}
	class:theme-blue={$user.theme === "blue"}
	class:theme-fire={$user.theme === "fire"}
	class:layout-old={true}
	class:layout-mobile={$mobile}
	class:input-touch={$touch}
	class:input-hover={!$touch}
	on:mousedown={() => BGM.canPlayNow()}
	on:keydown={() => BGM.canPlayNow()}
>
	<!--<div class="banner">
		<span>This is a banner!</span>
	</div>-->

	{#if $showMeowerDown && !$reconnecting}
		<MeowerDownModal />
	{/if}

	{#if $reconnecting}
		<Modal>
			<h2 slot="header">Reconnecting...</h2>
			<div slot="default">
				<p>
					Looks like we're having some problems connecting you to
					Meower. Give us a moment and we'll reconnect you as soon as
					possible...
				</p>
			</div>
		</Modal>
	{:else if $modalStack.length > 0}
		<svelte:component
			this={$modalStack[0].modal}
			modalData={$modalStack[0].data}
		/>
	{/if}

	{#if $screen === "blank"}
		<div id="blank" />
		If your stuck here, click the button below
		<br />
		<button
			on:click={() => {
				screen.set("main");
			}}>Me</button
		>
	{:else if $screen === "setup"}
		<Setup />
	{:else}
		<div class="main-screen">
			<div class="transition" />
			<div class="sidebar">
				<Sidebar />
			</div>
			<View><slot /></View>
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

		--orange-button: var(--orange);

		--pfp-bg: white;
		--pfp-outline: #d9d9d9;

		--orange: #e48b26;
		--orange-light: #f9a535;
		--orange-dark: #ac5b18;
		--orange-scrollbar-back: rgb(131, 45, 5);
		--background: #181818;
		--sidebar-hover: #252525;
		--sidebar-active: #151515;
		--date: #bdbdbd;
		--foreground: #eef;
		--foreground-orange: #eef;

		color: var(--foreground);
		scrollbar-color: var(--orange) var(--orange-scrollbar-back);
		font-size: 14pt;
	}
	#main.theme-blue {
		--orange: #4d97ff;
		--orange-light: rgb(140, 189, 245);
		--orange-dark: #3888f1;
		--orange-scrollbar-back: color-mix(
			in srgb,
			#000000 20%,
			var(--orange-dark)
		);
		--background: #181818;
		--foreground: white;
		--date: #bdbdbd;
		--foreground-orange: white;
		scrollbar-color: unset;
	}

	#main.theme-fire {
		--orange: #181818;
		--orange-light: rgb(255, 255, 255);
		--orange-dark: #ff00ea;
		--orange-scrollbar-back: color-mix(
			in srgb,
			#000000 20%,
			var(--orange-dark)
		);
		--background: #f50505;
		--foreground: white;
		--date: #bdbdbd;
		--foreground-orange: white;
		scrollbar-color: unset;
	}

	.main-screen {
		box-sizing: border-box;

		display: flex;
		flex-direction: column;
		gap: 0;

		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background-color: var(--background);
	}

	:global(main.layout-mobile) .main-screen {
		flex-direction: column-reverse !important;
	}

	.transition {
		background-color: #1d1d1d;
		height: 100%;
		width: 100%;
		position: absolute;
		animation-fill-mode: forwards;
		animation-timing-function: ease;
		transition: 0.5s;
		z-index: 2;
	}

	:global(main:not(layout-old)) .transition {
		animation-name: transition;
		animation-duration: 0.7s;
	}

	@keyframes transition {
		from {
			height: 100%;
			opacity: 1;
		}
		80% {
			opacity: 1;
		}
		to {
			height: 4em;
			opacity: 0;
		}
	}

	.sidebar {
		width: 14em;
		height: auto;

		z-index: 100;
		position: relative;

		flex-shrink: 0;
		flex-grow: 0;
		z-index: 3;
		border-bottom: 1px solid #0e0e0e;
	}

	:global(main.layout-old) .main-screen {
		flex-direction: column;
	}
	:global(main.layout-old) .sidebar {
		width: auto;
		height: 3.5em;
	}

	/* General scrollbar styling - works across most browsers */
	* {
		scrollbar-width: thin; /* Make scrollbars thinner */
		scrollbar-color: #454545 #202020; /* Dark thumb on slightly lighter track */
	}

	/* WebKit-specific styling for more granular control */
	::-webkit-scrollbar {
		width: 8px; /* Adjust width as needed */
	}

	::-webkit-scrollbar-track {
		background: #202020;
	}

	::-webkit-scrollbar-thumb {
		background-color: #454545;
		border-radius: 4px; /* Optional: Rounded scrollbar thumb */
	}
</style>
