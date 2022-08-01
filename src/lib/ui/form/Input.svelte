<!-- note: this component is for text inputs only -->
<script>
	import {play} from "../../audio/sfx.js";

	export let white = false;
	export let fullWidth = false;
	export let sound = true;
	export let type = "text";

	export let placeholder = null,
		autocomplete = null,
		maxlength = null,
		id = null,
		name = null;

	export let disabled = false;
</script>

<input
	class:white={white}
	class:full-width={fullWidth}
	class="meower-ui meower-input"

	{type}

	{placeholder} {autocomplete} {maxlength} {id} {name}

	on:focus={() => {
		if (sound) play("select");
	}}

	on:click
	on:focus
	
	{disabled}
>