<!--
	Home but it's the inbox.
-->
<script>
	import Container from "../lib/Container.svelte";
	import PostList from "../lib/PostList.svelte";

	import {user} from "../lib/stores.js";
	import * as clm from "../lib/clmanager.js";
</script>

<div class="messages">
	<Container>
		<h1>Inbox Messages</h1>
		Here are your latest inbox messages. We will send announcements and important
		messages to here!
	</Container>
	<PostList
		on:loaded={() => {
			// Mark inbox as read
			if ($user.unread_inbox) clm.updateProfile({unread_inbox: false});
		}}
		fetchUrl={"inbox"}
		postOrigin={null}
		canPost={false}
	>
		<Container slot="error" let:error>
			Error loading messages. Please try again.
			<pre><code>{error}</code></pre>
		</Container>
		<Container slot="empty">No messages here. Check back later!</Container>
	</PostList>
</div>

<style>
	.messages {
		height: 100%;
	}
</style>
