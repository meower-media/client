<script>
	import Modal from "../Modal.svelte";

	import {user, modalShown} from "../stores.js";

	import * as clm from "../clmanager.js";
</script>

<Modal
	on:close={() => {
		$modalShown = false;
	}}
>
	<h2 slot="header">Set Quote</h2>
	<div slot="default">
		<form
			on:submit|preventDefault={async e => {
				modalShown.set(false);

				$user.quote = e.target[0].value;
				await clm.updateProfile();
			}}
		>
			<span
				>Your quote is a small piece of text that will be displayed
				publicly on your profile.</span
			><br /><br />
			<input
				type="text"
				class="modal-input white"
				placeholder="Write something..."
				maxlength="360"
				value={$user.quote}
			/><br /><br />
			<div class="modal-buttons">
				<button
					type="button"
					on:click={() => {
						$modalShown = false;
					}}>Cancel</button
				>
				<button type="submit">Set Quote</button>
			</div>
		</form>
	</div>
</Modal>
