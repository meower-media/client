<script>
	import Modal from "../Modal.svelte";

	import {searchQuery, searchType} from "../stores.js";
	import * as modals from "../modals.js";

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
				searchQuery.set(e.target[0].value);
				searchType.set("users");
				modals.showModal("searchResults");
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
				<button type="submit" disabled={!username}>Search</button>
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
