<script>
	export let data;
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

{#if data.isclient}
	Client sided
{:else}
	Server sided
{/if}

<style>
	
</style>
