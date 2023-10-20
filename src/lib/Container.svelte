<!--
	The typical Meower container, used literally everywhere.
-->
<script>
	export let warning = false;
</script>

<div class={warning ? "warning" : ""}><slot /></div>

<style>
	div {
		background-color: var(--background);
		border: solid 2px var(--orange);
		border-radius: 5px;
		padding: 0.6em;
		margin-bottom: 0.4em;
		overflow-wrap: break-word;
		position: relative;
		overflow: auto;
	}

	.warning {
		background-color: #eb4e33;
		border: none;
		color: white;
	}
</style>
