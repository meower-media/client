<!--
	Home except it's now implemented.
-->
<script>
	import PostList from "../lib/PostList.svelte";
	import Container from "../lib/Container.svelte";
	import {searchQuery, searchType} from "../lib/stores.js";
</script>

<div class="search-results">
	<Container>
		{#if $searchQuery === ""}
			{#if $searchType === "users"}
				<h1>All Users</h1>
			{:else}
				<h1>All Home Posts</h1>
			{/if}
		{:else}
			<h1>Search Results for "{$searchQuery}"</h1>
		{/if}
	</Container>
	<PostList
		fetchUrl="search/{$searchType}"
		queryParams={{q: $searchQuery}}
		postOrigin=""
		canPost={false}
	>
		<Container slot="error" let:error>
			Error loading results. Please try again.
			<pre><code>{error}</code></pre>
		</Container>
		<Container slot="empty">No results found.</Container>
	</PostList>
</div>

<style>
	h1 {
		margin: 0;
	}
</style>
