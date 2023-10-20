<script>
	import Modal from "../../Modal.svelte";

	import {authHeader} from "../../stores.js";
	import {apiUrl} from "../../urls.js";
	import * as modals from "../../modals.js";

	export let modalData;

	let {username, postOrigin} = modalData;

	let loading, error;
</script>

<Modal on:close={modals.closeLastModal}>
	<h2 slot="header">Clear {username}'s Posts</h2>
	<div slot="default">
		<form
			on:submit|preventDefault={async () => {
				loading = true;
				try {
					const resp = await fetch(
						`${apiUrl}admin/users/${username}/posts${
							postOrigin ? `?origin=${postOrigin}` : ""
						}`,
						{
							method: "DELETE",
							headers: $authHeader,
						}
					);
					if (!resp.ok) {
						throw new Error(
							"Response code is not OK; code is " + resp.status
						);
					}
					modals.closeLastModal();
				} catch (e) {
					error = e;
					loading = false;
				}
			}}
		>
			<p>
				Are you sure you wish to delete all of {username}'s posts{postOrigin
					? ` in ${postOrigin}`
					: ""}? Currently, there is no easy way to recover all of
				their deleted posts!
			</p>
			{#if error}
				<p style="color: crimson;">{error}</p>
			{:else}
				<br />
			{/if}
			<div class="modal-buttons">
				<button
					type="button"
					disabled={loading}
					on:click={modals.closeLastModal}>Cancel</button
				>
				<button type="submit" disabled={loading}>Confirm</button>
			</div>
		</form>
	</div>
</Modal>
