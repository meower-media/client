<script>
	import Modal from "../Modal.svelte";

	import SignupModal from "./Signup.svelte";

	import {user} from "../stores.js";
	import * as clm from "../clmanager.js";
	import * as modals from "../modals.js";
	import * as BGM from "../BGM.js";

	import {focus} from "@roxi/routify";

	let username, password, loading, error;
</script>

<Modal on:close={modals.closeLastModal}>
	<h2 slot="header">Login to Meower</h2>
	<div slot="default">
		<form
			on:change={() => (error = "")}
			on:submit|preventDefault={async () => {
				if (!username || !password) {
					error = "You must specify a username and password!";
					return;
				}

				loading = true;
				try {
					await clm.meowerRequest({
						cmd: "direct",
						val: {
							cmd: "authpswd",
							val: {
								username: username,
								pswd: password,
							},
						},
					});
				} catch (e) {
					loading = false;
					switch (e) {
						case "E:103 | ID not found":
							error = "Invalid username!";
							break;
						case "E:025 | Deleted":
							error = "This account has been deleted!";
							break;
						case "I:011 | Invalid Password":
							error = "Invalid password!";
							break;
						case "E:018 | Account Banned":
							break;
						case "E:019 | Illegal characters detected":
							error =
								"Usernames must not have spaces or other special characters!";
							break;
						case "E:106 | Too many requests":
							error =
								"Too many requests! Please try again later.";
							break;
						default:
							error = `Unexpected ${e} error!`;
					}
					return;
				}

				BGM.playBGM($user.bgm_song);
				modals.closeLastModal();
			}}
		>
			<label for="username" style={error ? "color: crimson;" : ""}>
				<b>Username</b>{#if error}<i> - {error}</i>{/if}
			</label>
			<input
				id="username"
				type="text"
				class="modal-input white"
				placeholder="Username..."
				maxlength="20"
				disabled={loading}
				bind:value={username}
				use:focus
			/>
			<br /><br />
			<label for="password" style={error ? "color: crimson;" : ""}>
				<b>Password</b>{#if error}<i> - {error}</i>{/if}
			</label>
			<input
				id="password"
				type="password"
				class="modal-input white"
				placeholder="Password..."
				maxlength="255"
				disabled={loading}
				bind:value={password}
			/>
			<br /><br /><br />
			<div class="modal-buttons">
				<a
					href="/"
					on:click|preventDefault={() => {
						if (!loading) modals.replaceLastModal(SignupModal);
					}}>Join Meower</a
				>
				<button type="submit" disabled={loading}>Login</button>
			</div>
		</form>
	</div>
</Modal>
