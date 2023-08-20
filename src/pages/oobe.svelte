<script>
	import OOBECustomizePFP from "../lib/OOBE/CustomizePFP.svelte";
	import OOBECustomizeTheme from "../lib/OOBE/CustomizeTheme.svelte";

	import {sidebarLocked, OOBEPage, user} from "../lib/stores.js";
	import * as clm from "../lib/clmanager.js";

	import {goto} from "@roxi/routify";

	clm.updateProfile();

	OOBEPage.set(0);

	$: allowPrevious = $OOBEPage > 0;
	$: allowNext = $OOBEPage < 2;

	sidebarLocked.set(true);
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
							sidebarLocked.set(false);
							$goto("/home");
						}}>Let's go!</button
					>
				{:else}
					<p>{$OOBEPage}</p>
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
				sidebarLocked.set(false);
				$goto("/home");
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
