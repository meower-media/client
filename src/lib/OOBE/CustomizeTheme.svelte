<script>
	import * as modals from "../modals.js";
	modals.showModal("switchTheme");
</script>

<div class="content">
	<h1>Set your theme</h1>
	<button on:click={() => modals.showModal("switchTheme")}
		>Change Theme</button
	>
	<br /><br />
	Click Next when done.
</div>

<style>
	.content {
		text-align: center;
	}
</style>
