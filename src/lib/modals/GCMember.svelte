<script>
	import Modal from "../Modal.svelte";

	import * as clm from "../clmanager.js";
	// @ts-ignore
	import {shiftHeld} from "../keyDetect.js";

	import {
		profileClicked_GC,
		user,
		chatid,
		chatOwner,
		chatMembers,
	} from "../stores.js";

	import * as modals from "../modals.js";

	import ProfileView from "../ProfileView.svelte";

	import {goto} from "@roxi/routify";

	function filter1(v) {
		return v !== $profileClicked_GC;
	}
</script>

<Modal
	on:close={() => {
		modals.closeModal();
	}}
>
	<h2 slot="header">{$profileClicked_GC}'s Profile</h2>
	<div slot="default">
		<ProfileView username={$profileClicked_GC} />
		<button
			class="long"
			on:click={() => {
				modals.closeModal();
				$goto(`/users/${$profileClicked_GC}`);
			}}>View full profile</button
		>
		{#if $chatOwner == $user.name && $profileClicked_GC != $user.name}
			<button
				class="long"
				on:click={() => {
					if (shiftHeld) {
						clm.meowerRequest({
							cmd: "direct",
							val: {
								cmd: "remove_from_chat",
								val: {
									chatid: $chatid,
									username: $profileClicked_GC,
								},
							},
						});
						chatMembers.set($chatMembers.filter(filter1));
						modals.closeModal();
					} else {
						modals.showModal("removeMember");
					}
				}}>Remove from chat</button
			>
		{/if}
		<button
			class="long"
			on:click={() => {
				modals.closeModal();
			}}>Close</button
		>
	</div>
</Modal>

<style>
	.long {
		width: 100%;
		margin: 0;
		margin-bottom: 0.2em;
	}
</style>
