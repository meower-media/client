<script>
	import Modal from "../Modal.svelte";

	import {modalShown, modalPage,searchQuery, searchType} from "../stores.js";

    import PostList from "../PostList.svelte";
	import Container from "../Container.svelte";
</script>

<Modal
	on:close={() => {
		$modalShown = false;
	}}
>
	<h2 slot="header">Results</h2>
	<div slot="default">
		<div class="search-results">
            <PostList
                fetchUrl="search/{$searchType}"
                queryParams={{q: $searchQuery}}
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