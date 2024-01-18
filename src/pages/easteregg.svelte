<!-- routify:options bundle=false -->
<script>
	import Container from "../lib/Container.svelte";
	import PFP from "../lib/PFP.svelte";
	import LiText from "../lib/LiText.svelte";

	import DebugModal from "../lib/modals/Debug.svelte";
	import LogoutModal from "../lib/modals/Logout.svelte";
	import ServerSelectorModal from "../lib/modals/ServerSelector.svelte";
	import CreateChatModal from "../lib/modals/chats/CreateChat.svelte";
	import ChangePasswordModal from "../lib/modals/settings/ChangePassword.svelte";
	import CustomThemeModal from "../lib/modals/settings/CustomTheme.svelte";
	import DeleteAccountModal from "../lib/modals/settings/DeleteAccount.svelte";
	import LogoutEverywhereModal from "../lib/modals/settings/LogoutEverywhere.svelte";
	import SwitchBGMSFXModal from "../lib/modals/settings/SwitchBGMSFX.svelte";
	import SwitchThemeModal from "../lib/modals/settings/SwitchTheme.svelte";

	import {OOBERunning, groupCats, Showkitties} from "../lib/stores.js";
	import * as modals from "../lib/modals.js";

	import version from "../lib/version.js";
	import { tick } from "svelte";

	const allModals = [
		DebugModal,
		LogoutModal,
		ServerSelectorModal,
		CreateChatModal,
		ChangePasswordModal,
		CustomThemeModal,
		DeleteAccountModal,
		LogoutEverywhereModal,
		SwitchBGMSFXModal,
		SwitchThemeModal,
	];

	const PFP_COUNT = 34;

	const pfps = new Array(PFP_COUNT).fill().map((_, i) => i + 1);
	let pfpSwitcher = false;

	let pfpOverflow = false;
	$: {
		const pfp = 1;
		pfpOverflow = pfp < 0 || pfp > PFP_COUNT;
	}

	let profileUsername = "EasterEgg";
	let profileQuote = "Quote Here";
	let profilePfp = 1;
	let profileQuoteEnabled = true;
</script>

<div>
	<Container>
		<h1>Look at that!</h1>
		You found a secret! Here you can mess around with a bit of Meower Svelte.
	</Container>
	<Container>
		<h1>Modal Roulette</h1>
		Press the button below to pick a random modal (of course with moderation,
		harmful and errored ones removed)
		<br /><br />
		<button
			on:click={() => {
				let randModal =
					allModals[Math.round(Math.random() * allModals.length - 1)];
				modals.showModal(randModal);
			}}>Me!</button
		>
	</Container>
	<Container>
		<h1>Group Cats</h1>
		Crash your browser by changing the amount of group cats! (Default is 200)

		<br /><br />

		<input
			type="number"
			placeholder="Enter a number"
			bind:value={$groupCats}
		/>
		<button
			on:click = {async () => {
				Showkitties.set(false)
				await tick();
				Showkitties.set(true)
			}}
		>Click here to reload group cat</button>
	</Container>
	<Container>
		<!--Posts, Profiles and Profile Views (Later on, maybe GC Member list and postlist)-->
		<h1>Make your own!</h1>
		Make your own profile, post, etc. with this!

		<br /><br />

		<Container>
			<h1>Profile</h1>

			Username
			<br />
			<input
				placeholder="Username"
				type="text"
				bind:value={profileUsername}
				class="modal-input white"
			/>
			<br /><br />

			Quote
			<br />
			<input
				placeholder="Quote"
				type="text"
				bind:value={profileQuote}
				class="modal-input white"
			/>
			<br /><br />

			Enable Quote
			<br />
			<input
				type="checkbox"
				bind:checked={profileQuoteEnabled}
				class="modal-input white"
			/>
			<br /><br />

			Profile Picture
			<br />
			{#if pfpSwitcher}
				<Container>
					<h2>Profile Picture</h2>
					<div id="pfp-list">
						{#if pfpOverflow && profilePfp < 0}
							<button
								on:click={() => {
									pfpSwitcher = false;
								}}
								class="pfp selected"
								><PFP
									online={false}
									icon={profilePfp}
									alt="Profile picture {profilePfp}"
								/></button
							>
						{/if}
						{#each pfps as pfp}
							<button
								on:click={() => {
									profilePfp = pfp;
								}}
								class="pfp"
								class:selected={profilePfp === pfp}
								><PFP
									online={false}
									icon={pfp}
									alt="Profile picture {pfp}"
								/></button
							>
						{/each}
						{#if pfpOverflow && profilePfp > 0}
							<button class="pfp selected"
								><PFP
									online={false}
									icon={profilePfp}
									alt="Profile picture {profilePfp}"
								/></button
							>
						{/if}
					</div>
					<br /><br />
					<button
						class="long"
						title="Close"
						on:click={() => (pfpSwitcher = false)}>Close</button
					>
				</Container>
			{:else}
				<button
					class="long"
					title="Change Profile Picture"
					on:click={() => (pfpSwitcher = true)}
					>Change Profile Picture</button
				>
			{/if}
			<br /><br />

			<Container>
				<div class="profile-header">
					<PFP
						online={false}
						icon={profilePfp}
						alt="{profileUsername}'s profile picture"
						size={1.4}
					/>
					<div class="profile-header-info">
						<h1 class="profile-username">
							<LiText text={profileUsername} />
						</h1>
						<div class="profile-active">Offline</div>
					</div>
				</div>
			</Container>

			{#if profileQuoteEnabled}
				<Container>
					<h3>Quote</h3>
					<p>"<i>{profileQuote}</i>"</p>
				</Container>
			{/if}
		</Container>

		<Container>
			<h1>Post</h1>
			Coming soon!
		</Container>
	</Container>
	<Container>
		<h1>OOBE</h1>
		Wanna see the OOBE?

		<br /><br />

		<button on:click={() => ($OOBERunning = true)}>Click me</button>
	</Container>
	<!--<Container>
        <h1>Internal/Debug Info</h1>
        Want a look inside Svelte? Here you go!


    </Container>-->
	Meower Svelte v{version}
</div>

<style>
	.long {
		width: 100%;
		margin: 0;
		margin-bottom: 0.2em;
	}

	.pfp {
		padding: 0.2em;
		margin: 0.2em;
		border-radius: 1.45em;
		display: inline-block;
		background: none;
		border: none;
	}
	:global(main.input-hover) .pfp:hover,
	:global(main.input-touch) .pfp:active {
		background-color: var(--orange-light);
	}
	/* cst todo: fix shadow appearing when activating then unhovering because i gtg*/
	:global(:root main.input-hover) .pfp:active {
		background-color: var(--orange-dark);
	}
	:global(main) .pfp.selected {
		background-color: var(--orange);
	}
	#pfp-list {
		display: flex;
		flex-wrap: wrap;
	}

	.profile-header-info {
		margin-left: 1em;
		height: 6em;
	}

	.profile-active {
		font-style: italic;
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
