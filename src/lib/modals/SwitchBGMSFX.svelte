<script>
	import Modal from "../Modal.svelte";

	import {modalShown, modalPage, user} from "../stores.js";
    import * as clm from "../clmanager.js";
    import {AudioJSON} from "../BGM_Json.js"
    import * as BGM from "../BGM.js"

    let Selections = AudioJSON

    let BgmError = false
    let BgmTrack = $user.bgm_song - 1

    if (BgmTrack > Selections.length-1 || BgmTrack < 0) {
        BgmTrack = 2
        BgmError = true
    }

    const _clamp = (num, min, max) => Math.min(Math.max(num, min), max);
    let BgmTrack_Name = Selections[BgmTrack]["name"]

    function ChangeTrack() {
        BgmTrack = _clamp(BgmTrack, 0, Selections.length-1)
        BgmTrack_Name = Selections[BgmTrack]["name"]
    }
</script>

<Modal
	on:close={() => {
		$modalShown = false;
	}}
>
	<h2 slot="header">Select a Bgm</h2>
	<div slot="default">
        <p id="BgmName">{BgmTrack_Name}</p>
        <div id="BgmSelect">
            <button on:click={() => {BgmTrack -= 1; ChangeTrack()}}>{"<"}</button>
            <button on:click={() => {BgmTrack += 1; ChangeTrack()}}>{">"}</button>
        </div>
        {#if BgmError}
            <p id="BgmInvalid">Your previous BGM song Was invalid, so it was reset to orange.</p>
        {/if}
        <div class="modal-buttons">
            <button 
                on:click={() => {
                    const _user = $user;
                    _user.bgm_song = BgmTrack + 1;
                    user.set(_user);

                    clm.updateProfile();
                    BGM.PlayBGM(BgmTrack+1);
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
