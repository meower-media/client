<!--
	Home but it's a user's posts.
-->
<script>
	import Container from "../../../lib/Container.svelte";
	import PostList from "../../../lib/PostList.svelte";

	import {params} from "@roxi/routify";
</script>

<div class="posts">
	<Container>
		<h1>{$params.username}'s Recent Posts</h1>
		Here are {$params.username}'s recent posts.
	</Container>
	<PostList
		fetchUrl="users/{$params.username}/posts"
		postOrigin="home"
		canPost={false}
	>
		<Container slot="empty">
			{$params.username} hasn't made any posts yet.
		</Container>
	</PostList>
</div>

<style>
	.posts {
		height: 100%;
	}
</style>
