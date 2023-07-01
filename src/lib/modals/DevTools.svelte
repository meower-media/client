<!-- WIP -->
<!-- WlodekM: i hope this works -->
<script>
	import Modal from "../Modal.svelte";
	
	import Container from "../Container.svelte";
	
	import {link} from "../clmanager.js"
	import {tick} from "svelte";
	import {fade} from "svelte/transition";
	import {shiftHeld} from "../keyDetect.js";
	
	import {profileCache} from "../loadProfile.js";
	import {autoresize} from "svelte-textarea-autoresize";
	import ProfileView from "../ProfileView.svelte";
	import PFP from "../PFP.svelte";
	import Loading from "../Loading.svelte";
	import * as clm from "../clmanager.js";
	import {apiUrl, encodeApiURLParams} from "../urls.js";
	const PFP_COUNT = 38;
	var pfp_temp = $user.pfp_data
	var result_eval, code_eval
	var target_modal = ""
	const pfps = new Array(PFP_COUNT).fill().map((_, i) => i + 1);
	pfps.push(-1, 500, 101, 102, 404) //add secret pfps
	let pfpSwitcher = false;
	async function loadProfile() {
		let path = `users/${$profileClicked}`;
		if (encodeApiURLParams) path = encodeURIComponent(path);
		const resp = await fetch(`${apiUrl}${path}`);
		if (!resp.ok) {
			throw new Error("Response code is not OK; code is " + resp.status);
		}
		const json = await resp.json();
		return json;
	}
	/**
	 * Saves the user profile, and also clears its cache entry.
	 */
	function save() {
		if ($profileCache[$user.name]) {
			const _profileCache = $profileCache;
			delete _profileCache[$user.name];
			profileCache.set(_profileCache);
		}
		clm.updateProfile();
	}
	let pfpOverflow = false;
	var target_page = "groupcat"
	$: {
		const pfp = $user.pfp_data;
		let hiddenpfps = [-1, 500, 101, 102]
		pfpOverflow = pfp < 0 || pfp > PFP_COUNT && !(hiddenpfps.includes(pfp));
	}
	var spamn = 10
	function spamlive() {
		for (var count = 0; count < spamn; count++) {
        link.send({
            "cmd": "direct",
            "val": {
                "cmd": "set_chat_state",
                "val": {
                    "state": 1,
                    "chatid": "livechat"
                }
            },
        })
    }
	}
  
	let postErrors = "";
	
	function goto(newPage, resetScroll = true) {
		if (
			!$user.name &&
			newPage !== "home" &&
			newPage !== "settings" &&
			newPage !== "changelog" &&
			newPage !== "search"
		) {
			modalPage.set("signup");
			modalShown.set(true);
			return;
		}
		if (resetScroll) {
			window.scrollTo(0, 0);
		}
		if ($page === "groupchat") {
			clm.meowerRequest({
				cmd: "direct",
				val: {
					cmd: "set_chat_state",
					val: {
						state: 0,
						chatid: $chatid,
					},
				},
			});
		}
		chatid.set("");
		page.set("blank");
		tick().then(() => page.set(newPage));
	}
	var whusername = "User"
	var whpost = ""
	function whsend() {
		console.log(`${whusername}:${whpost}`)
		fetch('https://webhooks.meower.org/post/home', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ "post": whpost,"username":whusername })
		})
		.then(response => response.text())
		.then(response => console.log(response))
	}
	
	import {
		mainPage as page,
		user,
		profileClicked,
		modalShown,
		modalPage,
		lastTyped,
		screen,
		chatName,chatid,chatMembers,chatOwner,
		windowStyle,
	} from "../stores.js";
	// export const chatName = writable("");
	// export const chatid = writable("");
	// export const chatMembers = writable([]);
	// export const chatOwner = writable("");
</script>

<Modal
	on:close={() => {
		$modalShown = false;
	}}
>
	<Container>
		<h1>Developer tools</h1>
		Hello everyone its THE DEV TOOLS HERE back with another youtube video!!!!!!
	</Container>
	<Container>
		<h2>Info</h2>
		<h4>Stores</h4>
		<ul>
			<li>mainPage: {JSON.stringify($page)} </li>
			<li>modalPage: {JSON.stringify($modalPage)} </li>
			<li>user: {JSON.stringify($user)} </li>
			<li>chatOwner: {JSON.stringify($chatOwner)} </li>
			<li>chatMembers: {JSON.stringify($chatMembers)} </li>
			<li>chatid: {JSON.stringify($chatid)} </li>
			<li>chatName: {JSON.stringify($chatName)} </li>
			<li>windowStyle: {JSON.stringify($windowStyle)} </li>
		</ul>
	</Container>
<!-- 	<Container style="height: 150px;">
		<div class="settings-controls">
            <input bind:value={whusername} type="text" id="username" style="margin-bottom:4px" class="white">
        	<textarea bind:value={whpost} rows="4" class="container type-message" style="resize: none;width:calc(100% - (11px * 2) - 100px)"></textarea>
			<button
				class="circle settings"
				on:click={() => {
					whsend()
				}}
			/>
		</div>
		<h1>Webhook</h1>
		Send message using webhooks.<br><br><br><br>
	</Container>
	<Container>
		<div class="settings-controls">
			<button
				class="circle settings"
				on:click={() => {
					modalPage.set("modUserInp");
					modalShown.set(true);
				}}
			/>
		</div>
		<h1>Moderate User</h1>
		Moderate a certain User.
	</Container> -->
<!-- 	<Container>
		<div class="settings-controls">
			<p>Start:</p>
			<button
				class="circle settings"
				alt="Start spamming"
				on:click={() => {
					spamlive()
				}}
			/>
			&emsp;
				<p>Configure:</p>
			<button
				class="circle settings"
				alt="Set how many times to spam"
				on:click={() => {
					spamn = window.prompt(`How many times to spam\nCurrent:${spamn}`);
				}}
			/>
		</div>
		<h1>Spam live</h1>
		Spam livechat with join messages.<br><br><br><br><br><br>
	</Container> -->
	<Container>
		<div class="settings-controls">
			<button
				class="circle settings"
				on:click={() => {
					$modalPage = "clear-data";
					$modalShown = true;
					console.warn("Clear local data modal opened, proceed with caution!")
				}}
			></button>
		</div>

		<h2>Clear local data</h2>
		This should only be used if you're having issues with Streamilator talk. This clears saved logins, local settings and preferences.
		<br>
		<small style="font-size: 0.5em;">
			Created by the bettermeower team
		</small>
	</Container>
<Container>
	<div class="settings-controls">
		<button
			class="circle settings"
			on:click={() => {
				cljs.disconnect();
				console.warn("Disconnection from ST server triggered via developer tools")
			}}
		></button>
	</div>

	<h2>Disconnect</h2>
	Disconnects from the server by calling CLJS.disconnect()
	<br>
	<small style="font-size: 0.5em;">
		Created by the bettermeower team
	</small>
</Container>
<Container>
	<div class="settings-controls">
		<button
			class="circle settings"
			on:click={async () => {
				localStorage.removeItem("meower_linkurl")
				localStorage.removeItem("meower_apiurl")
				location.reload();
				console.warn("Server and API urls reset via developer tools")
			}}
		></button>
	</div>

	<h2>Reset server URLS</h2>
	Reset API and server URL's
	
		<br>
		<small style="font-size: 0.5em;">
			Created by the bettermeower team
		</small>
</Container>
	<Container>
		<h1>Set server urls </h1>
		Set to another meower server.
		<br>
		<hr>
		<form 
			class="createpost"
			autocomplete="off"
			on:submit|preventDefault={async e => {	
				localStorage.setItem("meower_linkurl",e.target[0].value+"/")
				localStorage.setItem("meower_apiurl",e.target[1].value+"/")
				cljs.disconnect()
				await tick();
				location.reload();
				console.log("Meower server was changed in developer tools, refreshing...")
			}}
		>
			<input
				type="text"
				class="white"
				placeholder="Server URL"
				name="switchserver"
				autocomplete="false"
				on:keydown={(event) => {
					if (event.key == "Enter" && !shiftHeld) {
						event.preventDefault();
						document.getElementById("submitpost4").click();
					}
				}}
			>
			<input
				type="text"
				class="white"
				placeholder="API URL"
				name="switchapi"
				autocomplete="false"
				on:keydown={(event) => {
					if (event.key == "Enter" && !shiftHeld) {
						event.preventDefault();
						document.getElementById("submitpost4").click();
					}
				}}
			>
			<button id="submitpost4">Connect</button>
		</form>
		<br>
		<small style="font-size: 0.5em;">
			Created by the bettermeower team
		</small>
	</Container>
	<Container>
		<div class="settings-controls">
			<button
				class="circle settings"
				alt="Go to group cat"
				on:click={() => goto("groupcat")}
			/>
		</div>
		<h1>group cat</h1>
		Groupcat
	</Container>
	{#await loadProfile()}
			<Loading />
	{:then data}
	<Container>
		<div class="settings-controls">
			<button
				class="circle settings"
				alt="Set pfp"
				on:click={() => {
								pfpSwitcher = false;
								$user.pfp_data = pfp_temp;
								save()
								}
						  }
			/>
		</div>
		<h1>Set pfp</h1>
		<input bind:value={pfp_temp} class="white" type="text">
	</Container>
	{:catch e}
		<ProfileView username={$profileClicked} />
	{/await}
	<Container>
		<div class="settings-controls">
			<button
				class="circle settings"
				alt="Go!"
				on:click={() => {
								goto(target_page)
								}
						  }
			/>
		</div>
		<h1>Go to page</h1>
		<input bind:value={target_page} class="white" type="text">
	</Container>
	<Container>
		<div class="settings-controls">
			<button
				class="circle settings"
				alt="Go!"
				on:click={() => {
								$modalShown = false;
								modalPage.set(target_modal);
								modalShown.set(true);
								}
						  }
			/>
		</div>
		<h1>Open modal</h1>
		<input bind:value={target_modal} class="white" type="text">
	</Container>
	<Container>
		<h1>Evaluate</h1>
		Run code (Dangerous)
		<form
				class="createpost"
				autocomplete="off"
				on:submit|preventDefault={e => {
					postErrors = "";
					if (!e.target[0].value.trim()) {
						postErrors = "You can't eval an empty string!";
						return false;
					}
					try {
						result_eval = eval(e.target[0].value)
						console.log(`Code: ${e.target[0].value}`)
					} catch(err) {
						result_eval = err
					}
				}}
			>
				<textarea
					type="text"
					class="white"
					placeholder="Write something..."
					id="postinput"
					name="postinput"
					autocomplete="false"
					rows="1"
					use:autoresize
					width="100%"
					on:input={() => {
						if ($lastTyped + 1500 < +new Date()) {
							lastTyped.set(+new Date());
							link.send({
								cmd: "direct",
								val: {
									cmd: "set_chat_state",
									val: {
										chatid: "livechat",
										state: 101,
									},
								},
								listener: "typing_indicator",
							});
						}
					}}
					on:keydown={event => {
						if (event.key == "Enter" && shiftHeld) {
							event.preventDefault();
							document.getElementById("submitpost").click();
						}
					}}
					bind:this={code_eval}
				/>
		<div class="post-errors">{postErrors}</div>
		<div class="settings-controls">
			<button
				class="circle settings"
				alt="Go!" id="submitpost"
			/>
		</div>
		
		<input disabled bind:value={result_eval} class="white" type="text">
			</form>
	</Container>
	
</Modal>
<style>
	button.circle {
		border: none;
		margin: 0;
		margin-left: 0.125em;
	}
</style>
