<!--
	Home but it's a user's posts.
-->
<script>
	import {profileClicked} from "../lib/stores.js";
	import Container from "../lib/Container.svelte";
	import PostList from "../lib/PostList.svelte";
</script>

<div class="posts">
	<Container>
		<h1>{$profileClicked}'s Recent Posts</h1>
		Here are {$profileClicked}'s recent posts.
	</Container>
	<PostList
		fetchUrl="users/{$profileClicked}/posts"
		postOrigin=""
		canPost={false}
	>
		<Container slot="empty">
			{$profileClicked} hasn't made any posts yet.
		</Container>
	</PostList>
</div>

<style>
	.posts {
		height: 100%;
	}
</style>
