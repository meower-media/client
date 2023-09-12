<script>
	import Modal from "../Modal.svelte";
	import Container from "../Container.svelte";
	import FormattedDate from "../FormattedDate.svelte";

	import {user} from "../stores.js";

	import * as modals from "../modals.js";

	let banType = "";
	let banTypeIon = "";
	if (["TempRestriction", "PermRestriction"].includes($user.ban.state)) {
		banType = "restricted";
		banTypeIon = "restriction";
	} else if (["TempSuspension", "PermSuspension"].includes($user.ban.state)) {
		banType = "suspended";
		banTypeIon = "suspension";
	} else if (["TempBan", "PermBan"].includes($user.ban.state)) {
		banType = "banned";
		banTypeIon = "ban";
	}
</script>

<Modal
	on:close={() => {
		modals.closeModal();
	}}
>
	<h2 slot="header">Account {banType}</h2>

	<div slot="default">
		<p>
			Your account has been {$user.ban.state.includes("Temp")
				? "temporarily"
				: "permanently"}
			{banType} for the following reason:
			<Container>
				<span style="white-space: pre-wrap;">
					{$user.ban.reason}
				</span>
			</Container>
		</p>

		{#if banType === "restricted"}
			<p>
				While your account is restricted you will not be able to create
				new chats or add members to chats.
			</p>
		{:else if banType === "suspended"}
			<p>
				While your account is suspended you will not be able to create
				new posts, create new chats, or add members to chats.
			</p>
		{/if}

		{#if $user.ban.state.includes("Temp")}
			<p>
				This {banTypeIon} will expire after <FormattedDate
					date={$user.ban.expires}
				/>.
			</p>
		{:else}
			<p>
				If you would like to appeal this {banTypeIon}, please email
				<a
					href="mailto:support@meower.org"
					target="_blank"
					rel="noreferrer">support@meower.org</a
				>.
			</p>
		{/if}

		<p>
			<i
				>Please note that attempting to evade this {banTypeIon} is prohibited
				and can lead to more severe punishments.</i
			>
		</p>

		<br />

		<div class="modal-buttons">
			<a href="https://meower.org/legal" target="_blank" rel="noreferrer"
				>Terms of Service</a
			>
			<button
				on:click={() => {
					modals.closeModal();
				}}>Close</button
			>
		</div>
	</div>
</Modal>
