<script>
    import PFP from "../lib/PFP.svelte";
	import {profileclicked} from "../lib/stores.js";
    import Loading from "../lib/Loading.svelte";
    import Container from "../lib/Container.svelte";
    import * as clm from "../lib/clmanager.js";

    var data = null
</script>

<div class="OtherProfile">
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
                    online={true}
                    icon={data.payload.pfp_data}
                    alt="{data.payload.name}'s profile picture"
                    big={true}
                ></PFP>
                <h1 class="profile-username">{data.payload._id}</h1>
                <p class="profile-active">hi</p>
                <p>smol hi</p>
            </div>
        </Container>
    {:catch e}
        <!-- error happened, you can display it here -->
        <Container>
            <h1>Error Occured While Displaying Profile.</h1>
            <p>Error: {e}, If this error occurs again, Contact CST or Bloctans</p>
        </Container>
    {/await}
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

    .pfp {
		padding: 0.2em;
		margin: 0.2em;
		border-radius: 1.25em;
		display: inline-block;
	}
	.pfp:hover {
		background-color: var(--orange-light);
	}
	.pfp.selected {
		background-color: var(--orange);
	}
	#pfp-list {
		display: flex;
		flex-wrap: wrap;
	}

	.profile-username {
		margin: 0;
		margin-left: 0.2em;
        margin-bottom: 0.3em;
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