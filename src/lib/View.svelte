<script>
    import OOBE from "./OOBE/Main.svelte";
    import {hasExperiment} from "./bitField.js";
    import ChatsList from "./ChatsList.svelte";
    import {afterPageLoad, params} from "@roxi/routify";
	import {tick} from "svelte";

    import {
		OOBERunning,
	} from "../lib/stores.js";

    let currentPage = "";
	let currentParams = JSON.stringify($params);
	let remounting = false;
	$afterPageLoad(async page => {
		if (remounting) return;

		if (page.title === currentPage) {
			if (currentParams !== JSON.stringify($params)) {
				currentPage = page.title;
				currentParams = JSON.stringify($params);

				remounting = true;
				await tick();
				remounting = false;
			}
		} else {
			currentPage = page.title;
			currentParams = JSON.stringify($params);
		}
	});
</script>

<div class="views-outer">
    <div class="views">
        <div class="view">
            <div class="wrapper">
                {#if hasExperiment(1)}
                    <p>Hello world!</p>
                {/if}
                {#if $OOBERunning}
                    <OOBE />
                {:else if !remounting}
                    <slot />
                {/if}
            </div>
        </div>
        <div class="chats">
            <ChatsList />
        </div>
    </div>
</div>

<style>
    	.chats {
		width: 30vw;
		background-color: #000000;
		height: 100%;
	}

	.wrapper {
		position: relative;
		width: 90%;
		left: 50%;
		transition: 0.15s;
		transform: translate(-50%,0);
	}

	.views {
		display: flex;
		overflow: hidden;
		height: 100%;
	}

	.views-outer {
		overflow: hidden;
		height: 100%;
	}

	:global(main.layout-mobile) .wrapper {
		width: 100%;
	}

	:global(main.layout-mobile) .views {
		width: 200%;
	}

	:global(main.layout-mobile) .views-outer {
		scrollbar-width: none;
		overflow-x: scroll;
	}

	:global(main.layout-mobile) .chats, .view {
		width: 100vw;
		transition: 0.2s;
	}

	@keyframes transition {
		from {
			height: 100%;
			opacity: 1;
		}
		80% {
			opacity: 1;
		}
		to {
			height: 4em;
			opacity: 0;
		}
	}

	.view {
		flex-grow: 1;
		flex-shrink: 1;

		padding: 0.33em;
		box-sizing: border-box;
		overflow: auto;

		display: flex;
		flex-direction: row;

		width: 70vw;

		--view-height: calc(100vh - 0.66em);

		background-color: var(--background);
	}

	:global(main.layout-old) .view {
		--view-height: calc(100vh - 3.5em - 0.66em);
	}
</style>