<script>
	import Modal from "../../Modal.svelte";

	import {authHeader} from "../../stores.js";
	import {apiUrl} from "../../urls.js";
	import * as modals from "../../modals.js";
	import sleep from "../../sleep";

	export let modalData;

	let {announcement} = modalData;

	let sending, error;
</script>

<Modal on:close={modals.closeLastModal}>
	<h2 slot="header">Send Announcement</h2>
	<div slot="default">
		<p>Are you sure? This will send a message to EVERYONE's inbox!</p>
		{#if error}
			<p style="color: crimson;">{error}</p>
		{:else}
			<br />
		{/if}
		<div class="modal-buttons">
			<button disabled={sending} on:click={modals.closeLastModal}
				>Cancel</button
			>
			{#await sleep(1500)}
				<button disabled>Confirm</button>
			{:then}
				<button
					disabled={sending}
					on:click={async () => {
						sending = true;
						try {
							const resp = await fetch(
								`${apiUrl}admin/announcements`,
								{
									method: "POST",
									headers: {
										"Content-Type": "application/json",
										...$authHeader,
									},
									body: JSON.stringify({
										content: announcement,
									}),
								}
							);
							if (!resp.ok) {
								throw new Error(
									"Response code is not OK; code is " +
										resp.status
								);
							}
							announcement = "";
							modals.closeLastModal();
						} catch (e) {
							error = e;
							sending = false;
						}
					}}>Confirm</button
				>
			{/await}
		</div>
	</div>
</Modal>
