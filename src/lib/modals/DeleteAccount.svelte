<script>
	import Modal from "../Modal.svelte";

	import * as modals from "../modals.js";
	import * as clm from "../clmanager.js";

	import {user, userToMod} from "../stores.js";

	import {goto} from "@roxi/routify";

	let deleteStatus, username, password, submitButton;

	async function deleteAccount() {
		if (
			($userToMod && username !== $userToMod) ||
			(!$userToMod && username !== $user.name)
		) {
			deleteStatus = "Invalid username!";
			return;
		}

		submitButton.disabled = true;

		clm.meowerRequest({
			cmd: "direct",
			val: {cmd: "del_account", val: $userToMod ? username : password},
		})
			.then(() => {
				modals.closeModal();
				if (!$userToMod) $goto("/logout");
			})
			.catch(code => {
				submitButton.disabled = false;
				switch (code) {
					case "I:011 | Invalid Password":
						deleteStatus = "Invalid password!";
						break;
					case "E:106 | Too many requests":
						deleteStatus =
							"Too many requests! Please try again later.";
						break;
					default:
						deleteStatus = `Unexpected ${code} error!`;
				}
			});
	}
</script>

<Modal
	on:close={() => {
		if ($userToMod) {
			modals.showModal("moderateUser");
		} else {
			modals.closeModal();
		}
	}}
>
	<h2 slot="header">Delete{$userToMod ? ` ${$userToMod}'s ` : " "}Account</h2>
	<div slot="default">
		{#if $userToMod}
			<span style="color: red;">
				Deleting {$userToMod}'s account will erase all of their data
				from the database, this action is irreversible! Are you
				absolutely sure you would like to permanently delete their
				account?
				<br /><br />
				Type their username to confirm this action.
			</span>
		{:else}
			<span style="color: red;"
				>Deleting your account will erase all of your data from our
				database, this action is irreversible! Are you absolutely sure
				you would like to permanently delete your account?
				<br /><br />
				Type your username and password to confirm this action.
			</span>
		{/if}
		<br /><br />
		{#if deleteStatus}
			<label for="password-input" style="color: red;"
				>{deleteStatus}</label
			>
		{/if}
		<input
			id="username-input"
			type="text"
			class="modal-input white"
			placeholder="Username"
			maxlength="255"
			bind:value={username}
		/><br /><br />
		{#if !$userToMod}
			<input
				id="password-input"
				type="password"
				class="modal-input white"
				placeholder="Password"
				maxlength="255"
				bind:value={password}
			/><br /><br />
		{/if}
		<div class="modal-buttons">
			<button
				type="button"
				on:click={() => {
					if ($userToMod) {
						modals.showModal("moderateUser");
					} else {
						modals.closeModal();
					}
				}}>Cancel</button
			>
			<button
				type="submit"
				disabled={!username || (!$userToMod && !password)}
				bind:this={submitButton}
				on:click={() => {
					deleteAccount();
				}}>Delete Account</button
			>
		</div>
	</div>
</Modal>
