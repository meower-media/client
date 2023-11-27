<!--
	The home page!
	It features live post updates and a load more button which is pretty nice.
-->
<script>
	import PostList from "../lib/PostList.svelte";
</script>

<div class="home">
	<PostList fetchUrl="home" postOrigin="home" canPost={true} />
</div>

<style>
	.home {
		height: 100%;
	}
</style>
