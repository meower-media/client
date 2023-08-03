<!-- A post. Profile pictures not appearing while not logged in is intentional. -->
<script>
	import Container from "./Container.svelte";
    import {apiUrl} from "./urls.js";
	import {onMount, tick} from "svelte";
	export let post;
    function initPostUser() {
        if (!post.user) return;
		if (post.content.includes(":")) {
			let bridged =
				post.user === "Discord" ||
				post.user === "revolt" ||
				post.user === "Revower";
			let webhook = post.user == "Webhooks";
		}
		if (bridged || webhook) {
			post.user = post.content.split(": ")[0];
			post.content = post.content.slice(post.content.indexOf(": ") + 1);
		}
    }
    onMount(initPostUser);
</script>

<Container>
    {#await fetch(`${apiUrl}posts?id=${post}`).then(res => res.json())}
        <span class="loading">
            <span class="circle circle1"></span>
            <span class="circle circle2"></span>
            <span class="circle circle3"></span>
            <b class="text">Loading...</b>
        </span>
    {:then info}
        {#if info.p.includes(":") ||
            info.u === "Discord" ||
            info.u === "revolt" ||
            info.u === "Revower"
        }
            <span><b>{info.p.split(": ")[0]}</b> {info.p.slice(info.p.indexOf(": ") + 1)}</span>
        {:else}
            <span><b>{info.u}</b> {info.p.split(/^\[\w+-\w+-\w+-\w+-\w+\]\s*/i).join(" ")}</span>
        {/if}
    {/await}
</Container>

<style>
	.loading {
		align-items: center;
		display: flex;
		height: 20px;
	}
	.circle {
		width: 10px;
		height: 10px;
		border-radius: 100%;
		display: inline-block;
		background: var(--orange-button);
		margin-right: 4px;
		animation: jump 0.5s infinite cubic-bezier(.45,.05,.55,.95) alternate;
	}
	.circle1 {
		animation-delay: 0s;
	}
	.circle2 {
		animation-delay: -0.166s;
	}
	.circle3 {
		animation-delay: -0.333s;
	}
    .text {
        margin-left: 6px;
    }
	@keyframes jump {
		from {
			transform: translateY(0);
		}
		to {
			transform: translateY(-5px);
		}
	}
</style>
