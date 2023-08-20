<script>
	import Modal from "../Modal.svelte";

	import {customTheme, modalShown, useCustomTheme, user} from "../stores.js";
	import * as clm from "../clmanager.js";

	import * as Modals from "../modals.js";

    import defaultPreview from "../../assets/themePreviews/OrangeLight.png";

	const themePreviews = import.meta.glob("../../assets/themePreviews/*.png", {
		import: "default",
		eager: true,
	});

	let selections = ["orange", "dark-orange", "blue", "dark-blue","custom"];

	let error = false;

    let darkMode = !$user.mode;
	let theme = $user.theme;

	if (!selections.includes(theme)) {
		if (!theme.startsWith("custom:")) {
			theme = "orange";
			error = true;
		} else {
			theme = "custom";
			darkMode = false
		}
	}

	const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
	let selection = selections.indexOf((darkMode ? "dark-" : "") + theme);

	let darkModeStr = (!darkMode && "Light") || "Dark";
	let themeCaps = theme.slice(0, 1).toUpperCase() + theme.slice(1);
	let themeName = themeCaps + darkModeStr;
	let CustomTheme = false;

	if (theme != "custom") {
		CustomTheme = false
	} else {
		CustomTheme = true
	}
	
    /**
     * @type {string}
     */
	// @ts-ignore
	let currentPreviewImage =
		themePreviews["../../assets/themePreviews/" + themeName + ".png"] || defaultPreview;

	function changeTheme() {
		if (selection < 0) {selection = selections.length-1}

		selection = selection % selections.length;
		theme = selections[selection];

		if (theme != "custom") {
			CustomTheme = false
			darkMode = false;
			if (theme.startsWith("dark-")) {
				darkMode = true;
				theme = theme.substring(5);
			}

			darkModeStr = darkMode ? "Dark" : "Light";
			themeCaps = theme.slice(0, 1).toUpperCase() + theme.slice(1);
			themeName = themeCaps + darkModeStr; // Change vars
			
			// @ts-ignore
			currentPreviewImage =
				themePreviews["../../assets/themePreviews/" + themeName + ".png"] || defaultPreview;
		} else {
			CustomTheme = true
		}
	}

	function customThemeChange() {
		Modals.showModal("customTheme");
	}
</script>

<Modal
	on:close={() => {
		$modalShown = false;
	}}
>
	<h2 slot="header">Select a Theme</h2>
	<div slot="default">
		<div class="theme-select">
			<button
				on:click={() => {
					selection -= 1;
					changeTheme();
				}}>{"<"}</button
			>
			<div class="theme-middle">
				{#if !CustomTheme}
					<img
						src={currentPreviewImage}
						class="theme-preview"
						alt={themeName}
					/>
					<div class="theme-name">
						{themeCaps + " (" + darkModeStr + ")"}
					</div>
				{:else}
					<button on:click={() => {customThemeChange()}}>Press me</button>
					<br /><br />
					<div class="theme-name">
						Custom Theme
					</div>
				{/if}
			</div>
			<button
				on:click={() => {
					selection += 1;
					changeTheme();
				}}>{">"}</button
			>
		</div>
		{#if error}
			<p class="theme-invalid">
				Your previous theme was invalid, so it was reset to orange.
			</p>
		{/if}
		<p class="layout-text">(Change the layout in the settings.)</p>
		<div class="modal-buttons">
			<button
				on:click={() => {
					$modalShown = false;
				}}>Close</button
			>
			{#if !CustomTheme}
				<button
					on:click={() => {
						const _user = $user;
						_user.theme = theme;
						_user.mode = !darkMode;
						user.set(_user);

						clm.updateProfile();
						$modalShown = false;
						useCustomTheme.set(false)
					}}>OK</button
				>
			{:else}
				<button
					disabled
				>Ok</button>
			{/if}
		</div>
	</div>
</Modal>

<style>
	.theme-select {
		margin-top: 1rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: space-between;
	}

	.theme-preview {
		height: 11em;
		width: auto;
	}

	.theme-name {
		font-size: 3rem;
		font-weight: bold;
	}

	.theme-middle {
		text-align: center;
	}

	.theme-invalid {
		text-align: center;
		width: 100%;
	}

	.layout-text {
		text-align: center;
        margin: 0.75em 0;
        font-size: 80%;
	}
</style>
