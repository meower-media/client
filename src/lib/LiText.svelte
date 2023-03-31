<!-- An element that tries to prevent impersonation in usernames by making 0, O, l and I look different from eachother. -->
<script>
	export let text = "";
	$: _text = text.split("");
</script>

<span class="text-overlap" aria-hidden="true"
	>{#each _text as l}{#if l === "0"}<span class="overlap"
				><span class="letter">0</span><span class="zero-slash">/</span
				></span
			>{:else if l === "l"}<span class="overlap l"
				><span class="letter">l</span><span
					class="l-bottom"
					aria-hidden="true">_</span
				></span
			>{:else if l === "I"}<span class="overlap i"
				><span class="letter">I</span><span class="i-top">_</span><span
					class="i-bottom">_</span
				></span
			>{:else}<span class="letter">{l}</span>{/if}{/each}</span
>{text}

<style>
	.overlap {
		position: relative;
	}
	.overlap > span:not(.letter) {
		position: absolute;
	}
	.letter {
		color: transparent;
	}
	.text-overlap {
		width: 0;
		display: inline-block;
		white-space: nowrap;
		overflow: visible;
		user-select: none;
		pointer-events: none;
	}
	.zero-slash {
		top: -0.26ex;
		left: 0.1ex;
		transform: scale(0.72);
	}
	.l-bottom {
		bottom: 0.09ex;
		left: -0.22ex;
		transform: scaleX(0.3);
	}
	.i-bottom {
		bottom: 0.04em;
	}
	.i-top {
		bottom: 0.6em;
	}
	.i-top,
	.i-bottom {
		left: -0.345ex;
		transform: scaleX(0.6);
	}
</style>