<script>
	import Modal from "../../Modal.svelte";
	import PostList from "../../PostList.svelte";

	import ClearPostsModal from "./ClearPosts.svelte";

	import {adminPermissions, hasPermission} from "../../bitField.js";
	import * as modals from "../../modals.js";

	import {tick} from "svelte";

	export let modalData;

	let {username, userProtected} = modalData;

	let postOrigin, chatid, reloadingPosts;
</script>

<Modal showClose={true} on:close={modals.closeLastModal}>
	<h2 slot="header">
		{username}'s Posts
	</h2>
	<div slot="default">
		<label for="post-origin"><b>Post Origin</b></label><br />
		<select
			id="post-origin"
			class="modal-input grow"
			style="width: 100%; margin-bottom: 0.25em;"
			bind:value={postOrigin}
			on:change={async () => {
				reloadingPosts = true;
				await tick();
				reloadingPosts = false;
			}}
		>
			<option value={null} selected={!postOrigin}>Any</option>
			<option value="home" selected={postOrigin === "home"}>Home</option>
			<option value="inbox" selected={postOrigin === "inbox"}
				>Inbox</option
			>
			<option value="chat" selected={postOrigin === "chat"}>Chat</option>
		</select><br />
		{#if postOrigin === "chat"}
			<label for="chat-id"><b>Chat ID</b></label><br />
			<input
				id="chat-id"
				type="text"
				class="modal-input white"
				style="margin-bottom: 0.25em;"
				placeholder="Chat ID..."
				bind:value={chatid}
				on:change={async () => {
					reloadingPosts = true;
					await tick();
					reloadingPosts = false;
				}}
			/><br />
		{/if}
		{#if !reloadingPosts && (postOrigin !== "chat" || chatid)}
			<button
				class="long"
				title="Delete All Posts"
				disabled={userProtected &&
					!hasPermission(adminPermissions.SYSADMIN)}
				on:click={() =>
					modals.showModal(ClearPostsModal, {
						username,
						postOrigin: postOrigin === "chat" ? chatid : postOrigin,
					})}>Delete All Posts</button
			><br />
			<PostList
				fetchUrl={`admin/users/${username}/posts`}
				postOrigin={postOrigin === "chat" ? chatid : postOrigin}
				canPost={false}
				queryParams={postOrigin
					? {origin: postOrigin === "chat" ? chatid : postOrigin}
					: ""}
				adminView={true}
			/>
		{/if}
	</div>
</Modal>

<style>
	.long {
		width: 100%;
		margin: 0;
		margin-bottom: 0.2em;
	}
</style>
