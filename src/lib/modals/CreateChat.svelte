<script>
	import Modal from "../Modal.svelte";

	import {modalShown, mainPage} from "../stores.js";

	import * as clm from "../clmanager.js";

	import {tick} from "svelte";

	let createStatus = "";

	function doCreate(nickname) {
		try {
			createStatus = "Creating chat...";
			clm.meowerRequest({
				cmd: "direct",
				val: {
					cmd: "create_chat",
					val: nickname,
				},
			})
				.then(() => {
					modalShown.set(false);
					mainPage.set("blank");
					tick().then(() => mainPage.set("chatlist"));
				})
				.catch(code => {
					createStatus = `Unexpected ${code} error!`;
				});
		} catch (e) {
			console.error(e);
			createStatus = "Error logging in: " + e;
		}
	}
</script>

<Modal
	on:close={() => {
		$modalShown = false;
	}}
>
	<h2 slot="header">Create Chat</h2>
	<div slot="default">
		<form
			on:submit|preventDefault={e => {
				if (!e.target[0].value) {
					createStatus =
						"You must specify a nickname to create the chat!";
					return false;
				}
				doCreate(e.target[0].value);
				return false;
			}}
		>
			{#if createStatus}
				<span class="login-status">{createStatus}</span><br />
			{/if}
			<input
				type="text"
				class="modal-input white"
				placeholder="Nickname"
				maxlength="20"
				autofocus
			/><br /><br />
			<div class="modal-buttons">
				<button
					type="button"
					on:click={() => {
						$modalShown = false;
					}}>Cancel</button
				>
				<button type="submit">Create</button>
			</div>
		</form>
	</div>
</Modal>
