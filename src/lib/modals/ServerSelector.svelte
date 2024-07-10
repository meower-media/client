<script>
	import Modal from "../Modal.svelte";
	import Container from "../Container.svelte";

	import * as modals from "../modals.js";

	import {focus} from "@roxi/routify";

	let clUrl = localStorage.getItem("meower_linkurl");
	let apiUrl = localStorage.getItem("meower_apiurl");
	let uploadsUrl = localStorage.getItem("meower_uploadsurl");
	let loading, error;
</script>

<Modal on:close={modals.closeLastModal}>
	<h2 slot="header">Server Selector</h2>
	<div slot="default">
		<form
			on:submit|preventDefault={async () => {
				// set loading state
				loading = true;

				// set clUrl
				if (clUrl) {
					localStorage.setItem("meower_linkurl", clUrl);
				} else {
					localStorage.removeItem("meower_linkurl");
				}

				// set apiUrl
				if (apiUrl) {
					if (!apiUrl.endsWith("/")) apiUrl = `${apiUrl}/`;
					localStorage.setItem("meower_apiurl", apiUrl);
				} else {
					localStorage.removeItem("meower_apiurl");
				}

				// set uploadsUrl
				if (uploadsUrl) {
					if (!uploadsUrl.endsWith("/")) uploadsUrl = `${uploadsUrl}/`;
					localStorage.setItem("meower_uploadsurl", uploadsUrl);
				} else {
					localStorage.removeItem("meower_uploadsurl");
				}

				// refresh
				window.location.reload();
			}}
		>
			<Container warning={true}>
				<b>WARNING!</b><br />
				Connecting to a custom server can be dangerous! They will get your
				IP address and some details about your device upon connecting. They
				may also be running custom code to log passwords or other sensitive
				information.
				<br /><br />
				<i>This feature is intended for developers.</i>
			</Container>
			<label for="cl-url" style={error ? "color: crimson;" : ""}>
				<b>Cloudlink URL</b>
				{#if error}<i>- {error}</i>{/if}
			</label>
			<input
				id="cl-url"
				type="text"
				class="modal-input white"
				placeholder="wss://api.meower.org/v0/cloudlink"
				disabled={loading}
				bind:value={clUrl}
				use:focus
			/>
			<br /><br />
			<label for="api-url" style={error ? "color: crimson;" : ""}
				><b>REST API URL</b>
				{#if error}<i>- {error}</i>{/if}</label
			>
			<input
				id="api-url"
				type="text"
				class="modal-input white"
				placeholder="https://api.meower.org/"
				disabled={loading}
				bind:value={apiUrl}
			/>
			<br /><br />
			<label for="uploads-url" style={error ? "color: crimson;" : ""}
				><b>Uploads URL</b>
				{#if error}<i>- {error}</i>{/if}</label
			>
			<input
				id="uploads-url"
				type="text"
				class="modal-input white"
				placeholder="https://uploads.meower.org/"
				disabled={loading}
				bind:value={uploadsUrl}
			/>
			<br /><br />
			<div class="modal-buttons">
				<button
					type="button"
					disabled={loading}
					on:click={modals.closeLastModal}>Cancel</button
				>
				<button
					type="button"
					disabled={loading}
					on:click={() => {
						clUrl = "";
						apiUrl = "";
						uploadsUrl = "";
					}}>Reset</button
				>
				<button type="submit" disabled={loading}>Save & Reload</button>
			</div>
		</form>
	</div>
</Modal>
