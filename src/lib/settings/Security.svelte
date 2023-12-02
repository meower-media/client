<script>
	import Container from "../Container.svelte";
	import * as modals from "../modals.js";
</script>

<Container>
	<div class="settings-controls">
		<button
			class="circle settings"
			on:click={() => {
				modals.showModal("changePassword");
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
				modals.showModal("logoutEverywhere");
			}}
		/>
	</div>

	<h2>Logout Everywhere</h2>
	Revoke all logged in sessions.
</Container>
<Container>
	<div class="settings-controls">
		<button
			class="circle settings"
			on:click={() => {
				modals.showModal("deleteAccount");
			}}
		/>
	</div>

	<h2>Delete Account</h2>
	Permanently delete your Meower account.
	<b class="important">THIS CANNOT BE UNDONE!</b>
</Container>