<script>
	import Modal from "../Modal.svelte";

	import {screen, setupPage, modalShown} from "../stores.js";

	import * as clm from "../clmanager.js";

	import {tick} from "svelte";

	let changeStatus,
		oldPassword,
		newPassword,
		newPasswordConfirmation,
		submitButton;

	function changePassword() {
		if (newPassword !== newPasswordConfirmation) {
			changeStatus = "New passwords do not match!";
		}

		submitButton.disabled = true;

		clm.meowerRequest({
			cmd: "direct",
			val: {
				cmd: "change_pswd",
				val: {
					old: oldPassword,
					new: newPassword,
				},
			},
		})
			.then(async () => {
				$modalShown = false;

				await clm.meowerRequest({
					cmd: "direct",
					val: {cmd: "del_tokens", val: ""},
				});

				localStorage.clear();

				screen.set("setup");
				await tick();
				setupPage.set("reconnect");
			})
			.catch(code => {
				submitButton.disabled = false;
				switch (code) {
					case "I:011 | Invalid Password":
						changeStatus = "Current password is invalid!";
						break;
					case "E:106 | Too many requests":
						changeStatus =
							"Too many requests! Please try again later.";
						break;
					default:
						changeStatus = `Unexpected ${code} error!`;
				}
			});
	}
</script>

<Modal
	on:close={() => {
		$modalShown = false;
	}}
>
	<h2 slot="header">Change Password</h2>
	<div slot="default">
		{#if changeStatus}
			<label for="old-password-input" style="color: red;"
				>{changeStatus}</label
			>
		{/if}
		<input
			id="old-password-input"
			type="password"
			class="modal-input white"
			placeholder="Current Password"
			maxlength="255"
			bind:value={oldPassword}
		/><br /><br />
		<input
			id="new-password-input"
			type="password"
			class="modal-input white"
			placeholder="New Password"
			maxlength="255"
			bind:value={newPassword}
		/><br /><br />
		<input
			type="password"
			class="modal-input white"
			placeholder="Confirm New Password"
			maxlength="255"
			bind:value={newPasswordConfirmation}
		/><br /><br />
		<div class="modal-buttons">
			<button
				type="button"
				on:click={() => {
					$modalShown = false;
				}}>Cancel</button
			>
			<button
				type="submit"
				disabled={!oldPassword ||
					!newPassword ||
					!newPasswordConfirmation}
				bind:this={submitButton}
				on:click={() => {
					changePassword();
				}}>Change Password</button
			>
		</div>
	</div>
</Modal>
