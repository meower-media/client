<script>
	export let text = "BADGE";
	export let title = null;
</script>

<span
	class="badge"
	alt="({text})"
	class:hastitle={title}
	{title}
>{text}</span>

<style>
	.badge {
		background-color: var(--orange);
		color: var(--foreground-orange);

		height: 1.1em;
		border-radius: calc(1.10em / 2);
		padding: 0 0.33em;

		display: inline-flex;
		align-items: center;

		cursor: default;
	}

	.badge.hastitle {
		cursor: help;
	}

</style>