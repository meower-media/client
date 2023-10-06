<script>
	import Modal from "../Modal.svelte";
	import Container from "../Container.svelte";

	import * as modals from "../modals.js";
	import * as clm from "../clmanager.js";

	import {user} from "../stores.js";

	import {goto} from "@roxi/routify";

	let username, password, loading, error;
</script>

<Modal
	on:close={modals.closeLastModal}
>
	<h2 slot="header">Delete Account</h2>
	<div slot="default">
		<form
			on:change={() => error = ""}
			on:submit|preventDefault={async () => {
				// set loading state
				loading = true;

				// check username
				if (username !== $user.name) {
					error = "Invalid username!";
					loading = false;
					return;
				}

				// request account deletion
				try {
					await clm.meowerRequest({
						cmd: "direct",
						val: {
							cmd: "del_account",
							val: password,
						},
					});
				} catch (code) {
					loading = false;
					switch (code) {
						case "I:011 | Invalid Password":
							error = "Invalid password!";
							break;
						case "E:106 | Too many requests":
							error = "Too many requests! Please try again later.";
							break;
						default:
							error = "Unexpected " + code + " error!";
					}
					return;
				}

				$goto("/logout");
			}}
		>
			<Container warning={true}>
				<b>WARNING!</b><br />
				Deleting your account will erase all of your data from our
				database, <b>this action is irreversible</b>! Are you absolutely sure
				you would like to <b>permanently</b> delete your account?
				<br /><br />
				Type your username and password to confirm this action.
			</Container>
			<label
				for="username"
				style={error ? "color: crimson;" : ""}
			>
				<b>Username</b>{#if error}<i> - {error}</i>{/if}
			</label>
			<input
				id="username"
				type="text"
				class="modal-input white"
				placeholder="Username..."
				disabled={loading}
				bind:value={username}
			/>
			<br /><br />
			<label for="password" style={error ? "color: crimson;" : ""}><b>Password</b>{#if error}<i> - {error}</i>{/if}</label>
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
					disabled={!username || !password || loading}
					>Delete Account</button
				>
			</div>
		</form>
	</div>
</Modal>
