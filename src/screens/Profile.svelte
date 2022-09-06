<!-- The profile page, now with viewing others' profiles. -->
<script>
	import {
		ulist,
		profileClicked, profileData, user, pfpSwitcher,
		screen, setupPage,
		mainPage as page
	} from "../lib/stores.js";
	
    import PFP from "../lib/PFP.svelte";
    import Loading from "../lib/Loading.svelte";
    import Container from "../lib/Container.svelte";
    import * as clm from "../lib/clmanager.js";
    import {levels} from "../lib/formatting.js";

	import {tick} from "svelte";
	
	const pfps = new Array(28).fill().map((_,i) => i+1);

	// Update pfpSwitcher
	pfpSwitcher.set(false);

	/**
	 * Saves the user profile, and also clears its cache entry.
	 */
	function save() {
		if ($profileData[$user.name]) {
			const _profileData = $profileData;
			delete _profileData[$user.name];
			profileData.set(_profileData);
		}

		clm.updateProfile();
	}
</script>

<div class="OtherProfile">
	{#await
		clm.meowerRequest({
			cmd: "direct",
			val: {
				cmd: "get_profile",
				val: $profileClicked,
			},
		})
	}
		<div class="fullcenter">
			<Loading />
		</div>
	{:then data}
		<Container>
			<div class="profile-header">
				<PFP
					online={$ulist.includes(data.payload._id)}
					icon={
						$profileClicked === $user.name ?
							$user.pfp_data : data.payload.pfp_data
					}
					alt="{data.payload.name}'s profile picture"
					big={true}
				></PFP>
				<div class="profile-header-info">
					<h1 class="profile-username">{data.payload._id}</h1>
					<div class="profile-active">{
						$ulist.includes(data.payload._id) ? "Online" : "Offline"
					}</div>
					<div class="profile-role">
						{levels[data.payload.lvl] || "Unknown"}
					</div>
				</div>
			</div>
		</Container>

		{#if $pfpSwitcher}
			<Container>
				<h2>Profile Picture</h2>
				<div id="pfp-list">
					{#each pfps as pfp}
						<span
							on:click={() => {
								pfpSwitcher.set(false);
								$user.pfp_data = pfp;
								save();
							}}
							class="pfp"
							class:selected={$user.pfp_data === pfp}
						><PFP
							online={false}
							icon={pfp}
							alt="Profile picture {pfp}"
						></PFP></span>
					{/each}
				</div>
			</Container>
		{:else if $profileClicked === $user.name}
			<button
				class="long"
				title="Change Profile Picture"
				on:click={() => pfpSwitcher.set(true)}
			>Change Profile Picture</button>
		{/if}

		<button
			class="long"
			title="View Recet Posts"
			on:click={()=>{
				window.scrollTo(0,0);
				page.set("blank");
				tick().then(() => page.set("recent"));
			}}
		>View recent posts</button>

		{#if $profileClicked !== $user.name}
			<button
				class="long"
				title="Coming soon?"
				disabled
			>Add to chat</button>

			<button
				class="long"
				title="Report User"
				on:click={()=>{
					if (confirm("Are you sure you want to report this user?")) {
						clm.meowerRequest({
							cmd: "direct",
							val: {
								cmd: "report",
								val: {
									type: 1,
									id: $profileClicked,
								},
							},
						});
					}
				}}
			>Report User</button>
		{/if}
	{:catch e}
		<Container>
			<div class="profile-header">
				<PFP
					online={$ulist.includes($profileClicked)}
					icon={-2}
					alt="{$profileClicked}'s profile picture"
					big={true}
				></PFP>
				<div class="profile-header-info">
					<h1 class="profile-username">{$profileClicked}</h1>
					<div class="profile-active">{
						$ulist.includes($profileClicked) ? "Online" : "Offline"
					}</div>
					<div class="profile-role">Unknown</div>
				</div>
			</div>
		</Container>
		{#if e === "E:115 | Refused" && !$user.name}
			<Container>
				<h2>Error</h2>
				<div>
					Unfortunately, we cannot get profile info without being logged in.
					<a
						href="."
						on:click|preventDefault={async () => {
							screen.set("setup");
							await tick();
							setupPage.set("reconnect");
						}}
					>Try logging in.</a>
				</div>
			</Container>
		{:else}
			<Container>
				<h2>Error</h2>
				We couldn't get this user's profile info.
				<pre><code>{e}</code></pre>
				Try again. If this issue persists,
				<a
					href="https://github.com/Meower-Media-Co/Meower-Svelte/issues/new"
				>create an issue on Meower Svelte's issue tracker</a> with the error code shown above.
			</Container>
		{/if}
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

    .long {
        width: 100%;
        margin: 0;
		margin-bottom: -2px;
    }

	.pfp {
		padding: 0.2em;
		margin: 0.2em;
		border-radius: 1.45em;
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
</style>
