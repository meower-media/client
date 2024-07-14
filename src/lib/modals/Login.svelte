<script>
	import Modal from "../Modal.svelte";

	import SignupModal from "./Signup.svelte";

	import {authHeader, user} from "../stores.js";
	import * as clm from "../clmanager.js";
	import * as modals from "../modals.js";
	import * as BGM from "../BGM.js";

	import {focus} from "@roxi/routify";
	import {apiUrl} from "../urls";

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

				const resp = await fetch(`${apiUrl}auth/login`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						username: username,
						password: password,
					}),
				});

				let data;

				try {
					data = await resp.json();
				} catch (e) {
					loading = false;
					error = "Invalid response!";
					return;
				}

				if (!data.error) {
					authHeader.set({
						username,
						token: data.token,
					});

					await clm.login();

					BGM.playBGM($user.bgm_song);
					modals.closeLastModal();
				} else {
					loading = false;
					switch (data.type) {
						case "invalidCredentials":
							error = "Invalid password!";
							break;
						case "tooManyRequests":
							error =
								"Too many requests! Please try again later.";
							break;
						default:
							error = "Unexpected " + data.type + " error!";
					}
				}
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
