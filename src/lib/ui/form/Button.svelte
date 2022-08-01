<script>
	import {play} from "../../audio/sfx.js";

	export let white = false;
	export let fullWidth = false;
	export let sound = true;
	export let style = "normal";

	export let disabled = false;
</script>

<button
	class:white={white}
	class:full-width={fullWidth}
	class="meower-ui meower-btn {style}"

	on:mouseenter={() => {
		if (sound) play("select");
	}}
	on:click={() => {
		if (sound) play("menu");
	}}

	on:click
	
	{disabled}
>
	<slot />
</button>