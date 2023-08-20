<script>
	import Modal from "../Modal.svelte";

	import {modalShown, user, customTheme} from "../stores.js";
    import * as clm from "../clmanager.js";
    import {loadTheme, saveTheme} from "../CustomTheme.js"

    var MainColor = $customTheme.orange
    var Add = "#101010"
</script>

<Modal
	on:close={() => {
		$modalShown = false;
	}}
>
	<h2 slot="header">Custom Theme</h2>
	<div slot="default">
		<label for="MainColor">Main Color: </label>
        <input type="color" id="MainColor" bind:value={MainColor}>
        <br>
        <label for="Tint">Tinting: </label>
        <input type="color" id="Tint" bind:value={Add}>
        <br>
        <br>
		<div class="modal-buttons">
			<button
				on:click={() => {
					$modalShown = false;
				}}>Close</button
			>
            <button
                on:click={() => {
                    saveTheme({"Orange":MainColor,"Add":Add})

                    clm.updateProfile();
                    $modalShown = false;
                }}>OK</button
            >
		</div>
	</div>
</Modal>

<style>
	.smol {
		font-size: 8px;
	}
</style>
