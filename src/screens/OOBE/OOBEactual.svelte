<script>
	import {
		Sidebarlocked,
        OOBEPage,
		mainPage
	} from "../../lib/stores.js";

	import OobeCustomizePfp from "./OOBE_CustomizePFP.svelte";
	import OobeCustomizeTheme from "./OOBE_CustomizeTheme.svelte";
	import OobeCustomizeBGMSFX from "./OOBE_CustomizeBGMSFX.svelte";
</script>

<div class="actual">
	<div class="fullcenter">
		{#if $OOBEPage == 0}
			<OobeCustomizePfp />
		{:else if $OOBEPage == 1}
			<OobeCustomizeTheme />
		{:else if $OOBEPage == 2}
			<OobeCustomizeBGMSFX />
		{:else if $OOBEPage == 3}
			<h1>Thats it!</h1>
			<button on:click={() => {Sidebarlocked.set(false); mainPage.set("home")}}>Press me to finish!</button>
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
