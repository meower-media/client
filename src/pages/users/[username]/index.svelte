<!-- The profile page, now with viewing others' profiles. -->
<script>
	import * as modals from "../../../lib/modals.js";
	import UserProfile from "../../../lib/modals/UserProfile.svelte";

	import {params} from "@roxi/routify";

	modals.showModal(UserProfile, $params.username)
</script>