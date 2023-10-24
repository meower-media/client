<script>
	import Modal from "../Modal.svelte";

	import LoginModal from "./Login.svelte";
	import BasicModal from "./Basic.svelte";
	import AccountCreationBlockedModal from "./safety/AccountCreationBlocked.svelte";

	import {OOBERunning, user} from "../stores.js";
	import * as clm from "../clmanager.js";
	import * as modals from "../modals.js";

	import {focus} from "@roxi/routify";

	let username, password, confirmPassword, acceptTerms, loading, error;
</script>

<Modal on:close={modals.closeLastModal}>
	<h2 slot="header">Join Meower</h2>
	<div slot="default">
		<form
			on:change={() => (error = "")}
			on:submit|preventDefault={async () => {
				if (!username || !password) {
					error = "You must specify a username and password!";
					return;
				}
				if (password !== confirmPassword) {
					error =
						"Passwords do not match! Make sure you have entered your password correctly.";
					return;
				}

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
							case "E:019 | Illegal characters detected":
								error =
									"Usernames must not have spaces or other special characters!";
								break;
							case "E:106 | Too many requests":
								error =
									"Too many requests! Please try again later.";
								break;
							case "E:119 | IP Blocked":
								modals.showModal(AccountCreationBlockedModal);
								break;
							case "E:122 | Command disabled by sysadmin":
								modals.showModal(BasicModal, {
									title: "Registration Disabled",
									desc: "Unfortunately, you may not create a new account at this time. An administrator has disabled registration. Please try again later.",
								});
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
				minlength="8"
				maxlength="255"
				disabled={loading}
				bind:value={password}
			/>
			<br /><br />
			<label
				for="confirm-password"
				style={error ? "color: crimson;" : ""}
			>
				<b>Confirm Password</b>{#if error}<i> - {error}</i>{/if}
			</label>
			<input
				id="confirm-password"
				type="password"
				class="modal-input white"
				placeholder="Confirm password..."
				maxlength="255"
				autocomplete="new-password"
				disabled={loading}
				bind:value={confirmPassword}
			/><br />
			<p class="checkboxes">
				<input
					id="accept-terms"
					type="checkbox"
					bind:checked={acceptTerms}
				/>
				<label for="accept-terms">
					I agree to <a
						href="https://meower.org/legal"
						target="_blank"
						rel="noreferrer"
						>Meower's Terms of Service and Privacy Policy</a
					>
				</label>
			</p>

			<br />

			<div class="modal-buttons">
				<a
					href="/"
					on:click|preventDefault={() => {
						if (!loading) modals.replaceLastModal(LoginModal);
					}}>Login to Meower</a
				>
				<button type="submit" disabled={!acceptTerms || loading}
					>Join</button
				>
			</div>
		</form>
	</div>
</Modal>

<style>
	label,
	.checkboxes input {
		vertical-align: middle;
	}

	.checkboxes {
		text-align: left;
		font-size: 90%;
	}
</style>
