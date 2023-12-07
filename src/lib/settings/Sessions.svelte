<script>
	import Container from "../Container.svelte";

	import LogoutEverywhereModal from "../modals/settings/LogoutEverywhere.svelte";

	import * as modals from "../modals.js";
</script>

<Container>
	<h1>Sessions</h1>
	Here are the devices you're currently logged in to. You can log out of individual
	devices or all devices.
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
