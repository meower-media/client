<!-- Boring orange screen with login and signup. -->

<script>
	import
		{screen, setupPage as page,
		modalShown, modalPage,
		auth_header,
		user
	} from "../lib/stores.js";
	import * as clm from "../lib/clmanager.js";
	const link = clm.link;
	// @ts-ignore
	window.clm = clm;

	import unloadedProfile from "../lib/unloadedprofile.js";

	import meowerLogo from "../assets/logo.svg";
	import meowy from "../assets/meowy.svg";

	import {tick, onMount} from "svelte";
	import {fade} from 'svelte/transition';
	import sleep from "../lib/sleep.js";

	let logo, setup, logoImg, loginStatus = "";

	async function connect() {
		await clm.disconnect();
		clm.connect();

		await new Promise(resolve => link.once("connected", resolve));
	}

	let rememberMe = false;
	let acceptTerms = false;

	onMount(() => {
		page.subscribe(async value => {
			if (!setup) return;

			setup.classList.remove("white");
			if (value === "logo") {
				clm.disconnect();
				loginStatus = "";

				await tick();
				setup.classList.add("white");
				logoImg.height = 0;
				logo.classList.remove("top");
				
				await sleep(600);
				// Directly changing image height instead
				// of using transforms to prevent blur
				logoImg.height = 80;
				await sleep(300);
				setup.classList.remove("white");
				logoImg.height = 40;
				logo.classList.add("top");

				await sleep(700);
				loginStatus = "Connecting...";
				await connect();

				if (localStorage.getItem("meower_savedusername") && localStorage.getItem("meower_savedpassword")) {
					doLogin(localStorage.getItem("meower_savedusername"), localStorage.getItem("meower_savedpassword"), true);
				} else {
					await mainSetup();
				}
			} else if (value === "reconnect") {
				loginStatus = "";
				await connect();
				await sleep(100);
				page.set("welcome");
			}
		});
	});

	/**
	 * Goes to main setup screen.
	*/
	async function mainSetup() {
		localStorage.clear();
		user.set(unloadedProfile());
		loginStatus = "";
		page.set("blank");
		await sleep(600);
		page.set("welcome");
	}

	/**
	 * Logs in.
	 * 
	 * @param {string} username
	 * @param {string} password
	*/
	function doLogin(username, password, autoLogin = false) {
		try {
			loginStatus = "Logging in...";
			clm.meowerRequest({
				cmd: "direct",
				val: {
					cmd: "authpswd",
					val: {
						username: username,
						pswd: password,
					},
				},
			}).then(async val => {
				try {
					const profileVal = await clm.meowerRequest({
						cmd: "direct",
						val: {
							cmd: "get_profile",
							val: val.payload.username,
						},
					});
					user.update(v => Object.assign(v, {
						...profileVal.payload,
						name: val.payload.username,
					}));
					auth_header.set({username: val.payload.username, token: val.payload.token});

					if (rememberMe || localStorage.getItem("meower_savedusername") === username) {
						localStorage.setItem("meower_savedusername", username);
						localStorage.setItem("meower_savedpassword", val.payload.token);
					}

					screen.set("main");
				} catch(e) {
					localStorage.clear();
					console.error("Unexpected " + e + " error getting user data!");
					link.disconnect(1000, "Failed to load userdata");
				}
			}).catch(code => {
				if (autoLogin) return mainSetup();
				switch (code) {
					case "E:103 | ID not found":
						loginStatus = "Invalid username!";
						break;
					case "I:011 | Invalid Password":
						loginStatus = "Invalid password!";
						break;
					case "E:018 | Account Banned":
						$modalPage = "banned";
						$modalShown = true;
						loginStatus = "";
						break;
					case "E:019 | Illegal characters detected":
						loginStatus = "Usernames must not have spaces or other special characters!";
						break;
					case "E:106 | Too many requests":
						loginStatus = "Too many requests! Please try again later.";
						break;
					default:
						loginStatus = `Unexpected ${code} error!`;
				}
			});
		} catch(e) {
			if (autoLogin) return mainSetup();

			console.error(e);
			loginStatus = "Error logging in: " + e;
		}
	}
</script>

<div bind:this={setup} out:fade={{duration: 500}} class="setup white">
	{#if $page === "logo"}
		<div class="left">
			<h2 class="welcometo">Connecting to</h2>
			<div id="meowerlogo_left">
				<img
					alt="Meower"
					src={meowerLogo}
					height="70"
				/>
			</div>
			<div class="meowy-orang"></div>
			<img
				src={meowy}
				alt=""
				height="64"
				id="meowy_left"
			>
		</div>
		<div out:fade={{duration: 300}} class="fullcenter">
			<div>
				<div class="logo top" bind:this={logo}>
					<img
						bind:this={logoImg}
						alt="Meower"
						src={meowerLogo}
						class="logo-img"
						height="40"
					/>
				</div>
				<div class="connecting">{loginStatus}</div>
			</div>
		</div>
	{:else if $page === "reconnect"}
		<div class="fullcenter">
			Reconnecting...
		</div>
	{:else if $page === "welcome"}
		<div class="left">
			<h2 class="welcometo">Welcome to</h2>
			<div id="meowerlogo_left">
				<img
					alt="Meower"
					src={meowerLogo}
					height="70"
				/>
			</div>
			<div class="meowy-orang"></div>
			<img
				src={meowy}
				alt=""
				height="64"
				id="meowy_left"
			>
		</div>
		<div class="fullcenter">
			<h2 class="selectopt">Please select an option.</h2>
			{#if localStorage.getItem("meower_savedusername")}
				<button on:click={() => {
					loginStatus = "";
					page.set("blank");
					screen.set("main");
				}}>Skip</button>
				<p class="small">(Several features will be unavailable while not logged in.)</p>
				<div>
					<p class="small">
						Meower Svelte v1.5 Dev Build 3
					</p>
					<img
						src={meowy}
						alt=""
						height="64"
					>
				</div>
			{/if}
		</div>
	{:else if $page === "login"}
		<div class="left">
			<h2 class="welcometo">Welcome Back!</h2>
			<div id="meowerlogo_left">
				<img
					alt="Meower"
					src={meowerLogo}
					height="70"
				/>
			</div>
			<div class="meowy-orang"></div>
			<img
				src={meowy}
				alt=""
				height="64"
				id="meowy_left"
			>
		</div>
		<div class="fullcenter">
			<h1 class="login_textre">Log in to Meower</h1>
			
			<form
				on:submit|preventDefault={e => {
					if (!(e.target[0].value && e.target[1].value)) {
						loginStatus = "You must specify a username and a password to login!";
						return false;
					}
					doLogin(
						e.target[0].value,
						e.target[1].value,
					);
					return false;
				}}
			>
				<input type="text" placeholder="Username" maxlength="20"> <br />
				<input type="password" placeholder="Password" maxlength="64">
				<p class="checkboxes">
					<input id="remember-me" type="checkbox" bind:checked={rememberMe}>
					<label for="remember-me">
						Save login
					</label>
				</p>
				<span class="login-status">{loginStatus}</span>
				<button type="button" class="backbuttonlogin" on:click|preventDefault={()=>{
					page.set("welcome");
					loginStatus = "";
					return false;
				}}>Back</button>
				<button type="submit" class="loginbuttonlogin">Log in</button>
			</form>
		</div>
	{:else if $page === "join"}
		<div class="left">
			<h2 class="welcometo">Thanks for choosing</h2>
			<div id="meowerlogo_left">
				<img
					alt="Meower"
					src={meowerLogo}
					height="70"
				/>
			</div>
			<div class="meowy-orang"></div>
			<img
				src={meowy}
				alt=""
				height="64"
				id="meowy_left"
			>
		</div>
		<div class="fullcenter">

			<!--<form class="column-ui"
				on:submit|preventDefault={e => {
					const username = e.target[0].value;
					const password = e.target[1].value;
					if (!(username && password)) {
						loginStatus = "You must specify a username and a password to create an account!";
						return false;
					}

					loginStatus = "Creating account..."

					clm.meowerRequest({
						cmd: "direct",
						val: {
							cmd: "gen_account",
							val: {
								username: username,
								pswd: password,
							},
						},
						listener: "join",
					}).then(async val => {
						if (val.mode === "auth" && val.payload.username === username) {
							loginStatus = "Getting user data...";
							const profileVal = await clm.meowerRequest({
								cmd: "direct",
								val: {
									cmd: "get_profile",
									val: val.payload.username,
								},
							});
							user.update(v => Object.assign(v, {
								...profileVal.payload,
								name: val.payload.username,
							}));
							auth_header.set({username: val.payload.username, token: val.payload.token});

							loginStatus = "";
							
							if (rememberMe) {
								localStorage.setItem("meower_savedusername", username);
								localStorage.setItem("meower_savedpassword", val.payload.token);
							}

							page.set("go");
							await sleep(1000);
							screen.set("main");
						} else {
							loginStatus = "Unexpected error logging in!";
						}
					}).catch(code => {
						switch (code) {
							case "I:015 | Account exists":
								loginStatus = "That username already exists!";
								break;
							case "I:011 | Invalid Password":
								loginStatus = "Invalid password!";
								break;
							case "E:119 | IP Blocked":
								$modalPage = "ipBanned";
								$modalShown = true;
								loginStatus = "";
								break;
							case "E:019 | Illegal characters detected":
								loginStatus = "Usernames must not have spaces or other special characters!";
								break;
							case "E:106 | Too many requests":
								loginStatus = "Too many requests! Please try again later.";
								break;
							default:
								loginStatus = `Unexpected ${code} error!`;
						}
					});
				}}
			>
				<input type="text" placeholder="Username" maxlength="20"> <br />
				<input type="password" placeholder="Password" maxlength="64">
				<p class="checkboxes">
					<input id="remember-me" type="checkbox" bind:checked={rememberMe}>
					<label for="remember-me">
						Save this login
					</label>
					<br />
					<input id="accept-terms" type="checkbox" bind:checked={acceptTerms}>
					<label for="accept-terms">
						I agree to <a
							href="https://meower.org/legal" target="_blank"
						>Meower's Terms of Service and Privacy Policy</a>
					</label>
				</p>
				<span class="login-status">{loginStatus}</span>
				<div class="buttons">
					<button type="button" on:click|preventDefault={()=>{
						page.set("welcome");
						loginStatus = "";
						return false;
					}}>Go back</button>
					<button type="submit" disabled={!acceptTerms}>Join!</button>
				</div>
			</form>-->
			Ya cant join till OOBE
			<br><br>
			<button type="button" style="border-color:white;" on:click|preventDefault={()=>{
				page.set("welcome");
				loginStatus = "";
				return false;
			}}>Go back</button>
		</div>
	{:else if $page === "blank"}
		<div></div>
	{:else if $page === "go"}
		<div class="fullcenter">Let's go!</div>
	{:else}
		<div class="fullcenter">
			<div class="column-ui">
				Somehow, you got to a page that doesn't exist...
				<br />
				(Current page: {$page})

				<div class="buttons">
					<button on:click={()=>page.set("logo")}>Go back!</button>
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

		text-align: center;
		
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1000;
		
		width: 100%;
		min-height: 100vh;
		height: 100%;

		display: table;
		overflow: hidden;
	}
	.fullcenter {
		width: 100%;
		height: 100%;
		box-sizing: border-box;

		margin: auto;
		overflow: hidden;

		display: table-cell;
		vertical-align: middle;
		padding: 0.5em;
		z-index: 0;
	}

	.meowy-orang {
		opacity: 0.4;
		transform: translate(-20%,180%) rotate(30deg);
		height: 300px;
		width: 300px;
		position: absolute;
		z-index: 1;
		background: linear-gradient(180deg, #F9A637 99.99%, rgba(255, 255, 255, 0) 100%);
		mix-blend-mode: color;
	}

	#meowy_left {
		position: relative;
		opacity: 0.4;
		z-index: 0;
		transform: scale(4) translate(-50%,260%) rotate(30deg);
	}

	.button_welcome_savedlogin {
		position: absolute;
		bottom: 25%;
		left: 35%;
		font-family: simvoni !important;
		line-height: 0.5;
	}

	.login_textre {
		position: absolute;
		font-size: 48px;
		top: 22%;
		right: 37%;
	}

	.button_OOBE_NP {
		background-color: white;
		border-width: 5px;
		border-color: var(--orange-light);
		font-family: simvoni-bold;
		color: black;
		position: relative;
		text-align: left;
	}

	.button_OOBE_NP:hover {
		background-color: rgb(244, 244, 244) !important;
	}

	.button_OOBE {
		width: 100%;
		left: 4em;
		background-color: white;
		border-width: 5px;
		border-color: var(--orange-light);
		font-family: simvoni-bold;
		color: black;
		position: relative;
		text-align: left;
		margin-bottom: 1em;
	}

	.input_OOBE {
		width: 100%;
		left: 4em;
		background-color: white;
		border-width: 5px;
		border-color: var(--orange-light);
		font-family: simvoni-bold;
		color: black;
		position: relative;
		text-align: left;
		margin-bottom: 1em;
	}

	.button_OOBE:hover {
		background-color: rgb(244, 244, 244) !important;
	}

	.sveltever {
		position: absolute;
		bottom: 10%;
		left: 49%;
	}

	.meowerteam {
		position: absolute;
		bottom: 5%;
		left: 53%;
	}

	.selectopt {
		position: absolute;
		top: 3%;
		font-size: 48px;
		left: 35%;
	}

	.welcometo {
		position: absolute;
		top: 3em;
		left: 2.8em;
		color: var(--orange-button);
		font-size: 24px;
		width:10em;
		text-align: center;
	}

	#meowerlogo_left {
		position: absolute;
		top: 12%;
		left: 8%;
		transform: scale(0.8);
	}

	.setup.white {
		background-color: var(--background);
		color: var(--orange-button);
	}

	.logo {
		position: relative;
		bottom: 0px;
		transition:
			bottom 0.3s cubic-bezier(0,1,1,1);
	}
	.logo-img {
		transition:
			height 0.3s cubic-bezier(0,1,1,1);
	}
	.logo.top {
		bottom: 10px;
	}
	.setup:not(.white) .logo-img {
		filter: brightness(0) invert(1);
	}

	.left {
		background-color: white;
		width: 14em;
		height: 100%;
		position: relative;
		overflow: hidden;
		z-index: 1;
	}

	.small {
		font-size: 75%;
	}

	.connecting {
		height: 0;
		overflow: visible;
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

	.login-status {
		display: inline-block;
		height: 0;
		overflow: visible;
	}

	label, .checkboxes input {
		vertical-align: middle;
	}

	.checkboxes {
		text-align: left;
		font-size: 90%;
		position: absolute;
	}

	.login-save {
		top: 55%;
		right: 52%;
	}

	.backbuttonlogin {
		position: absolute;
		width: 50%;
		bottom: 16%;
		right: 40%;
		text-align: right;
		color: black;
		font-family: simvoni-bold;
		background-color: white;
		border-width: 5px;
		border-color: var(--orange-light);
	}

	.backbuttonlogin:hover {
		background-color: rgb(244, 244, 244) !important;
	}

	.loginbuttonlogin {
		position: absolute;
		width: 50%;
		bottom: 16%;
		left: 70%;
		text-align: left;
		color: black;
		font-family: simvoni-bold;
		background-color: white;
		border-width: 5px;
		border-color: var(--orange-light);
	}

	.loginbuttonlogin:hover {
		background-color: rgb(244, 244, 244) !important;
	}
</style>
