<script>
	import Cats from "../lib/MEOW.svelte";
	import {goto} from "@roxi/routify";

	let hide = false
</script>

<div>
	<div class="message">GROUP CAT 2.0!!!!</div>
	{#if !hide}
		<Cats />
		<button class="help"
			on:click={() => hide = true}
		>AAAAAA THERE'S TOO MANY</button>
	{/if}
	<button class="easter-egg"
		on:click={$goto("/easteregg")}
	></button>
</div>

<style>
	.message {
		position: absolute;
		z-index: 1;
	}

	.help {
		z-index: 1;
		position: absolute;
		top: 5%;
	}

	.easter-egg {
		background-color: var(--background);
		border: none;
	}

	.easter-egg:hover {
		background-color: var(--background) !important;
	}

	.easter-egg:active {
		background-color: red !important;
	}
</style>
