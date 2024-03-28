<script>
    let selected = 1
</script>

<div class="main">
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
    </div>
</div>

<style>
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
        font-size: 125%;
    }

    .selection > button:hover {
        background-color: var(--sidebar-hover) !important;
    }

    .selection > button:active {
        background-color: var(--sidebar-active) !important;
    }

    .main {
        padding: 1em;
        background-color: var(--background);
        height: 100%;
    }
</style>