<script>
	import Modal from "./Modal.svelte";
	import ConnectionFailed from "./modals/ConnectionFailed.svelte";
	import LoginModal from "./modals/Login.svelte";
	import SignupModal from "./modals/Signup.svelte";
	import BannedModal from "./modals/Banned.svelte";
	import IPBlockedModal from "./modals/IPBlocked.svelte";
	import AccountCreationBlocked from "./modals/AccountCreationBlocked.svelte";
	import DeletePostModal from "./modals/DeletePost.svelte";
	import ReportPostModal from "./modals/ReportPost.svelte";
	import ReportUserModal from "./modals/ReportUser.svelte";
	import GCMemberModal from "./modals/GCMember.svelte";
	import AddMemberModal from "./modals/AddMember.svelte";
	import RemoveMemberModal from "./modals/RemoveMember.svelte";
	import CreateChatModal from "./modals/CreateChat.svelte";
	import AddImgModal from "./modals/AddImage.svelte";
	import ChangePasswordModal from "./modals/ChangePassword.svelte";
	import LogoutEverywhereModal from "./modals/LogoutEverywhere.svelte";
	import DeleteAccountModal from "./modals/DeleteAccount.svelte";
	import ErrorModal from "./modals/Error.svelte";
	import LogoutModal from "./modals/Logout.svelte";
	import AnnounceModal from "./modals/Announce.svelte";
	import KickAllUsers from "./modals/KickAllUsers.svelte";
	import EnableRepairMode from "./modals/EnableRepairMode.svelte";
	import AddMember2Modal from "./modals/AddMember_2.svelte";
	import AddMemberSearchModal from "./modals/AddMember_Search.svelte";
	import AddMemberModeModal from "./modals/AddMember_Mode.svelte";
	import SearchResultsModal from "./modals/SearchResults.svelte";
	import SwitchThemeModal from "./modals/SwitchTheme.svelte";
	import LoggedOut from "./modals/LoggedOut.svelte";
	import SwitchBGMSFXModal from "./modals/SwitchBGMSFX.svelte";
	import BasicModal from "./modals/Basic.svelte";
	import CustomThemeModal from "./modals/CustomTheme.svelte";

	import ModPanel from "./ModPanel.svelte";

	import {
		modalShown,
		modalPage,
		reconnecting,
		userToMod,
		user,
		modPanelOpen
	} from "./stores.js";
</script>

<main>
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
		{:else if $modalPage === "customTheme"}
			<CustomThemeModal />
		{:else if $modalPage === "loggedOut"}
			<LoggedOut />
		{:else if $modalPage === "basic"}
			<BasicModal />
		{:else}
			<ErrorModal />
		{/if}
	{/if}
</main>