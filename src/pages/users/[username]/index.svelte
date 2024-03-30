<!-- The profile page, now with viewing others' profiles. -->
<script>
	import * as modals from "../../../lib/modals.js";
	import UserProfile from "../../../lib/modals/UserProfile.svelte";

	import {params, goto} from "@roxi/routify";

	console.warn("users/[username] is deprecated, if this was used as a link in svelte then please fix that.")

	modals.showModal(UserProfile, {username: $params.username, gc: false})

	$goto("/home")
</script>