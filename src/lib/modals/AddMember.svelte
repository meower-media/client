<script>
	import Modal from "../Modal.svelte";

	import {
		modalShown,
		mainPage as page,
		chatid,
		chatMembers,
	} from "../stores.js";

	import {tick} from "svelte";

	import * as clm from "../clmanager.js";

	let username;
</script>

<Modal
	on:close={() => {
		$modalShown = false;
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
				$modalShown = false;
			}}
		>
			<label for="userinput"><b>Username</b></label>
			<input
				type="text"
				class="long white"
				placeholder="Username"
				id="userinput"
				name="userinput"
				autocomplete="false"
				maxlength="360"
				bind:value={username}
			/>
			<br /><br />
			<div class="modal-buttons">
				<button
					type="button"
					on:click|preventDefault={() => {
						$modalShown = false;
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
		margin-bottom: -2px;
	}
</style>
