<script>
	import Modal from "../Modal.svelte";

	import {screen, setupPage, user, modalShown} from "../stores.js";

	import * as clm from "../clmanager.js";

	import {tick} from "svelte";

	let typedUsername = "";
</script>

<Modal
	on:close={() => {
		$modalShown = false;
	}}
>
	<h2 slot="header">Delete Account</h2>
	<div slot="default">
		<form
			on:submit|preventDefault={async e => {
				await clm.meowerRequest({
					cmd: "direct",
					val: {cmd: "del_account", val: ""},
				});

				$modalShown = false;

				localStorage.clear();

				screen.set("setup");
				await tick();
				setupPage.set("reconnect");
			}}
		>
			<span style="color: red;"
				>Deleting your account will erase all data from our database,
				this action is irreversible! Are you absolutely sure you would
				like to permanently delete your account?</span
			><br /><br />
			<span
				>Please confirm your username below to be able to delete your
				account:</span
			><br />
			<input
				type="text"
				class="modal-input white"
				placeholder="Username"
				maxlength="20"
				bind:value={typedUsername}
			/><br /><br />
			<div class="modal-buttons">
				<button
					type="button"
					on:click={() => {
						$modalShown = false;
					}}>Cancel</button
				>
				<button type="submit" disabled={!(typedUsername === $user.name)}
					>Delete Account</button
				>
			</div>
		</form>
	</div>
</Modal>
