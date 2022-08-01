<!--
	The typical Meower container, used literally everywhere*.
	*in the homepage, settings and profile
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