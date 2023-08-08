<!-- A reply. -->
<script>
	import Container from "./Container.svelte";
    import PFP from "./PFP.svelte";
    import {apiUrl} from "./urls.js";

	export let post;
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
        {#if info.p.includes(":") &&
            info.u === "Discord" ||
            info.u === "revolt" ||
            info.u === "Revower"
        }
            {#await fetch(`https://api.meower.org/users/${info.p.split(": ")[0]}`).then(res => res.json())}
                <PFP
                    icon={-1}
                    alt="{info.p.split(": ")[0]}'s profile picture"
                    online={false}
                    size={0.3}
                />
            {:then user} 
                <PFP
                    icon={user.pfp_data}
                    alt="{info.p.split(": ")[0]}'s profile picture"
                    online={false}
                    size={0.3}
                />
            {/await}
            <span>
                <b>{info.p.split(": ")[0]}</b>
                {info.p.slice(info.p.indexOf(": ") + 1)}
            </span>
        {:else}
            {#await fetch(`https://api.meower.org/users/${info.u}`).then(res => res.json())}
                <PFP
                    icon={-1}
                    alt="{info.u}'s profile picture"
                    online={false}
                    size={0.3}
                />
            {:then user} 
                <PFP
                    icon={user.pfp_data}
                    alt="{info.u}'s profile picture"
                    online={false}
                    size={0.3}
                />
            {/await}
            <span>
                <b>{info.u}</b>
                {info.p.split(/^@\w+\s\[\w+-\w+-\w+-\w+-\w+\]\s*/i).join(" ")}
            </span>
        {/if}
    {:catch error}
        <span>
            <b>Error fetching post:</b>
            <code>{error}</code>
        </span>
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