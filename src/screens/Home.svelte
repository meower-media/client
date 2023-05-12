<!--
	The home page!
	It features live post updates and a load more button which is pretty nice.
-->
<script>
	import {ulist, mainPage} from "../lib/stores.js";
	import Container from "../lib/Container.svelte";
	import PostList from "../lib/PostList.svelte";
	import * as Modals from "../lib/Modals.js"
</script>

<div class="home">
	<button on:click={() => {}}
	<Container>
		<h1>Home</h1>
		<div class="overflow">
			{#if $ulist.length == 1}
				You are the only user online.
			{:else if $ulist.length == 0}
				Nobody is online.
			{:else}
				There are currently {$ulist.length} users online ({$ulist.join(
					", "
				)}).
			{/if}
		</div>
	</Container>
	<PostList fetchUrl="home" postOrigin="home" canPost={true} />
</div>

<style>
	.home {
		height: 100%;
	}
</style>
