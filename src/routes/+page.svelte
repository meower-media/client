<script>
	import {
		goto
	} from '$app/navigation';

	export let data;
	
	let metacontent = ""
	let c = data.isclient

	if (c) {
		goto("/setup")
	}
</script>

<svelte:head>
	<title>Meower</title>
	<meta name="description" content="Meower media platform" />
</svelte:head>

{#if !c}
	Loading...
{:else}
	Still Loading...
{/if}