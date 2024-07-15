<script>
	import Modal from "../../Modal.svelte";

	import * as modals from "../../modals.js";

	import {goto, focus} from "@roxi/routify";
	import {authHeader} from "../../stores.js";
	import {apiUrl} from "../../urls";

	let loading, error;
</script>

<Modal on:close={modals.closeLastModal}>
	<h2 slot="header">Logout Everywhere</h2>
	<div slot="default">
		<form
			on:submit|preventDefault={async () => {
				loading = true;

				const resp = await fetch(`${apiUrl}/me/tokens`, {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						...$authHeader,
					},
				});

				let body;

				try {
					body = await resp.json();
				} catch (e) {
					loading = false;
					error = "Failed to parse response!";
					return;
				}

				if (body.error) {
					loading = false;

					let code = body.type;

					if (code === "tooManyRequests") {
						error = "Too many requests! Please try again later.";
					} else {
						error = "Unexpected " + code + " error!";
					}
				} else {
					$goto("/logout");
				}
			}}
		>
			<p>Are you sure you want to logout everywhere?</p>
			<div class="modal-buttons">
				<button
					type="button"
					disabled={loading}
					on:click={modals.closeLastModal}>Cancel</button
				>
				<button type="submit" disabled={loading} use:focus
					>Confirm</button
				>
			</div>
		</form>
	</div>
</Modal>
