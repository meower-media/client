<script>
	import Modal from "../../Modal.svelte";
	import Container from "../../Container.svelte";
	import FormattedDate from "../../FormattedDate.svelte";

	import * as modals from "../../modals.js";

	export let modalData;

	let {ban, feature} = modalData;
	let banType;

	$: {
		if (["temp_restriction", "perm_restriction"].includes(ban.state)) {
			banType = "restriction";
		} else if (["temp_ban", "perm_ban"].includes(ban.state)) {
			banType = "ban";
		} else {
			modals.closeLastModal();
		}
	}
</script>

<Modal on:close={modals.closeLastModal}>
	<h2 slot="header">
		Account
		{#if ban.state.includes("restriction")}
			Restricted
		{:else if ban.state.includes("ban")}
			Banned
		{/if}
	</h2>

	<div slot="default">
		<p>
			Your account has been
			{#if ban.state.includes("temp")}
				temporarily
			{:else}
				permanently
			{/if}
			{#if ban.state.includes("restriction")}
				restricted from {feature}
			{:else if ban.state.includes("ban")}
				banned
			{/if}
			{#if ban.reason}
				for the following reason:
				<Container>
					<span style="white-space: pre-wrap;">
						{ban.reason}
					</span>
				</Container>
			{:else}
				due to Terms of Service violations.
			{/if}
		</p>

		{#if ban.state.includes("temp")}
			<p>
				This {banType} will expire after <FormattedDate
					date={ban.expires}
				/>.
			</p>
		{:else}
			<p>
				If you would like to appeal this {banType}, please email
				<a
					href="mailto:support@meower.org"
					target="_blank"
					rel="noreferrer">support@meower.org</a
				>.
			</p>
		{/if}

		<p>
			<i
				>Please note that attempting to evade this {banType} is prohibited
				and can lead to more severe punishments.</i
			>
		</p>

		<br />

		<div class="modal-buttons">
			<a href="https://meower.org/legal" target="_blank" rel="noreferrer"
				>Terms of Service</a
			>
			<button on:click={modals.closeLastModal}>Close</button>
		</div>
	</div>
</Modal>
