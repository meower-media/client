<script>
	import Modal from "../Modal.svelte";

	import {chatid, chatMembers} from "../stores.js";

	import * as modals from "../modals.js";

	import * as clm from "../clmanager.js";

	let username;
</script>

<Modal
	on:close={() => {
		modals.closeModal();
	}}
>
	<h2 slot="header">Add Member</h2>
	<div slot="default">
		<form
			on:submit|preventDefault={e => {
				clm.meowerRequest({
					cmd: "direct",
					val: {
						cmd: "add_to_chat",
						val: {chatid: $chatid, username: e.target[0].value},
					},
				});
				$chatMembers.push(username);
				chatMembers.set($chatMembers);
				modals.closeModal();
			}}
		>
			<label for="userinput"><b>Username</b></label>
			<input
				type="text"
				class="long white"
				placeholder="Username"
				id="userinput"
				name="userinput"
				autocomplete="off"
				maxlength="20"
				bind:value={username}
			/>
			<br /><br />
			<div class="modal-buttons">
				<button
					type="button"
					on:click|preventDefault={() => {
						modals.closeModal();
					}}>Cancel</button
				>
				<button type="submit" disabled={!username}>Add member</button>
			</div>
		</form>
	</div>
</Modal>

<style>
	.long {
		width: 100%;
		margin: 0;
	}
</style>
