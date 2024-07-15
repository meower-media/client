<script>
	import Container from "../Container.svelte";
	import ProfileView from "../ProfileView.svelte";
	import {relationships} from "../stores.js";

	let blockedUsers = [];

	relationships.subscribe(_relationships => {
		blockedUsers = [];
		for (let [username, state] of Object.entries(_relationships)) {
			if (state == 2) blockedUsers.push(username);
		}
	});
</script>

<Container>
	<h1>Blocked Users</h1>
	Here are the users you have blocked. You can unblock them at anytime. While blocked,
	they won't be able to direct message you, add you to group chats, and you may
	not be able to view their posts depending on your privacy settings.
</Container>

{#if blockedUsers.length === 0}
	<Container>Looks like you haven't blocked anyone yet.</Container>
{:else}
	{#each blockedUsers as username}
		<ProfileView {username} small={true} canClick={true} canBlock={true} />
	{/each}
{/if}
