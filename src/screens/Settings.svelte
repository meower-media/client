<!-- You probably know what this is. -->

<script>
	import {tick} from "svelte";

	import Container from "../lib/Container.svelte";

	import {user, screen, setupPage} from "../lib/stores.js";
	import * as clm from "../lib/clmanager.js";

	let delete1 = false, delete2 = false, delete3 = false, delete4 = false, delete5 = false;
	async function checkDelete() {
		if (delete1 && delete2 && delete3 && delete4 && delete5) {
			if ($user.name === localStorage.getItem("meower_savedusername")) {
				localStorage.removeItem("meower_savedusername");
				localStorage.removeItem("meower_savedpassword");
			}

			await clm.meowerRequest({cmd: "direct", val: {cmd: "del_account", val: ""}});
			
			screen.set("setup");
			await tick();
			setupPage.set("reconnect");
		}
	}
</script>

<Container>
	<h1>Settings</h1>
	You can change your settings here. These will save to your account, so they will carry over into other clients.
</Container>
<Container>
	<div class="settings-controls">
		<button
			class="settings-button change"
			class:on={$user.layout === "old"}
			on:click={()=>{
				const _user = $user;
				_user.layout = _user.layout === "new" ? "old" : "new";
				user.set(_user);

				clm.updateProfile();
			}}
		></button>
	</div>

	<h2>Layout</h2>
	The layout is currently set to {$user.layout}.
</Container>
<Container>
	<div class="settings-controls">
		<button
			class="settings-button change"
			class:on={$user.theme === "blue"}
			on:click={()=>{
				const _user = $user;
				_user.theme = _user.theme === "orange" ? "blue" : "orange";
				user.set(_user);

				clm.updateProfile();
			}}
		></button>
	</div>

	<h2>Theme</h2>
	The theme is currently set to {$user.theme}.
</Container>
<Container>
	<div class="settings-controls">
		<button
			class="settings-button switch"
			class:on={!$user.mode}
			on:click={()=>{
				const _user = $user;
				_user.mode = !_user.mode;
				user.set(_user);

				clm.updateProfile();
			}}
		></button>
	</div>

	<h2>Dark Mode</h2>
	Dark mode is currently {$user.mode ? "disabled" : "enabled"}.
</Container>
<Container>
	<div class="settings-controls">
		<button
			class="settings-button switch"
			class:on={delete1}
			on:click={()=>{
				delete1 = !delete1;
				checkDelete();
			}}
		></button>
		<button
			class="settings-button switch"
			class:on={delete2}
			on:click={()=>{
				delete2 = !delete2;
				checkDelete();
			}}
		></button>
		<button
			class="settings-button switch"
			class:on={delete3}
			on:click={()=>{
				delete3 = !delete3;
				checkDelete();
			}}
		></button>
		<button
			class="settings-button switch"
			class:on={delete4}
			on:click={()=>{
				delete4 = !delete4;
				checkDelete();
			}}
		></button>
		<button
			class="settings-button switch"
			class:on={delete5}
			on:click={()=>{
				delete5 = !delete5;
				checkDelete();
			}}
		></button>
	</div>

	<h2>Delete Account</h2>
	THIS CANNOT BE UNDONE. Enable all the switches to delete your account, if you are really sure.
</Container>

<div class="eee"></div>

<style>
	.settings-controls {
		position: absolute;
		top: 0.25em;
		right: 0.25em;
	}
	.settings-button {
		width: 1.6em;
		height: 1.6em;
		padding: 0;
		margin-left: 0.125em;

		border-radius: 100%;
		border: none;

		background-position: center;
		background-size: 1.3em;
		background-repeat: no-repeat;
	}
	.settings-button:hover:not(:active) {
		transform: scale(1.2);
	}

	.switch {
		background-image: url("../assets/off.svg");
	}
	.switch.on {
		background-image: url("../assets/on.svg");
	}
	.change {
		background-image: url("../assets/settings.svg");
	}
</style>