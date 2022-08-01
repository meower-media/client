<!-- Where all the actual chatting action is. -->

<script>
	import Home from "./Home.svelte";
	import Profile from "./Profile.svelte";
	import Settings from "./Settings.svelte";
	import MidSetup from "./MidSetup.svelte";
	import Groupcat from "./Groupcat.svelte";

	import Sidebar from "./Sidebar.svelte";

	import BGM from "../lib/audio/BGM.svelte";

	import {mainPage as page, user} from "../lib/stores.js";

	page.set("home");
</script>

{#if $page === "midsetup"}
	<MidSetup />
{:else}
	<div class="main-screen">
		<div class="sidebar">
			<Sidebar />
		</div>
		<div class="view"> 
			{#if $page === "home"}
				<Home />
			{:else if $page === "profile"}
				<Profile />
			{:else if $page === "settings"}
				<Settings />
			{:else if $page === "groupchat"}
				<Groupcat />
			{:else if $page === "midsetup"}
				<div></div>
			{:else if $page === "blank"}
				<div></div>
			{:else}
				Somehow, you got to a page that doesn't exist...
				<br />
				(Current page: {$page})
			{/if}
		</div>
	</div>
{/if}

<BGM
	muted={!$user.bgm}
	songId={$user.bgm_song}
/> 

<style>
	.main-screen {
		box-sizing: border-box;
	}

	.sidebar {
		position: fixed;
		left: 0;
		top: 0;
		width: 3.5em;
		height: 100%;
		z-index: 100;
	}
	.view {
		margin-left: 3.5em;
		padding: 0.33em;

		box-sizing: border-box;
		
		background-color: var(--background);
	}

	@media (max-aspect-ratio: 1/1) {
		.view {
			margin-left: 0;
			margin-top: 3.5em;
		}
		.sidebar {
			width: 100%;
			height: 3.5em;
		}
	}
	:global(main.layout-old) .view {
		margin-left: 0;
		margin-top: 3.5em;
	}
	:global(main.layout-old) .sidebar {
		width: 100%;
		height: 3.5em;
	}
</style>
