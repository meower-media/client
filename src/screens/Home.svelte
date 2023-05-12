<!--
	The home page!
	It features live post updates and a load more button which is pretty nice.
-->
<script>
	import {ulist, mainPage, user} from "../lib/stores.js";
	import Container from "../lib/Container.svelte";
	import PostList from "../lib/PostList.svelte";
	import * as Modals from "../lib/Modals.js"
	import * as BGM from "../lib/BGM.js";
</script>

<div class="home">
	<button on:click={() => {Modals.ShowModal("switchBGM")}}>Switch BGM test</button>
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
		<div class="settings-controls">
			<button
				class="circle reload"
				title="Reload the music if it isnt playing"
				on:click={() => {
					BGM.PlayBGM($user.bgm_song)
				}}
			/>
		</div>
	</Container>
	<PostList fetchUrl="home" postOrigin="home" canPost={true} />
</div>

<style>
	.home {
		height: 100%;
	}
</style>
