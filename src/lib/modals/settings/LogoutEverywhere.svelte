<script>
	import Modal from "../../Modal.svelte";

	import * as modals from "../../modals.js";
	import { apiUrl } from "../../urls.js";
	import { authHeader } from "../../stores.js";

	import {goto, focus} from "@roxi/routify";

	let loading, error;
</script>

<Modal on:close={modals.closeLastModal}>
	<h2 slot="header">Logout Everywhere</h2>
	<div slot="default">
		<form
			on:submit|preventDefault={async () => {
				loading = true;
				try {
					const resp = await fetch(
						`${apiUrl}me/tokens`,
						{
							method: "DELETE",
							headers: $authHeader,
						}
					);
					if (!resp.ok) {
						throw new Error(
							"Response code is not OK; code is " + resp.status
						);
					}
					$goto("/logout");
				} catch (e) {
					loading = false;
					error = e;
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
