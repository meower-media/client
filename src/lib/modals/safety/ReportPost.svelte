<script>
	import Modal from "../../Modal.svelte";
	import Post from "../../Post.svelte";

	import BasicModal from "../Basic.svelte";

	import * as modals from "../../modals.js";
	import { apiUrl } from "src/lib/urls";
	import { authHeader } from "src/lib/stores";

	export let modalData;

	let {post} = modalData;

	let reason = null,
		comment,
		loading,
		error;
</script>

<Modal on:close={modals.closeLastModal}>
	<h2 slot="header">Report Post</h2>
	<div slot="default">
		<form
			on:submit|preventDefault={async () => {
				loading = true;

				const resp = await fetch(`${apiUrl}posts/${post.post_id}/report`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						...$authHeader,
					},
					body: JSON.stringify({ reason, comment })
				})

				let body;

				try {
					body = await resp.json();
				} catch (e) {
					loading = false;
					error = "Failed to parse response!";
					return;
				}

				if (body.error) {
					loading = false

					let code = body.type;

					if (code === "tooManyRequests") {
						error = "Too many requests! Please try again later.";
					} else {
						error = "Unexpected " + code + " error!";
					}
				} else {
					modals.replaceLastModal(BasicModal, {
						title: "Report Post",
						desc: "Successfully reported post! A moderator will view your report soon. Thank you for your help with keeping Meower a safe and welcoming place!",
					});
				}
			}}
		>
			<Post {post} buttons={false} />
			<label for="reason"><b>Reason</b></label><br />
			<select id="reason" class="modal-input grow" bind:value={reason}>
				<option>Spam</option>
				<option>Harassment or abuse towards others</option>
				<option>Rude, vulgar or offensive language</option>
				<option>NSFW (sexual, alcohol, violence, gore, etc.)</option>
				<option
					>Scams, hacks, phishing or other malicious content</option
				>
				<option>Threatening violence or real world harm</option>
				<option>Illegal activity</option>
				<option>Self-harm/suicide</option>
				<option>Other</option>
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
				<button type="submit" disabled={!reason || loading}
					>Report</button
				>
			</div>
		</form>
	</div>
</Modal>

<style>
	select {
		margin-bottom: 0.5em;
	}
</style>
