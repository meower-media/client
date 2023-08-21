<script>
	import Modal from "../Modal.svelte";
	import Loading from "../Loading.svelte";

	import {OOBERunning, user} from "../stores.js";

	import * as modals from "../modals.js";

	import * as clm from "../clmanager.js";

	let loading = false;
	let loginStatus = "";
	let username = "";
	let password = "";
	let acceptTerms = false;

	function doLogin() {
		try {
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
							layout: "new",
						})
					);
					loginStatus = "";
					OOBERunning.set(true);
					modals.closeModal();
				})
				.catch(code => {
					loading = false;
					switch (code) {
						case "I:015 | Account exists":
							loginStatus = "That username already exists!";
							break;
						case "E:119 | IP Blocked":
							modals.showModal("accountCreationBlocked");
							break;
						case "E:019 | Illegal characters detected":
							loginStatus =
								"Usernames must not have spaces or other special characters!";
							break;
						case "E:106 | Too many requests":
							loginStatus =
								"Too many requests! Please try again later.";
							break;
						default:
							loginStatus = `Unexpected ${code} error!`;
					}
				});
		} catch (e) {
			console.log(e);
			loading = false;
			loginStatus = "Error logging in: " + e;
		}
	}
</script>

<Modal
	on:close={() => {
		modals.closeModal();
	}}
>
	<h2 slot="header">Join Meower</h2>
	<div slot="default">
		{#if loading}
			<div class="fullcenter">
				<Loading />
			</div>
		{:else}
			<form
				on:submit|preventDefault={e => {
					if (!(e.target[0].value && e.target[1].value)) {
						loginStatus =
							"You must specify a username and a password to create an account!";
						return false;
					}
					username = e.target[0].value;
					password = e.target[1].value;
					doLogin();
					return false;
				}}
			>
				{#if loginStatus}
					<span class="login-status">{loginStatus}</span><br />
				{/if}
				<input
					type="text"
					class="modal-input white"
					placeholder="Username"
					maxlength="20"
					value={username}
					autofocus
				/><br /><br />
				<input
					type="password"
					class="modal-input white"
					placeholder="Password"
					minlength="8"
					maxlength="255"
					value={password}
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
							modals.showModal("login");
						}}>Login to Meower</a
					>
					<button type="submit" disabled={!acceptTerms}
						>Create Account</button
					>
				</div>
			</form>
		{/if}
	</div>
</Modal>

<style>
	.fullcenter {
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		top: 0;
		left: 0;
	}
	.login-status {
		color: red;
		font-size: 105%;
		display: inline-block;
		height: 0;
		overflow: visible;
	}
	label,
	.checkboxes input {
		vertical-align: middle;
	}
	.checkboxes {
		text-align: left;
		font-size: 95%;
	}
</style>
