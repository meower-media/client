<script>
	import Member from "./Member.svelte";
	import { ulist } from "./stores";
    import {goto} from "@roxi/routify";
</script>

<div id="members">
    <div id="members-inner">
        {#each $ulist as chatmember}
            <button
                class="member-button"
                on:click={() => {
                    $goto(`/users/${chatmember}`);
                }}
            >
                <Member
                    member={chatmember}
                    owner={false}
                />
            </button>
        {/each}
    </div>
    <div class="top">
        <h2 class="members-title">
            Users Online (Home): <span class="small">{$ulist.length}</span>
        </h2>
    </div>
</div>

<style>
    .member-button {
		padding: 0;
		margin: 0;

		width: 100%;

		background-color: transparent;
		color: var(--foreground);
		border: none;

		position: relative;
		text-align: left;
		box-shadow: none;
	}

	/* repetition because of CSS specificity */
	:global(main.input-hover) .member-button.member-button:hover,
	.member-button.member-button:focus-visible {
		background-color: #7773;
	}
	:global(#main) .member-button.member-button:active {
		background-color: #7776;
	}

	#members {
		height: var(--view-height);
		width: min(45%, 12em);

		background-color: var(--background);
		border: solid 2px var(--orange);
		border-radius: 5px;
		box-sizing: border-box;

		position: sticky;
		top: 0;

		flex-shrink: 0;
		flex-grow: 0;
	}
	:global(#main.layout-mobile) #members {
		width: 100%;
	}
	#members-inner {
		position: relative;

		overflow-y: auto;
		overflow-x: hidden;
		overscroll-behavior: none;

		height: calc(100% - 3.15em);
		margin-top: 3.15em;
	}

    .top {
		position: absolute;
		top: 0;
		width: 100%;
	}
</style>