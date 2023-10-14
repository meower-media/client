<script>
	import Modal from "../Modal.svelte";

	import {user} from "../stores.js";
	import {removeTheme} from "../CustomTheme.js";
	import * as clm from "../clmanager.js";

	import * as modals from "../modals.js";

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
			darkMode = false;
		}
	}

	let selection = selections.indexOf((darkMode ? "dark-" : "") + theme);

	let darkModeStr = (!darkMode && "Light") || "Dark";
	let themeCaps = theme.slice(0, 1).toUpperCase() + theme.slice(1);
	let themeName = themeCaps + darkModeStr;
	
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
		}
	}
</script>

<Modal
	on:close={() => modals.closeModal()}
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
				{#if theme === "custom"}
					<div class="theme-name">
						Custom Theme
					</div>
					<button on:click={() => modals.showModal("customTheme")}>Edit theme</button>
				{:else}
					<div class="theme-name">
						{themeCaps + " (" + darkModeStr + ")"}
					</div>
					<img
						src={currentPreviewImage}
						class="theme-preview"
						alt={themeName}
					/>
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
				on:click={() => modals.closeModal()}>Cancel</button
			>
			<button
				disabled={theme === "custom"}
				on:click={() => {
					removeTheme();
					const _user = $user;
					_user.theme = theme;
					_user.mode = !darkMode;
					user.set(_user);
					clm.updateProfile();
					modals.closeModal();
				}}>Save</button
			>
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
