<script>
	import {
		Sidebarlocked,
        OOBEPage,
        mainPage,
        user
	} from "../../lib/stores.js";
    import * as clm from "../../lib/clmanager.js";
    import * as BGM from "../../lib/BGM.js"
    
    const _user = $user;
    _user.bgm = false;
    user.set(_user);
    BGM.PlayBGM(_user.bgm_song)

    clm.updateProfile();

    import OobEactual from "./OOBEactual.svelte";
    OOBEPage.set(0)

    let allowprevious = true
    let allownext = true

    Sidebarlocked.set(true)
</script>

<div class="oobe">
	<div class="main">
        <OobEactual />
    </div>
    <div class="footer">
        <button 
            class="full"
            disabled = {!allowprevious}
            on:click={() => {
                if ($OOBEPage > 0) {
                    allownext = true
                    OOBEPage.set($OOBEPage - 1);
                } else {
                    allowprevious = false
                }
            }}
        >
            {"<- Back"}
        </button>
        <button 
            class="right full"
            disabled = {!allownext}
            on:click={() => {
                if ($OOBEPage < 2) {
                    allowprevious = true
                    OOBEPage.set($OOBEPage + 1);
                } else {
                    allowprevious = true
                    allownext = false
                }
            }}
        >
            {"-> Next"}
        </button>
        <button class="center full" on:click={() => {Sidebarlocked.set(false); mainPage.set("home")}}>Skip</button>
    </div>
</div>

<style>
    .main {
        height: calc(100% - 4rem);
    }

    .full {
        height: 4rem;
        border: none;
        background-color: var(--orange-dark);
    }

    .right {
        right: 0.33em;
        position: absolute;
    }

    .center {
        position: relative;
        transform: translate(-180%,0);
        left: 50%;
    }

	.footer { 
        height: 4rem;
        background-color: var(--orange);
    }

    .oobe {
        width: 100%;
		height: 100%;
	}
</style>
