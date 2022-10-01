<!-- Where all the actual chatting action is. -->

<script>
	import Home from "./Home.svelte";
	import Inbox from "./Inbox.svelte";
	import Chatlist from "./Chatlist.svelte";
	import Groupchat from "./Groupchat.svelte";
	import Profile from "./Profile.svelte";
	import Recent from "./Recent.svelte";
	import Settings from "./Settings.svelte";
	import Groupcat from "./Groupcat.svelte";	

	import Sidebar from "./Sidebar.svelte";

	import {mainPage as page} from "../lib/stores.js";

	page.set("home");
</script>

<div class="main-screen">
	<div class="sidebar">
		<Sidebar />
	</div>
	<div class="view"> 
		{#if $page === "home"}
			<Home />
		{:else if $page === "inbox"}
			<Inbox />
		{:else if $page === "chatlist"}
			<Chatlist />
		{:else if $page === "groupchat"}
			<Groupchat />
		{:else if $page === "profile"}
			<Profile />
		{:else if $page === "recent"}
			<Recent />
		{:else if $page === "settings"}
			<Settings />
		{:else if $page === "groupcat"}
			<Groupcat />
		{:else if $page === "groupchat"}
			<Groupchat />
		{:else if $page === "blank"}
			<div></div>
		{:else}
			Somehow, you got to a page that doesn't exist...
			<br />
			(Current page: {$page})
		{/if}
	</div>
</div>

<style>
	.main-screen {
		box-sizing: border-box;
	}

	.sidebar {
		position: fixed;
		left: 0;
		top: 0;
		width: 4.6em;
		height: 100%;
		z-index: 100;
	}
	.view {
		margin-left: 5em;
		padding: 0.33em;
		
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
