<!-- You probably know what this is. -->

<script>
	import Container from "../lib/Container.svelte";

	import {user} from "../lib/stores.js";
	import * as clm from "../lib/clmanager.js";
</script>

<Container>
	<h1>Settings</h1>
	You can change your settings here. These will save to your account, so they will carry over into other clients.
</Container>
<Container>
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

	<h2>Layout</h2>
	The layout is currently set to {$user.layout}.
</Container>
<Container>
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

	<h2>Theme</h2>
	The theme is currently set to {$user.theme}.
</Container>
<Container>
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

	<h2>Dark Mode</h2>
	Dark mode is currently {$user.mode ? "disabled" : "enabled"}.
</Container>

<div class="eee"></div>

<style>
	.settings-button {
		position: absolute;
		top: 0;
		right: 0;

		width: 1.6em;
		height: 1.6em;
		padding: 0;
		margin: 0.25em;

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