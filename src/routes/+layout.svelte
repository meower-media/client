<script>
	import './styles.css';
</script>

<div class="app">
	<main>
		<slot />
	</main>
</div>

<style>
	.app {
		--background-color: #1a1b1e;
		--color: #f5f8fb;
		--accent-color: #3a3d43;
    	--hov-accent-color: #323439;
    	--hov-color: #4a4d56;

		background-color: var(--background-color);
    	color: var(--color);

		height: 100vh;
		width: 100vw;
	}
</style>
