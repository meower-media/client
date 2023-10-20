<script>
	import Modal from "../../Modal.svelte";

	import SearchResultsModal from "../SearchResults.svelte";

	import * as modals from "../../modals.js";

	import {focus} from "@roxi/routify";

	let username;
</script>

<Modal on:close={modals.closeLastModal}>
	<h2 slot="header">Add Member</h2>
	<div slot="default">
		<form
			on:submit|preventDefault={() => {
				modals.replaceLastModal(SearchResultsModal, {
					type: "users",
					query: username,
				});
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
				use:focus
			/>
			<br /><br />
			<div class="modal-buttons">
				<button
					type="button"
					on:click|preventDefault={() => {
						modals.closeLastModal();
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
