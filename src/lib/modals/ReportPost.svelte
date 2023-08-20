<script>
	import Modal from "../Modal.svelte";
	import Post from "../Post.svelte";

	import * as modals from "../modals.js";

	import * as clm from "../clmanager.js";

	import {postClicked} from "../stores.js";
</script>

<Modal
	on:close={() => {
		modals.closeModal();
	}}
>
	<h2 slot="header">Report Post</h2>
	<div slot="default">
		<p>
			Are you sure you would like to report this post?
			<br /><br />
			Please make sure you're only reporting stuff that is against the Meower
			<a href="https://meower.org/legal" target="_blank" rel="noreferrer"
				>Terms of Service</a
			>.
		</p>
		<Post post={$postClicked} buttons={false} />
		<br />
		<div class="modal-buttons">
			<button
				on:click={() => {
					modals.closeModal();
				}}>Cancel</button
			>
			<button
				on:click={async () => {
					await clm.meowerRequest({
						cmd: "direct",
						val: {
							cmd: "report",
							val: {
								type: 0,
								// @ts-ignore
								id: $postClicked.post_id,
							},
						},
					});
					modals.closeModal();
				}}>Report</button
			>
		</div>
	</div>
</Modal>
