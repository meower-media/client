<script>
	import Modal from "../Modal.svelte";
	import Post from "../Post.svelte";

	import {authHeader, user} from "../stores.js";
	import {apiUrl} from "../urls.js";
	import * as modals from "../modals.js";

	import {focus} from "@roxi/routify";

	export let modalData;

	let {post} = modalData;

	let report, loading, error;
</script>

<Modal on:close={modals.closeLastModal}>
	<h2 slot="header">Delete Post</h2>
	<div slot="default">
		<form
			on:submit|preventDefault={async () => {
				loading = true;
				try {
					const resp = await fetch(
						`${apiUrl}posts?id=${post.post_id}`,
						{
							method: "DELETE",
							headers: $authHeader,
						}
					);
					if (!resp.ok) {
						if (resp.status === 429) {
							throw new Error(
								"Too many requests! Try again later."
							);
						}
						throw new Error(
							"Response code is not OK; code is " + resp.status
						);
					}
					modals.closeLastModal();
				} catch (e) {
					loading = false;
					error = e;
				}
			}}
		>
			<p>Are you sure you would like to delete this post?</p>
			<Post {post} buttons={false} />
			{#if post.user !== $user.name}
				<label>
					<input type="checkbox" bind:checked={report} />
					Report to Meower Moderators
				</label><br />
			{/if}
			{#if error}
				<p style="color: crimson;">{error}</p>
			{:else}
				<br />
			{/if}
			<div class="modal-buttons">
				<button
					type="button"
					disabled={loading}
					on:click|preventDefault={modals.closeLastModal}
					>Cancel</button
				>
				<button type="submit" disabled={loading} use:focus
					>Delete</button
				>
			</div>
		</form>
	</div>
</Modal>

<style>
	label,
	input[type="checkbox"] {
		vertical-align: middle;
	}
</style>
