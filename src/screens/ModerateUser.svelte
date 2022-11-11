<script>
    import {User_ToMod,ulist,user,} from "../lib/stores.js";

    import ProfileView from "../lib/Profile_View.svelte";
</script>

<div class="ModerateUser">
    <ProfileView username={$User_ToMod}></ProfileView>
</div>

<style>
</style>