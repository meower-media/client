<!--
	Home but it's a user's posts.
-->
<script>
	import * as modals from "../../../lib/modals.js";
	import UserPosts from "../../../lib/modals/UserPosts.svelte";

	import {params, goto} from "@roxi/routify";

	console.warn("users/[username]/posts is deprecated, if this was used as a link in svelte then please fix that.")

	modals.showModal(UserPosts, $params.username)

	$goto("/home")
</script>