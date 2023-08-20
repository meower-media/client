<script>
	import Modal from "../Modal.svelte";

	import {profileClicked} from "../stores.js";

	import * as modals from "../modals.js";

	import * as clm from "../clmanager.js";
</script>

<Modal
	on:close={() => { modals.closeModal(); }}
>
	<h2 slot="header">Report User</h2>
	<div slot="default">
		<span>Are you sure you want to report {$profileClicked}?</span>
		<br /><br />
		<div class="modal-buttons">
			<button
				on:click={() => { modals.closeModal(); }}>Cancel</button
			>
			<button
				on:click={async () => {
					await clm.meowerRequest({
						cmd: "direct",
						val: {
							cmd: "report",
							val: {
								type: 1,
								id: $profileClicked,
							},
						},
					});
					modals.closeModal();
				}}>Report</button
			>
		</div>
	</div>
</Modal>

<style></style>
