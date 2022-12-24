<!-- To nobody's surprise, a profile picture! -->
<script>
	export let icon = -1;
	export let alt = "Profile picture";
	export let online = false;
	export let size = 1;

	// only respond to `icon` changing
	let id;
	function setId(val) {
		id = val;
	}
	$: setId(icon);
</script>

<span class="pfp-container" style:--size={size}>
	{#if online}
		<span class="online" />
	{/if}
	<span class="pfp">
		<img
			{alt}
			title={alt}
			src={new URL(
				`./../assets/avatars/icon_${
					id === -1 ? 21 : id === -2 ? "err" : id - 1
				}.svg`,
				import.meta.url
			).href}
			on:error|once={() => (id = -2)}
			class:loading={icon === -1}
			draggable={false}
			width="auto"
			height="100%"
		/>
	</span>
</span>

<style>
	.pfp-container {
		display: inline-block;
		position: relative;
	}
	.pfp {
		width: calc(var(--size) * 3.75em);
		height: calc(var(--size) * 3.75em);
		box-sizing: border-box;

		background-color: var(--pfp-bg);
		border: solid 1.5px var(--pfp-outline);
		border-bottom-width: 5px;
		border-radius: calc(var(--size) * 1.25em);

		display: flex;
		align-items: center;
		justify-content: center;
		user-select: none;

		/* Always make fallback text visible */
		color: black;
	}

	.loading {
		animation: spin 0.5s linear infinite;
		filter: saturate(0) brightness(1.5);
	}
	@keyframes spin {
		from {
			transform: rotate(0turn);
		}
		to {
			transform: rotate(1turn);
		}
	}

	.online {
		display: inline-block;

		width: calc(var(--size) * 1em);
		height: calc(var(--size) * 1em);
		border-radius: 100%;

		background-color: limegreen;

		position: absolute;
		bottom: calc(var(--size) * -0.2em);
		right: calc(var(--size) * -0.2em);
		z-index: 1;
	}
</style>
