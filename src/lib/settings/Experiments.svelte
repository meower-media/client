<script>
	import { tick } from "svelte";
	import Container from "../Container.svelte";

	import {hasExperiment, setExperiment} from "../bitField.js";
	import {screen} from "../stores.js";

	var a = hasExperiment(1)
</script>

<Container>
	<h1>Experiments/Beta features</h1>
	Here you can enable features that MAY not work correctly, or are a work in progress
</Container>

<Container hasborder>
    This page is currently a work in progress (ironically)...
	<br>
	Also experiments DO NOT save right now.
</Container>

<Container hasborder>
	<h2>Reload</h2>
	Some experiments MAY require a view reload, do it here!
	<br>
	(You will need to go back to this page manually after a reload)
	<br>
	<br>
	<button
		on:click={async () => {
			screen.set("blank");
			await tick();
			screen.set("main");
		}}
	>
		Click me
	</button>
	<br><br>
</Container>

<Container>
	<div class="settings-controls">
		<input
            type="checkbox"
			bind:checked={a}
			on:change={async () => {
                setExperiment(1, !hasExperiment(1))
            }}
		/>
	</div>

	<h2>Hello world!</h2>
	An example experiment to test out this new system of ours!
    <br />
    This experiment adds "Hello world!" to the top of every page!
</Container>