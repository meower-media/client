<script>
	import {user} from "../../lib/stores.js";
	import Container from "../../lib/Container.svelte";
	import * as clm from "../../lib/clmanager.js";
	import * as Modals from "../../lib/modals.js";
	import * as BGM from "../../lib/BGM.js";
</script>

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
				Modals.showModal("switchTheme");
			}}
		/>
	</div>

	<h2>Theme</h2>
	The theme is currently set to {$user.theme} ({$user.mode
		? "light"
		: "dark"}).
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
<Container>
	<div class="settings-controls">
		{#if $user.bgm}
			<button
				class="circle settings"
				on:click={() => {
					Modals.showModal("switchBGM");
				}}
			/>
		{/if}
		<input
			type="checkbox"
			checked={$user.bgm}
			on:change={() => {
				const _user = $user;
				_user.bgm = !_user.bgm;
				user.set(_user);
				BGM.playBGM(_user.bgm_song);

				clm.updateProfile();
			}}
		/>
	</div>

	<h2>Background Music</h2>
	Background music is currently {!$user.bgm ? "disabled" : "enabled"}.
	{#if $user.bgm}
		Click the cog button to change the song.
	{/if}
</Container>
