<script>
	import Modal from "../Modal.svelte";

	import {modalShown, modalPage, user} from "../stores.js";
    import * as clm from "../clmanager.js";
    import {AudioJSON} from "../BGM_Json.js"

    let Selections = AudioJSON

    let BgmError = false
    let BgmTrack = $user.bgm_song

    if (Selections[BgmTrack]) {
        BgmTrack = 2
        BgmError = true
    }

    const _clamp = (num, min, max) => Math.min(Math.max(num, min), max);
    let Selection = BgmTrack

    function ChangeTrack() {
       
    }
</script>

<Modal
	on:close={() => {
		$modalShown = false;
	}}
>
	<h2 slot="header">Select a Bgm</h2>
	<div slot="default">
        <p id="BgmName">{BgmTrack }</p>
        <div id="BgmSelect">
            <button on:click={() => {Selection -= 1; ChangeTrack()}}>{"<"}</button>
            <button on:click={() => {Selection += 1; ChangeTrack()}}>{">"}</button>
        </div>
        {#if BgmError}
            <p id="BgmInvalid">Your previous BGM song Was invalid, so it was reset to orange.</p>
        {/if}
        <div class="DarkMode">
            <input id="sfx" style="position: relative; float:left; z-index: 2;" type="checkbox" title="Sound Effects" bind:checked={(SfxEnabled)} on:change={() => {Sfx()}}/>
            <label for="sfx">SFX?</label>
            <p style="top:0.5rem; position: relative; z-index: 0;">SFX?</p>
        </div>
        <div class="modal-buttons">
            <button 
                on:click={() => {
                    const _user = $user;
                    _user.bgm_song = BgmTrack;
                    user.set(_user);

                    clm.updateProfile();
                    $modalShown = false;
                }}
            >OK</button>
			<button
				on:click={() => {
					$modalShown = false;
				}}>Close</button
			>
		</div>
	</div>
</Modal>

<style>
    #BgmInvalid {
        text-align: center;
        width: 100%;
    }

    .DarkMode {
        position: relative;
        left: 50%;
        transform: translate(-50%,0);
    }

    #BgmName {
        font-size: 4rem;
        margin: 0.2rem;
        text-align: center;
        font-weight: bold;
    }

    #BgmSelect {
        margin-top: 1rem;
        position: relative;
        left: 50%;
        width: 6.7rem;
        transform: translate(-50%,0);
    }
</style>
