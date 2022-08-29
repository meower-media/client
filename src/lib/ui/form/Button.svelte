<script>
	import {play} from "../../audio/sfx.js";

	export let white = false;
	export let fullWidth = false;
	export let sound = true;
	export let style = "normal";
	
	export let title = "";
	export let disabled = false;
</script>

<button
	class:white={white}
	class:full-width={fullWidth}
	class:meower-ui={style !== "none"}
	class:meower-btn={style !== "none"}
	class={style}

	on:mouseenter={async () => {
		if (sound) play("select");
	}}
	on:click={async () => {
		if (sound) play("menu");
	}}

	on:click
	
	{title} {disabled}
>
	<slot />
</button>