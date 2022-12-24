<script>
	import Modal from "../Modal.svelte";

	import {modalShown} from "../stores.js";
</script>

<Modal
	on:close={() => {
		$modalShown = false;
	}}
>
	<h2 slot="header">Account Banned</h2>
	<div slot="default">
		<p>
			Your account has been banned by the Meower moderation team because
			it was used to violate Meower's Terms of Service.
			<br /><br />
			If you would like to discuss this ban, please email
			<a href="mailto:support@meower.org" target="_blank"
				>support@meower.org</a
			>.
		</p>
		<br />
		<div class="modal-buttons">
			<a href="https://meower.org/legal" target="_blank"
				>Terms of Service</a
			>
			<button
				on:click={() => {
					$modalShown = false;
				}}>Close</button
			>
		</div>
	</div>
</Modal>
