<script>
	import {createEventDispatcher, onDestroy} from "svelte";
	import {scale, fade} from "svelte/transition";
	import {expoOut} from "svelte/easing";

	const dispatch = createEventDispatcher();
	const close = () => dispatch("close");

	let modal;

	const handle_keydown = e => {
		if (e.key === "Escape") {
			close();
			return;
		}

		if (e.key === "Tab") {
			// trap focus
			const nodes = modal.querySelectorAll("*");
			const tabbable = Array.from(nodes).filter(n => n.tabIndex >= 0);

			let index = tabbable.indexOf(document.activeElement);
			if (index === -1 && e.shiftKey) index = 0;

			index += tabbable.length + (e.shiftKey ? -1 : 1);
			index %= tabbable.length;

			tabbable[index].focus();
			e.preventDefault();
		}
	};

	const previously_focused =
		typeof document !== "undefined" && document.activeElement;

	if (previously_focused) {
		onDestroy(() => {
			// @ts-ignore
			previously_focused.focus();
		});
	}
</script>

<svelte:window on:keydown={handle_keydown} />

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="modal-background"
	on:click={close}
	transition:fade={{duration: 100, easing: expoOut}}
/>

<div
	class="modal"
	role="dialog"
	aria-modal="true"
	bind:this={modal}
	transition:scale={{start: 0.8, duration: 200, easing: expoOut}}
>
	<slot name="header" />
	<hr />
	<slot />
</div>

<style>
	.modal-background {
		z-index: 9999;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
	}

	.modal {
		z-index: 9999;
		position: fixed;
		left: 50%;
		top: 50%;
		width: calc(100vw - 4em);
		max-width: 32em;
		max-height: calc(100vh - 4em);
		overflow: auto;
		transform: translate(-50%, -50%);
		padding: 1em;
		background-color: var(--background);
		border: none;
		border-radius: 5px;
	}
</style>
