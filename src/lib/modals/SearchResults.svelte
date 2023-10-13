<script>
	import Modal from "../Modal.svelte";
	import PostList from "../PostList.svelte";
	import Container from "../Container.svelte";

	import * as modals from "../modals.js";

	export let modalData;

	let {type, query} = modalData;
</script>

<Modal showClose={true} on:close={modals.closeLastModal}>
	<h2 slot="header">Results</h2>
	<div slot="default">
		<div class="search-results">
			<PostList
				fetchUrl="search/{type}"
				queryParams={{q: query}}
				postOrigin=""
				canPost={false}
				addToChat={true}
			>
				<Container slot="error" let:error>
					Error loading results. Please try again.
					<pre><code>{error}</code></pre>
				</Container>
				<Container slot="empty">No results found.</Container>
			</PostList>
		</div>
	</div>
</Modal>
