<script>
	import Modal from "../Modal.svelte";

	import * as modals from "../modals.js";

	export let modalData;

	let username = modalData;

	import Container from "../Container.svelte";
	import PostList from "../PostList.svelte";
</script>

<Modal on:close={modals.closeLastModal}>
	<h2 slot="header">{username}'s posts</h2>
	<div slot="default">
		<div class="posts">
			<PostList
				fetchUrl="users/{username}/posts"
				postOrigin=""
				canPost={false}
				canclickPFP={false}
			>
				<Container slot="empty">
					{username} hasn't made any posts yet.
				</Container>
			</PostList>
		</div>
	</div>
</Modal>

<style>
	.posts {
		height: 100%;
	}
</style>
