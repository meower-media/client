<!--
	Home but it's a user's posts.
-->
<script>
	import * as modals from "../../../lib/modals.js";
	import UserPosts from "../../../lib/modals/UserPosts.svelte";

	import {params} from "@roxi/routify";

	modals.showModal(UserPosts, $params.username)
</script>