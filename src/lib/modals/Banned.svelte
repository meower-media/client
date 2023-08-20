<script>
	import Modal from "../Modal.svelte";

	import * as modals from "../modals.js";
</script>

<Modal
	on:close={() => { modals.closeModal(); }}
>
	<h2 slot="header">Account Banned</h2>
	<div slot="default">
		<p>
			Your account has been banned by the Meower moderation team because
			it was used to violate Meower's Terms of Service.
			<br /><br />
			If you would like to discuss this ban, please email
			<a href="mailto:support@meower.org" target="_blank" rel="noreferrer"
				>support@meower.org</a
			>.
		</p>
		<br />
		<div class="modal-buttons">
			<a href="https://meower.org/legal" target="_blank" rel="noreferrer"
				>Terms of Service</a
			>
			<button
				on:click={() => { modals.closeModal(); }}>Close</button
			>
		</div>
	</div>
</Modal>
