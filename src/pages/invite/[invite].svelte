<script>
	import {authHeader, chats, user} from "./../../lib/stores.js";
	import {apiUrl} from "../../lib/urls";
	import {params, goto} from "@roxi/routify";
	import {onMount} from "svelte";
	import Container from "../../lib/Container.svelte";
	import Spinner from "../../lib/Spinner.svelte";
	import { writable } from "svelte/store";

    let ok = writable(true);
	onMount(() => {
		(async () => {
			let response = await fetch(
				`${apiUrl}chats/join/${$params.invite}`,
				{
					method: "GET",
					headers: {
						...$authHeader,
					},
				}
			);

			if (response.status === 404) {
				$goto("/404");
			} else if (!response.ok) {
                $goto("/500");
            }

            let data = await response.json();

            // Cursed code because the server does not seem to want to send a packet
            let chat = $chats.findLast(
                chat => chat._id === data.chat
            )

            if (chat.members.indexOf($user.name) === -1) chat.members.push($user.name);

			$goto(`/chats/${data.chat}`);
		})();
	});
</script>

<Container>
    <h1>Joining Invite...</h1>

    {#if $ok}
        <Spinner />
    {:else}
        <h1>Invalid Invite</h1>

        Or you could have been banned.
    {/if}
</Container>