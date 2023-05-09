<script>
	import Modal from "../Modal.svelte";

	import {modalShown, modalPage} from "../stores.js";

    const ThemePreviews = import.meta.glob("../../assets/ThemePreviews/*.png", {
		import: "default",
		eager: true,
	});

    Themes = ["Orange","Blue"]
</script>

<Modal
	on:close={() => {
		$modalShown = false;
	}}
>
	<h2 slot="header">Theme</h2>
	<div slot="default">
		
	</div>
</Modal>

<style>
	.smol {
		font-size: 8px;
	}
</style>
