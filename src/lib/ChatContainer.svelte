<!--
	Stripped down Member.svelte for Chat lists
-->
<script>
	import PFP from "./PFP.svelte";

	import {ulist, chats, authHeader, user} from "./stores.js";

	import {onMount} from "svelte";
	import loadProfile from "./loadProfile.js";
	import * as clm from "./clmanager.js";
	import {apiUrl} from "./urls.js";

	export let cuser;
	export let IsDM = false;
	export let ID;

	let userdata = {};

	let error;

	/**
	 * Initialize this post's user profile - gets profile info from the cache or fetches it.
	 */
	async function initPostUser() {
		try {
			userdata = (await loadProfile(cuser));
		} catch (e) {
			error = e;
			userdata = {pfp_data: -2, _id: cuser};
		}
	}
	if (IsDM) {
		onMount(initPostUser);
	} else {
		userdata = {pfp_data: 103, _id: cuser}
	}
</script>

{#if !error}
	<div class="mainwrapper">
		<div class="member">
			<div class="member-pfp">
				<PFP
					userdata = {userdata}
					alt = "{user}'s profile picture"
					online = {$ulist.includes(user)}
					size={1}
				/>
			</div>
			<div class="side">
				<p class="member-name">{userdata._id}</p>
				{#if !IsDM}
					<p class="members">Bloctans, Joe and 15 others</p>
				{/if}
			</div>
		</div>
		<div class="settings-controls">
			<button
				class="circle star"
				class:filled={$user.favorited_chats.includes(
					ID
				)}
				on:click={() => {
					if ($user.favorited_chats.includes(ID)) {
						$user.favorited_chats.splice(
							$user.favorited_chats.indexOf(ID),
							1
						);
						clm.updateProfile({
							favorited_chats: $user.favorited_chats,
						});
					} else {
						$user.favorited_chats =
							$user.favorited_chats.filter(chatId => {
								return $chats.some(
									_chat => _chat._id === chatId
								);
							});
						if ($user.favorited_chats.length >= 50) {
							modals.showModal(BasicModal, {
								title: "Too many stars!",
								desc: "Sorry, you can only have up to 50 favorited chats!",
							});
						} else {
							$user.favorited_chats.push(ID);
							clm.updateProfile({
								favorited_chats: $user.favorited_chats,
							});
						}
					}
				}}
			/>
			{#if !$user.favorited_chats.includes(ID)}
				<button
					class="circle close"
					on:click={() => {
						fetch(`${apiUrl}chats/${ID}`, {
							method: "DELETE",
							headers: $authHeader,
						});
						$chats.filter(
							_chat => _chat._id !== ID
						);
					}}
				/>
			{/if}
		</div>
	</div>
{:else}
	<div class="error">error loading member {userdata._id}: {error}</div>
{/if}

<style>
	.mainwrapper {
		display: flex;
		flex-wrap: nowrap;
		flex-direction: row;
		align-items: center;
	}

	.member {
		display: flex;
		flex-wrap: nowrap;
		flex-direction: row;
		align-items: center;

		width: 100%;
		height: 2.5em;
		gap: 0.5em;
		padding: 0 0.5em;
		box-sizing: border-box;
	}

	.settings-controls {
		margin-right: 0.3em;
		position: relative;
		right: 0;
		top: 0;
		display: flex;
		gap: 0 !important;
		flex-direction: column;
	}

	.settings-controls > button {
		background-color: transparent;
		margin: -0.1em;
	}

	.side > p {
		width: 100%;
		margin: 0;
	}

	.side {
		display: flex;
		flex-wrap: nowrap;
		flex-direction: column;
	}

	.members {
		color: var(--date);
	}

	.error {
		padding: 0.25em;
		font-style: italic;
		font-size: 80%;
	}
</style>
