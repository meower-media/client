<script>
	import Modal from "../Modal.svelte";

	import {
		modalShown,
		profileClicked_GC,
		chatName,
		chatid,
		chatMembers,
	} from "../stores.js";

	import * as clm from "../clmanager.js";

	function filter1(v) {
		return v !== $profileClicked_GC;
	}
</script>

<Modal
	on:close={() => {
		$modalShown = false;
	}}
>
	<h2 slot="header">Remove Member</h2>
	<div slot="default">
		<span
			>Are you sure you want to remove {$profileClicked_GC} from {$chatName}?</span
		>
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
							cmd: "remove_from_chat",
							val: {
								chatid: $chatid,
								username: $profileClicked_GC,
							},
						},
					});
					chatMembers.set($chatMembers.filter(filter1));
					$modalShown = false;
				}}>Remove</button
			>
		</div>
	</div>
</Modal>

<style></style>
