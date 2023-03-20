<!--
	Home but it's the inbox.
-->
<script>
	import Container from "../lib/Container.svelte";
	import PostList from "../lib/PostList.svelte";
</script>

<div class="messages">
	<Container>
		<h1>Inbox Messages</h1>
		Here are your latest inbox messages. We will send announcements and moderator
		messages to here!
	</Container>
	<PostList fetchUrl={"inbox"} postOrigin={null} canPost={false}>
		<Container slot="error" let:error>
			Error loading messages. Please try again.
			<pre><code>{error}</code></pre>
		</Container>
		<Container slot="empty">No messages here... somehow.</Container>
	</PostList>
</div>

<style>
	.messages {
		height: 100%;
	}
</style>
