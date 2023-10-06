<script>
	import Modal from "../../Modal.svelte";

	import * as modals from "../../modals.js";
	import * as clm from "../../clmanager.js";
    import sleep from "../../sleep";

	let loading, error;
</script>

<Modal
	on:close={modals.closeLastModal}
>
	<h2 slot="header">Restart Server</h2>
	<div slot="default">
		<form
			on:submit|preventDefault={async () => {
				loading = true;
				try {
					await clm.meowerRequest({
						cmd: "direct",
						val: {
							cmd: "restart",
							val: "",
						},
					});
				} catch (code) {
					loading = false;
                    switch (code) {
                        case "E:122 | Command disabled by sysadmin":
                            error = "This server doesn't support the restart command!";
                            break;
                        default:
                            error = "Unexpected " + code + " error!";
                    }
					return;
				}
			}}
		>
			<p>Are you sure you would like to restart the server?</p>
			{#if error}
				<p style="color: crimson;">{error}</p>
			{:else}
				<br />
			{/if}
			<div class="modal-buttons">
				<button
					type="button"
					disabled={loading}
					on:click|preventDefault={modals.closeLastModal}>Cancel</button
				>
                {#await sleep(1500)}
                    <button type="submit" disabled>Restart</button>
                {:then}
                    <button type="submit" disabled={loading}>Restart</button>
                {/await}
                
			</div>
		</form>
	</div>
</Modal>