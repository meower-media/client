<script>
	import Cats from "../lib/MEOW.svelte";
	import {goto} from "@roxi/routify";

	let Hide = false
</script>

<div>
	<div class="message">GROUP CAT 2.0!!!!</div>
	{#if !Hide}
		<Cats />
		<button class="help"
			on:click={() => {Hide = true}}
		>AAAAAA THERE'S TOO MANY</button>
	{/if}
	<button class="EasterEgg"
		on:click={() => {$goto("/easteregg")}}
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

	.EasterEgg {
		background-color: var(--background);
		border: none;
	}

	.EasterEgg:hover {
		background-color: var(--background) !important;
	}

	.EasterEgg:active {
		background-color: red !important;
	}
</style>
