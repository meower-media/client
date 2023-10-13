<script>
	import Modal from "../../Modal.svelte";
	import PostList from "../../PostList.svelte";
	import Container from "../../Container.svelte";

	import * as modals from "../../modals.js";
</script>

<Modal showClose={true} on:close={modals.closeLastModal}>
	<h2 slot="header">Recent Users</h2>
	<div slot="default">
		<PostList fetchUrl="admin/users" postOrigin="" canPost={false}>
			<Container slot="error" let:error>
				Error loading users. Please try again.
				<pre><code>{error}</code></pre>
			</Container>
			<Container slot="empty">No users found.</Container>
		</PostList>
		<div />
	</div>
</Modal>
