<!--
	The home page!
	It features live post updates and a load more button which is pretty nice.
-->
<script>
	import {ulist, modalPage,modalShown} from "../lib/stores.js";
	import Container from "../lib/Container.svelte";
	import PostList from "../lib/PostList.svelte";
</script>

<div class="home">
	<!--<button
		on:click = {() => {
			var modals = ["login","signup","banned","ipBlocked","accountCreationBlocked","deletePost","reportPost","reportUser ","searchResults","logoutEverywhere ","deleteAccount","logout","announce","kickAllUsers","enableRepairMode","createChat ","addImg","changePassword","gcMember ","addMember","addMember2","addMemberSearch","addMemberMode ","removeMember","connectionFailed","switchTheme","switchBGM","customTheme","loggedOut","basic"]
			// Switchtheme broken

			var randmodal = modals[Math.round(Math.random() * modals.length-1)]

			alert(randmodal)
		
			modalPage.set(randmodal)
			modalShown.set(true)
		}}	
	>Random Modal</button>-->
	<Container>
		<h1>Home</h1>
		<div class="overflow">
			{#if $ulist.length == 1}
				You are the only user online.
			{:else if $ulist.length == 0}
				Nobody is online.
			{:else}
				There are currently {$ulist.length} users online ({$ulist.join(
					", "
				)}).
			{/if}
		</div>
	</Container>
	<PostList fetchUrl="home" postOrigin="home" canPost={true} />
</div>

<style>
	.home {
		height: 100%;
	}
</style>
