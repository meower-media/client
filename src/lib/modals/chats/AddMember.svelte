<script>
	import Modal from "../../Modal.svelte";

	import {authHeader, chat} from "../../stores.js";
	import {apiUrl} from "../../urls.js";
	import * as modals from "../../modals.js";

	import {focus, params} from "@roxi/routify";

	let username, loading, error;
</script>

<Modal on:close={modals.closeLastModal}>
	<h2 slot="header">Add Member</h2>
	<div slot="default">
		<form
			on:submit|preventDefault={async () => {
				loading = true;
				try {
					const resp = await fetch(
						`${apiUrl}${$params.admin ? "admin/" : ""}chats/${
							$chat._id
						}/members/${username}`,
						{
							method: "PUT",
							headers: $authHeader,
						}
					);
					if (!resp.ok) {
						switch (resp.status) {
							case 403:
								throw new Error(
									`Someone's privacy settings are preventing you from adding ${username} to ${$chat.nickname}.`
								);
							case 404:
								throw new Error(`${username} not found.`);
							case 409:
								throw new Error(
									`${username} is already a member of ${$chat.nickname}.`
								);
							case 429:
								throw new Error(
									"Too many requests! Try again later."
								);
							default:
								throw new Error(
									"Response code is not OK; code is " +
										resp.status
								);
						}
					}
					if ($params.admin) {
						$chat = await resp.json();
					}
					modals.closeLastModal();
				} catch (e) {
					loading = false;
					error = e;
				}
			}}
		>
			<label for="username"><b>Username</b></label>
			<input
				type="text"
				class="long white"
				placeholder="Username"
				id="username"
				name="username"
				autocomplete="off"
				maxlength="20"
				disabled={loading}
				bind:value={username}
				use:focus
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
				<button type="submit" disabled={!username || loading}
					>Add member</button
				>
			</div>
		</form>
	</div>
</Modal>

<style>
	.long {
		width: 100%;
		margin: 0;
	}
</style>
