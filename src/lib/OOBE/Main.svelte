<script>
	import OOBECustomizePFP from "./CustomizePFP.svelte";
	import OOBECustomizeTheme from "./CustomizeTheme.svelte";

	import {OOBERunning, OOBEPage} from "../stores.js";
	import * as clm from "../clmanager.js";

	import {onMount} from "svelte";

	$: allowPrevious = $OOBEPage > 0;
	$: allowNext = $OOBEPage < 2;

	onMount(() => {
		clm.updateProfile({});
		OOBEPage.set(0);
	});
</script>

<div class="wrapper">
	<div class="main">
		<div class="setup">
			<div class="fullcenter">
				{#if $OOBEPage == 0}
					<OOBECustomizePFP />
				{:else if $OOBEPage == 1}
					<OOBECustomizeTheme />
				{:else if $OOBEPage == 2}
					<h1>That's it!</h1>
					<button
						on:click={() => {
							OOBERunning.set(false);
						}}>Let's go!</button
					>
				{:else}
					<p>You aren't supposed to be here.</p>
					<p>Current Page: {$OOBEPage}</p>
				{/if}
			</div>
		</div>
	</div>
	<div class="footer">
		<button
			class="full"
			disabled={!allowPrevious}
			on:click={() => {
				OOBEPage.set($OOBEPage - 1);
			}}
		>
			&lt;- Back
		</button>
		<button
			class="center full"
			on:click={() => {
				OOBERunning.set(false);
			}}>Skip</button
		>
		<button
			class="right full"
			disabled={!allowNext}
			on:click={() => {
				OOBEPage.set($OOBEPage + 1);
			}}
		>
			Next -&gt;
		</button>
	</div>
</div>

<style>
	.wrapper {
		width: 100%;
		height: 100%;
	}

	.main {
		height: calc(100% - 3em);
	}

	.setup {
		text-align: center;
		display: table;
	}

	.footer {
		height: 3em;
		display: flex;
		align-items: stretch;
		justify-content: space-between;
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
