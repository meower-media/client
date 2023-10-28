<script>
	import Modal from "../../Modal.svelte";

	import {user} from "../../stores.js";
	import {audioData} from "../../BGMdata.js";
	import * as BGM from "../../BGM.js";
	import * as modals from "../../modals.js";
	import * as clm from "../../clmanager.js";

	let selections = audioData;

	let bgmError = false;
	let bgmTrack = $user.bgm_song - 1;

	if (bgmTrack > selections.length - 1 || bgmTrack < 0) {
		bgmTrack = 2;
		bgmError = true;
	}

	const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
	let bgmName = selections[bgmTrack]["name"];

	function ChangeTrack() {
		bgmTrack = clamp(bgmTrack, 0, selections.length - 1);
		bgmName = selections[bgmTrack].name;
		BGM.playBGM(bgmTrack + 1);
	}
</script>

<Modal on:close={modals.closeLastModal}>
	<h2 slot="header">Select Song</h2>
	<div slot="default">
		<div class="bgm-select">
			<button
				on:click={() => {
					bgmTrack -= 1;
					ChangeTrack();
				}}>{"<"}</button
			>
			<div class="bgm-name">
				{bgmName}
				<div class="bgm-author">
					by {selections[bgmTrack]["author"]}
				</div>
			</div>
			<button
				on:click={() => {
					bgmTrack += 1;
					ChangeTrack();
				}}>{">"}</button
			>
		</div>
		{#if bgmError}
			<p class="bgm-invalid">
				Your previous song Was invalid, so it was reset.
			</p>
		{/if}
		<div class="modal-buttons">
			<button
				on:click={() => {
					BGM.playBGM($user.bgm_song); // why
					modals.closeLastModal();
				}}>Cancel</button
			>
			<button
				on:click={() => {
					clm.updateProfile({bgm_song: bgmTrack + 1});
					modals.closeLastModal();
				}}>OK</button
			>
		</div>
	</div>
</Modal>

<style>
	.bgm-invalid {
		text-align: center;
		width: 100%;
	}

	.bgm-select {
		margin: 1em 0;
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-items: center;
	}

	.bgm-name {
		font-weight: bold;
		font-size: 2.5em;
		text-align: center;
	}

	.bgm-author {
		font-size: 0.5em;
		text-align: center;
		font-weight: normal;
	}
</style>
