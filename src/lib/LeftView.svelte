<script>
    import media_logo from "../assets/media_logo.svg";
    import {goto} from "@roxi/routify";

    let McVersioningEasterEggInitalRand = Math.random()
    let SecretText = "(Meower Client)"

    let McVersioningEasterEggRand = Math.ceil(McVersioningEasterEggInitalRand * 1000)

    if (McVersioningEasterEggRand == 500) {
        SecretText = "(MC Version Moment)"
    }
</script>

<div class = "LeftView">
    <div class =" padding"></div>
    <p class = "text">
        <!-- svelte-ignore a11y-invalid-attribute -->
        <a on:click={() => {
            $goto("/about");
        }} href="">About</a> 
        | 
        <a href="https://meower.org/legal" target="_blank">Legal</a>
        |
        <a href="https://github.com/Meower-media-co/Meower-Svelte" target="_blank">Github</a>
        <br />
        <br />
        © Meower Media 2023
        <br />
        Svelte 1.10 
        <br />
        {SecretText}
    </p>
    <img alt="Meower media logo" style="opacity: 0.5;" src={media_logo} height=60/>
    <hr />
</div>

<style>
    .LeftView {
        display: flex;
        flex-direction: column;
        width: 25vw;
        height: calc(100vh - 0.66em);
    }

    .padding {
        flex-grow: 0.95;
    }

    .text {
        align-self: center;
        text-align: center;
        font-size: 0.75em;
        color: #4F4F4F;
    }

    hr {
        width: 24vw;
    }
</style>