<!--
	The home page!
	It features live post updates and a load more button which is pretty nice.
-->
<script>
	import {ulist} from "../lib/stores.js";
	import Container from "../lib/Container.svelte";
	import PostList from "../lib/PostList.svelte";
</script>

<div class="home">
	<Container>
		<h1>Home</h1>
		<div class="overflow">
			{#if $ulist.length == 1}
				You are the only user online.
			{:else if $ulist.length == 0}
				Nobody is online.
			{:else}
				<span class="caret" onclick="toggleUserList()" style="cursor: pointer; user-select: none;">There are currently {$ulist.length} users online &#9660;</span>
				<div id="userList" style="display: none;">
					<ul>
						{#each $ulist as user}
							<li>{user}</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
	</Container>
	
	<script>
		function toggleUserList() {
			var userList = document.getElementById('userList');
			if (userList.style.display === 'none') {
				userList.style.display = 'block';
			} else {
				userList.style.display = 'none';
			}
		}
	</script>
	
	
	<PostList fetchUrl="home" postOrigin="home" canPost={true} />
</div>

<style>
	.home {
		height: 100%;
	}
</style>
