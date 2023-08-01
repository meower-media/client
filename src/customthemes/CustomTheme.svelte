<script>
	import Modal from "../lib/Modal.svelte";
	import Loading from "../Loading.svelte";

	import {modalShown, modalPage} from "../stores.js";

	import * as clm from "../clmanager.js";

	let loading = false;
    let newTheme, theme

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
		{#if loading}
			<div class="fullcenter">
				<Loading />
			</div>
		{:else}
			<form
				on:submit|preventDefault={e => {
					if (!(e.target[0].value && e.target[1].value)) {
						return false;
					}
					newTheme = e.target[0].value;
					return false;
				}}
			>
				<input
					type="text"
					class="modal-input white"
					placeholder="Theme JSON"
					maxlength="20"
					value={theme}
					autofocus
				/><br />
				<br />
				<div class="modal-buttons">
					<a
						href="/"
						on:click|preventDefault={() => {
							modalPage.set("signup");
						}}>Join Meower</a
					>
					<button type="submit">Login</button>
				</div>
			</form>
		{/if}
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
