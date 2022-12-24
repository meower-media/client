<script>
	import Modal from "../Modal.svelte";

	import {modalShown, profileClicked} from "../stores.js";

	import * as clm from "../clmanager.js";
</script>

<Modal
	on:close={() => {
		$modalShown = false;
	}}
>
	<h2 slot="header">Report User</h2>
	<div slot="default">
		<span>Are you sure you want to report {$profileClicked}?</span>
		<br /><br />
		<div class="modal-buttons">
			<button
				on:click={() => {
					$modalShown = false;
				}}>Cancel</button
			>
			<button
				on:click={() => {
					clm.meowerRequest({
						cmd: "direct",
						val: {
							cmd: "report",
							val: {
								type: 1,
								id: $profileClicked,
							},
						},
					});
					$modalShown = false;
				}}>Report</button
			>
		</div>
	</div>
</Modal>

<style></style>
