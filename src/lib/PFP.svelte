<!-- To nobody's surprise, a profile picture! -->

<script>
	export let icon = -1;
	export let alt = "Profile picture";
	export let online = false;
	export let big = false;
</script>

<span class="pfp-container" class:big>
	{#if online}
		<span class="online"></span>
	{/if}
	<span class="pfp">
		<img
			{alt}
			title={alt}
			src="/avatars/icon_{
				icon < 0 ? (icon === -1 ? 21 : "err") : icon-1}.svg"
			class:loading={icon === -1}
			draggable={false}
			width="auto"
			height="100%"
		>
	</span>
</span>

<style>
	.pfp-container {
		display: inline-block;
		position: relative;
	}
	.big .pfp {
		width: 5em;
		height: 5em;
	}
	.pfp {
		width: 3.75em;
		height: 3.75em;
		box-sizing: border-box;

		background-color: var(--pfp-bg);
		border: solid 1.5px var(--pfp-outline);
		border-bottom-width: 5px;
		border-radius: 1.25em;

		display: flex;
		align-items: center;
		justify-content: center;
		user-select: none;
	}

	.loading {
		animation: spin 0.5s linear infinite;
		filter: saturate(0) brightness(1.5);
	}
	@keyframes spin {
		from {transform: rotate(0turn);}
		to {transform: rotate(1turn);}
	}

	.online {
		display: inline-block;

		width: 1em;
		height: 1em;
		border-radius: 100%;

		background-color: limegreen;

		position: absolute;
		bottom: -0.2em;
		right: -0.2em;
		z-index: 1;
	}
	.big .online {
		width: 1.25em;
		height: 1.25em;
	}
</style>