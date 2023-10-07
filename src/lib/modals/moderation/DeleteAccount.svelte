<script>
	import Modal from "../../Modal.svelte";

	import {authHeader} from "../../stores.js";
	import {userFlags} from "../../bitField.js";
	import {apiUrl} from "../../urls.js";
	import * as modals from "../../modals.js";

	export let modalData;

	let {user} = modalData;
	let mode, deleting, error;

	async function deleteAccount() {
		error = "";
		deleting = true;
		try {
			let attemptedUsername = prompt(
				`Please confirm the user's username (${user._id}):`
			);
			if (attemptedUsername !== user._id) {
				throw new Error("Invalid username!");
			}
			if (
				!confirm(
					"This action can be very destructive! By confirming this, you acknowledge and take responsibility for the consequences of this action. Are you absolutely sure you wish to continue?"
				)
			) {
				throw new Error("Cancelled!");
			}
			const resp = await fetch(
				`${apiUrl}admin/users/${user._id}?mode=${mode}`,
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
			deleting = false;
		}
	}
</script>

<Modal on:close={modals.closeLastModal}>
	<h2 slot="header">
		Delete {user._id}
	</h2>
	<div slot="default">
		<label for="post-account-mode"><b>Mode</b></label><br />
		<select
			id="post-account-mode"
			class="modal-input grow"
			style="width: 100%; margin-bottom: 0.25em;"
			disabled={deleting}
			bind:value={mode}
			on:change={() => (error = "")}
		>
			{#if (user.flags & userFlags.DELETED) !== userFlags.DELETED}
				{#if user.delete_after}
					<option value="cancel" selected={mode === "cancel"}
						>Cancel scheduled deletion</option
					>
				{:else}
					<option value="schedule" selected={mode === "schedule"}
						>Schedule deletion</option
					>
				{/if}
				<option value="immediate" selected={mode === "immediate"}
					>Immediate deletion</option
				>
			{/if}
			<option value="purge" selected={mode === "purge"}>Purge</option>
		</select><br />
		{#if mode === "cancel"}
			Cancel scheduled account deletion.
		{:else if mode === "schedule"}
			Schedule account for deletion after 7 days.
		{:else if mode === "immediate"}
			Immediately delete account.
		{:else if mode === "purge"}
			Purge everything about the account. It'll be like it never existed.
		{/if}

		{#if error}
			<p style="color: crimson;">{error}</p>
		{:else}
			<br /><br />
		{/if}
		<div class="modal-buttons">
			<button
				type="button"
				disabled={deleting}
				on:click={modals.closeLastModal}>Cancel</button
			>
			<button
				type="button"
				disabled={!mode || deleting}
				on:click={deleteAccount}>Confirm</button
			>
		</div>
	</div>
</Modal>
