<script>
	import PFP from "./PFP.svelte";
	import {goto} from "@roxi/routify";

	export let username = "";
	export let url = "";
	export let pfp = null;
	export let isMeower = false;

	$: if (isMeower) url = "/users/" + username;
</script>

<a
	target="_blank"
	href={url}
	title={username}
	class="contributor"
	on:click={e => {
		if (!isMeower) return;
		e.preventDefault();
		$goto(url);
	}}
>
	{#if isMeower && pfp != null}
		<div class="contrib-pfp">
			<PFP icon={Number(pfp)} alt={username} size={3 / 3.75} />
		</div>
	{:else if pfp}
		<img class="contrib-pfp" src={pfp} alt={username} />
	{/if}
	<div class="contrib-text">
		<b class="contrib-username">{username}</b>
		<slot />
	</div>
</a>

<style>
	.contributor {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;

		box-sizing: content-box;
		height: 3em;
		border-radius: 5px;
		padding: 0.3em;
		overflow: hidden;

		background-color: var(--background);
		border: solid 2px var(--orange);
		color: var(--foreground);
		text-decoration: none;
	}
	.contrib-pfp {
		flex-shrink: 0;
		flex-grow: 0;
		height: 3em;
		width: 3em;
		border-radius: 0.3em;
	}
	.contrib-text {
		flex-shrink: 1;
		flex-grow: 1;

		width: 100%;
		padding-left: 0.6em;
	}
	.contrib-username {
		font-size: 1.25em;
		font-weight: bold;
		display: block;
	}
	.contrib-username,
	.contrib-text {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	:global(main.input-hover) .contributor.contributor:hover,
	.contributor.contributor:focus-visible {
		background-color: #7773;
	}
	:global(#main) .contributor.contributor:active {
		background-color: #7776;
	}
</style>
