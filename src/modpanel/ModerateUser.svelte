<script>
	import {userToMod} from "../lib/stores.js";
	import ProfileView from "../lib/ProfileView.svelte";
	import Container from "../lib/Container.svelte";
</script>

<div class="ModerateUser">
	<ProfileView username={$userToMod} />
	<Container>
		<div class="settings-controls">
			<button class="circle settings" on:click={() => {}} />
		</div>
		<h1>Ban User</h1>
		This will ban the user that is entered.<i>*whack*</i>
	</Container>
</div>

<style>
	.settings-controls {
		position: absolute;
		top: 0.25em;
		right: 0.25em;
	}

	button.circle {
		border: none;
		margin: 0;
		margin-left: 0.125em;
	}
</style>
