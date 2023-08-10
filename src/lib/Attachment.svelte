<script>
	import Container from "./Container.svelte";
	import { meowerRequest } from "./clmanager";

    export let title;
    export let url;
    export let type;

    let typesplit = type.split(";")[0].split("/")[0]

    let show = true
</script>

<div class="AttachmentClass">
    {#if show}
        <a href={url} target="_blank" rel="noreferrer">
            {#if typesplit == "image"}
                <img src={url} alt={title} {title} class="post-image" />
            {:else if typesplit == "video"}
                <!-- svelte-ignore a11y-media-has-caption -->
                <video src={url} controls class="post-image" />
            {:else if typesplit == "audio"}
                <!-- svelte-ignore a11y-media-has-caption -->
                <audio controls>
                    <source src={url}>
                </audio>
            {:else}
                Other File Type ({type})
            {/if}
        </a>
    {/if}
</div>

<style>
    .post-image {
		max-height: 12em;
		max-width: 100%;
        border-radius: 5px;
	}
</style>