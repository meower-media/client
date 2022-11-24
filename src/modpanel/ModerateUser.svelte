<script>
    import {User_ToMod,ulist,user,} from "../lib/stores.js";

    import ProfileView from "../lib/Profile_View.svelte";
    import Container from "../lib/Container.svelte";
</script>

<div class="ModerateUser">
    <ProfileView username={$User_ToMod}></ProfileView>
    <Container>
        <div class="settings-controls">
            <button
                class="circle settings"
                on:click={() => {
                    
                }}
            ></button>
        </div>
        <h1>Ban User</h1>
        This will ban the user that is entered
    </Container>
</div>

<style>
    .settings-controls {
		position: absolute;
		top: 0.25em;
		right: 0.25em;
	}

	button.circle {
		border: none;
		margin: 0;
		margin-left: 0.125em;
	}
</style>