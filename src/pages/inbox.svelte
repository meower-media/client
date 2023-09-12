<!--
	Home but it's the inbox.
-->
<script>
	import Container from "../lib/Container.svelte";
	import PostList from "../lib/PostList.svelte";
	import {user} from "../lib/stores.js";
	import {permissions, hasPermission} from "../lib/adminPermissions.js";
	import * as clm from "../lib/clmanager.js";

	import {params, goto} from "@roxi/routify";
	import {onMount} from "svelte";

	onMount(() => {
		if ($params.user && !hasPermission(permissions.VIEW_INBOXES)) {
			$goto("/inbox");
		}
	});
</script>

<div class="messages">
	<Container>
		{#if $params.user}
			<h1>{$params.user}'s Inbox Messages</h1>
			Here are {$params.user}'s latest inbox messages.
		{:else}
			<h1>Inbox Messages</h1>
			Here are your latest inbox messages. We will send announcements and moderator
			messages to here!
		{/if}
	</Container>
	<PostList
		on:loaded={() => {
			// Mark inbox as read
			if (!$user.unread_inbox) return;
			$user.unread_inbox = false;
			clm.updateProfile();
		}}
		fetchUrl={"inbox"}
		queryParams={$params.user ? {user: $params.user} : {}}
		postOrigin={null}
		canPost={false}
	>
		<Container slot="error" let:error>
			Error loading messages. Please try again.
			<pre><code>{error}</code></pre>
		</Container>
		<Container slot="empty">No messages here Check back later!</Container>
	</PostList>
</div>

<style>
	.messages {
		height: 100%;
	}
</style>
