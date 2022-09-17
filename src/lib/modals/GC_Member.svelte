<script>	
	import Modal from "../Modal.svelte";
    import Container from "../Container.svelte";
    import PFP from "../PFP.svelte";
    import Loading from "../Loading.svelte";

    import * as clm from "../clmanager.js";

	import {modalShown, modalPage, profileClicked_GC, ulist, profileData,user, profileClicked, mainPage as page, chatid} from "../stores.js";
    import {apiUrl, encodeApiURLParams} from "../urls";
    import {levels} from "../formatting.js";

    async function loadProfile() {
		let path = `users/${$profileClicked_GC}`;
		if (encodeApiURLParams) path = encodeURIComponent(path);
		const resp = await fetch(
			`${apiUrl}${path}`
		);
		if (!resp.ok) {
			throw new Error("Response code is not OK; code is " + resp.status);
		}
		const json = await resp.json();
		return json;
	}

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

<Modal on:close={() => {$modalShown = false}}>
    <h2 slot="header">{"Profile of "+$profileClicked_GC}</h2>
    <div slot="default">
        {#await loadProfile()}
            <div class="fullcenter">
                <Loading />
            </div>
        {:then data}
            <Container>
                <div class="profile-header">
                    <PFP
                        online={$ulist.includes($profileClicked_GC)}
                        icon={
                            $profileClicked_GC === $user.name ?
							    $user.pfp_data : data.pfp_data
                        }
                        alt="{$profileClicked_GC}'s profile picture"
                        big={true}
                    ></PFP>
                    <div class="profile-header-info">
                        <h1 class="profile-username">{$profileClicked_GC}</h1>
                        <div class="profile-active">{
                            $ulist.includes($profileClicked_GC) ? "Online" : "Offline"
                        }</div>
                        <div class="profile-role">
                            {levels[data.lvl] || "Unknown"}
                        </div>
                    </div>
                </div>
            </Container>
            <button class="long" on:click={() => {
				$modalShown = false
				clm.meowerRequest({
					cmd: "direct",
					val: {
						cmd: "set_chat_state",
						val: {
							state: 0,
							chatid: $chatid
						},
					}
				});
				profileClicked.set($profileClicked_GC);
				page.set("profile");
			}}
				>View full profile</button>
			<button class="long" on:click={() => {
				modalPage.set("Memberem");
			}}>Remove from chat</button>
			<button class="long" on:click={() => {$modalShown = false}}>Close</button>
		{:catch error}
			<Container>
				Error loading user profile.
				<pre><code>{error}</code></pre>
			</Container>
			<button class="long" on:click={() => {
				modalPage.set("Memberem");
			}}>Remove from chat</button>
			<button class="long" on:click={() => {$modalShown = false}}>Close</button>
        {/await}
    </div>
</Modal>

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

    .long {
        width: 100%;
        margin: 0;
		margin-bottom: -2px;
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
</style>