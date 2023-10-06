<script>
    import Modal from "../../Modal.svelte";

    import {userToMod} from "../../stores.js";
    import * as modals from "../../modals.js";

    export let modalData;

    let { deleted, deleteAfter, deleteAccountCallback } = modalData;
    let mode, error;
</script>

<Modal on:close={modals.closeLastModal}>
    <h2 slot="header">
        Delete {$userToMod}
    </h2>
    <div slot="default">
        <label for="post-account-mode"><b>Mode</b></label><br />
        <select
            id="post-account-mode"
            class="modal-input grow"
            style="width: 100%; margin-bottom: 0.25em;"
            bind:value={mode}
        >
            {#if !deleted}
                {#if deleteAfter}
                    <option value="cancel" selected={mode === "cancel"}>Cancel scheduled deletion</option>
                {:else}
                    <option value="schedule" selected={mode === "schedule"}>Schedule deletion</option>
                {/if}
                <option value="immediate" selected={mode === "immediate"}>Immediate deletion</option>
            {/if}
            <option value="purge" selected={mode === "purge"}>Purge</option>
        </select><br />
        {#if mode === "cancel"}
            Cancel scheduled account deletion.
        {:else if mode === "schedule"}
            Schedule account for deletion after 7 days.
        {:else if mode === "immediate"}
            Immediately delete account.
        {:else if mode === "purge"}
            Purge everything about the account. It'll be like it never existed.
        {/if}
        
        {#if error}
            <p style="color: crimson;">{error}</p>
        {:else}
            <br /><br />
        {/if}
        <div class="modal-buttons">
            <button
                type="button"
                on:click={modals.closeLastModal}
                >Cancel</button
            >
            <button
                type="button"
                disabled={!mode}
                on:click={async () => {
                    try {
                        await deleteAccountCallback(mode);
                    } catch (e) {
                        error = e;
                    }
                }}
            >Confirm</button>
        </div>
    </div>
</Modal>