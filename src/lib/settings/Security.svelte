<script>
	import Container from "../Container.svelte";

	import BasicModal from "../modals/Basic.svelte";
	import ChangePasswordModal from "../modals/settings/ChangePassword.svelte";
	import LogoutEverywhereModal from "../modals/settings/LogoutEverywhere.svelte";
	import DeleteAccountModal from "../modals/settings/DeleteAccount.svelte";

	import {user} from "../stores.js";
	import * as clm from "../clmanager.js";
	import * as modals from "../modals.js";
</script>

<Container>
	<h1>Security & Privacy</h1>
	Here you can manage your account's privacy and security settings.
</Container>

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
	You are currently {$user.hide_blocked_users ? "" : "not"} hiding posts from people
	you have blocked.
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
<!-- this should be moved to sessions once we have the auth server ready -->
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
</Container>
