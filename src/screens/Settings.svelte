<!-- You probably know what this is. -->
<script>
	import Container from "../lib/Container.svelte";

	import {user, modalShown, modalPage} from "../lib/stores.js";
	import * as clm from "../lib/clmanager.js";
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
	You can change your settings here. These will save to your account, so they will
	carry over into other clients.
</Container>
<Container>
	<div class="settings-controls">
		<button
			class="circle settings"
			on:click={() => {
				const _user = $user;
				_user.layout = _user.layout === "new" ? "old" : "new";
				user.set(_user);

				clm.updateProfile();
			}}
		/>
	</div>

	<h2>Layout</h2>
	The layout is currently set to {$user.layout}.
</Container>
<Container>
	<div class="settings-controls">
		<button
			class="circle settings"
			on:click={() => {
				const _user = $user;
				_user.theme = _user.theme === "orange" ? "blue" : "orange";
				user.set(_user);

				clm.updateProfile();
			}}
		/>
	</div>

	<h2>Theme</h2>
	The theme is currently set to {$user.theme}.
</Container>
<Container>
	<div class="settings-controls">
		<input
			type="checkbox"
			checked={!$user.mode}
			on:change={() => {
				const _user = $user;
				_user.mode = !_user.mode;
				user.set(_user);

				clm.updateProfile();
			}}
		/>
	</div>

	<h2>Dark Mode</h2>
	Dark mode is currently {$user.mode ? "disabled" : "enabled"}.
</Container>
<Container>
	<div class="settings-controls">
		<input
			type="checkbox"
			checked={$user.sfx}
			on:change={() => {
				const _user = $user;
				_user.sfx = !_user.sfx;
				user.set(_user);

				clm.updateProfile();
			}}
		/>
	</div>

	<h2>Sound Effects</h2>
	Sound effects (for new messages) are currently {!$user.sfx
		? "disabled"
		: "enabled"}.
</Container>
<!--<Container>
	<div class="settings-controls">
		<input
			type="checkbox"
			checked={$user.bgm}
			on:change={()=>{
				const _user = $user;
				_user.bgm = !_user.bgm;
				user.set(_user);

				clm.updateProfile();
			}}
		>
	</div>

	<h2>BGM</h2>
	BGM is currently {!$user.sfx ? "disabled" : "enabled"}.
</Container>-->
{#if $user.name}
	<Container>
		<div class="settings-controls">
			<button
				class="circle settings"
				on:click={() => {
					$modalPage = "changePassword";
					$modalShown = true;
				}}
			/>
		</div>

		<h2>Change Password</h2>
		Change your account password.
	</Container>
	<Container>
		<div class="settings-controls">
			<button
				class="circle settings"
				on:click={() => {
					$modalPage = "deleteAccount";
					$modalShown = true;
				}}
			/>
		</div>

		<h2>Delete Account</h2>
		Permanently delete your Meower account. THIS CANNOT BE UNDONE.
	</Container>
{/if}

<!--
	{"cmd": "direct", "val": {"cmd": "del_tokens", "val": ""}, "listener": "del_tokens"}
-->

<div class="eee" />

<style>
	.settings-controls {
		position: absolute;
		top: 0.25em;
		right: 0.25em;
	}

	input[type="checkbox"],
	button.circle {
		border: none;
		margin: 0;
		margin-left: 0.125em;
	}
</style>
