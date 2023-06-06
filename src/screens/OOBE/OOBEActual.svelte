<script>
	import {
		sidebarLocked,
        OOBEPage,
		mainPage
	} from "../../lib/stores.js";

	import OOBECustomizePFP from "./OOBE_CustomizePFP.svelte";
	import OOBECustomizeTheme from "./OOBE_CustomizeTheme.svelte";
</script>

<div class="actual">
	<div class="fullcenter">
		{#if $OOBEPage == 0}
			<OOBECustomizePFP />
		{:else if $OOBEPage == 1}
			<OOBECustomizeTheme />
		{:else if $OOBEPage == 2}
			<h1>That's it!</h1>
			<button on:click={() => {sidebarLocked.set(false); mainPage.set("home")}}>Let's go!</button>
		{:else}
			<p>{$OOBEPage}</p>
		{/if}
	</div>
</div>

<style>
	.actual {
		text-align: center;
		display: table;
	}

    .fullcenter {
        width: 100vw;
		height: calc(100vh - 4rem);
		box-sizing: border-box;

		margin: auto;
		overflow: auto;

		display: table-cell;
		vertical-align: middle;
		padding: 0.5em;
    }
</style>
