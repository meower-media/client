<script>
	import Modal from "../Modal.svelte";

	import {modalShown, modalPage, user} from "../stores.js";
    import * as clm from "../clmanager.js";

    const ThemePreviews = import.meta.glob("../../assets/ThemePreviews/*.png", {
		import: "default",
		eager: true,
	});

    let Selections = ["orange","blue"]

    let ThemeError = false

    let DarkMode = !$user.mode
    let Theme = $user.theme

    if (!Selections.includes(Theme)) {
        Theme = "orange"
        ThemeError = true
    }

    const _clamp = (num, min, max) => Math.min(Math.max(num, min), max);
    let Selection = Selections.indexOf(Theme)

    let DarkModeSTR = (!DarkMode && 'Light' || 'Dark')
    let CurrentThemeName = Theme.slice(0,1).toUpperCase()+Theme.slice(1)+DarkModeSTR
    let CurrentThemePreviewIMG = ThemePreviews["../../assets/ThemePreviews/"+CurrentThemeName+".png"]

    function ChangeTheme() {
        Selection = _clamp(Selection, 0, 1)
        Theme = Selections[Selection]
        DarkModeSTR = (!DarkMode && 'Light' || 'Dark')
        CurrentThemeName = Theme.slice(0,1).toUpperCase()+Theme.slice(1)+DarkModeSTR
        CurrentThemePreviewIMG = ThemePreviews["../../assets/ThemePreviews/"+CurrentThemeName+".png"]
    }
</script>

<Modal
	on:close={() => {
		$modalShown = false;
	}}
>
	<h2 slot="header">Select a Theme</h2>
	<div slot="default">
        <img src={CurrentThemePreviewIMG} id="ThemePreview" alt={CurrentThemeName} />
        <p id="ThemeName">{Theme.slice(0,1).toUpperCase()+Theme.slice(1) + " (" + DarkModeSTR + ")"}</p>
        <div id="ThemeSelect">
            <button on:click={() => {Selection -= 1; ChangeTheme()}}>{"<"}</button>
            <button on:click={() => {Selection += 1; ChangeTheme()}}>{">"}</button>
        </div>
        {#if ThemeError}
            <p id="ThemeInvalid">Your previous theme Was invalid, so it was reset to orange.</p>
        {/if}
        <div class="DarkMode">
            <input style="position: relative; float:left; z-index: 2;" type="checkbox" title="Dark Mode" bind:checked={(DarkMode)} on:change={() => {ChangeTheme()}}/>
            <p style="top:0.5rem; position: relative; z-index: 0;">Dark mode?</p>
        </div>
        <p class="smol">Layout Has to be changed in settings.</p>
        <div class="modal-buttons">
            <button 
                on:click={() => {
                    const _user = $user;
                    _user.theme = Theme;
                    _user.mode = !DarkMode;
                    user.set(_user);

                    clm.updateProfile();
                    $modalShown = false;
                }}
            >OK</button>
			<button
				on:click={() => {
					$modalShown = false;
				}}>Close</button
			>
		</div>
	</div>
</Modal>

<style>
    #ThemePreview {
        position: relative;
        left: 50%;
        transform: translate(-50%,0);
        width: 50%;
        height: 50%;
        border-radius: 1vw;
    }

    .DarkMode {
        position: relative;
        left: 50%;
        transform: translate(-50%,0);
    }

    #ThemeInvalid {
        text-align: center;
        width: 100%;
    }

    #ThemeName {
        font-size: 4rem;
        margin: 0.2rem;
        text-align: center;
        font-weight: bold;
    }

    #ThemeSelect {
        margin-top: 1rem;
        position: relative;
        left: 50%;
        width: 6.7rem;
        transform: translate(-50%,0);
    }

	.smol {
		font-size: 0.8rem;
	}
</style>
