<script>
	import {
		Sidebarlocked,
        Next_Enabled,
        OOBEPage
	} from "../../lib/stores.js";

	import OobeCustomizePfp from "./OOBE_CustomizePFP.svelte";
</script>

<div class="actual">
	<div class="fullcenter">
		{#if $OOBEPage == 0}
			<OobeCustomizePfp />
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
