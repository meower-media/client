<script>
	import SwitchThemeModal from "../modals/settings/SwitchTheme.svelte";

	import {user} from "../stores.js"
	import * as clm from "../clmanager.js";
</script>

<div class="content">
	<h1>Select your layout</h1>
	<br />
	<button
		class="circle settings"
		on:click={() =>
			clm.updateProfile({
				layout: $user.layout === "new" ? "old" : "new",
			})}
	/>
	<br />
	The layout is currently set to {$user.layout}.
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
