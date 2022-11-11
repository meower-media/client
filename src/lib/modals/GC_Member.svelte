<script>	
	import Modal from "../Modal.svelte";
    import Container from "../Container.svelte";
    import PFP from "../PFP.svelte";
    import Loading from "../Loading.svelte";

    import * as clm from "../clmanager.js";

	import {
		modalShown, modalPage, 
		profileClicked_GC, 
		ulist, user, profileClicked, 
		mainPage as page, 
		chatid, chatOwner
	} from "../stores.js";
    import {levels} from "../formatting.js";

	import {default as loadProfile} from "../loadProfile.js";
    import ProfileView from "../Profile_View.svelte";
</script>

<Modal on:close={() => {$modalShown = false}}>
    <h2 slot="header">{$profileClicked_GC}'s Profile</h2>
    <div slot="default">
		<ProfileView username={$profileClicked_GC}></ProfileView>
		<button class="long" on:click={() => {
			$modalShown = false
			clm.meowerRequest({
				cmd: "direct",
				val: {
					cmd: "set_chat_state",
					val: {
						state: 0,
						chatid: $chatid
					},
				}
			});
			profileClicked.set($profileClicked_GC);
			page.set("profile");
		}}>View full profile</button>
		{#if $chatOwner == $user.name && $profileClicked_GC != $user.name}
			<button class="long" on:click={() => {
				modalPage.set("removeMember");
			}}>Remove from chat</button>
		{/if}
		<button class="long" on:click={() => {$modalShown = false}}>Close</button>
    </div>
</Modal>

<style>
    .long {
        width: 100%;
        margin: 0;
		margin-bottom: -2px;
    }

	.profile-header-info {
		margin-left: 1em;
		height: 6em;
	}

    .profile-active {
        font-style: italic;
    }

    .profile-role {
        position: absolute;
        font-size: 90%;
    }

	.profile-username {
		margin: 0;
		display: inline-block;
		max-width: 100%;
		font-size: 3em;
	}

	.profile-header {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}

	.center {
		text-align: center;
	}
</style>