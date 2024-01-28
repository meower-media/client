<!-- A component for showing shortened large numbers (like 1k etc). -->
<script>
	export let num = 0;
	// we don't need negative numbers but why not
	$: magnitude = Math.abs(num);

	function round(n, decimals) {
		return +n.toFixed(decimals);
	}
</script>

{#if isNaN(num) || num === Infinity || num === -Infinity || magnitude < 1000}
	{num}
{:else if magnitude < 1_000_000}
	{round(num / 1000, 2)}k
{:else if magnitude < 1_000_000}
	{round(num / 1_000_000, 2)}M
{:else}
	<!-- how -->
	{round(num / 1_000_000_000, 2)}B
{/if}
