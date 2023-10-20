<script>
	import Modal from "../Modal.svelte";

	import {goto, focus} from "@roxi/routify";
</script>

<Modal>
	<h2 slot="header">Logged Out</h2>
	<div slot="default">
		<p>You have been logged out. Please login again.</p>
		<br />
		<div class="modal-buttons">
			<button on:click={$goto("/logout")} use:focus>Logout</button>
		</div>
	</div>
</Modal>
