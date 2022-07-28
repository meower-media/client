<!-- Boring orange screen with login and signup. -->

<script>
	import {screen, setupPage as page, user} from "../lib/stores.js";
	import * as clm from "../lib/clmanager.js";
	import unloadedProfile from "../lib/unloadedprofile.js";
	const link = clm.link;

	import meowerLogo from "../assets/logo.svg";
	import meowy from "../assets/meowy.svg";

	import {tick, onMount} from "svelte";
	import {fade} from 'svelte/transition';
	import sleep from "../lib/sleep.js";

	let logo, setup, logoImg, loginStatus = "";

	let acceptTerms = false;

	async function connect() {
		await clm.disconnect();
		clm.connect();

		await new Promise(resolve => link.once("connected", resolve));
	}

	let rememberMe = false;

	onMount(() => {
		page.subscribe(async value => {
			if (!setup) return;
			rememberMe = false;
			acceptTerms = false;
			setup.classList.remove("white");
			if (value === "start") {
				clm.disconnect();
			} else if (value === "logo") {
				loginStatus = "";

				await tick();
				setup.classList.add("white");
				logoImg.height = 0;
				logo.classList.remove("top");
				
				await sleep(300);
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
				await sleep(800);

				loginStatus = "";
				page.set("blank");
				await sleep(600);
				page.set("welcome");
			} else if (value === "reconnect") {
				await connect();
				await sleep(100);
				page.set("welcome");
			}
		});
	});

	/**
	 * Logs in.
	 * 
	 * @param {string} username
	 * @param {string} password
	*/
	function doLogin(username, password) {
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
					
					if (rememberMe) {
						localStorage.setItem("meower_savedusername", username);
						localStorage.setItem("meower_savedpassword", password);
					}

					screen.set("main");
				} catch(e) {
					console.error(e);
					loginStatus = "Unexpected " + e + " error getting user data!";
				}
			}).catch(code => {
				if (code == "E:103 | ID not found") {
					loginStatus = "Invalid username!";
				} else if (code == "I:011 | Invalid Password") {
					loginStatus = "Invalid password!";
				} else if (code == "E:018 | Account Banned") {
					loginStatus = "This account is banned. L :(";
				} else if (code == "E:107 | Packet too large") {
					loginStatus = "The username and/or password is too long!";
				} else if (code == "E:019 | Illegal characters detected") {
					loginStatus = "Usernames must not have spaces or other special characters!";
				} else {
					loginStatus = `Unexpected ${code} error!`;
				}
			});
		} catch(e) {
			console.error(e);
			loginStatus = "Error logging in: " + e;
		}
	}
</script>

<div out:fade={{duration: 300}} bind:this={setup} class="setup white">
	{#if $page === "start"}
		<div class="fullcenter"><button on:click={()=>page.set("logo")}>
			Click here to Start Meower Svelte!
		</button></div>
	{:else if $page === "logo"}
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
				<button on:click={() => page.set("login")}>Log in</button> <br />
				<button on:click={() => page.set("join")}>Create an account</button> <br />
				{#if localStorage.getItem("meower_savedusername")}
					<button on:click={() => {
						doLogin(
							localStorage.getItem("meower_savedusername"),
							localStorage.getItem("meower_savedpassword"),
						)
					}}>Use saved login ({localStorage.getItem("meower_savedusername")})</button>
					<p class="small">{loginStatus}</p>
				{/if}
				<button on:click={() => {
					user.set(unloadedProfile());
					loginStatus = "";
					page.set("blank");
					screen.set("main");
				}}>Skip</button>
				<p class="small">(Several features will be unavailable while not logged in.)</p>
				<div>
					<p class="small">
						Meower Svelte v1.2.0, by CST1229, Bloctans_4 and Arrow
					</p>
					<img
						src={meowy}
						alt=""
						height="64"
					>
				</div>
			</div>
		</div>
	{:else if $page === "login"}
		<div class="fullcenter">
			<h1>Login to Meower</h1>
			
			<form class="column-ui"
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
				<input type="password" placeholder="Password" maxlength="72">
				<p class="checkboxes">
					<label>
						<input type="checkbox" bind:checked={rememberMe}>
						Save this login
					</label>
				</p>
				<span class="login-status">{loginStatus}</span>
				<div class="buttons"> 
					<button>Log in</button><button on:click|preventDefault={()=>{
						page.set("welcome");
						loginStatus = "";
						return false;
					}}>Go back</button>
				</div>
				<button on:click|preventDefault={()=>{
					localStorage.removeItem("meower_savedusername");
					localStorage.removeItem("meower_savedpassword");
					loginStatus = "Saved login cleared.";
					return false;
				}}>Clear saved login</button>
			</form>
		</div>
	{:else if $page === "join"}
		<div class="fullcenter">
			<h1>Welcome to Meower</h1>

			<form class="column-ui"
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
						if (val.mode === "auth" && val.payload === username) {
							loginStatus = "Getting user data...";
							const profileVal = await clm.meowerRequest({
								cmd: "direct",
								val: {
									cmd: "get_profile",
									val: val.payload,
								},
							});
							user.update(v => Object.assign(v, {
								...profileVal.payload,
								name: val.payload,
							}));

							loginStatus = "";
							
							if (rememberMe) {
								localStorage.setItem("meower_savedusername", username);
								localStorage.setItem("meower_savedpassword", password);
							}

							page.set("go");
							await sleep(1000);
							screen.set("main");
						} else {
							loginStatus = "Unexpected error logging in!";
						}
					}).catch(err => {
						if (err === "I:015 | Account exists") {
							loginStatus = "The account already exists!";
						} else if (err == "E:107 | Packet too large") {
							loginStatus = "The username and/or password is too long!";
						} else {
							console.error(err);
							loginStatus = "Unexpected " + err + " error!";
						}
					});
				}}
			>
				<input type="text" placeholder="Username" maxlength="20"> <br />
				<input type="password" placeholder="Password" maxlength="72">
				<p class="checkboxes">
					<label>
						<input type="checkbox" bind:checked={rememberMe}>
						Save this login
					</label>
					<br />
					<label>
						<input type="checkbox" bind:checked={acceptTerms}>
						I agree to <a
							href="https://meower.org/legal"
						>Meower's Terms of Service and Privacy Policy</a>
					</label>
				</p>
				<span class="login-status">{loginStatus}</span>
				<div class="buttons">
					<button disabled={!acceptTerms}>Join!</button><button on:click|preventDefault={()=>{
						page.set("welcome");
						loginStatus = "";
						return false;
					}}>Go back</button>
				</div>
			</form>
		</div>
	{:else if $page === "blank"}
		<div></div>
	{:else if $page === "go"}
		<div class="fullcenter">Let's go!</div>
	{:else}
		Somehow, you got to a page that doesn't exist...
		<br />
		(Current page: {$page})

		<div class="buttons">
			<button on:click={()=>page.set("page2")}>Go back!</button>
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
	}
	.fullcenter {
		width: 100%;
		height: 100%;
		box-sizing: border-box;

		margin: auto;
		overflow: auto;

		display: table-cell;
		vertical-align: middle;
		padding: 1em;
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

	label {
		vertical-align: middle;
	}

	.checkboxes {
		text-align: left;
		font-size: 90%;
	}
</style>
