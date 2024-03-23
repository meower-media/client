<script>
	import Modal from "../../Modal.svelte";

	import CustomThemeModal from "./CustomTheme.svelte";

	import {user} from "../../stores.js";
	import {removeTheme} from "../../CustomTheme.js";
	import * as modals from "../../modals.js";
	import * as clm from "../../clmanager.js";

	import defaultPreview from "../../../assets/themePreviews/Orange.png";

	const themePreviews = import.meta.glob(
		"../../../assets/themePreviews/*.png",
		{
			import: "default",
			eager: true,
		}
	);

	let selections = ["orange", "blue", "custom"];

	let error = false;

	let theme = $user.theme;

	if (!selections.includes(theme)) {
		if (!theme.startsWith("custom:")) {
			theme = "orange";
			error = true;
		} else {
			theme = "custom";
		}
	}

	let selection = selections.indexOf(theme);

	let themeName = theme.slice(0, 1).toUpperCase() + theme.slice(1);

	/**
	 * @type {string}
	 */
	// @ts-ignore
	let currentPreviewImage =
		themePreviews["../../../assets/themePreviews/" + themeName + ".png"] ||
		defaultPreview;

	function changeTheme() {
		if (selection < 0) {
			selection = selections.length - 1;
		}

		selection = selection % selections.length;
		theme = selections[selection];

		if (theme != "custom") {
			themeName = theme.slice(0, 1).toUpperCase() + theme.slice(1);

			// @ts-ignore
			currentPreviewImage =
				themePreviews[
					"../../assets/themePreviews/" + themeName + ".png"
				] || defaultPreview;
		}

		themeName = theme.slice(0, 1).toUpperCase() + theme.slice(1); // Change vars

		// @ts-ignore
		currentPreviewImage =
			themePreviews[
				"../../../assets/themePreviews/" + themeName + ".png"
			] || defaultPreview;
	}
</script>

<Modal on:close={modals.closeLastModal}>
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
					<div class="theme-name">Custom Theme</div>
					<button on:click={() => modals.showModal(CustomThemeModal)}
						>Edit theme</button
					>
				{:else}
					<div class="theme-name">
						{themeName}
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
			<button on:click={modals.closeLastModal}>Close</button>
			<button
				disabled={theme === "custom"}
				on:click={() => {
					removeTheme();
					const _user = $user;
					_user.theme = theme;
					user.set(_user);
					clm.updateProfile({theme: theme});
					modals.closeLastModal();
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
		height: 20vw;
		max-height: 11em;
		width: auto;
	}

	.theme-name {
		padding-bottom: 0.25em;
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
