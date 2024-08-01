<script>
	import Modal from "../../Modal.svelte";

	import * as modals from "../../modals.js";
	import { apiUrl } from "../../urls.js";
	import { authHeader } from "../../stores.js";

	import {goto, focus} from "@roxi/routify";

	let oldPassword, newPassword, newPasswordConfirmation, clearSessions, loading, error;
</script>

<Modal on:close={modals.closeLastModal}>
	<h2 slot="header">Change Password</h2>
	<div slot="default">
		<form
			on:change={() => (error = "")}
			on:submit|preventDefault={async () => {
				// check new password confirmation
				if (newPassword !== newPasswordConfirmation) {
					error = "New passwords do not match!";
					return;
				}

				// request change password
				loading = true;
				try {
					const resp = await fetch(
						`${apiUrl}me/password`,
						{
							method: "PATCH",
							headers: { 'Content-Type': 'application/json', ...$authHeader },
							body: JSON.stringify({
								old: oldPassword,
								new: newPassword,
							}),
						}
					);
					if (!resp.ok) {
						throw new Error(
							"Response code is not OK; code is " + resp.status
						);
					}
					if (clearSessions) {
						fetch(
							`${apiUrl}me/tokens`,
							{
								method: "DELETE",
								headers: $authHeader,
							}
						);
						$goto("/logout");
					} else {
						modals.closeLastModal();
					}			
				} catch (e) {
					loading = false;
					error = e;
				}
			}}
		>
			<label for="old-password" style={error ? "color: crimson;" : ""}
				><b>Current Password</b>
				{#if error}<i>- {error}</i>{/if}</label
			>
			<input
				id="old-password"
				type="password"
				class="modal-input white"
				placeholder="Current Password..."
				disabled={loading}
				bind:value={oldPassword}
				use:focus
			/><br />
			<label for="new-password" style={error ? "color: crimson;" : ""}
				><b>New Password</b>
				{#if error}<i>- {error}</i>{/if}</label
			>
			<input
				id="new-password"
				type="password"
				class="modal-input white"
				placeholder="New Password..."
				minlength="8"
				maxlength="255"
				disabled={loading}
				bind:value={newPassword}
			/><br />
			<label
				for="new-password-confirmation"
				style={error ? "color: crimson;" : ""}
				><b>New Password Confirmation</b>
				{#if error}<i>- {error}</i>{/if}</label
			>
			<input
				id="new-password-confirmation"
				type="password"
				class="modal-input white"
				placeholder="New Password Confirmation..."
				minlength="8"
				maxlength="255"
				disabled={loading}
				bind:value={newPasswordConfirmation}
			/><br />
			<label>
				<input type="checkbox" bind:checked={clearSessions} />
				Logout everywhere
			</label><br />
			<br />
			<div class="modal-buttons">
				<button
					type="button"
					disabled={loading}
					on:click={modals.closeLastModal}>Cancel</button
				>
				<button
					type="submit"
					disabled={!oldPassword ||
						!newPassword ||
						!newPasswordConfirmation ||
						loading}>Change Password</button
				>
			</div>
		</form>
	</div>
</Modal>

<style>
	input[type="password"] {
		margin-bottom: 0.5em;
	}
	label, input[type="checkbox"] {
		vertical-align: middle;
	}
</style>
