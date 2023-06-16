<script>
	import Container from "../lib/Container.svelte";
	import logo from "../assets/logo.svg";
	import version from "../lib/version.js";
	import {profileClicked, mainPage as page} from "../lib/stores.js";
	import meowy from "../assets/meowy.svg";
	import Changelog from "./Changelog.svelte";

	const CONTRIBUTORS = [
		"CST1229",
		"tnix100",
		"Bloctans",
		"JoshAtticus",
		"ShowierData9978",
		"silvxrcat",
		"mdwalters",
		"williamhorning",
		"zedthehedgehog",
		"ArrowAced",
		"theotherhades",
	];
	const MEOWER_USERNAMES = {
		tnix100: "tnix",
	};
	const CONTRIBUTOR_ROLES = {
		CST1229: "creator of this client",
	};

	function gotoProfile(username) {
		profileClicked.set(username);
		page.set("profile");
	}

	var _Changelog = false
</script>

<Container>
	<h1>
		<img src={logo} alt="Meower" height="80" />
	</h1>
	Svelte Client, v{version}
	<br />
	All of Meower is free and open-source!
	<a href="https://github.com/Meower-Media-Co">See the source code here.</a>
</Container>
<Container>
	<h2>Credits</h2>
	Meower is possible thanks to these amazing people:

	<h3>The People Who Started It All</h3>
	<ul>
		<li>
			<a
				href="/"
				on:click|preventDefault={() => {
					gotoProfile("MikeDEV");
				}}>@MikeDEV</a
			>
			(<a href="https://github.com/MikeDEV">GitHub</a>) - current owner of
			Meower and creator of the
			<a href="https://old.meower.org">old Scratch client</a>
		</li>
		<li>
			<a
				href="/"
				on:click|preventDefault={() => {
					gotoProfile("silvxrcat");
				}}>@silvxrcat</a
			>
			(<a href="https://github.com/silvxrcat">GitHub</a>) - original
			creator of Meower
		</li>
	</ul>

	<h3>Client Contributors</h3>
	<ul>
		{#each CONTRIBUTORS as username}
			<li>
				{#if MEOWER_USERNAMES[username] !== null}<a
						href="/"
						on:click|preventDefault={() => {
							gotoProfile(MEOWER_USERNAMES[username] || username);
						}}>@{MEOWER_USERNAMES[username] || username}</a
					>{:else}
					{username}{/if} (<a href="https://github.com/{username}"
					>GitHub</a
				>) {#if CONTRIBUTOR_ROLES[username]}
					- {CONTRIBUTOR_ROLES[username]}
				{/if}
			</li>
		{/each}
	</ul>

	<h3>Other Contributors</h3>
	<ul>
		<li>
			<a href="https://scratch.mit.edu/users/trappist-1e">@trappist-1e</a>
			on Scratch - <img src={meowy} alt="Meowy" height="20" /> Meowy's original
			creator
		</li>
	</ul>
</Container>
{#if !_Changelog}
	<button
		class="long"
		title="View Changelog"
		on:click={() => (_Changelog = true)}
		>View Changelog</button
	>
{/if}
{#if _Changelog}
	<Changelog />
{/if}

<style>
	.long {
		width: 100%;
		margin: 0;
		margin-bottom: -2px;
	}

	h1 {
		margin: 0;
	}
	h3 {
		margin: 0.5em 0;
	}
</style>
