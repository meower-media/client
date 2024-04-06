<script>
    import ChatContainer from "./ChatContainer.svelte";
    import {user} from "./stores.js";

    let selected = 1
</script>

<div class="main">
    {#if $user.name}
        <div class="selection">
            <button on:click = {() => {
                selected = 1
            }}>
                All  
                {#if selected == 1}
                    <div class="line"></div>
                {:else}
                    <div class="line-inactive"></div>
                {/if}
            </button>
            <button on:click = {() => {
                selected = 2
            }}>
                DM'S 
                {#if selected == 2}
                    <div class="line"></div>
                {:else}
                    <div class="line-inactive"></div>
                {/if}
            </button>
            <button on:click = {() => {
                selected = 3
            }}>
                Groups  
                {#if selected == 3}
                    <div class="line"></div>
                {:else}
                    <div class="line-inactive"></div>
                {/if}
            </button>
        </div>
        <div class="chats">
            <br />
            <h2>This is currently a BIG work in progress!</h2>
            <button
                class="member-button"
                on:click={() => {
                    
                }}
            >
                <ChatContainer
                    user="MikeDEV"
                    IsDM
                    ID = 2
                />
            </button>
            <button
                class="member-button"
                on:click={() => {
                    
                }}
            >
                <ChatContainer
                    user="A GC"
                    ID = 2
                />
            </button>
        </div>
    {:else}
        <h1>Join Meower to use this feature!</h1>
    {/if}
</div>

<style>
    .member-button {
		padding: 0;
		margin: 0;
        padding-top: 0.3em;
        padding-bottom: 0.2em;

		width: 100%;

		background-color: transparent;
		color: var(--foreground);
		border: none;

		position: relative;
		text-align: left;
	}

    .member-button:hover {
        background-color: var(--sidebar-hover) !important;
    }

    .member-button:active {
        background-color: var(--sidebar-active) !important;
    }

    .line {
        height: 0.1em;
        width: 100%;
        background-color: white;
    }

    .line-inactive {
        height: 0.1em;
        opacity: 1;
    }

    .selection > button {
        background: none !important;
        border-radius: 0;
        margin: 0;
    }

    .selection > button:hover {
        background-color: var(--sidebar-hover) !important;
    }

    .selection > button:active {
        background-color: var(--sidebar-active) !important;
    }

    .main {
        padding: 1.5em;
        height: 100%;
    }
</style>