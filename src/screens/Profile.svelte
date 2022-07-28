<!-- The profile page, AKA the change your profile picture page. -->

<script>
	import PFP from "../lib/PFP.svelte";
	import Container from "../lib/Container.svelte";
	import * as clm from "../lib/clmanager.js";
	import {user, profileData, spinner} from "../lib/stores.js";

	let _user = $user;
	user.subscribe(v => _user = v);

	const pfps = new Array(23).fill().map((v,i) => i+1)
	
	/**
	 * Saves the user profile, and also clears its cache entry.
	 */
	function save() {
		if ($profileData[$user.name]) {
			alert("upd")
			const _profileData = $profileData;
			delete _profileData[$user.name];
			profileData.set(_profileData);
		}

		clm.updateProfile();
	}
</script>

<div class="profile">
	<p>Quote: {$user.quote}</p>
	<form 
		class="createpost"
		on:submit|preventDefault={e => {
			spinner.set(true);
			const _user2 = $user;
			_user2.quote = e.target[0].value
			user.set(_user2);

			clm.updateProfile();
			spinner.set(false);
		}}
	>
		<input
			type="text"
			class="white"
			placeholder="Write something..."
				id="qinput"
				name="qinput"
			autocomplete="false"
		>
		<button>Save Quote</button>
	</form>
	<Container>
		<div class="profile-header">
			<PFP
				online={true}
				icon={_user.pfp_data}
				alt="{_user.name}'s profile picture"
				big={true}
			></PFP>
			<h1 class="profile-username">{_user.name}</h1>
		</div>
	</Container>
	<Container>
		<h2>Profile Picture</h2>
		<div id="pfp-list">
			{#each pfps as pfp}
				<span
					on:click={() => {
						if (_user.pfp_data === pfp) return;
						_user.pfp_data = pfp;
						save();
					}}
					class="pfp"
					class:selected={_user.pfp_data === pfp}
				><PFP
						online={false}
						icon={pfp}
						alt="Profile picture {pfp}"
					></PFP></span>
			{/each}
		</div>
	</Container>
</div>

<style>
	.pfp {
		padding: 0.2em;
		margin: 0.2em;
		border-radius: 1.25em;
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

	.profile-username {
		margin: 0;
		margin-left: 0.2em;
		display: inline-block;
		max-width: 100%;
		font-size: 300%;
	}

	.profile-header {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}
</style>