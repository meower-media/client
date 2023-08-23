<script>
	import Cats from "../lib/MEOW.svelte";
	import {goto} from "@roxi/routify";
</script>

<div>
	<div class="message">GROUP CAT 2.0!!!!</div>
	<Cats />
	<button class="EasterEgg"
		on:click={() => {$goto("/easteregg")}}
	></button>
</div>

<style>
	.message {
		position: absolute;
		z-index: 1;
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
