<script>
    import PFP from "../lib/PFP.svelte";
	import {profileclicked, ulist, mainPage as page, screen, setupPage, user} from "../lib/stores.js";
    import {tick} from "svelte";
    import Loading from "../lib/Loading.svelte";
    import Container from "../lib/Container.svelte";
    import * as clm from "../lib/clmanager.js";
    import * as fmt from "../lib/formatting.js";

    var data = null
</script>

<div class="OtherProfile">
    {#if $user.name}
        {#if $profileclicked != $user.name}
            {#await
                data = clm.meowerRequest({
                    cmd: "direct",
                    val: {
                        cmd: "get_profile",
                        val: $profileclicked,
                    },
                })
            }
                <div class="fullcenter">
                    <Loading />
                </div>
            {:then data}
                <!-- data loaded, do stuff with it -->
                <Container>
                    <div class="profile-header">
                        <PFP
                            online={$ulist.includes(data.payload._id)}
                            icon={data.payload.pfp_data}
                            alt="{data.payload.name}'s profile picture"
                            big={true}
                        ></PFP>
                        <h1 class="profile-username">{data.payload._id}</h1>
                        <p class="profile-active">{($ulist.includes(data.payload._id)) && "Online" || "Offline"}</p>
                        <p class="profile-role">{fmt.frmt_proflvl_tostr(data.payload.lvl)}</p>
                    </div>
                </Container>
            {:catch e}
                <!-- error happened, you can display it here -->
                <Container>
                    <h1>Error Occured While Displaying Profile.</h1>
                    <p>Error: {e}, If this error occurs again, Contact CST or Bloctans</p>
                </Container>
            {/await}
        {:else}
            {page.set("profile")}
        {/if}
    {:else}
        <Container>
            <div class="profile-header">
                <PFP
                    online={$ulist.includes($profileclicked)}
                    icon={-2}
                    alt="{$profileclicked}'s profile picture"
                    big={true}
                ></PFP>
                <h1 class="profile-username">{$profileclicked}</h1>
                <p class="profile-active">{($ulist.includes($profileclicked)) && "Online" || "Offline"}</p>
                <p class="profile-role">System/Unknown Role</p>
            </div>
        </Container>
        <Container>
            <h1>Can't Fetch Info</h1>
            <p>Sorry, Svelte Can't Fetch Much info about this user currently</p>
            <p style="text-decoration:underline; color:blue; cursor:pointer;"on:click={async () => {
                screen.set("setup");
                await tick();
                setupPage.set("reconnect");
            }}>Maybe Log in?</p>
        </Container>
    {/if}
</div>

<style>
    .fullcenter {
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;

		width: 100vw;
		height: 100vh;

		position: fixed;
		top: 0;
		left: 0;
	}

    .profile-active {
        font-style: italic;
        position: absolute;
        bottom: 0.9em;
        left:6.1em;
    }

    .profile-role {
        position: absolute;
        bottom: 0.2em;
        left:6.8em;
        font-size: 90%;
    }

	.profile-username {
		margin: 0;
		margin-left: 0.2em;
        margin-bottom: 0.7em;
		display: inline-block;
		max-width: 100%;
		font-size: 300%;
	}

	.profile-header {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}
</style>