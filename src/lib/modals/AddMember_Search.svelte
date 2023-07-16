<script>
	import Modal from "../Modal.svelte";

	import {
		modalShown,
		mainPage as page,
		searchQuery,
		searchType,
	} from "../stores.js";
	import * as Modals from "../modals.js";

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
				searchQuery.set(e.target[0].value);
				searchType.set("users");
				Modals.showModal("searchResults");
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
						$modalShown = false;
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
		margin-bottom: -2px;
	}
</style>
