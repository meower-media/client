<!--
	The typical Meower container, used literally everywhere.
-->

<div><slot /></div>

<style>
	div {
		background-color: var(--background);
		border: solid 2px var(--orange);
		border-radius: 1px;
		padding: 0.6em;
		margin-bottom: 0.4em;
		overflow-wrap: break-word;
		position: relative;
	}
</style>
