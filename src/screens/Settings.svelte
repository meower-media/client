<!-- You probably know what this is. -->

<script>
	import {tick} from "svelte";

	import Container from "../lib/Container.svelte";

	import {
		user,
		screen, setupPage,
		customTheme, useCustomTheme, defaultCustomTheme
	} from "../lib/stores.js";
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

	function updateTheme() {
		localStorage.setItem("meower_customtheme", JSON.stringify($customTheme));
	}
</script>

<!--
	<p>Quote: {$user.quote}</p>
	<form 
		class="createpost"
		on:submit|preventDefault={e => {
			//spinner.set(true);
			const _user = $user;
			_user.quote = e.target[0].value;
			user.set(_user);

			clm.updateProfile();
			//spinner.set(false);
		}}
	>
		<input
			type="text"
			class="white"
			placeholder="Write something..."
				id="qinput"
				name="qinput"
			autocomplete="false"
		>
		<button>Save Quote</button>
	</form>
-->
<Container>
	<h1>Settings</h1>
	You can change your account's settings here. These will save to your account, so they will carry over into other clients.
</Container>
<Container>
	<div class="settings-controls">
		<button
			class="circle settings"
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
			class="circle settings"
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
		<input
			type="checkbox"
			checked={!$user.mode}
			on:change={()=>{
				const _user = $user;
				_user.mode = !_user.mode;
				user.set(_user);

				clm.updateProfile();
			}}
		>
	</div>

	<h2>Dark Mode</h2>
	Dark mode is currently {$user.mode ? "disabled" : "enabled"}.
</Container>

<br />

<Container>
	<h1>Client Settings</h1>
	These settings will only apply for Meower Svelte, and are saved on your device.
</Container>
<Container>
	<div class="settings-controls">
		<input
			type="checkbox"
			bind:checked={$useCustomTheme}
			on:change={()=>{
				localStorage.setItem("meower_usecustomtheme", $useCustomTheme.toString());
			}}
		>
	</div>
	<h2>Custom Theme</h2>
	The custom theme is currently {$useCustomTheme ? "enabled" : "disabled"}. When enabled, the custom theme overrides dark mode and the normal theme.
	<table class="custom-theme">
		<tbody>
			<tr>
				<td >
					<div class="custom-color">
						<span class="color-name">Main</span>
						<input
							class="theme-color"
							type="color"
							bind:value={$customTheme.orange}
							on:change={updateTheme}
						>
					</div>
				</td>
				<td>
					<div class="custom-color">
						<span class="color-name">Main (highlight)</span>
						<input
							class="theme-color"
							type="color"
							bind:value={$customTheme.orangeLight}
							on:change={updateTheme}
						>
					</div>
				</td>
				<td>
					<div class="custom-color">
						<span class="color-name">Main (shadow)</span>
						<input
							class="theme-color"
							type="color"
							bind:value={$customTheme.orangeDark}
							on:change={updateTheme}
						>
					</div>
				</td>
				<td>
					<div class="custom-color">
						<span class="color-name">Main (alternate)</span>
						<input
							class="theme-color"
							type="color"
							bind:value={$customTheme.orangeButton}
							on:change={updateTheme}
						>
					</div>
				</td>
			</tr>
			<tr>
				<td colspan="2">
					<div class="custom-color">
						<span class="color-name">Background</span>
						<input
							class="theme-color"
							type="color"
							bind:value={$customTheme.background}
							on:change={updateTheme}
						>
					</div>
				</td>
				<td>
					<div class="custom-color">
						<span class="color-name">Text</span>
						<input
							class="theme-color"
							type="color"
							bind:value={$customTheme.foreground}
							on:change={updateTheme}
						>
					</div>
				</td>
				<td>
					<div class="custom-color">
						<span class="color-name">Text on Main</span>
						<input
							class="theme-color"
							type="color"
							bind:value={$customTheme.foregroundOrange}
							on:change={updateTheme}
						>
					</div>
				</td>
			</tr>
		</tbody>
	</table>
	<button
		class="reset-theme"
		on:click={() => {
			customTheme.set(JSON.parse(JSON.stringify($defaultCustomTheme)));
			updateTheme();
		}}
	>
		Reset theme to defaults
	</button>
</Container>

<br />

<Container>
	<div class="settings-controls">
		<input
			type="checkbox"
			bind:checked={delete1}
			on:change={checkDelete}
		>
		<input
			type="checkbox"
			bind:checked={delete2}
			on:change={checkDelete}
		>
		<input
			type="checkbox"
			bind:checked={delete3}
			on:change={checkDelete}
		>
		<input
			type="checkbox"
			bind:checked={delete4}
			on:change={checkDelete}
		>
		<input
			type="checkbox"
			bind:checked={delete5}
			on:change={checkDelete}
		>
	</div>

	<h1>Delete Account</h1>
	THIS CANNOT BE UNDONE. Enable all the switches to delete your account, if you are really sure.
</Container>

<div class="eee"></div>

<style>
	.settings-controls {
		position: absolute;
		top: 0.25em;
		right: 0.25em;
	}

	input[type="checkbox"], button.circle {
		border: none;
		margin: 0;
		margin-left: 0.125em;
	}

	.custom-theme {
		width: 100%;
		margin-top: 1em;
	}
	.color-name {
		flex-grow: 1;
	}
	.custom-color {
		display: flex;
		align-items: center;
		vertical-align: middle;
	}

	.reset-theme {
		width: 100%;
		margin-top: 0.5em;
	}
</style>