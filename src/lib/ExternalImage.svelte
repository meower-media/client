<script>
	export let title;
	export let url;
</script>

<div class="AttachmentClass">
	<a href={url} target="_blank" rel="noreferrer">
		<img src={url} alt={title} class="post-image" />
	</a>
</div>

<style>
	.post-image {
		max-height: 12em;
		max-width: 100%;
		border-radius: 5px;
	}
</style>
