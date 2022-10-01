<!--
	The typical Meower container, used literally everywhere*.
	*in the homepage, settings and profile
-->

<div><slot /></div>

<style>
	div {
		background-color: var(--background);
		border: solid 4px var(--orange);
		border-radius: 15px;
		padding: 0.7em;
		margin-bottom: 0.6em;
		overflow-wrap: break-word;
		position: relative;
		box-shadow: 0px 4px 0px 0px var(--orange-scrollbar-back);
	}
</style>