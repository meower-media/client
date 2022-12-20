<script>
	import Modal from "../Modal.svelte";
	import Post from "../Post.svelte";

	import * as clm from "../clmanager.js";

	import {modalShown, postClicked} from "../stores.js";
</script>

<Modal
	on:close={() => {
		$modalShown = false;
	}}
>
	<h2 slot="header">Delete Post</h2>
	<div slot="default">
		<p>Are you sure you would like to delete this post?</p>
		<Post post={$postClicked} buttons={false} />
		<br />
		<div class="modal-buttons">
			<button
				on:click={() => {
					$modalShown = false;
				}}>Cancel</button
			>
			<button
				autofocus
				on:click={() => {
					clm.meowerRequest({
						cmd: "direct",
						val: {
							cmd: "delete_post",
							val: $postClicked.post_id,
						},
					});
					$modalShown = false;
				}}>Delete</button
			>
		</div>
	</div>
</Modal>
