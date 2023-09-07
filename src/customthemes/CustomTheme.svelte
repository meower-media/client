<script>
	import Modal from "../lib/Modal.svelte";
	import Loading from "../lib/Loading.svelte";

	import {modalShown, modalPage, customTheme} from "../lib/stores.js";
	import {stringToTheme} from "./customTheme.js";

	import * as clm from "../lib/clmanager.js";

	let loading = false;
    let newTheme, theme, error

	function doLogin() {
	}
</script>

<Modal
	on:close={() => {
		$modalShown = false;
	}}
>
	<h2 slot="header">Use custom theme</h2>
	<div slot="default">
			<form
				on:submit|preventDefault={e => {
					if (!(e.target[0].value && JSON.stringify(e.target[0].value))) {
						error = "input a theme"
						return false;
					}
					newTheme = e.target[0].value;
					console.log(`theme:${JSON.stringify(e.target[0].value)}`)
					customTheme.set(`theme:${JSON.stringify(e.target[0].value)}`)
					return false;
				}}
			>
				<input
					type="text"
					class="modal-input white"
					placeholder="Theme JSON"
					value={JSON.stringify(stringToTheme(customTheme))}
					autofocus
				/><br />
				<br />
				<div class="modal-buttons">
					<button type="submit">Submit</button>
					<div class="error">
						{error}
					</div>
				</div>
			</form>
	</div>
</Modal>

<style>
	.fullcenter {
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		top: 0;
		left: 0;
	}
	.login-status {
		color: red;
		font-size: 105%;
		display: inline-block;
		height: 0;
		overflow: visible;
	}
	label,
	.checkboxes input {
		vertical-align: middle;
	}
	.checkboxes {
		text-align: left;
		font-size: 95%;
	}
</style>
