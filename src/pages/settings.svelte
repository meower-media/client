<!-- You probably know what this is. -->
<script>
	import Container from "../lib/Container.svelte";

	import BasicModal from "../lib/modals/Basic.svelte";
	import SwitchThemeModal from "../lib/modals/settings/SwitchTheme.svelte";
	import SwitchBGMSFXModal from "../lib/modals/settings/SwitchBGMSFX.svelte";
	import ChangePasswordModal from "../lib/modals/settings/ChangePassword.svelte";
	import LogoutEverywhereModal from "../lib/modals/settings/LogoutEverywhere.svelte";
	import DeleteAccountModal from "../lib/modals/settings/DeleteAccount.svelte";

	import {user} from "../lib/stores.js";
	import * as clm from "../lib/clmanager.js";
	import * as modals from "../lib/modals.js";
	import * as BGM from "../lib/BGM.js";
</script>

<Container>
	<h1>Settings</h1>
	You can change your settings here. These will save to your account, so they will
	carry over into other clients.
</Container>
<Container>
	<div class="settings-controls">
		<button
			class="circle settings"
			on:click={() =>
				clm.updateProfile({
					layout: $user.layout === "new" ? "old" : "new",
				})}
		/>
	</div>

	<h2>Layout</h2>
	The layout is currently set to {$user.layout}.
</Container>
<Container>
	<div class="settings-controls">
		<button
			class="circle settings"
			on:click={() => modals.showModal(SwitchThemeModal)}
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
			bind:checked={$user.sfx}
			on:change={() => clm.updateProfile({sfx: $user.sfx})}
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
				on:click={() => modals.showModal(SwitchBGMSFXModal)}
			/>
		{/if}
		<input
			type="checkbox"
			bind:checked={$user.bgm}
			on:change={() => clm.updateProfile({bgm: $user.bgm})}
		/>
	</div>

	<h2>Background Music</h2>
	Background music is currently {!$user.bgm ? "disabled" : "enabled"}.
	{#if $user.bgm}
		Click the cog button to change the song.
	{/if}
</Container>
{#if $user.name}
	<Container>
		<div class="settings-controls">
			<input
				type="checkbox"
				bind:checked={$user.hide_blocked_users}
				on:change={() => {
					if ($user.hide_blocked_users) {
						modals.showModal(BasicModal, {
							title: "Hide Blocked Users",
							desc: "This setting can have undesirable consequences! We usually try to show 25 posts per page, but pages that include posts made by people you have blocked will have fewer posts. It may also make it harder to keep up with conversations without the context of posts made by people you have blocked.",
						});
					}
					clm.updateProfile({
						hide_blocked_users: $user.hide_blocked_users,
					});
				}}
			/>
		</div>

		<h2>Hide Blocked Users</h2>
		You {$user.hide_blocked_users ? "are" : "are not"} currently hiding posts
		from people you have blocked.
	</Container>
	<Container>
		<div class="settings-controls">
			<button
				class="circle settings"
				on:click={() => modals.showModal(ChangePasswordModal)}
			/>
		</div>

		<h2>Change Password</h2>
		Change your account password.
	</Container>
	<Container>
		<div class="settings-controls">
			<button
				class="circle settings"
				on:click={() => modals.showModal(LogoutEverywhereModal)}
			/>
		</div>

		<h2>Logout Everywhere</h2>
		Revoke all logged in sessions.
	</Container>
	<Container>
		<div class="settings-controls">
			<button
				class="circle settings"
				on:click={() => modals.showModal(DeleteAccountModal)}
			/>
		</div>

		<h2>Delete Account</h2>
		Permanently delete your Meower account.
		<b class="important">THIS CANNOT BE UNDONE!</b>
	</Container>
{/if}

<style>
	.settings-controls {
		position: absolute;
		top: 0.25em;
		right: 0.25em;
		display: flex;
		gap: 0.25em;
	}

	input[type="checkbox"],
	button.circle {
		border: none;
		margin: 0;
		margin-left: 0.125em;
	}
	.important {
		color: crimson;
	}
</style>
