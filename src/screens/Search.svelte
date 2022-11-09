<script>
    import {mainPage as page, modalShown,modalPage, profileClicked} from "../lib/stores.js";
    import Container from "../lib/Container.svelte";
    import { shiftHeld } from "../lib/keyDetect.js";
</script>

<div class="Search">
    <Container>
        <h1>Search</h1>
        Surf Meower By looking at Posts, Users and Stats.
    </Container>
    <Container>
        <div class="settings-controls">
            <button
                class="circle search"
                disabled
            ></button>
        </div>

        <h1>Search Users</h1>
        Find all the legit users, Memes and Namesnipes.
    </Container>
    <Container>
        <div class="settings-controls">
            <button
                class="circle search"
                disabled
            ></button>
        </div>

        <h1>Search Posts</h1>
        Find posts and maybe even relics.
    </Container>
    <Container>
        <div class="settings-controls">
            <button
                class="circle search"
                on:click = {()=>{
                    modalPage.set("Stats");
					modalShown.set(true);
                }}
            ></button>
        </div>

        <h1>Stats</h1>
        The amount of things on Meower!
    </Container>
    <Container>
        <h1>Go to User</h1>
        <form 
            class="createpost"
            autocomplete="off"
            on:submit|preventDefault={e => {	
                profileClicked.set(e.target[0].value)
                page.set("profile")
            }}
        >
            <!--TODO: Check if user exists-->
            <p>Go to a specific user!</p>
            <input
                type="text"
                class="white"
                placeholder="Write something..."
                name="gtuser"
                autocomplete="false"
                on:keydown={(event) => {
                    if (event.key == "Enter" && !shiftHeld) {
                        event.preventDefault();
                        document.getElementById("submitpost").click();
                    }
                }}
            >
            <button id="submitpost">Go to user</button>
        </form>
    </Container>
</div>

<style>
    .settings-controls {
		position: absolute;
		top: 0.25em;
		right: 0.25em;
	}
</style>