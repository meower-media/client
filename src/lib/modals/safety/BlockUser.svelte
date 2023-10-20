<script>
	import Modal from "../../Modal.svelte";

	import {authHeader, relationships} from "../../stores.js";
	import {apiUrl} from "../../urls.js";
	import * as modals from "../../modals.js";

	import {focus} from "@roxi/routify";

	export let modalData;

	let {username} = modalData;

	let blocked, loading, error;

	$: blocked = $relationships[username] === 2;
</script>

<Modal on:close={modals.closeLastModal}>
	<h2 slot="header">{blocked ? "Unb" : "B"}lock {username}</h2>
	<div slot="default">
		<form
			on:submit|preventDefault={async () => {
				loading = true;
				try {
					const resp = await fetch(
						`${apiUrl}users/${username}/relationship`,
						{
							method: "PATCH",
							headers: {
								"Content-Type": "application/json",
								...$authHeader,
							},
							body: JSON.stringify({state: blocked ? 0 : 2}),
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
					error = e;
					loading = false;
				}
			}}
		>
			{#if blocked}
				<p>
					Are you sure you would like to unblock {username}?
				</p>
			{:else}
				<p>
					Are you sure you would like to block {username}? This will
					prevent them from direct messaging you or adding you to
					group chats. Depending on your account settings, it may also
					prevent you from seeing their posts. You may unblock them at
					any time.
				</p>
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
					on:click|preventDefault={() => modals.closeLastModal()}
					>Cancel</button
				>
				<button type="submit" disabled={loading} use:focus
					>{blocked ? "Unb" : "B"}lock</button
				>
			</div>
		</form>
	</div>
</Modal>
