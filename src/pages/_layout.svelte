<!-- Meower Svelte, the app itself. -->
<script>
	import Setup from "../lib/Setup.svelte";
	import Modal from "../lib/Modal.svelte";
	import ConnectionFailed from "../lib/modals/ConnectionFailed.svelte";
	import LoginModal from "../lib/modals/Login.svelte";
	import SignupModal from "../lib/modals/Signup.svelte";
	import BannedModal from "../lib/modals/Banned.svelte";
	import IPBlockedModal from "../lib/modals/IPBlocked.svelte";
	import AccountCreationBlocked from "../lib/modals/AccountCreationBlocked.svelte";
	import DeletePostModal from "../lib/modals/DeletePost.svelte";
	import ReportPostModal from "../lib/modals/ReportPost.svelte";
	import ReportUserModal from "../lib/modals/ReportUser.svelte";
	import GCMemberModal from "../lib/modals/GCMember.svelte";
	import AddMemberModal from "../lib/modals/AddMember.svelte";
	import RemoveMemberModal from "../lib/modals/RemoveMember.svelte";
	import CreateChatModal from "../lib/modals/CreateChat.svelte";
	import AddImgModal from "../lib/modals/AddImage.svelte";
	import ChangePasswordModal from "../lib/modals/ChangePassword.svelte";
	import LogoutEverywhereModal from "../lib/modals/LogoutEverywhere.svelte";
	import DeleteAccountModal from "../lib/modals/DeleteAccount.svelte";
	import ErrorModal from "../lib/modals/Error.svelte";
	import LogoutModal from "../lib/modals/Logout.svelte";
	import AnnounceModal from "../lib/modals/Announce.svelte";
	import KickAllUsers from "../lib/modals/KickAllUsers.svelte";
	import EnableRepairMode from "../lib/modals/EnableRepairMode.svelte";
	import AddMember2Modal from "../lib/modals/AddMember_2.svelte";
	import AddMemberSearchModal from "../lib/modals/AddMember_Search.svelte";
	import AddMemberModeModal from "../lib/modals/AddMember_Mode.svelte";
	import SearchResultsModal from "../lib/modals/SearchResults.svelte";
	import SwitchThemeModal from "../lib/modals/SwitchTheme.svelte";
	import LoggedOut from "../lib/modals/LoggedOut.svelte";
	import SwitchBGMSFXModal from "../lib/modals/SwitchBGMSFX.svelte";
	import BasicModal from "../lib/modals/Basic.svelte";

	import OOBE from "../lib/OOBE/Main.svelte";

	import Sidebar from "../lib/Sidebar.svelte";
	import ModPanel from "../lib/ModPanel.svelte";

	import Spinner from "../lib/Spinner.svelte";
	import {link} from "../lib/clmanager.js";
	import {mobile, touch} from "../lib/responsiveness.js";
	import * as BGM from "../lib/BGM.js";

	import {
		screen,
		setupPage,
		modalShown,
		modalPage,
		reconnecting,
		disconnected,
		disconnectReason,
		userToMod,
		OOBERunning,
		user,
		spinner,
		modPanelOpen,
	} from "../lib/stores.js";
	import {tick} from "svelte";
</script>

<!-- routify:options bundle=true -->

<!--
	in main:
	style:--orange={$user.name && $useCustomTheme ? $customTheme.orange : null}
	style:--orange-button={$user.name && $useCustomTheme ? $customTheme.orangeButton : null}
	style:--orange-light={$user.name && $useCustomTheme ? $customTheme.orangeLight : null}
	style:--orange-dark={$user.name && $useCustomTheme ? $customTheme.orangeDark : null}
	style:--background={$user.name && $useCustomTheme ? $customTheme.background : null}
	style:--foreground={$user.name && $useCustomTheme ? $customTheme.foreground : null}
	style:--foreground-orange={$user.name && $useCustomTheme ? $customTheme.foregroundOrange : null}
-->

<main
	id="main"
	class:theme-orange={$user.theme === "orange"}
	class:theme-blue={$user.theme === "blue"}
	class:mode-light={!($user.mode === false)}
	class:mode-dark={$user.mode === false}
	class:layout-old={$user.layout === "old"}
	class:layout-mobile={$mobile}
	class:input-touch={$touch}
	class:input-hover={!$touch}
	on:mousedown={() => BGM.canPlayNow()}
	on:keydown={() => BGM.canPlayNow()}
>
	{#if $modPanelOpen && $user.lvl >= 1}
		<div class="mod-panel">
			<Modal
				on:close={() => {
					$modPanelOpen = false;
					$userToMod = "";
				}}
			>
				<div slot="header">
					<h1>Moderation Panel</h1>
				</div>
				<ModPanel />
			</Modal>
		</div>
	{/if}

	{#if $reconnecting}
		<Modal>
			<h2 slot="header">Reconnecting...</h2>
			<div slot="default">
				<p>
					Looks like we're having some problems connecting you to
					Meower. Give us a moment and we'll reconnect you as soon as
					possible...
				</p>
			</div>
		</Modal>
	{:else if $modalShown}
		<!-- Login, signup -->
		{#if $modalPage === "login"}
			<LoginModal />
		{:else if $modalPage === "signup"}
			<SignupModal />
			<!-- Bans -->
		{:else if $modalPage === "banned"}
			<BannedModal />
		{:else if $modalPage === "ipBlocked"}
			<IPBlockedModal />
		{:else if $modalPage === "accountCreationBlocked"}
			<AccountCreationBlocked />
			<!-- Confirmations -->
		{:else if $modalPage === "deletePost"}
			<DeletePostModal />
		{:else if $modalPage === "reportPost"}
			<ReportPostModal />
		{:else if $modalPage === "reportUser"}
			<ReportUserModal />
		{:else if $modalPage === "searchResults"}
			<SearchResultsModal />
		{:else if $modalPage === "logoutEverywhere"}
			<LogoutEverywhereModal />
		{:else if $modalPage === "deleteAccount"}
			<DeleteAccountModal />
		{:else if $modalPage === "logout"}
			<LogoutModal />
		{:else if $modalPage === "announce"}
			<AnnounceModal />
		{:else if $modalPage === "kickAllUsers"}
			<KickAllUsers />
		{:else if $modalPage === "enableRepairMode"}
			<EnableRepairMode />
			<!-- Text inputs -->
		{:else if $modalPage === "createChat"}
			<CreateChatModal />
		{:else if $modalPage === "addImg"}
			<AddImgModal />
		{:else if $modalPage === "changePassword"}
			<ChangePasswordModal />
			<!-- Group chats -->
		{:else if $modalPage === "gcMember"}
			<GCMemberModal />
		{:else if $modalPage === "addMember"}
			<AddMemberModal />
		{:else if $modalPage === "addMember2"}
			<AddMember2Modal />
		{:else if $modalPage === "addMemberSearch"}
			<AddMemberSearchModal />
		{:else if $modalPage === "addMemberMode"}
			<AddMemberModeModal />
		{:else if $modalPage === "removeMember"}
			<RemoveMemberModal />
			<!-- Misc -->
		{:else if $modalPage === "connectionFailed"}
			<ConnectionFailed />
		{:else if $modalPage === "switchTheme"}
			<SwitchThemeModal />
		{:else if $modalPage === "switchBGM"}
			<SwitchBGMSFXModal />
		{:else if $modalPage === "loggedOut"}
			<LoggedOut />
		{:else if $modalPage === "basic"}
			<BasicModal />
		{:else}
			<ErrorModal />
		{/if}
	{/if}

	{#if $screen === "blank"}
		<div id="blank" />
	{:else if $screen === "setup"}
		<Setup />
	{:else}
		<div class="main-screen">
			<div class="transition" />
			<div class="sidebar">
				<Sidebar />
			</div>
			<div class="view">
				{#if $OOBERunning}
					<OOBE />
				{:else}
					<slot />
				{/if}
			</div>
		</div>
	{/if}

	{#if $spinner || $reconnecting}
		<div class="spinner-container">
			<Spinner />
		</div>
	{/if}
</main>

<style>
	.spinner-container {
		position: fixed;
		right: 27px;
		bottom: 25px;
		z-index: 10000;
	}

	#main {
		width: 100%;
		height: 100%;

		font-family: Simvoni, sans-serif;

		--orange: #f9a636;
		--orange-button: var(--orange);
		--orange-light: #ffce8c;
		--orange-dark: #b46d34;
		--orange-scrollbar-back: #a15d04;
		--background: white;
		--foreground: black;
		--foreground-orange: white;

		--pfp-bg: white;
		--pfp-outline: #d9d9d9;

		background-color: var(--background);
		color: var(--foreground);
		scrollbar-color: var(--orange) var(--orange-scrollbar-back);
		font-size: 15pt;
	}

	#main.theme-orange.mode-dark {
		--orange: #ec932d;
		--orange-light: #F9A535;
		--orange-dark: #ac5b18;
		--orange-scrollbar-back: rgb(131, 45, 5);
		--background: #181818;
		--foreground: #eef;
		--foreground-orange: #eef;
	}
	#main.theme-blue {
		/*--orange: #aa0000;
		--orange-light: #aa0000;
		--orange-dark: #aa0000;
		--orange-scrollbar-back: #aa0000;*/
		--orange: #4d97ff;
		--orange-light: #79b7ff;
		--orange-dark: #3685eb;
		--orange-scrollbar-back: #374eb1;
		--background: white;
		--foreground: black;
		--foreground-orange: white;
		scrollbar-color: unset;
	}
	#main.theme-blue.mode-dark {
		--background: #181818;
		--foreground: white;
		--foreground-orange: white;
	}

	.main-screen {
		box-sizing: border-box;

		display: flex;
		flex-direction: row;
		gap: 0;

		width: 100vw;
		height: 100vh;
		overflow: hidden;
	}

	.transition {
		background-color: var(--orange);
		height: 100%;
		width: 100%;
		position: absolute;
		animation-fill-mode: forwards;
		animation-timing-function: ease;
		z-index: 2;
	}

	:global(main:not(layout-old)) .transition {
		animation-name: transition;
		animation-duration: 0.7s;
	}

	:global(main.layout-old) .transition {
		animation-name: transitionOld;
		animation-duration: 0.6s;
	}

	@keyframes transition {
		from {
			width: 100%;
		}
		to {
			width: 3.5em;
		}
	}

	@keyframes transitionOld {
		from {
			height: 100%;
		}
		to {
			height: 3.5em;
		}
	}

	.sidebar {
		width: 3.5em;
		height: auto;

		z-index: 100;
		position: relative;

		flex-shrink: 0;
		flex-grow: 0;
		z-index: 3;
	}

	.view {
		flex-grow: 1;
		flex-shrink: 1;

		padding: 0.33em;
		box-sizing: border-box;
		overflow: auto;

		--view-height: calc(100vh - 0.66em);

		background-color: var(--background);
	}

	:global(main.layout-old) .main-screen {
		flex-direction: column;
	}
	:global(main.layout-old) .sidebar {
		width: auto;
		height: 3.5em;
	}
	:global(main.layout-old) .view {
		--view-height: calc(100vh - 3.5em - 0.66em);
	}
</style>
