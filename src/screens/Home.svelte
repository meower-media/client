<!--
	The home page!
	It features live post updates and a load more button which is pretty nice.
-->
<script>
	import {ulist} from "../lib/stores.js";
	import Container from "../lib/Container.svelte";
	import PostList from "../lib/PostList.svelte";
</script>

<div class="home">
	<div class="overflow">
		<Container>
			<h1>Home</h1>
			{#if $ulist.length == 1}
				You are the only user online.
			{:else if $ulist.length == 0}
				Nobody is online.
			{:else}
				There are currently {$ulist.length} users online{#if $ulist.length}{" "}({$ulist.join(
						", "
					)}){/if}.
			{/if}
		</Container>
	</div>
	<PostList fetchUrl="home" postOrigin="home" canPost={true} />
</div>

<style>
	.home {
		height: 100%;
	}
	.overflow {
		overflow: scroll
	}
</style>
