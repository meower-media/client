<!-- Boring orange screen with login and signup. -->

<script>
	import {screen, setupPage as page, user} from "../lib/stores.js";

	import Button from "../lib/ui/form/Button.svelte";
	import Input from "../lib/ui/form/Input.svelte";

	import * as clm from "../lib/networking/clmanager.js";
	const link = clm.link;

	import unloadedProfile from "../lib/constants/unloadedprofile.js";

	import meowerLogo from "../assets/logo.svg";
	import meowy from "../assets/meowy.svg";

	import {tick, onMount} from "svelte";
	import {fade} from 'svelte/transition';
	import sleep from "../lib/sleep.js";

	import {play} from "../lib/audio/sfx.js";

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
			setup.classList.remove("white");
			
			rememberMe = false;
			acceptTerms = false;
			loginStatus = "";
			if (value === "logo") {
				loginStatus = "";

				await tick();
				setup.classList.add("white");
				logoImg.height = 0;
				logo.classList.remove("top");
				
				await sleep(300);
				play("start");
				
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
				await sleep(300);

				if (
					localStorage.getItem("meower_autologin") === "true" &&
					localStorage.getItem("meower_savedusername")
				) {
					const loginResp = await doLogin(
						localStorage.getItem("meower_savedusername"),
						localStorage.getItem("meower_savedpassword"),
					);
					if (loginResp) {
						return;
					}
					await sleep(1500);
				}

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
		return new Promise((res) => {
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
						res(true);
					} catch(e) {
						console.error(e);
						loginStatus = "Unexpected " + e + " error getting user data!";
						res(false);
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
					} else if (code == "E:106 | Too many requests") {
						loginStatus = "Too many requests! Please try again later.";
					} else {
						loginStatus = `Unexpected ${code} error!`;
					}
					res(false);
				});
			} catch(e) {
				console.error(e);
				loginStatus = "Error logging in: " + e;
				res(false);
			}
		});
	}
</script>

<div out:fade={{duration: 300}} bind:this={setup} class="setup white">
	{#if $page === "logo"}
		<div out:fade={{duration: 300}} class="fullcenter">
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
	{:else if $page === "reconnect"}
		<div class="center">
			Reconnecting...
		</div>
	{:else if $page === "welcome"}
		<div class="center">
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
				<Button on:click={() => page.set("login")}>Log in</Button> <br />
				<Button on:click={() => page.set("join")}>Create an account</Button> <br />
				{#if localStorage.getItem("meower_savedusername")}
					<Button on:click={() => {
						rememberMe = true;
						doLogin(
							localStorage.getItem("meower_savedusername"),
							localStorage.getItem("meower_savedpassword"),
						)
					}}>Continue as {localStorage.getItem("meower_savedusername")}</Button>
					<p class="small">{loginStatus}</p>
				{/if}
				<Button on:click={() => {
					user.set(unloadedProfile());
					loginStatus = "";
					page.set("blank");
					screen.set("main");
				}}>Skip</Button>
				<p class="small">(Several features will be unavailable while not logged in.)</p>
				<div>
					<p class="small">
						Meower Svelte v1.3.0 | <a
							href="#"
							on:click|preventDefault={() => {
								page.set("about");
								play("menu");
							}}
						>About</a>
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
		<div class="center">
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
				<Input type="text" placeholder="Username" maxlength="20" /> <br />
				<Input type="password" placeholder="Password" maxlength="72" />
				<p class="checkboxes">
					<input id="remember-me" type="checkbox" bind:checked={rememberMe}>
					<label for="remember-me">
						Save this login
					</label>
				</p>
				<span class="login-status">{loginStatus}</span>
				<div class="buttons"> 
					<Button>Log in</Button><Button on:click={(e) => {
						page.set("welcome");
						loginStatus = "";
						return false;
					}}>Go back</Button>
				</div>
				<Button on:click={(e) => {
					localStorage.removeItem("meower_savedusername");
					localStorage.removeItem("meower_savedpassword");
					loginStatus = "Saved login cleared.";
					return false;
				}}>Clear saved login</Button>
			</form>
		</div>
	{:else if $page === "join"}
		<div class="center">
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
					}).catch(err => {
						if (err === "I:015 | Account exists") {
							loginStatus = "The account already exists!";
						} else if (err == "E:107 | Packet too large") {
							loginStatus = "The username and/or password is too long!";
						} else if (err == "E:106 | Too many requests") {
							loginStatus = "Too many requests! Please try again later.";
						} else if (err == "E:119 | IP Blocked") {
							loginStatus = "Your IP is blocked from creating accounts!";
						} else {
							console.error(err);
							loginStatus = "Unexpected " + err + " error!";
						}
					});
				}}
			>
				<Input type="text" placeholder="Username" maxlength="20" /> <br />
				<Input type="password" placeholder="Password" maxlength="72" />
				<p class="checkboxes">
					<input id="remember-me" type="checkbox" bind:checked={rememberMe}>
					<label for="remember-me">
						Save this login
					</label>
					<br />
					<input id="accept-terms" type="checkbox" bind:checked={acceptTerms}>
					<label for="accept-terms">
						I agree to <a
							href="https://meower.org/legal"
						>Meower's Terms of Service and Privacy Policy</a>
					</label>
				</p>
				<span class="login-status">{loginStatus}</span>
				<div class="buttons">
					<Button disabled={!acceptTerms}>Join!</Button><Button on:click={(e) => {
						page.set("welcome");
						loginStatus = "";
						return false;
					}}>Go back</Button>
				</div>
			</form>
		</div>
	{:else if $page === "blank"}
		<div></div>
	{:else if $page === "about"}
		<div class="center">
			<h1>Meower Svelte</h1>
			Contributors:
			<ul>
				<li>
					<a href="https://github.com/CST1229">CST1229</a>
				</li>
				<li>
					<a href="https://github.com/Bloctans">Bloctans</a>
				</li>
				<li>
					<a href="https://github.com/tnix100">tnix100</a>
				</li>
				<li>
					<a href="https://github.com/ArrowAced">ArrowAced</a>
				</li>
			</ul>
			<p>
				Meower is made by <a href="https://github.com/Meower-Media-Co">Meower Media Co.</a>
			</p>
			
			<div class="buttons">
				<Button on:click={(e) => {
					page.set("welcome");
					loginStatus = "";
				}}>Go back</Button>
			</div>
		</div>
	{:else if $page === "go"}
		<div class="center">Let's go!</div>
	{:else}
		<div class="center">
			<div class="column-ui">
				Somehow, you got to a page that doesn't exist...
				<br />
				(Current page: {$page})

				<div class="buttons">
					<Button on:click={()=>page.set("logo")}>Go back!</Button>
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
		
		min-width: 100%;
		min-height: 100%;

		display: grid;
	}
	.center {
		box-sizing: border-box;

		margin: auto;
		
		padding: 0.5em;
	}
	.fullcenter {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
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
	.column-ui > :global(*) {
		width: 100%;
	}
	.column-ui .buttons {
		display: flex;
		width: 24em;
		max-width: 100%;

		margin-top: 2em;
	}
	.column-ui .buttons :global(*) {
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
	}
	
	a {
		color: var(--foreground-orange);
	}
</style>
