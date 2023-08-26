<!-- routify:options bundle=false -->
<script>
	import { modalPage, modalShown, OOBERunning, GroupCats} from "../lib/stores";
	import Container from "../lib/Container.svelte";
    import PFP from "../lib/PFP.svelte";
    import LiText from "../lib/LiText.svelte";

    import {levels} from "../lib/formatting.js"
	import version from "../lib/version.js";

    const PFP_COUNT = 34;

	const pfps = new Array(PFP_COUNT).fill().map((_, i) => i + 1);
	let pfpSwitcher = false;

    let pfpOverflow = false;
	$: {
		const pfp = 1;
		pfpOverflow = pfp < 0 || pfp > PFP_COUNT;
	}

    let GCats = 100

    let Profile_Username = "EasterEgg";
    let Profile_Level = 0;
    let Profile_Quote = "Quote Here";
    let Profile_PFP = 1;
    let Profile_QuoteEnabled = true;
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

        <br /><br />

        <input type="number" placeholder="Enter a number" bind:value={GCats}/>
        <button
            on:click={() => {
                GroupCats.set(GCats)
            }}
        >Update</button>
    </Container>
    <Container>
        <!--Posts, Profiles and Profile Views (Later on, maybe GC Member list and postlist)-->
        <h1>Make your own!</h1>
        Make your own profile, post, etc list with this!

        <br /><br />

        <Container>
            <h1>Profile</h1>

            Username
            <br />
            <input placeholder="Username" type="text" bind:value={Profile_Username} class="modal-input white"/>
            <br /><br />

            Quote
            <br />
            <input placeholder="Quote" type="text" bind:value={Profile_Quote} class="modal-input white"/>
            <br /><br />

            Enable Quote
            <br />
            <input type="checkbox" bind:value={Profile_QuoteEnabled} class="modal-input white"/>
            <br /><br />

            User Level

            <br />
            <select
                class="grow"
                on:change={e => {
                    // @ts-ignore
                    Profile_Level = e.target.value;
                }}
            >
                <option value = 0>User</option>
                <option value = 1>Low-level Moderator</option>
                <option value = 2>Moderator</option>
                <option value = 3>Administrator</option>
                <option value = 4>Sysadmin</option>
            </select>
            <br /><br />

            PFP

            <br />
            {#if pfpSwitcher}
				<Container>
					<h2>Profile Picture</h2>
					<div id="pfp-list">
						{#if pfpOverflow && Profile_PFP < 0}
							<button
								on:click={() => {
									pfpSwitcher = false;
								}}
								class="pfp selected"
								><PFP
									online={false}
									icon={Profile_PFP}
									alt="Profile picture {Profile_PFP}"
								/></button
							>
						{/if}
						{#each pfps as pfp}
							<button
								on:click={() => {
									Profile_PFP = pfp
								}}
								class="pfp"
								class:selected={Profile_PFP === pfp}
								><PFP
									online={false}
									icon={pfp}
									alt="Profile picture {pfp}"
								/></button
							>
						{/each}
						{#if pfpOverflow && Profile_PFP > 0}
							<button
								class="pfp selected"
								><PFP
									online={false}
									icon={Profile_PFP}
									alt="Profile picture {Profile_PFP}"
								/></button
							>
						{/if}
					</div>
                    <br /><br />
                    <button
                        class="long"
                        title="Close"
                        on:click={() => (pfpSwitcher = false)}
                    >Close</button>
				</Container>
			{:else}
				<button
					class="long"
					title="Change Profile Picture"
					on:click={() => (pfpSwitcher = true)}
					>Change Profile Picture</button
				>
			{/if}
            <br /><br />
            
            <Container>
                <div class="profile-header">
                    <PFP
                        online={false}
                        icon={Profile_PFP}
                        alt="{Profile_Username}'s profile picture"
                        size={1.4}
                    />
                    <div class="profile-header-info">
                        <h1 class="profile-username">
                            <LiText text={Profile_Username} />
                        </h1>
                        <div class="profile-active">
                            Offline
                        </div>
                        <div class="profile-role">
                            {levels[Profile_Level]}
                        </div>
                    </div>
                </div>
            </Container>

            {#if Profile_QuoteEnabled}
                <Container>
                    <h3>Quote</h3>
                    <p>"<i>{Profile_Quote}</i>"</p>
                </Container>
            {/if}
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
	.long {
		width: 100%;
		margin: 0;
		margin-bottom: 0.2em;
	}

	.pfp {
		padding: 0.2em;
		margin: 0.2em;
		border-radius: 1.45em;
		display: inline-block;
		background: none;
		border: none;
	}
	:global(main.input-hover) .pfp:hover,
	:global(main.input-touch) .pfp:active {
		background-color: var(--orange-light);
	}
	/* cst todo: fix shadow appearing when activating then unhovering because i gtg*/
	:global(:root main.input-hover) .pfp:active {
		background-color: var(--orange-dark);
	}
	:global(main) .pfp.selected {
		background-color: var(--orange);
	}
	#pfp-list {
		display: flex;
		flex-wrap: wrap;
	}

    .profile-header-info {
		margin-left: 1em;
		height: 6em;
	}

	.profile-active {
		font-style: italic;
	}

	.profile-role {
		position: absolute;
		font-size: 90%;
	}

	.profile-username {
		margin: 0;
		display: inline-block;
		max-width: 100%;
		font-size: 3em;
	}

	.profile-header {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}
</style>
