<script>
	export let muted = true;
	export let songId = 1;

	import songs from "./songs.js";
</script>

<audio
	autoplay
	loop
	{muted}
	src={muted ? null : ((songs[songId - 1] || {}).src || null)}
></audio>