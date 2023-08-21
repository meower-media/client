<script>
	import Modal from "../Modal.svelte";

	import {modalShown, user, customTheme, useCustomTheme} from "../stores.js";
    import * as clm from "../clmanager.js";
    import {saveTheme,fallback,previewTheme} from "../CustomTheme.js"

    let MainColor = $customTheme.orange
    let Add = $customTheme.tinting
    let Background = $customTheme.background
    let Foreground = $customTheme.foreground
    let Foreground2 = $customTheme.foregroundOrange

    let PreviousCTheme = $useCustomTheme
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
        <label for="Bg">Background: </label>
        <input type="color" id="Bg" bind:value={Background}>
        <br>
        <label for="Fg">Foreground: </label>
        <input type="color" id="Fg" bind:value={Foreground}>
        <br>
        <label for="Fg2">Foreground 2: </label>
        <input type="color" id="Fg2" bind:value={Foreground2}>
        <br>
        <br>
        <button
            on:click={() => {
                PreviousCTheme = $useCustomTheme
                previewTheme({"Orange":MainColor,"Add":Add,"Bg":Background,"Fg":Foreground,"Fg2":Foreground2})
            }}>Preview</button
        >
        <button
            on:click={() => {
                PreviousCTheme = $useCustomTheme
                useCustomTheme.set(false)
            }}>Disable Preview</button
        >
        <br>
        <br>
		<div class="modal-buttons">
			<button
				on:click={() => {
					$modalShown = false;
                    useCustomTheme.set(PreviousCTheme)
				}}>Close</button
			>
            <button
				on:click={() => {
                    MainColor = fallback.orange
                    Add = fallback.tinting
                    Background = fallback.background
                    Foreground = fallback.foreground
                    Foreground2 = fallback.foregroundOrange
				}}>Reset</button>
            <button
                on:click={() => {
                    saveTheme({"Orange":MainColor,"Add":Add,"Bg":Background,"Fg":Foreground,"Fg2":Foreground2})

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
