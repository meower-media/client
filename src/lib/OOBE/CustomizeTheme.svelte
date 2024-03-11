<script>
	import SwitchThemeModal from "../modals/settings/SwitchTheme.svelte";

	import * as modals from "../modals.js";

	modals.showModal(SwitchThemeModal);
</script>

<div class="content">
	<h1>Set your theme</h1>
	<SwitchThemeModal fromoobe={true} />
	Click Next when done.
</div>

<style>
	.content {
		text-align: center;
	}
</style>
