<script>
	import Modal from "../Modal.svelte";

	import {
		mainPage as page,
		profileClicked
	} from "../stores.js";
    import PagedList from "../PagedList.svelte";
	import Container from "../Container.svelte";
	import * as Modals from "../modals.js";

    import {fly} from "svelte/transition";
	import {flip} from "svelte/animate";

    let items;

	import * as clm from "../clmanager.js";

	/**
	 * Loads a page.
	 * @param {number} page
	 * @returns {Promise<{
	 * 	numPages: number,
	 * 	result: *
	 * }>}
	 */
     async function loadPage(page) {
		if (page !== undefined) {
			let ev, result, numPages;

			try {
				ev = clm.link.on("direct", cmd => {
					if (cmd.val.mode === "chats") {
						result = cmd.val.payload.all_chats;
						numPages = cmd.val.payload.pages;
					}
				});
				await clm.meowerRequest({
					cmd: "direct",
					val: {
						cmd: "get_chat_list",
						val: {
							page: page,
						},
					},
				});
				if (!result || numPages === undefined)
					throw "This message should not appear";
				result = result.filter(chat => !chat.members.includes($profileClicked));
				return {result, numPages};
			} finally {
				if (ev) clm.link.off(ev);
			}
		}
		return {
			numPages: 1,
			result: [],
		};
	}
</script>

<Modal
	on:close={() => {
		Modals.CloseModal()
	}}
>
	<h2 slot="header">Add Member</h2>
	<div slot="default">
		<PagedList bind:items {loadPage}>
			<svelte:fragment slot="loaded" let:items>
				{#each items as chat (chat._id)}
					<div
						transition:fly|local={{y: -50, duration: 250}}
						animate:flip={{duration: 250}}
					>
						<Container>
							<div class="settings-controls">
								<button
									class="circle add"
									on:click={() => {
										clm.meowerRequest({
											cmd: "direct",
											val: {
												cmd: "add_to_chat",
												val: {chatid: chat._id, username: $profileClicked},
											},
										});
										Modals.CloseModal()
									}}
								/>
							</div>
	
							<h1>{chat.nickname}</h1>
							Members: {chat.members.length > 5
								? chat.members.slice(0, 4).join(", ") + "..."
								: chat.members.join(", ")}
						</Container>
					</div>
				{/each}
            </svelte:fragment>
            <Container slot="error" let:error>
                Error loading chats. Please try again.
                <pre><code>{error}</code></pre>
            </Container>
        </PagedList>
	</div>
</Modal>
