<!-- routify:options bundle=false -->
<script>
	import { modalPage, modalShown } from "../lib/stores";
	import Container from "../lib/Container.svelte";

	import version from "../lib/version.js";
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
                var modals = ["banned","ipBlocked","accountCreationBlocked","reportUser","searchResults","createChat","gcMember","addMember","addMember2","addMemberSearch","addMemberMode","removeMember","connectionFailed","switchTheme","switchBGM","customTheme","basic"]
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

        
    </Container>
    <Container>
        <h1>Cool hidden things!</h1>
        This is a little area of things that are normally unknown about svelte

        
    </Container>
    <Container>
        <h1>Internal/Debug Info</h1>
        Want a look inside Svelte? Here you go!


    </Container>
    Meower Svelte V{version}
</div>

<style>
	
</style>
