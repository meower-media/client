<script>
    import OOBE from "./OOBE/Main.svelte";
    import {hasExperiment} from "./bitField.js";
    import ChatsList from "./ChatsList.svelte";
    import {afterPageLoad, params} from "@roxi/routify";
	import {tick} from "svelte";
    import sleep from "./sleep.js"

    import {OOBERunning} from "../lib/stores.js";

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

    /*  
        May I credit half of this code to https://medium.com/@zhuyingsong0825/controller-for-swiping-using-pure-javascript-bd604669b22a
        and the other half to https://stackoverflow.com/questions/4770025/how-to-disable-scrolling-temporarily

        I will also give a fuck you to medium for putting a paywall after the first site visit
        - Bloctans
    */

    let touchstartX = 0;
    let touchstartY = 0;
    let touchendX = 0;
    let touchendY = 0;
    
    window.addEventListener('touchstart', function (event) {
        touchstartX = event.changedTouches[0].screenX;
        touchstartY = event.changedTouches[0].screenY;
    }, false);

    window.addEventListener('touchend', function (event) {
        touchendX = event.changedTouches[0].screenX;
        touchendY = event.changedTouches[0].screenY;
        handleGesture();
    }, false);

    let chats = false;

    var keys = {37: 1, 38: 1, 39: 1, 40: 1};

    function preventDefault(e) {
        e.preventDefault();
    }

    function preventDefaultForScrollKeys(e) {
        if (keys[e.keyCode]) {
            preventDefault(e);
            return false;
        }
    }

    // modern Chrome requires { passive: false } when adding event
    var supportsPassive = false;
    try {
        window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
            get: function () { supportsPassive = true; } 
        }));
    } catch(e) {}

    var wheelOpt = supportsPassive ? { passive: false } : false;
    var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

    // call this to Disable
    function disableScroll() {
        window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
        window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
        window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
        window.addEventListener('keydown', preventDefaultForScrollKeys, false);
    }

    // call this to Enable
    function enableScroll() {
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
        window.removeEventListener(wheelEvent, preventDefault, wheelOpt); 
        window.removeEventListener('touchmove', preventDefault, wheelOpt);
        window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
    }

    async function handleGesture() {
        let up = touchstartY - touchendY
        let right = touchendX - touchstartX
        let y = Math.abs(up)
        let x = Math.abs(right)
        if (y < x) {
            disableScroll()
            //swipe in left right directions
            if (right <= 0){
                //swipe right
                /*if (document.getElementById("views-outer").scrollLeft > 50) {
                    chats = true
                    document.getElementById("views-outer").scrollTo({left: document.getElementById("views-outer").scrollWidth, behavior: "smooth"})
                    await sleep(500)
                } else {
                    document.getElementById("views-outer").scrollTo({left: 0, behavior: "smooth"})
                    await sleep(500)
                } */
                if (document.getElementById("views-outer").scrollLeft > 0) {
                    chats = true
                    document.getElementById("views-outer").scrollTo({left: document.getElementById("views-outer").scrollWidth, behavior: "smooth"})
                    await sleep(500)
                }
            } else {
                /*if (document.getElementById("views-outer").scrollLeft <= document.getElementById("views-outer").scrollWidth / 2 - 50) {
                    //swipe left 
                    chats = false
                    document.getElementById("views-outer").scrollTo({left: 0, behavior: "smooth"})
                    await sleep(500)
                } else {
                    document.getElementById("views-outer").scrollTo({left: document.getElementById("views-outer").scrollWidth, behavior: "smooth"})
                    await sleep(500)
                } */
                if (document.getElementById("views-outer").scrollLeft <= document.getElementById("views-outer").scrollWidth / 2) {
                    //swipe left 
                    chats = false
                    document.getElementById("views-outer").scrollTo({left: 0, behavior: "smooth"})
                    await sleep(500)
                }
            }
        }   
        enableScroll()
    } 
</script>

<div id="views-outer">
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

	#views-outer {
		overflow: hidden;
		height: 100%;
	}

	:global(main.layout-mobile) .wrapper {
		width: 100%;
	}

	:global(main.layout-mobile) .views {
		width: 200%;
	}

	:global(main.layout-mobile) #views-outer {
		scrollbar-width: none;
		overflow-x: scroll;
        -webkit-overflow-scrolling: touch;
        overscroll-behavior-x: contain;
        scroll-behavior: auto;
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