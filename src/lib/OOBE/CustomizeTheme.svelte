<script>
	import SwitchThemeModal from "../modals/settings/SwitchTheme.svelte";
</script>

<div class="content">
	<h1>Select a theme</h1>
	<br />
	<SwitchThemeModal fromoobe={true} />
	<br />
	Click Next when done.
</div>

<style>
	.content {
		text-align: center;
		width: 50%;
		left: 50%;
        transform: translate(-50%,0);
        position: relative;
	}
</style>
