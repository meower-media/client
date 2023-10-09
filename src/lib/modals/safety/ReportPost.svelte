<script>
	import Modal from "../../Modal.svelte";
	import Post from "../../Post.svelte";

	import BasicModal from "../Basic.svelte";

	import * as modals from "../../modals.js";
	import * as clm from "../../clmanager.js";

	export let modalData;

	let { post } = modalData;

	let reason, comment, loading, error;
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
								id: post.post_id,
								reason,
								comment,
							},
						},
					});
					modals.replaceLastModal(BasicModal, {
						title: "Report Post",
						desc: "Successfully reported post! A moderator will view your report soon. Thank you for your help with keeping Meower a safe and welcoming place!"
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
				}
			}}
		>
			<Post post={post} buttons={false} />
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
