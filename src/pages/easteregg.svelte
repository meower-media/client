<!-- routify:options bundle=false -->
<script>
	import { modalPage, modalShown, OOBERunning, GroupCats} from "../lib/stores";
	import Container from "../lib/Container.svelte";

	import version from "../lib/version.js";

    let GCats = 100
</script>

<div>
	<Container>
        <h1>Look at that!</h1>
        You found a secret! Here you can mess around with a bit of svelte
    </Container>
    <Container>
        <h1>Modal Roulette</h1>
        Press the button below to pick a random modal (of course with moderation, harmful and errored ones removed)
        <br>
        <br>
        <button
            on:click = {() => {
                var modals = ["banned","accountCreationBlocked","reportUser","searchResults","createChat","gcMember","addMember","addMember2","addMemberSearch","addMemberMode","removeMember","connectionFailed","switchTheme","switchBGM","customTheme","basic"]
                // Switchtheme broken

                var randmodal = modals[Math.round(Math.random() * modals.length-1)]

                alert(randmodal)
            
                modalPage.set(randmodal)
                modalShown.set(true)
            }}	
        >Me!</button>
    </Container>
    <Container>
        <h1>Group cats</h1>
        Crash your browser by changing the amount of group cats!

        <br>
        <br>

        <input type="number" placeholder="Enter a number" bind:value={GCats}/>
        <button
            on:click={() => {
                GroupCats.set(GCats)
            }}
        >Update</button>
    </Container>
    <Container>
        <!--Posts, Profiles, Profile Views, and PFP (Later on, maybe GC Member list and postlist)-->
        <h1>Make your own!</h1>
        Make your own profile, post, etc list with this!

        <Container>
            <h1>Profile</h1>
            Make your own profile, post or group chat member list with this!
    
            
        </Container>
    </Container>
    <Container>
        <h1>OOBE</h1>
        Wanna see the OOBE?

        <br>
        <br>

        <button on:click = {() => {
            OOBERunning.set(true)
        }}>Click me</button>
    </Container>
    <Container>
        <h1>Internal/Debug Info</h1>
        Want a look inside Svelte? Here you go!


    </Container>
    Meower Svelte V{version}
</div>

<style>
	
</style>
