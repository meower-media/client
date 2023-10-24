<script>
	import Modal from "../../Modal.svelte";
	import Container from "../../Container.svelte";

	import {authHeader, chats} from "../../stores.js";
	import {apiUrl} from "../../urls.js";
	import * as modals from "../../modals.js";

	export let modalData;

	let {username} = modalData;

	let loading = {},
		errors = {};
</script>

<Modal showClose={true} on:close={modals.closeLastModal}>
	<h2 slot="header">Add Member</h2>
	<div slot="default">
		{#each $chats.filter(_chat => _chat.type === 0) as chat (chat._id)}
			<Container>
				<div class="settings-controls">
					{#if !chat.members.includes(username)}
						<button
							class="circle add"
							disabled={loading[chat._id] ||
								chat.members.length >= 256}
							on:click={async () => {
								errors[chat._id] = "";
								loading[chat._id] = true;
								try {
									const resp = await fetch(
										`${apiUrl}chats/${chat._id}/members/${username}`,
										{
											method: "PUT",
											headers: $authHeader,
										}
									);
									if (!resp.ok) {
										switch (resp.status) {
											case 403:
												throw new Error(
													`Someone's privacy settings are preventing you from adding ${username} to ${chat.nickname}.`
												);
											case 429:
												throw new Error(
													"Too many requests! Try again later."
												);
											default:
												throw new Error(
													"Response code is not OK; code is " +
														resp.status
												);
										}
									}
								} catch (e) {
									loading[chat._id] = false;
									errors[chat._id] = e;
								}
							}}
						/>
					{/if}
				</div>

				<h1>{chat.nickname}</h1>
				Members: {chat.members.length > 5
					? chat.members.slice(0, 4).join(", ") + "..."
					: chat.members.join(", ")}

				{#if errors[chat._id]}
					<p style="color: crimson;">{errors[chat._id]}</p>
				{/if}
			</Container>
		{/each}
	</div>
</Modal>
