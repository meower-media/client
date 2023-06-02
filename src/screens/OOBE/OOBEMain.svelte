<script>
	import {sidebarLocked, OOBEPage, mainPage, user} from "../../lib/stores.js";
	import * as clm from "../../lib/clmanager.js";
	import * as BGM from "../../lib/BGM.js";

	const _user = $user;
	_user.bgm = false;
	user.set(_user);
	BGM.playBGM(_user.bgm_song);

	clm.updateProfile();

	import OOBEActual from "./OOBEActual.svelte";
	OOBEPage.set(0);

	$: allowPrevious = $OOBEPage > 0;
	$: allowNext = $OOBEPage < 2;

	sidebarLocked.set(true);
</script>

<div class="oobe">
	<div class="main">
		<OOBEActual />
	</div>
	<div class="footer">
		<button
			class="full"
			disabled={!allowPrevious}
			on:click={() => {
				OOBEPage.set($OOBEPage - 1);
			}}
		>
			&lt;- Back
		</button>
		<button
			class="center full"
			on:click={() => {
				sidebarLocked.set(false);
				mainPage.set("home");
			}}>Skip</button
		>
		<button
			class="right full"
			disabled={!allowNext}
			on:click={() => {
				OOBEPage.set($OOBEPage + 1);
			}}
		>
			Next -&gt;
		</button>
	</div>
</div>

<style>
	.main {
		height: calc(100% - 3em);
	}

	.footer {
		height: 3em;
		display: flex;
		align-items: stretch;
		justify-content: space-between;
	}

	.oobe {
		width: 100%;
		height: 100%;
	}
</style>
