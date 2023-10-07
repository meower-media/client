<script>
	import Modal from "../../Modal.svelte";
	import Post from "../../Post.svelte";

	import {postClicked} from "../../stores.js";

	import * as modals from "../../modals.js";
	import * as clm from "../../clmanager.js";

	let loading, reason, comment, error;
</script>

<Modal on:close={modals.closeLastModal}>
	<h2 slot="header">Report Post</h2>
	<div slot="default">
		<form
			on:submit|preventDefault={async () => {
				loading = true;
				try {
					await clm.meowerRequest({
						cmd: "direct",
						val: {
							cmd: "report",
							val: {
								type: 0,
								// @ts-ignore
								id: $postClicked.post_id,
								reason: comment
									? `${reason} (${comment})`
									: reason,
							},
						},
					});
				} catch (code) {
					loading = false;
					switch (code) {
						case "E:106 | Too many requests":
							error =
								"Too many requests! Please try again later.";
							break;
						default:
							error = "Unexpected " + code + " error!";
					}
					return;
				}
				modals.closeLastModal();
			}}
		>
			<Post post={$postClicked} buttons={false} />
			<label for="reason"><b>Reason</b></label><br />
			<select id="reason" class="modal-input grow" bind:value={reason}>
				<option> No reason specified/other</option>
			</select><br />
			<label for="comment"><b>Comment</b></label>
			<input
				id="comment"
				type="text"
				class="modal-input white"
				placeholder="Write something..."
				disabled={loading}
				bind:value={comment}
				on:change={() => (error = "")}
			/>
			{#if error}
				<p style="color: crimson;">{error}</p>
			{:else}
				<br /><br />
			{/if}
			<div class="modal-buttons">
				<button
					type="button"
					disabled={loading}
					on:click|preventDefault={() => modals.closeLastModal()}
					>Cancel</button
				>
				<button type="submit" disabled={loading}>Report</button>
			</div>
		</form>
	</div>
</Modal>

<style>
	select {
		margin-bottom: 0.5em;
	}
</style>
