<script>
	import Modal from "../Modal.svelte";

	import {screen, setupPage, modalShown} from "../stores.js";

	import * as clm from "../clmanager.js";

	import {tick} from "svelte";

	let changeStatus = "";
</script>

<Modal
	on:close={() => {
		$modalShown = false;
	}}
>
	<h2 slot="header">Change Password</h2>
	<div slot="default">
		<form
			on:submit|preventDefault={async e => {
				if (!e.target[0].value) {
					changeStatus = "Current password is invalid!";
					return false;
				}
				if (!e.target[1].value) {
					changeStatus =
						"You must specify a new password to change your password!";
					return false;
				}
				if (e.target[1].value !== e.target[2].value) {
					changeStatus = "New passwords do not match!";
					return false;
				}

				e.target[4].disabled = true;

				await clm.meowerRequest({
					cmd: "direct",
					val: {cmd: "change_pswd", val: {old: e.target[0].value, new: e.target[1].value}},
				}).then(async () => {
					$modalShown = false;

					await clm.meowerRequest({
						cmd: "direct",
						val: {cmd: "del_tokens", val: ""},
					});
					
					localStorage.clear();

					screen.set("setup");
					await tick();
					setupPage.set("reconnect");
				}).catch(code => {
					e.target[4].disabled = false;
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
			}}
		>
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
			/><br /><br />
			<input
				id="new-password-input"
				type="password"
				class="modal-input white"
				placeholder="New Password"
				maxlength="255"
			/><br /><br />
			<input
				type="password"
				class="modal-input white"
				placeholder="Confirm New Password"
				maxlength="255"
			/><br /><br />
			<div class="modal-buttons">
				<button
					type="button"
					on:click={() => {
						$modalShown = false;
					}}>Cancel</button
				>
				<button type="submit">Change Password</button>
			</div>
		</form>
	</div>
</Modal>
