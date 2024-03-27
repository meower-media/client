<!-- Meower Svelte, the app itself. -->
<script>
	import Setup from "../lib/Setup.svelte";
	import Modal from "../lib/Modal.svelte";
	import OOBE from "../lib/OOBE/Main.svelte";
	import Sidebar from "../lib/Sidebar.svelte";
	import Spinner from "../lib/Spinner.svelte";
	import MeowerDownModal from "../lib/modals/MeowerDown.svelte";

	import {
		screen,
		modalStack,
		reconnecting,
		OOBERunning,
		user,
		spinner,
		useCustomTheme,
		customTheme,
		showMeowerDown,
	} from "../lib/stores.js";
	import {mobile, touch} from "../lib/responsiveness.js";
	import * as BGM from "../lib/BGM.js";
	import {hasExperiment} from "../lib/bitField.js";

	import {afterPageLoad, params} from "@roxi/routify";
	import {tick} from "svelte";
	import ChatsList from "../lib/ChatsList.svelte";

	let currentPage = "";
	let currentParams = JSON.stringify($params);
	let remounting = false;
	$afterPageLoad(async page => {
		if (remounting) return;

		if (page.title === currentPage) {
			if (currentParams !== JSON.stringify($params)) {
				currentPage = page.title;
				currentParams = JSON.stringify($params);

				remounting = true;
				await tick();
				remounting = false;
			}
		} else {
			currentPage = page.title;
			currentParams = JSON.stringify($params);
		}
	});
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
		<br>
		<button
			on:click = {() => {screen.set("main")}}
		>Me</button>
	{:else if $screen === "setup"}
		<Setup />
	{:else}
		<div class="main-screen">
			<div class="transition" />
			<div class="sidebar">
				<Sidebar />
			</div>
			<div class="views">
				<div class="view">
					<div class="wrapper">
						{#if hasExperiment(1)}
							<p>Hello world!</p>
						{/if}
						{#if $OOBERunning}
							<OOBE />
						{:else if !remounting}
							<slot />
						{/if}
					</div>
				</div>
				<div class="chats">
					<ChatsList />
				</div>
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

		--orange-button: var(--orange);

		--pfp-bg: white;
		--pfp-outline: #d9d9d9;

		--orange: #e48b26;
		--orange-light: #f9a535;
		--orange-dark: #ac5b18;
		--orange-scrollbar-back: rgb(131, 45, 5);
		--background: #181818;
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
		flex-direction: column-reverse;
	}

	.chats {
		width: 30vw;
		background-color: #000000;
		height: 100%;
	}

	.transition {
		background-color: #1D1D1D;
		height: 100%;
		width: 100%;
		position: absolute;
		animation-fill-mode: forwards;
		animation-timing-function: ease;
		transition: 0.5s;
		z-index: 2;
	}

	.wrapper {
		position: relative;
		width: 90%;
		left: 50%;
		transition: 0.15s;
		transform: translate(-50%,0);
	}

	.views {
		display: flex;
		overflow: hidden;
		height: 100%;
	}

	:global(main.layout-mobile) .wrapper {
		width: 100%;
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
	}

	.view {
		flex-grow: 1;
		flex-shrink: 1;

		padding: 0.33em;
		box-sizing: border-box;
		overflow: auto;

		display: flex;
		flex-direction: row;

		width: 70vw;

		--view-height: calc(100vh - 0.66em);

		background-color: var(--background);
	}

	.banner {
		background-color: crimson;
		margin: 0;
		padding: 0.5em;
		text-align: center;
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
