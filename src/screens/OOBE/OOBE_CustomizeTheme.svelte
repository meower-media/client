<script>
	import * as Modals from "../../lib/modals.js";
	Modals.showModal("switchTheme");
</script>

<div class="content">
	<h1>Set your theme</h1>
	<button on:click={() => Modals.showModal("switchTheme")}
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
