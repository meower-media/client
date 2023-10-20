<script>
	import Modal from "../../Modal.svelte";
	import ProfileView from "../../ProfileView.svelte";

	import BasicModal from "../Basic.svelte";

	import * as modals from "../../modals.js";
	import * as clm from "../../clmanager.js";

	export let modalData;

	let {user} = modalData;

	let loading,
		reason = null,
		comment,
		error;
</script>

<Modal on:close={modals.closeLastModal}>
	<h2 slot="header">Report User</h2>
	<div slot="default">
		<form
			on:submit|preventDefault={async () => {
				loading = true;
				try {
					await clm.meowerRequest({
						cmd: "direct",
						val: {
							cmd: "report",
							val: {
								type: 1,
								// @ts-ignore
								id: user._id,
								reason,
								comment,
							},
						},
					});
					modals.replaceLastModal(BasicModal, {
						title: "Report User",
						desc: "Successfully reported user! A moderator will view your report soon. Thank you for your help with keeping Meower a safe and welcoming place!",
					});
				} catch (code) {
					loading = false;
					switch (code) {
						case "E:106 | Too many requests":
							error =
								"Too many requests! Please try again later.";
							break;
						default:
							error = "Unexpected " + code + " error!";
					}
				}
			}}
		>
			<ProfileView username={user._id} profile={user} small={true} />
			<label for="reason"><b>Reason</b></label><br />
			<select id="reason" class="modal-input grow" bind:value={reason}>
				<option>Inappropriate username</option>
				<option>Inappropriate quote</option>
				<option
					>Sending content that is against Meower's Terms of Service</option
				>
				<option>Spamming or otherwise abusing the platform</option>
				<option>Impersonating me or someone else</option>
				<option
					>Evading a block or platform ban by using an alternative
					account</option
				>
				<option>I am concerned about this user's safety</option>
				<option>Other</option>
			</select><br />
			<label for="comment"><b>Comment</b></label>
			<input
				id="comment"
				type="text"
				class="modal-input white"
				placeholder="Write something..."
				disabled={loading}
				bind:value={comment}
				on:change={() => (error = "")}
			/>
			{#if error}
				<p style="color: crimson;">{error}</p>
			{:else}
				<br /><br />
			{/if}
			<div class="modal-buttons">
				<button
					type="button"
					disabled={loading}
					on:click|preventDefault={() => modals.closeLastModal()}
					>Cancel</button
				>
				<button type="submit" disabled={!reason || loading}
					>Report</button
				>
			</div>
		</form>
	</div>
</Modal>

<style>
	select {
		margin-bottom: 0.5em;
	}
</style>
