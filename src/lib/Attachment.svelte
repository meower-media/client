<!--
    Generic Meower attachment wrapper
-->

<script>
	import { uploadsUrl } from "./urls";

	export let id;
	export let filename;
	export let mime;

	let url;
	let previewUrl;
	$: {
		url = `${uploadsUrl}attachments/${id}/${filename}`;
		previewUrl = `${url}?preview`;
	}
</script>

<div class="AttachmentClass">
	<a href={url} target="_blank" rel="noreferrer">
		{#if mime.startsWith("image/")}
			<img src={previewUrl} alt={filename} class="post-image" />
		{:else if mime.startsWith("video/")}
			<!-- svelte-ignore a11y-media-has-caption -->
			<video src={previewUrl} controls class="post-image" />
		{:else if mime.startsWith("audio/")}
			<!-- svelte-ignore a11y-media-has-caption -->
			<audio controls>
				<source src={previewUrl} />
			</audio>
		{:else}
			{filename}
		{/if}
	</a>
</div>

<style>
	.post-image {
		max-height: 12em;
		max-width: 100%;
		border-radius: 5px;
		overflow: hidden;
	}
</style>
