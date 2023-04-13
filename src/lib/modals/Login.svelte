<script>
	import Modal from "../Modal.svelte";
	import Loading from "../Loading.svelte";

	import {modalShown, modalPage, authHeader, user} from "../stores.js";

	import * as clm from "../clmanager.js";
	import * as api from "../api.js";

	let loginStatus = "";
	let rememberMe = false;
	let loginState = "";
	let mfaTicket = "";

	function doLogin(accessToken) {
		console.log("");
	}
</script>

<Modal
	on:close={() => {
		$modalShown = false;
	}}
>
	<h2 slot="header">Login to Meower</h2>
	<div slot="default">
		{#if loginState === "loading"}
			<div class="fullcenter">
				<Loading />
			</div>
		{:else if loginState === "totp"}
			<form
				on:submit|preventDefault={e => {
					if (!e.target[0].value) {
						loginStatus =
							"You must specify a username and a password to login!";
						return;
					}
					api.makeRequest('auth/totp', 'POST', {
						ticket: mfaTicket,
						code: e.target[0].value
					}, false)
						.then(async resp => doLogin(resp.access_token))
				}}
			>
				{#if loginStatus}
					<span class="login-status">{loginStatus}</span><br />
				{/if}
				<input
					type="text"
					class="modal-input white"
					placeholder="Authenticator code"
					maxlength="6"
					autofocus
				/><br /><br />
				<div class="modal-buttons">
					<a
						href="/"
						on:click|preventDefault={() => {
							loginState = "";
						}}>Cancel</a
					>
					<button type="submit">Login</button>
				</div>
			</form>
		{:else}
			<form
				on:submit|preventDefault={e => {
					if (!(e.target[0].value && e.target[1].value)) {
						loginStatus =
							"You must specify a username and a password to login!";
						return;
					}
					loginState = "loading";
					api.makeRequest('auth/password', 'POST', {
						username: e.target[0].value,
						password: e.target[1].value
					}, false)
						.then(async resp => {
							if (resp.mfa_required) {
								mfaTicket = resp.mfa_ticket;
								if (resp.mfa_methods.length > 1) {
									loginState = "mfaMethods";
								} else {
									switch (resp.mfa_methods[0]) {
										case "email":
											loginState = "emailMFA";
											break;
										case "totp":
											loginState = "totp";
											break;
										case "recovery_codes":
											loginState = "recovery_codes";
											break;
									}
								}
								return;
							}
						})
						.catch(async resp => loginState = "")
				}}
			>
				{#if loginStatus}
					<span class="login-status">{loginStatus}</span><br />
				{/if}
				<input
					type="text"
					class="modal-input white"
					placeholder="Username/Email"
					maxlength="255"
					autofocus
				/><br /><br />
				<input
					type="password"
					class="modal-input white"
					placeholder="Password"
					maxlength="255"
				/><br />
				<p class="checkboxes">
					<input
						id="remember-me"
						type="checkbox"
						bind:checked={rememberMe}
					/>
					<label for="remember-me"> Remember me </label>
				</p>
				<br />
				<div class="modal-buttons">
					<a
						href="/"
						on:click|preventDefault={() => {
							modalPage.set("signup");
						}}>Join Meower</a
					>
					<button type="submit">Login</button>
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
