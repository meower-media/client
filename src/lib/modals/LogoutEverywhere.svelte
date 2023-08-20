<script>
	import Modal from "../Modal.svelte";

	import * as modals from "../modals.js";
	import * as clm from "../clmanager.js";

	import {goto} from "@roxi/routify";

	let errorStatus;
</script>

<Modal
	on:close={() => { modals.closeModal(); }}
>
	<h2 slot="header">Logout Everywhere</h2>
	<div slot="default">
		<span>Are you sure you want to logout everywhere?</span>
		{#if errorStatus}
			<span style="color: red;">{errorStatus}</span>
		{/if}
		<br /><br />
		<div class="modal-buttons">
			<button
				on:click={() => { modals.closeModal(); }}>Cancel</button
			>
			<button
				on:click={async () => {
					try {
						await clm.meowerRequest({
							cmd: "direct",
							val: {
								cmd: "del_tokens",
								val: "",
							},
						});
					} catch (e) {
						errorStatus = `Unexpected ${e} error!`;
					}

					$goto("/logout");
				}}>Logout Everywhere</button
			>
		</div>
	</div>
</Modal>
