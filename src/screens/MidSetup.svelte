<!-- Boring orange screen with login and signup. -->

<script>
	import {pageParam, user, mainPage} from "../lib/stores.js";

	import * as clm from "../lib/networking/clmanager.js";
	import songs from "../lib/audio/songs.js";
	import Button from "../lib/ui/form/Button.svelte";
</script>

<div class="midsetup">
	{#if $pageParam === "blank"}
		<div></div>
	{:else if $pageParam === "bgm"}
		<div class="fullcenter">
			<h1>Select a song:</h1>
			<div class="bgm-selector">
				<Button
					on:click={() => {
						$user.bgm_song--;
						if ($user.bgm_song < 1) {
							$user.bgm_song = songs.length;
						}
					}}
				>
					&lt;
				</Button>
				<div class="song-name">
					{#if songs[$user.bgm_song-1]}
						{songs[$user.bgm_song-1].author} - {songs[$user.bgm_song-1].name}
					{:else}
						Unknown
					{/if}
				</div>
				<Button
					on:click={() => {
						$user.bgm_song++;
						if ($user.bgm_song > songs.length) {
							$user.bgm_song = 1;
						}
					}}
				>
					&gt;
				</Button>
			</div>
			<Button
				on:click={() => {
					mainPage.set("settings");
					clm.updateProfile();
				}}
			>
				Done
			</Button>
		</div>
	{:else}
		Somehow, you got to a page that doesn't exist...
		<br />
		(Current page: {$pageParam})
	{/if}
</div>

<style>
	.midsetup {
		background-color: var(--orange);
		color: var(--foreground-orange);
		font-size: 150%;

		text-align: center;
		
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1000;
		
		width: 100%;
		min-height: 100vh;
		height: 100%;

		display: table;
	}
	.fullcenter {
		width: 100%;
		height: 100%;
		box-sizing: border-box;

		margin: auto;
		overflow: auto;

		display: table-cell;
		vertical-align: middle;
		padding: 1em;
	}

	.bgm-selector {
		width: 100%;
		max-width: 30em;
		margin: 2em auto;

		display: flex;
		flex-wrap: nowrap;

		align-items: center;
	}
	.song-name {
		flex-grow: 1;
		flex-shrink: 1;

		padding: 0.5em;
		box-sizing: border-box;
	}
</style>
