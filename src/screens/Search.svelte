<script>
    import {modalShown,modalPage} from "../lib/stores.js";
    import Container from "../lib/Container.svelte";
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
                on:click = {()=>{
                    
                }}
            ></button>
        </div>

        <h1>Search Users</h1>
        Find all the legit users, Memes and Namesnipes.
    </Container>
    <Container>
        <div class="settings-controls">
            <button
                class="circle search"
                on:click = {()=>{
                    
                }}
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
</div>

<style>
    .settings-controls {
		position: absolute;
		top: 0.25em;
		right: 0.25em;
	}
</style>