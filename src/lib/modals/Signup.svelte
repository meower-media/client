<script>
	import Modal from "../Modal.svelte";

	import LoginModal from "./Login.svelte";
	import AccountCreationBlockedModal from "./moderation/AccountCreationBlocked.svelte";

	import {OOBERunning, user} from "../stores.js";
	import * as clm from "../clmanager.js";
	import * as modals from "../modals.js";

	let username, password, loading, error;
</script>

<Modal on:close={modals.closeLastModal}>
	<h2 slot="header">Join Meower</h2>
	<div slot="default">
		<form
			on:change={() => (error = "")}
			on:submit|preventDefault={async () => {
				loading = true;
				clm.meowerRequest({
					cmd: "direct",
					val: {
						cmd: "gen_account",
						val: {
							username: username,
							pswd: password,
						},
					},
				})
					.then(async val => {
						user.update(v =>
							Object.assign(v, {
								name: val.payload.username,
								unread_inbox: true,
								layout: "new",
							})
						);
						OOBERunning.set(true);
						modals.closeLastModal();
					})
					.catch(code => {
						loading = false;
						switch (code) {
							case "I:015 | Account exists":
								error = `${username} is taken!`;
								break;
							case "E:119 | IP Blocked":
								modals.showModal(AccountCreationBlockedModal);
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
								error = `Unexpected ${code} error!`;
						}
						return;
					});
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
				minlength="1"
				maxlength="20"
				disabled={loading}
				autofocus
				bind:value={username}
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
				minlength="8"
				maxlength="255"
				disabled={loading}
				bind:value={password}
			/>
			<br /><br /><br />
			<div class="modal-buttons">
				<a
					href="/"
					on:click|preventDefault={() => {
						if (!loading) modals.replaceLastModal(LoginModal);
					}}>Login to Meower</a
				>
				<button type="submit" disabled={loading}>Join</button>
			</div>
		</form>
	</div>
</Modal>
