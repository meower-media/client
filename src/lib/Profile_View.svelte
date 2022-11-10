<script>

    import loadProfile from "./loadProfile";
    import {ulist,user} from "./stores.js";
    import Loading from "./Loading.svelte";
    import Container from "./Container.svelte";
    import PFP from "./PFP.svelte";
    import { levels } from "./formatting";

    export let username = "";

</script>

<div class="Profile">
    {#await loadProfile(username)}
        <div class="center">
            <Loading />
        </div>
    {:then data}
        <Container>
            <div class="profile-header">
                <PFP
                    online={$ulist.includes(data._id)}
                    icon={
                        username === $user.name ?
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