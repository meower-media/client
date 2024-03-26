<script>
	import Container from "../Container.svelte";


</script>

<Container>
	<h1>Experiments/Beta features</h1>
	Here you can enable features that MAY not work correctly, or are a work in progress
</Container>

<Container>
    This page is currently a work in progress (ironically)...
</Container>

<Container>
	<div class="settings-controls">
		<input
            type="checkbox"
			
			on:change={() => {
                alert("Placeholder")
            }}
		/>
	</div>

	<h2>Hello world!</h2>
	An example experiment to text out this new system of ours!
    <br />
    This experiment adds "Hello world!" to the search page!
</Container>