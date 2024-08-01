<script>
	import Modal from "../../Modal.svelte";
	import Container from "../../Container.svelte";

	import * as modals from "../../modals.js";
	import { apiUrl } from "../../urls.js";
	import { authHeader } from "../../stores.js";

	import {user} from "../../stores.js";

	import {goto, focus} from "@roxi/routify";

	let username, password, loading, error;
</script>

<Modal on:close={modals.closeLastModal}>
	<h2 slot="header">Delete Account</h2>
	<div slot="default">
		<form
			on:change={() => (error = "")}
			on:submit|preventDefault={async () => {
				// check username
				if (username !== $user.name) {
					error = "Invalid username!";
					return;
				}

				// request account deletion
				loading = true;
				try {
					const resp = await fetch(
						`${apiUrl}me`,
						{
							method: "DELETE",
							headers: { 'Content-Type': 'application/json', ...$authHeader },
							body: JSON.stringify({ password }),
						}
					);
					if (!resp.ok) {
						throw new Error(
							"Response code is not OK; code is " + resp.status
						);
					}
					$goto("/logout");	
				} catch (e) {
					loading = false;
					error = e;
				}
			}}
		>
			<Container warning={true}>
				Are you sure you would like to <b>permanently</b> delete your
				account?
				<br /><br />
				Once you confirm this action, your account and all related data will
				be deleted after 7 days. If you change your mind and wish to keep
				your account, you may log back in within 7 days to cancel the deletion
				of your account.
			</Container>
			<label for="username" style={error ? "color: crimson;" : ""}>
				<b>Username</b>{#if error}<i> - {error}</i>{/if}
			</label>
			<input
				id="username"
				type="text"
				class="modal-input white"
				placeholder="Username..."
				disabled={loading}
				bind:value={username}
				use:focus
			/>
			<br /><br />
			<label for="password" style={error ? "color: crimson;" : ""}
				><b>Password</b>{#if error}<i> - {error}</i>{/if}</label
			>
			<input
				id="password"
				type="password"
				class="modal-input white"
				placeholder="Password..."
				disabled={loading}
				bind:value={password}
			/>
			<br /><br />
			<div class="modal-buttons">
				<button
					type="button"
					disabled={loading}
					on:click={modals.closeLastModal}>Cancel</button
				>
				<button
					type="submit"
					disabled={!username || !password || loading}>Confirm</button
				>
			</div>
		</form>
	</div>
</Modal>
