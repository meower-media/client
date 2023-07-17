<!--
	The typical Meower container, used literally everywhere.
-->

<div><slot /></div>

<style>
	div {
		background-color: var(--container-color);
		border-radius: 10px;
		padding: 0.6em;
		margin-bottom: 0.4em;
		overflow-wrap: break-word;
		position: relative;
		overflow: auto;
	}
</style>
