<!-- Boring orange screen with login and signup. -->
<script>
	import ServerSelectorModal from "./modals/ServerSelector.svelte";
	import LoginModal from "./modals/Login.svelte";
	import SignupModal from "./modals/Signup.svelte";
	import StartupErrorModal from "./modals/StartupError.svelte";

	import {screen, setupPage as page, user, authHeader, modalStack, showMeowerDown} from "./stores.js";
	import unloadedProfile from "./unloadedprofile.js";
	import * as clm from "./clmanager.js";
	import * as modals from "./modals.js";
	const link = clm.link;
	// @ts-ignore
	window.clm = clm;

	import meowerLogo from "../assets/logo.svg";
	import meowy from "../assets/meowy.svg";

	import {tick, onMount, onDestroy} from "svelte";
	import {fade} from "svelte/transition";
	import sleep from "./sleep.js";
	import version from "./version.js";
	import * as BGM from "./BGM.js";

	import {isActive} from "@roxi/routify";

	let logo,
		setup,
		logoImg,
		serverSelectorTimeout,
		loginStatus = "";

	async function connect() {
		await clm.disconnect();
		showMeowerDown.set(false)
		clm.connect();

		await new Promise(resolve => link.once("connected", resolve));
	}

	function cancelServerSelector() {
		if (serverSelectorTimeout) {
			clearTimeout(serverSelectorTimeout);
		}
	}

	let requireLogin = false;
	$: requireLogin =
		$isActive("./inbox") || $isActive("./chats", {}, {strict: false});

	onMount(() => {
		page.subscribe(async value => {
			if (!setup) return;

			if (value === "logo") {
				try {
					loginStatus = ""
					setup.classList.remove("setup");

					await tick();
					if (!logoImg) return;

					await connect();
					setup.classList.remove("setupnobg");
					setup.classList.add("setup");
					logoImg.classList.remove("logo-img-color");
					await sleep(50);

					document.getElementById("meower-logo").remove()
					if (
						localStorage.getItem("meower_savedusername") &&
						localStorage.getItem("meower_savedpassword")
					) {
						authHeader.set({
							username: localStorage.getItem("meower_savedusername"),
							token: localStorage.getItem("meower_savedpassword"),
						});

						await clm.login()

						if ($user.name) {
							loginStatus = "";
							BGM.playBGM($user.bgm_song);
							screen.set("main");
						} else {
							await sleep(100);
							await mainSetup();
						}
					} else {
						await sleep(100);
						await mainSetup();
					}
				} catch (error) {
					document.getElementById("meower-logo").remove()
					modals.showModal(StartupErrorModal, {error: error})
				}
			} else if (value === "reconnect") {
				if (document.getElementById("meower-logo")) { document.getElementById("meower-logo").remove() }
				setup.classList.remove("setupnobg");
				setup.classList.add("setup");
				loginStatus = "";
				await connect();
				await sleep(100);
				page.set("welcome");
			}
		});

		window.addEventListener("mouseup", cancelServerSelector);
	});

	onDestroy(() => {
		window.removeEventListener("mouseup", cancelServerSelector);
	});

	/**
	 * Goes to main setup screen.
	 */
	async function mainSetup() {
		localStorage.removeItem("meower_savedusername");
		localStorage.removeItem("meower_savedpassword");
		user.set(unloadedProfile());
		loginStatus = "";
		page.set("blank");
		await sleep(300);
		if (requireLogin || $isActive("./index")) {
			page.set("welcome");
		} else {
			page.set("blank");
			screen.set("main");
		}
	}

	function handle_modal(_, modal = LoginModal) {
		modals.showModal(modal);

		modalStack.subscribe(val => {
			if (val.length === 0 && $authHeader.token) {
				loginStatus = "";
				BGM.playBGM($user.bgm_song);
				screen.set("main");
			}
		})
	}

	function signup_modal(_) {
		handle_modal(_, SignupModal);
	}
</script>

<div bind:this={setup} in:fade={{duration: 250}} out:fade={{duration: 250}} class="setup setupnobg">
	{#if $page === "logo"}
		<div out:fade={{duration: 300}}>
			<img
				bind:this={logoImg}
				alt="Meower"
				src={meowerLogo}
				class="logo-img logo-img-color presvl-fullcenter"
			/>
		</div>
	{:else if $page === "reconnect"}
		<div class="fullcenter">Reconnecting...</div>
	{:else if $page === "welcome"}
		<div class="fullcenter">
			<div class="column-ui">
				<div>
					<img
						alt="Meower"
						src={meowerLogo}
						class="logo-img"
						height="70"
					/>
					<br /><br />
				</div>
				<button
					on:click={handle_modal}
					on:mousedown={() => {
						serverSelectorTimeout = setTimeout(() => {
							modals.showModal(ServerSelectorModal);
						}, 1000);
					}}>Log in</button
				>
				<br />
				<button on:click={signup_modal}
					>Create an account</button
				> <br />
				{#if !requireLogin}
					<button
						on:click={() => {
							loginStatus = "";
							page.set("blank");
							screen.set("main");
						}}>Skip</button
					>
					<p class="small">
						(Several features will be unavailable while not logged
						in.)
					</p>
				{:else}
					<p class="small">
						(You need to be logged in for this page.)
					</p>
				{/if}
				<div>
					<p class="small">Meower Svelte v{version}</p>
					<img src={meowy} alt="" height="64" />
				</div>
			</div>
		</div>
	{:else if $page === "blank"}
		<div />
	{:else}
		<div class="fullcenter">
			<div class="column-ui">
				Somehow, you got to a page that doesn't exist...
				<br />
				(Current page: {$page})

				<div class="buttons">
					<button on:click={() => page.set("logo")}>Go back!</button>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.setup {
		background-color: var(--orange);
		color: var(--foreground-orange);
		font-size: 150%;
		transition: 0.25s;

		text-align: center;

		position: absolute;
		top: 0;
		left: 0;
		z-index: 1000;

		width: 100%;
		min-height: 100vh;
		height: 100%;

		display: table;
	}
	.setupnobg {
		background-color: #0A0A0A;
		color: #FFFFFF;
		font-size: 150%;

		text-align: center;

		position: absolute;
		top: 0;
		left: 0;
		z-index: 1000;

		width: 100%;
		min-height: 100vh;
		height: 100%;

		display: table;
	}
	.fullcenter {
		width: 100%;
		height: 100%;
		box-sizing: border-box;

		margin: auto;
		overflow: auto;

		display: table-cell;
		vertical-align: middle;
		padding: 0.5em;
	}
	.presvl-fullcenter {
		width: 40vh;
		height: 40vh;
		box-sizing: border-box;
		position: absolute; 
		z-index: -2;

		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);

		margin: auto;
		overflow: auto;

		display: table-cell;
		vertical-align: middle;
		padding: 0.5em;
	}

	.logo-img {
		transition: height 0.3s cubic-bezier(0, 1, 1, 1);
		user-select: none;
	}
	.setup:not(.white) .logo-img {
		filter: brightness(0) invert(1);
	}


	.logo-img-color {
		filter: brightness(10) !important;
	}

	.small {
		font-size: 75%;
	}

	.column-ui {
		width: 24em;
		max-width: calc(100vw - 2em);
		min-height: 8em;

		position: relative;

		margin: auto;
	}
	.column-ui > * {
		width: 100%;
	}
	.column-ui .buttons {
		display: flex;
		width: 24em;
		max-width: 100%;

		margin-top: 2em;
	}
	.column-ui .buttons * {
		flex-grow: 1;
		flex-shrink: 1;
		padding-left: 0;
		padding-right: 0;
	}

	button {
		margin-bottom: 0.2cm;
	}

	.buttons {
		display: grid;
		grid-auto-flow: column;
		grid-column-gap: 8px;
	}
</style>
