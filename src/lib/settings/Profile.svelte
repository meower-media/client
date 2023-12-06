<script>
	import ProfileView from "../ProfileView.svelte";
    import Container from "../Container.svelte";

    import {user} from "../stores.js";
</script>

<ProfileView username={$user.name} canDoActions={true} />

<Container>
    This page is still being worked on :/
</Container>