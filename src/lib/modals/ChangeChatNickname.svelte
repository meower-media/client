<script>
	import Modal from "../Modal.svelte";

    import {chat} from "../stores.js";

	import {authHeader} from "../stores.js";
	import {apiUrl} from "../urls.js";
	import * as modals from "../modals.js";

	let nickname = $chat.nickname;
    let loading, error;
</script>

<Modal
	on:close={modals.closeLastModal}
>
	<h2 slot="header">Change Nickname</h2>
	<div slot="default">
		<form
			on:submit|preventDefault={async () => {
				loading = true;
				try {
					const resp = await fetch(`${apiUrl}chats/${$chat._id}`, {
						method: "PATCH",
						headers: {
							"Content-Type": "application/json",
							...$authHeader,
						},
						body: JSON.stringify({nickname: nickname}),
					});
					if (!resp.ok) {
						if (resp.status === 429) {
							throw new Error("Too many requests! Try again later.");
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
			<label for="nickname" style={error ? "color: crimson;" : ""}><b>Chat Nickname</b> {#if error}<i>- {error}</i>{/if}</label>
			<input
				id="nickname"
				type="text"
				class="modal-input white"
				placeholder="Chat Nickname"
				maxlength="32"
				disabled={loading}
				bind:value={nickname}
				on:change={() => error = ""}
			/><br />
			<br />
			<div class="modal-buttons">
				<button
					type="button"
					disabled={loading}
					on:click={modals.closeLastModal}>Cancel</button
				>
				<button
					type="submit"
					disabled={!nickname || nickname === $chat.nickname || loading}
					>Change Nickname</button
				>
			</div>
		</form>
	</div>
</Modal>