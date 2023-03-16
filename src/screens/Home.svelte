<!--
	The home page!
	It features live post updates and a load more button which is pretty nice.
-->
<script>
	import {
		ulist,
	} from "../lib/stores.js";
	import Container from "../lib/Container.svelte";
	import PostList from "../lib/PostList.svelte";
</script>

<div class="home">
	<Container>
		<h1>Home</h1>
            {#if _ulist.length == 1}
                You are the only user online.
            {:else if _ulist.length == 0}
                Nobody is online.
            {:else}
			    There are currently {_ulist.length} users online{#if _ulist.length}{" "}({_ulist.join(
					", "
				)}).
        {/if}
	</Container>
	<PostList
		fetchUrl="home"
		postOrigin="home"
		canPost={true}
	/>
</div>

<style>
	.home {
		height: 100%;
	}
</style>
