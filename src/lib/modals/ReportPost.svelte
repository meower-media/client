<script>
	import Modal from "../Modal.svelte";
	import Post from "../Post.svelte";

	import * as clm from "../clmanager.js";

	import {modalShown, postClicked} from "../stores.js";

	let state = 0;
</script>

<Modal
	on:close={() => {
		$modalShown = false;
	}}
>
	<h2 slot="header">Report Post</h2>
	<div slot="default">
		{#if state === 0}
			<p>
				Are you sure you would like to report this post?
				<br /><br />
				Please make sure you're only reporting stuff that is against the
				Meower
				<a href="https://meower.org/legal" target="_blank"
					>Terms of Service</a
				>.
			</p>
			<Post post={$postClicked} buttons={false} />
			<br />
			<div class="modal-buttons">
				<button
					on:click={() => {
						$modalShown = false;
					}}>Cancel</button
				>
				<button
					on:click={() => {
						clm.meowerRequest({
							cmd: "direct",
							val: {
								cmd: "report",
								val: {
									type: 0,
									id: $postClicked.post_id,
								},
							},
						});
						state = 1;
					}}>Report</button
				>
			</div>
		{:else if state === 1}
			<p>
				Successfully reported post! A member of the Meower moderation
				team will review it shortly.
			</p>
			<br />
			<div class="modal-buttons">
				<button
					on:click={() => {
						$modalShown = false;
					}}>Close</button
				>
			</div>
		{/if}
	</div>
</Modal>
