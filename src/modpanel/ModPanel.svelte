<script>
	import Container from "../lib/Container.svelte";

	import {modalShown, modalPage} from "../lib/stores.js";
</script>

<div class="ModPanel">
	<Container>
		<h1>Moderation Panel</h1>
		Hello everyone its THE MOD PANEL HERE back with another youtube video!!!!!!
	</Container>
	<Container>
		<div class="settings-controls">
			<button
				class="circle settings"
				on:click={() => {
					modalPage.set("modUserInp");
					modalShown.set(true);
				}}
			/>
		</div>
		<h1>Moderate User</h1>
		Moderate a certain User.
	</Container>
</div>

<style>
	button.circle {
		border: none;
		margin: 0;
		margin-left: 0.125em;
	}
</style>
