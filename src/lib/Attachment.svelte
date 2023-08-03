<script>
	import Container from "./Container.svelte";

    export let title;
    export let url;
    export let type;

    let typesplit = type.split(";")[0].split("/")[0]

    let show = true
    let other = false
</script>

<div class="AttachmentClass">
    {#if show}
        {#if typesplit == "image"}
            <a href={url} target="_blank" rel="noreferrer">
                <img src={url} alt={title} {title} class="post-image" />
            </a>
        {:else if typesplit == "video"}
            <a href={url} target="_blank" rel="noreferrer">
                <!-- svelte-ignore a11y-media-has-caption -->
                <video src={url} controls class="post-image" />
            </a>
        {:else}
            <a href={url} target="_blank" rel="noreferrer">Other File Type ({type})</a>
        {/if}
    {/if}
</div>

<style>
    .post-image {
		max-height: 12em;
		max-width: 100%;
        border-radius: 5px;
	}
</style>