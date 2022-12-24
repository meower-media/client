<script>
	import Modal from "../Modal.svelte";

	import * as clm from "../clmanager.js";

	import {
		modalShown,
		modalPage,
		profileClicked_GC,
		user,
		profileClicked,
		mainPage as page,
		chatid,
		chatOwner,
	} from "../stores.js";
	import ProfileView from "../ProfileView.svelte";
</script>

<Modal
	on:close={() => {
		$modalShown = false;
	}}
>
	<h2 slot="header">{$profileClicked_GC}'s Profile</h2>
	<div slot="default">
		<ProfileView username={$profileClicked_GC} />
		<button
			class="long"
			on:click={() => {
				$modalShown = false;
				clm.meowerRequest({
					cmd: "direct",
					val: {
						cmd: "set_chat_state",
						val: {
							state: 0,
							chatid: $chatid,
						},
					},
				});
				profileClicked.set($profileClicked_GC);
				page.set("profile");
			}}>View full profile</button
		>
		{#if $chatOwner == $user.name && $profileClicked_GC != $user.name}
			<button
				class="long"
				on:click={() => {
					modalPage.set("removeMember");
				}}>Remove from chat</button
			>
		{/if}
		<button
			class="long"
			on:click={() => {
				$modalShown = false;
			}}>Close</button
		>
	</div>
</Modal>

<style>
	.long {
		width: 100%;
		margin: 0;
		margin-bottom: -2px;
	}
</style>
