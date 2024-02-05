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
	import meowy from "../assets/meowy.svg";

	import sleep from "../lib/sleep.js";

	import {OOBERunning, groupCats} from "../lib/stores.js";
	import * as modals from "../lib/modals.js";

	import {onMount, onDestroy} from "svelte/internal";

	import version from "../lib/version.js";

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

	let EastereggUnlocked = true;

	let keys = new Audio(
		new URL(
			`../assets/keys.mp3`,
			import.meta.url
		).href
	);

	let canvas = null;
	let ctx = null;

	onDestroy(() => {
		keys.pause()
		keys.remove()
	})

	async function LimboGame() {
		canvas = document.getElementById("keyscanvas")
		ctx = canvas.getContext("2d")

		const meow = new Image();
		meow.src = meowy;

		ctx.fillStyle = "white";
		ctx.font = "48px serif";
		keys.volume = 0.1
		keys.play()
		ctx.fillText("Hello", 0, 50);
		await sleep(1500)
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		let Meowies = [0,1,2,3,4,5,6,7]
		let OldMeowies = [0,1,2,3,4,5,6,7]
		let correct = Math.ceil(Math.random() * 7)

		function easeInOutQuad(t, b, c, d) {
			if ((t /= d / 2) < 1) {
				return c / 2 * t * t + b;
			} else {
				return -c / 2 * ((--t) * (t - 2) - 1) + b;
			}
		}

		function DrawMeowy(where) {
			ctx.drawImage(meow, where[0], where[1], 75, 75);
		}

		function GetMeowyPos(Index) {
			/*
				1 2 3 4
				5 6 7 8
			*/

			if (Index < 4) {
				return [150 * Index + 200, 100]
			} else {
				return [(150 * Index) - 600 + 200, 250]
			}
		}

		function ShowCorrectMeowy(index) {
			var pos = GetMeowyPos(index)

			pos = [pos[0] - 37.5, pos[1] - 37.5]

			const grd = ctx.createRadialGradient(75+pos[0], 75+pos[1], 30, 75+pos[0], 75+pos[1], 75);
			grd.addColorStop(0, "#00FF00FF");
			grd.addColorStop(1, "#FFFFFF00");

			// Draw a filled Rectangle
			ctx.fillStyle = grd;
			ctx.fillRect(pos[0], pos[1], 150, 150);
		}

		function MoveListMeowy(from, where) {
			var originalfrom = Meowies[from-1]
			Meowies[from-1] = Meowies[where-1]
			Meowies[where-1] = originalfrom
		}

		function Lerp(to, where, step) {
			return [easeInOutQuad(step, to[0], where[0]-to[0], 1),easeInOutQuad(step, to[1], where[1]-to[1], 1)]
		}

		for (let index = 0; index < 8; index++) {
			DrawMeowy(GetMeowyPos(index))
			await sleep(250);
		}

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "white";
		ctx.fillText("Remember...", 0, 50);
		ShowCorrectMeowy(correct)
		for (let index = 0; index < 8; index++) {
			DrawMeowy(GetMeowyPos(index))
		}
		await sleep(6250)
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "white";
		ctx.fillText("Get ready!", 0, 50);
		for (let index = 0; index < 8; index++) {
			DrawMeowy(GetMeowyPos(index))
		}

		function DoShuffleCycle() {
			/*
				ideas:
					1 2 3 4
					5 6 7 8
					to
					1: 
						6 5 8 7
						2 1 4 3
					2:
						4 3 2 1
						8 7 6 5
					3:
						5 6 7 8
						1 2 3 4
					4:
						3 4 1 2
						7 8 5 6
					5:
						1 3 2 4
						5 7 6 8
					6:
						4 2 3 1
						8 6 7 5
			*/
			var cycle = Math.ceil(Math.random() * 5)

			if (cycle == 0) {
				MoveListMeowy(1, 6)
				MoveListMeowy(2, 5)
				MoveListMeowy(3, 8)
				MoveListMeowy(7, 4)
			} else if (cycle == 1) {
				Meowies = Meowies.reverse()
			} else if (cycle == 2) {
				MoveListMeowy(5, 1)
				MoveListMeowy(6, 2)
				MoveListMeowy(7, 3)
				MoveListMeowy(8, 4)
			} else if (cycle == 3) {
				MoveListMeowy(3, 1)
				MoveListMeowy(4, 2)
				MoveListMeowy(7, 5)
				MoveListMeowy(8, 6)
			} else if (cycle == 4) {
				MoveListMeowy(3, 2)
				MoveListMeowy(7, 6)
			} else {
				MoveListMeowy(4, 1)
				MoveListMeowy(8, 5)
			}
		}

		await sleep(750)

		let lerpt = 0
		let t = 0

		DoShuffleCycle()

		function draw() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			if (t < 36) {
				if (lerpt < 1) {
					lerpt += 1 / 16
					for (let index = 0; index < 8; index++) {
						DrawMeowy(Lerp(GetMeowyPos(Meowies[index]), GetMeowyPos(OldMeowies[index]), lerpt))
					}
				} else {
					for (let index = 0; index < 8; index++) {
						DrawMeowy(GetMeowyPos(Meowies[index]))
					}
					t += 1
					DoShuffleCycle()
					lerpt = 0
				}
			} else {
				ShowCorrectMeowy(Meowies[correct])
				ctx.font = "32px serif";
				ctx.fillStyle = "white";
				ctx.fillText("I will probably never add the guessing part.", 0, 50);
				for (let index = 0; index < 8; index++) {
					DrawMeowy(GetMeowyPos(Meowies[index]))
				}
			}

			window.requestAnimationFrame(draw);
		}

		window.requestAnimationFrame(draw);
	}
</script>

<div>
	{#if EastereggUnlocked}
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
		<Container>
			<h1>Limbo keys</h1>
			Funny game

			<br /><br />

			<button on:click={async () => {
				EastereggUnlocked = false
				await sleep(100)
				await LimboGame()
			}}>Click me</button>
		</Container>
		<!--<Container>
			<h1>Internal/Debug Info</h1>
			Want a look inside Svelte? Here you go!


		</Container>-->
		Meower Svelte v{version}
	{:else}
		<canvas id="keyscanvas" width=800 height=600 />
	{/if}
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
