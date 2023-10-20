<script>
	import Modal from "../../Modal.svelte";

	import {authHeader, chat, user} from "../../stores.js";
	import {apiUrl} from "../../urls.js";
	import * as modals from "../../modals.js";
	import sleep from "../../sleep";

	import {params} from "@roxi/routify";

	export let modalData;

	let {username} = modalData;

	let loading, error;

	$: {
		if (!$params.admin && $chat.owner !== $user.name) {
			modals.closeLastModal();
		}
	}
</script>

<Modal on:close={modals.closeLastModal}>
	<h2 slot="header">Transfer Ownership to {username}</h2>
	<div slot="default">
		<form
			on:submit|preventDefault={async () => {
				loading = true;
				try {
					const resp = await fetch(
						`${apiUrl}${$params.admin ? "admin/" : ""}chats/${
							$chat._id
						}/members/${username}/transfer`,
						{
							method: "POST",
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
			Are you sure you want to transfer ownership of {$chat.nickname} to {username}?
			{#if error}
				<p style="color: crimson;">{error}</p>
			{:else}
				<br /><br />
			{/if}
			<div class="modal-buttons">
				<button
					type="button"
					disabled={loading}
					on:click={modals.closeLastModal}>Cancel</button
				>
				{#await sleep(1500)}
					<button type="submit" disabled>Transfer Ownership</button>
				{:then}
					<button type="submit" disabled={loading}
						>Transfer Ownership</button
					>
				{/await}
			</div>
		</form>
	</div>
</Modal>
