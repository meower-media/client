<script>
	import Container from "../lib/Container.svelte";
	import Loading from "../lib/Loading.svelte";
	import version from "../lib/version.js";
	import logo from "../assets/logo.svg";
	import meowy from "../assets/meowy.svg";

	import Contributor from "../lib/Contributor.svelte";

	import {onMount} from "svelte";

	const REPO_OWNER = "meower-media-co";
	const REPO_NAME = "Meower-Svelte";

	async function fetchContributors() {
		const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contributors`);
		if (!res.ok) {
			throw new Error(`Received response code: ${res.status} ${res.statusText}`)
		}
		const json = await res.json();

		const shuffled = [];
		while (json.length > 0) {
			const index = Math.floor(Math.random() * json.length);
			shuffled.push(json[index]);
			json.splice(index, 1);
		}
		return shuffled;
	}
</script>

<h1 class="logo center">
	<img src={logo} alt="Meower" height="80" />
</h1>
<b class="center friendlier">The friendlier social media for everyone.</b>
<div class="center">Svelte Client, version {version}</div>
<div class="center links">
	<a href="https://meower.org">Learn more</a>
	|
	<a href="https://github.com/meower-media-co">Source code</a>
</div>

<Container>
	<h2>The Council</h2>
	<p>These people have the highest authority of the Meower project.</p>
	<div class="contributors-list">
		<Contributor
			username="MikeDEV"
			pfp={26}
			isMeower={true}
		>
			Current owner of Meower
		</Contributor>
		<Contributor
			username="tnix"
			pfp={20}
			isMeower={true}
		>
			Backend developer
		</Contributor>
		<Contributor
			username="silvxrcat"
			pfp={-3}
			isMeower={true}
		>
			Original owner of Meower
		</Contributor>
		<Contributor
			username="CST1229"
			pfp={-1}
			isMeower={true}
		>
			Frontend developer
		</Contributor>
		<Contributor
			username="zedthehedgehog"
			pfp={22}
			isMeower={true}
		>
			Designer
		</Contributor>
		<Contributor
			username="DaCatBlock"
			pfp={23}
			isMeower={true}
		>
			Web developer
		</Contributor>
		<Contributor
			username="Voxalice"
			pfp={28}
			isMeower={true}
		>
			Musician
		</Contributor>
	</div>
</Container>
<Container>
	<h2>Client Contributors</h2>
	<p>(This list uses GitHub usernames/PFPs and the order is randomized.)</p>
	{#await fetchContributors()}
		<Loading></Loading>
	{:then contributors}
		<div class="contributors-list">
			{#each contributors as contributor}
				{#if contributor.type === "User"}
					<Contributor
						username={contributor.login}
						url={contributor.html_url}
						pfp={contributor.avatar_url}
					>
						{contributor.contributions} commit{contributor.contributions === 1 ? "" : "s"}
					</Contributor>
				{/if}
			{/each}
		</div>
	{:catch e}
		<p>An error occurred!</p>
		<pre><code>{e}</code></pre>
	{/await}
</Container>
<Container>
	<h2>Special Thanks</h2>
	<div class="contributors-list">
		<Contributor
			username="trappist-1e"
			url="https://scratch.mit.edu/users/trappist-1e/"
			pfp="https://uploads.scratch.mit.edu/get_image/user/61483990_100x100.png"
		>
			<img class="inline-meowy" src={meowy} height="24" alt="Meowy"> Original creator of Meowy
		</Contributor>
	</div>
</Container>

<style>
	.center {
		text-align: center;
		display: block;
	}
	.logo {
		margin-bottom: 0;
	}
	.friendlier {
		font-size: 1.25em;
	}

	.links {
		margin-bottom: 1em;
	}

	.contributors-list {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(15em, 1fr));
		grid-gap: 0.5em;
	}

	.inline-meowy {
		vertical-align: middle;
	}
</style>
