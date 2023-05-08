<script>
	import Modal from "../Modal.svelte";

	import {modalShown, modalPage} from "../stores.js";
    import * as Modals from "../Modals.js";
</script>

<Modal
	on:close={() => {
		$modalShown = false;
	}}
>
	<h2 slot="header">How do you wanna add this Member?</h2>
	<div slot="default">
        <button
            class="long"
            on:click={() => {Modals.ShowModal("addMember")}}
        >
            Enter a Username!
        </button>
		<button
            class="long"
            on:click={() => {Modals.ShowModal("addMemberSearch")}}
        >
            Search For Users To add!
        </button>
	</div>
</Modal>

<style>
    .long {
		width: 100%;
		margin-bottom: 0.2em;
	}

	.smol {
		font-size: 8px;
	}
</style>
