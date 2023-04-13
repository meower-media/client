<!--
	The typical Meower container, used literally everywhere.
-->

<div><slot /></div>

<style>
	div {
		background-color: var(--background);
		border: solid 4px var(--orange);
		border-radius: 11px;
		padding: 0.6em;
		margin-bottom: 0.6em;
		overflow-wrap: break-word;
		position: relative;
		overflow: auto;
		filter: drop-shadow(0 4px 0 var(--orange-dark));
	}
</style>
