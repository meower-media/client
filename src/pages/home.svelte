<!--
	The home page!
	It features live post updates and a load more button which is pretty nice.
-->
<script>
	import {user} from "../lib/stores.js";
	import Container from "../lib/Container.svelte";
	import PostList from "../lib/PostList.svelte";
	import PFP from "../lib/PFP.svelte";
	import LiText from "../lib/LiText.svelte";

	import {goto} from "@roxi/routify";
</script>

<div class="home">
	<PostList fetchUrl="home" postOrigin="home" canPost={true} />
</div>

<style>
	.home {
		height: 100%;
	}
</style>
