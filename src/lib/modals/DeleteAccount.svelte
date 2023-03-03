<script>
	import Modal from "../Modal.svelte";

	import {screen, setupPage, modalShown} from "../stores.js";

	import * as clm from "../clmanager.js";

	import {tick} from "svelte";

	let deleteStatus = "";
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
				if (!e.target[0].value) {
					deleteStatus = "Invalid password!";
					return false;
				}

				e.target[2].disabled = true;

				await clm.meowerRequest({
					cmd: "direct",
					val: {cmd: "del_account", val: e.target[0].value},
				}).then(async () => {
					$modalShown = false;

					localStorage.clear();

					screen.set("setup");
					await tick();
					setupPage.set("reconnect");
				}).catch(code => {
					e.target[2].disabled = false;
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
			}}
		>
			<span style="color: red;"
				>Deleting your account will erase all data from our database,
				this action is irreversible! Are you absolutely sure you would
				like to permanently delete your account?</span
			><br /><br />
			{#if deleteStatus}
				<label for="password-input" style="color: red;"
					>{deleteStatus}</label
				>
			{/if}
			<input
				id="password-input"
				type="password"
				class="modal-input white"
				placeholder="Password"
				maxlength="255"
			/><br /><br />
			<div class="modal-buttons">
				<button
					type="button"
					on:click={() => {
						$modalShown = false;
					}}>Cancel</button
				>
				<button type="submit">Delete Account</button>
			</div>
		</form>
	</div>
</Modal>
