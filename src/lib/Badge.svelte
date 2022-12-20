<script>
	export let text = "BADGE";
	export let title = null;
	export let checkmark = false;
</script>

<span
	class="badge"
	alt="({text})"
	class:hastitle={title}
	{title}
	class:checkmark
>
	{text}
</span>

<style>
	.badge {
		background-color: var(--orange);
		color: var(--foreground-orange);

		height: 1.1em;
		border-radius: calc(1.1em / 2);
		padding: 0 0.33em;

		display: inline-flex;
		align-items: center;
		vertical-align: middle;

		overflow: hidden;

		cursor: default;
	}

	.badge.hastitle {
		cursor: help;
	}

	.checkmark::before {
		content: "✔";
		margin-right: 0.25em;
		/* weird height trickery to align the checkmark */
		height: 1.5em;
	}
</style>
