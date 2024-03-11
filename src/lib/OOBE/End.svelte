<script>
    import {OOBERunning, OOBEPage} from "../stores.js";
    import {goto} from "@roxi/routify";
</script>

<h1>Thats it for now.</h1>
<p>You can customize more things via the settings</p>
<p>To access settings, click on your pfp (Profile picture) icon in the bottom left.</p>
<p>Or, you can optionally go to the settings here</p>
<button
    on:click={() => {
        OOBERunning.set(false);
    }}>Click here to exit the oobe</button
>
<br />
<br />
<button
    on:click={() => {
        $goto("/settings")
        OOBERunning.set(false);
    }}>Click here to exit the oobe AND go to settings</button
>