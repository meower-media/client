<script>
    import {User_ToMod,ulist,user,} from "../lib/stores.js";

    import {default as loadProfile} from "../lib/loadProfile.js";
    import Loading from "../lib/Loading.svelte";
    import Container from "../lib/Container.svelte";
    import PFP from "../lib/PFP.svelte";
    import { levels } from "../lib/formatting.js";
</script>

<div class="ModerateUser">
    {#await loadProfile($User_ToMod)}
        <div class="center">
            <Loading />
        </div>
    {:then data}
        <Container>
            <div class="profile-header">
                <PFP
                    online={$ulist.includes(data._id)}
                    icon={
                        $User_ToMod === $user.name ?
                            $user.pfp_data : data.pfp_data
                    }
                    alt="{data._id}'s profile picture"
                    size={1.4}
                ></PFP>
                <div class="profile-header-info">
                    <h1 class="profile-username">{data._id}</h1>
                    <div class="profile-active">{
                        $ulist.includes(data._id) ? "Online" : "Offline"
                    }</div>
                    <div class="profile-role">
                        {levels[data.lvl] || "Unknown"}
                    </div>
                </div>
            </div>
        </Container>
    {/await}
</div>

<style>
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