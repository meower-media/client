<script>
	import Modal from "../Modal.svelte";

	import {modalShown, user} from "../stores.js";
	import * as clm from "../clmanager.js";

	import * as Modals from "../modals.js";

    import defaultPreview from "../../assets/themePreviews/OrangeLight.png";

	const themePreviews = import.meta.glob("../../assets/themePreviews/*.png", {
		import: "default",
		eager: true,
	});

	let selections = ["orange", "dark-orange", "blue", "dark-blue"];

	let error = false;

    let darkMode = !$user.mode;
	let theme = $user.theme;

	if (!selections.includes(theme)) {
		theme = "orange";
		error = true;
	}

	const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
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
		selection = clamp(selection, 0, 3);
		theme = selections[selection];
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
			<div class="theme-middle">
				<img
					src={currentPreviewImage}
					class="theme-preview"
					alt={themeName}
				/>
				<div class="theme-name">
					{themeCaps + " (" + darkModeStr + ")"}
				</div>
			</div>
		</div>
		<div class="theme-middle">
			<button
				on:click={() => {
					selection -= 1;
					changeTheme();
				}}>{"<"}</button
			>
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
			<button
				on:click={() => {
					const _user = $user;
					_user.theme = theme;
					_user.mode = !darkMode;
					user.set(_user);

					clm.updateProfile();
					$modalShown = false;
				}}>OK</button
			>
		</div>
	</div>
</Modal>

<style>
	div {
		width: 100%;
	}

	img {
		max-width: 100%;
		align-self: center;
	}

	.theme-select {
		margin-top: 1rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 10px;
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
