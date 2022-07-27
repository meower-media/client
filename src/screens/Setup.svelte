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

	async function connect() {
		return new Promise(resolve => {
			if (link.ws && link.ws.readyState === 1) {
				resolve();
				return;
			};

			clm.connect();

			link.once("connected", resolve);
		});
	}

	onMount(() => {
		page.subscribe(async value => {
			if (!setup) return;
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
			Click here to continue.
		</button></div>
	{:else if $page === "logo"}
		<div out:fade={{duration: 300}} class="fullcenter intro">
			<div class="logo top" bind:this={logo}>
				<img
					bind:this={logoImg}
					alt="Meower"
					src={meowerLogo}
					class="logo-img"
					height="40"
				/>
			</div>
			<div class="fullcenter">
				<span class="connecting">{loginStatus}</span>
			</div>
		</div>
	{:else if $page === "reconnect"}
		<div class="fullcenter">
			Reconnecting...
		</div>
	{:else if $page === "welcome"}
		<div class="welcome">
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
				<button on:click={() => {
					user.set(unloadedProfile());
					loginStatus = "";
					page.set("blank");
					screen.set("main");
				}}>Skip</button>
				<p class="small">(Several features will be unavailable while not logged in.)</p>
				<div>
					<p class="small">
						Meower Svelte v1.0, by CST1229
						<br />
						credits to Meower Media Co. for creating Meower
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
		<div>
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
				<input type="text" placeholder="Username"> <br />
				<input type="password" placeholder="Password"> <br /> <br />
				{loginStatus}
				<div class="buttons"> 
					<button>Log in</button><button on:click|preventDefault={()=>{
						page.set("welcome");
						loginStatus = "";
						return false;
					}}>Go back</button>
				</div>
			</form>
		</div>
	{:else if $page === "join"}
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

						page.set("go");
						await sleep(500);
						screen.set("main");
					} else {
						loginStatus = "Unexpected error logging in!";
					}
				}).catch(err => {
					if (err === "I:015 | Account exists") {
						loginStatus = "The account already exists!";
					} else {
						console.error(err);
						loginStatus = "Unexpected " + err + " error!";
					}
				});
			}}
		>
			<input type="text" placeholder="Username"> <br />
			<input type="password" placeholder="Password"> <br /> <br />
			{loginStatus}
			<div class="buttons">
				<button>Join!</button><button on:click|preventDefault={()=>{
					page.set("welcome");
					loginStatus = "";
					return false;
				}}>Go back</button>
			</div>
		</form>
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
		padding: 1em;
		box-sizing: border-box;
	}
	.intro {
		background-color: var(--orange);
		color: var(--foreground-orange);
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1001;
	}
	.setup.white .intro {
		background-color: var(--background);
		color: var(--orange-button);
	}
	.welcome {
		min-height: calc(100vh - 2em);
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.buttons {
		position: absolute;
		bottom: 2em;
		width: calc(100% - 4em);
	}
	.fullcenter {
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;

		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.logo {
		transition:
			margin-bottom 0.3s cubic-bezier(0,1,1,1);
	}
	.logo-img {
		transition:
			height 0.3s cubic-bezier(0,1,1,1);
	}
	.logo.top {
		margin-bottom: 1.5em;
	}
	.setup:not(.white) .logo-img {
		filter: brightness(0) invert(1);
	}

	.small {
		font-size: 75%;
	}

	.connecting {
		margin-top: 1.5em;
	}

	.column-ui {
		width: 24em;
		max-width: calc(100% - 2em);
		min-height: 8em;
		margin: auto;
	}
	.column-ui * {
		width: 100%;
	}
	.column-ui .buttons {
		display: flex;
		width: 24em;
		max-width: calc(100% - 4em);
	}
	.column-ui .buttons * {
		flex-grow: 1;
		flex-shrink: 1;
		padding-left: 0;
		padding-right: 0;
	}
</style>