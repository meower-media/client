<script>
	import Modal from "../../Modal.svelte";

	import * as modals from "../../modals.js";
</script>

<Modal on:close={modals.closeLastModal}>
	<h2 slot="header">Account Creation Blocked</h2>
	<div slot="default">
		<p>
			Your IP address has been blocked from creating new accounts because
			it was used to violate Meower's Terms of Service or is likely to
			cause spam.
			<br /><br />
			If you think this is a mistake, please email
			<a href="mailto:support@meower.org" target="_blank" rel="noreferrer"
				>support@meower.org</a
			>.
		</p>
		<br />
		<div class="modal-buttons">
			<a href="https://meower.org/legal" target="_blank" rel="noreferrer"
				>Terms of Service</a
			>
			<button on:click={modals.closeLastModal}>Close</button>
		</div>
	</div>
</Modal>
