<script>
	import Modal from "../lib/Modal.svelte";
	import {shiftHeld} from "../lib/keyDetect.js";
	import {mainPage as page, modalShown, userToMod} from "../lib/stores.js";
</script>

<Modal
	on:close={() => {
		$modalShown = false;
	}}
>
	<h2 slot="header">User to Moderate?</h2>
	<div slot="default">
		<form
			class="createpost"
			autocomplete="off"
			on:submit|preventDefault={e => {
				$modalShown = false;
				$userToMod = e.target[0].value;
				page.set("modUser");
			}}
		>
			<input
				type="text"
				class="white"
				placeholder="Write something..."
				id="long"
				name="moduser"
				autocomplete="false"
				on:keydown={event => {
					if (event.key == "Enter" && !shiftHeld) {
						event.preventDefault();
						document.getElementById("submitpost").click();
					}
				}}
			/>
			<button id="submitpost">Go to user</button>
		</form>
	</div>
</Modal>

<style>
	#long {
		width: 10em;
	}
</style>
