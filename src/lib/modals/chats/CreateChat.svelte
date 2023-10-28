<script>
	import Modal from "../../Modal.svelte";

	import {authHeader, chats} from "../../stores.js";
	import {apiUrl} from "../../urls.js";
	import * as modals from "../../modals.js";

	import {goto, focus} from "@roxi/routify";

	let nickname, loading, error;
</script>

<Modal on:close={modals.closeLastModal}>
	<h2 slot="header">Create Chat</h2>
	<div slot="default">
		<form
			on:change={() => (error = "")}
			on:submit|preventDefault={async () => {
				loading = true;
				try {
					const resp = await fetch(`${apiUrl}chats`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							...$authHeader,
						},
						body: JSON.stringify({nickname}),
					});
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
					const chat = await resp.json();
					if (
						$chats.findIndex(_chat => _chat._id === chat._id) === -1
					) {
						$chats.push(chat);
					}
					$goto(`/chats/${chat._id}`);
					modals.closeLastModal();
				} catch (e) {
					loading = false;
					error = e;
				}
			}}
		>
			<label for="nickname" style={error ? "color: crimson;" : ""}
				><b>Chat Nickname</b>
				{#if error}<i>- {error}</i>{/if}</label
			>
			<input
				id="nickname"
				type="text"
				class="modal-input white"
				placeholder="Chat Nickname..."
				maxlength="32"
				disabled={loading}
				bind:value={nickname}
				use:focus
			/><br />
			<br />
			<div class="modal-buttons">
				<button
					type="button"
					disabled={loading}
					on:click={modals.closeLastModal}>Cancel</button
				>
				<button type="submit" disabled={!nickname || loading}
					>Create Chat</button
				>
			</div>
		</form>
	</div>
</Modal>
