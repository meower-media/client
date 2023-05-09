<script>
	import {
		Sidebarlocked,
        Next_Enabled,
        OOBEPage
	} from "../../lib/stores.js";

    import OobEactual from "./OOBEactual.svelte";
    OOBEPage.set(0)

    //Sidebarlocked.set(true)
</script>

<div class="oobe">
	<div class="main">
        <OobEactual />
    </div>
    <div class="footer">
        <button 
            class="full"
            on:click={() => {
                if ($Next_Enabled) {
                    OOBEPage.set($OOBEPage - 1);
                }
            }}
        >
            {"<- Back"}
        </button>
        <button 
            class="right full"
            on:click={() => {
                if ($Next_Enabled) {
                    OOBEPage.set($OOBEPage + 1);
                }
            }}
        >
            {"-> Next"}
        </button>
        <button class="center full">Skip</button>
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
