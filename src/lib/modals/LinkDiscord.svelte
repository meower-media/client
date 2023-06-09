<script>
	import Modal from "../Modal.svelte";

	import {modalShown, mainPage as page} from "../stores.js";

	import {tick} from "svelte";

	import * as clm from "../clmanager.js";

	let token;
</script>

<Modal
	on:close={() => {
		$modalShown = false;
	}}
>
	<h2 slot="header">Link Discord Account</h2>
	<div slot="default">
		<form
			on:submit|preventDefault={e => {
				clm.meowerRequest({
					cmd: "pvar",
					id: "Discord",
					name: "discord",
					val: e.target[0].value,
				});
				$modalShown = false;
			}}
		>
			<label for="userinput"><b>Link token</b></label>
			<input
				type="text"
				class="long white"
				placeholder="Link token"
				id="userinput"
				name="userinput"
				autocomplete="false"
				maxlength="64"
				bind:value={token}
			/>
			<br /><br />
			<div class="modal-buttons">
				<button
					type="button"
					on:click|preventDefault={() => {
						$modalShown = false;
					}}>Cancel</button
				>
				<button type="submit" disabled={!token}>Send Request</button>
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
