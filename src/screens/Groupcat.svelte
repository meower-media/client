<script>
    import Cats from "../lib/MEOW.svelte";
</script>

<svelte:head>
	<title>GROUP CAT 2.0!!!</title>
</svelte:head>

<div>
    <div class="message">GROUP CAT 2.0!!!!</div>
    <Cats />
</div>

<style>
	.message {
		position: absolute;
		z-index: 1;
	}
</style>