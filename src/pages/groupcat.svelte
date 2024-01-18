<script>
	import {goto} from "@roxi/routify";
</script>

<div>
	<h1 class="message">Group cat mode activated</h1>
	<button class="easter-egg" on:click={$goto("/easteregg")} />
</div>

<style>
	.message {
		position: absolute;
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
