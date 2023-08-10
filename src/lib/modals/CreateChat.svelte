<script>
	import Modal from "../Modal.svelte";

	import {modalShown} from "../stores.js";

	import * as clm from "../clmanager.js";

	import {tick} from "svelte";
	import { goto } from "@roxi/routify";

	let createStatus,
		chatNickname = "";

	function doCreate() {
		try {
			createStatus = "Creating chat...";
			clm.meowerRequest({
				cmd: "direct",
				val: {
					cmd: "create_chat",
					val: chatNickname,
				},
			})
				.then(() => {
					modalShown.set(false);
					$goto("/chats");
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
		{#if createStatus}
			<span class="login-status">{createStatus}</span><br />
		{/if}
		<input
			type="text"
			class="modal-input white"
			placeholder="Nickname"
			maxlength="20"
			autofocus
			bind:value={chatNickname}
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
				disabled={!chatNickname}
				on:click={() => {
					doCreate();
				}}>Create</button
			>
		</div>
	</div>
</Modal>
