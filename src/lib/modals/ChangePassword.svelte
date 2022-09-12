<script>	
	import Modal from "../Modal.svelte";

	import {screen, setupPage, modalShown} from "../stores.js";

    import * as clm from "../clmanager.js";

	import {tick} from "svelte";

    let changeStatus = "";
</script>

<Modal on:close={() => {$modalShown = false}}>
    <h2 slot="header">Change Password</h2>
    <div slot="default">
		<form
			on:submit|preventDefault={async e => {
				if (!e.target[0].value) {
					changeStatus = "You must specify a new password to change your password!";
					return false;
				}
				if (e.target[0].value !== e.target[1].value) {
					changeStatus = "Passwords do not match!";
					return false;
				}

				changeStatus = "Changing password...";

				await clm.meowerRequest({cmd: "direct", val: {cmd: "change_pswd", val: e.target[0].value}});

				$modalShown = false;

				screen.set("setup");
				await tick();
				setupPage.set("reconnect");
			}}
		>
			{#if changeStatus}
			<span class="login-status">{changeStatus}</span><br />
			{/if}
			<input type="password" class="modal-input white" placeholder="New Password" maxlength="64"><br /><br />
			<input type="password" class="modal-input white" placeholder="Confirm New Password" maxlength="64"><br /><br />
			<div class="modal-buttons">
				<button type="button" on:click={() => {$modalShown = false}}>Cancel</button>
				<button type="submit">Change Password</button>
			</div>
		</form>
	</div>
</Modal>