<script>
	import {user} from "../../lib/stores.js";
	import ProfileView from "../../lib/ProfileView.svelte";
</script>

<ProfileView username={$user.name} />
