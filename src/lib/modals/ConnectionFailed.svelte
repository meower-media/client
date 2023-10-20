<script>
	import Modal from "../Modal.svelte";

	import {apiUrl} from "../urls.js";

	import {onMount} from "svelte";

	let repairMode = false;
	let ipBlocked = false;

	onMount(async () => {
		const resp = await fetch(`${apiUrl}status`);
		if (!resp.ok) return;

		const json = await resp.json();
		if (json.isRepairMode) repairMode = true;
		if (json.ipBlocked) ipBlocked = true;
	});
</script>

<Modal>
	<h2 slot="header">Connection Failed</h2>
	<div slot="default">
		{#if repairMode}
			<p>
				Meower is currently down for repairs. You can stay up-to-date
				with the current status of this outage by checking <a
					href="https://status.meower.org"
					target="_blank"
					rel="noreferrer">https://status.meower.org</a
				>.
			</p>
		{:else if ipBlocked}
			<p>
				Your IP address has been blocked because it was used to violate
				Meower's Terms of Service or is likely to cause spam.
				<br /><br />
				If you think this is a mistake, please email
				<a
					href="mailto:support@meower.org"
					target="_blank"
					rel="noreferrer">support@meower.org</a
				>.
			</p>
		{:else}
			<p>
				Failed connecting to server. View console for more information
				or try again later.
			</p>
		{/if}
		<br />
		<div class="modal-buttons">
			<button on:click={() => window.location.reload()}>Reconnect</button>
		</div>
	</div>
</Modal>
