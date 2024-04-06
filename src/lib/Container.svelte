<!--
	The typical Meower container, used literally everywhere.
-->
<script>
	export let warning = false;
	export let hasborder = false;
</script>

<div class={warning ? "warning" : ""}>
	<slot />
	{#if hasborder}
		<div class="border"></div>
	{/if}
</div>

<style>
	div {
		background-color: var(--background);
		padding: 0.6em;
		margin-bottom: 0.4em;
		overflow-wrap: break-word;
		position: relative;
		overflow: auto;
		border-radius: 0.4em;
		/*background-color: rgba(40, 40, 40, .15);  
 		backdrop-filter: blur(5px);*/
	}

	.settings-controls {
		position: absolute;
		top: 0.25em;
		right: 0.25em;
	}

	.border {
		border-bottom: 2px solid var(--orange);
		border-radius: 0;
	}

	.warning {
		background-color: #eb4e33;
		border: none;
		color: white;
	}
</style>
