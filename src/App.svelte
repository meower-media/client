<!-- Meower Svelte, the app itself. -->

<script>
	import Main from "./screens/Main.svelte";
	import Setup from "./screens/Setup.svelte";
	
	import Modal from "./lib/Modal.svelte";
	import LoginModal from "./lib/modals/Login.svelte";
	import SignupModal from "./lib/modals/Signup.svelte";
	import BannedModal from "./lib/modals/Banned.svelte";
	import IPBannedModal from "./lib/modals/IPBanned.svelte";
	import ReportPostModal from "./lib/modals/ReportPost.svelte";
	import DeletePostModal from "./lib/modals/DeletePost.svelte";
	import GC_MemberModal from "./lib/modals/GC_Member.svelte";
	import RemoveMemberModal from "./lib/modals/RemoveMember.svelte";
	import CreateChatModal from "./lib/modals/CreateChat.svelte";
	import ChatMembersModal from "./deleted/ChatMembers.svelte";
	import ErrorModal from "./lib/modals/Error.svelte";
	import ChangePasswordModal from "./lib/modals/ChangePassword.svelte";

	import Spinner from "./lib/Spinner.svelte";
	import {apiUrl} from "./lib/urls.js";
	import {link} from "./lib/clmanager.js";

	import {
		screen, setupPage,
		modalShown, modalPage,
		disconnected, disconnectReason,
		user, spinner
	} from "./lib/stores.js";
	import {tick} from "svelte";
</script>

<main
	id="main"
	class:theme-orange={$user.theme==="orange"}
	class:theme-blue={$user.theme==="blue"}
	class:mode-light={!($user.mode === false)}
	class:mode-dark={$user.mode === false}
	class:layout-old={$user.layout === "old"}
>
	{#if $disconnected}
		<Modal>
			<h2 slot="header">
				Me-owch.
			</h2>
			<div slot="default">
				<p>
					{#if $disconnectReason === ""}
						Something went wrong and the connection to Meower was lost.
					{:else if $disconnectReason === "E:119 | IP Blocked"}
						The server has blocked your IP address ({link.ip}).
					{:else if $disconnectReason == "E:110 | ID conflict"}
						There has been a hiccup! Looks like you logged into Meower from another device.
						<br /><br />
						Please check any devices currently logged into Meower and try again.
					{:else if $disconnectReason == "E:018 | Account Banned"}
						You have been banned by a moderator.
					{:else if $disconnectReason == "E:020 | Kicked"}
						You have been kicked by a moderator.
					{:else}
						We ran into an error trying to connect to the server.
						<pre><code>{$disconnectReason}</code></pre>
					{/if}
				</p>
				<button on:click={async () => {
					screen.set("setup");
					disconnected.set(false);
					await tick();
					setupPage.set("reconnect");
				}}>Reconnect</button>
			</div>
		</Modal>
	{/if}

	{#if $modalShown}
		{#if $modalPage === "login"}
			<LoginModal />
		{:else if $modalPage === "signup"}
			<SignupModal />
		{:else if $modalPage === "banned"}
			<BannedModal />
		{:else if $modalPage === "ipBanned"}
			<IPBannedModal />
		{:else if $modalPage === "reportPost"}
			<ReportPostModal />
		{:else if $modalPage === "deletePost"}
			<DeletePostModal />
		{:else if $modalPage === "createChat"}
			<CreateChatModal />
		{:else if $modalPage === "chatMembers"}
			<ChatMembersModal />
		{:else if $modalPage === "changePassword"}
			<ChangePasswordModal />
		{:else if $modalPage === "GC_Member"}
			<GC_MemberModal />
		{:else if $modalPage === "Memberem"}
			<RemoveMemberModal />
		{:else}
			<ErrorModal />
		{/if}
	{/if}

	{#if $screen === "setup"}
		<Setup />
	{:else}
		<Main />
	{/if}

	{#if $spinner}
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
		--orange: #b35305;
		--orange-light: #dd7f14;
		--orange-dark: #ac4718;
		--orange-scrollbar-back: rgb(131, 45, 5);
		--background: #020010;
		--foreground: #eef;
		--foreground-orange: #eef;
	}
	#main.theme-blue {
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
		--background: #202020;
		--foreground: white;
		--foreground-orange: white;
	}
</style>