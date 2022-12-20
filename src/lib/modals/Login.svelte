<script>
	import Modal from "../Modal.svelte";
	import Loading from "../Loading.svelte";

	import {modalShown, modalPage, authHeader, user} from "../stores.js";

	import * as clm from "../clmanager.js";

	let loading = false;
	let loginStatus = "";
	let username = "";
	let password = "";
	let rememberMe = false;

	function doLogin() {
		try {
			loading = true;
			clm.meowerRequest({
				cmd: "direct",
				val: {
					cmd: "authpswd",
					val: {
						username: username,
						pswd: password,
					},
				},
			})
				.then(async val => {
					try {
						const profileVal = await clm.meowerRequest({
							cmd: "direct",
							val: {
								cmd: "get_profile",
								val: val.payload.username,
							},
						});

						modalShown.set(false);

						user.update(v =>
							Object.assign(v, {
								...profileVal.payload,
								name: val.payload.username,
							})
						);
						authHeader.set({
							username: val.payload.username,
							token: val.payload.token,
						});

						if (rememberMe) {
							localStorage.setItem(
								"meower_savedusername",
								username
							);
							localStorage.setItem(
								"meower_savedpassword",
								val.payload.token
							);
						}
					} catch (e) {
						loading = false;
						loginStatus =
							"Unexpected " + e + " error getting user data!";
					}
				})
				.catch(code => {
					loading = false;
					switch (code) {
						case "E:103 | ID not found":
							loginStatus = "Invalid username!";
							break;
						case "I:011 | Invalid Password":
							loginStatus = "Invalid password!";
							break;
						case "E:018 | Account Banned":
							modalPage.set("banned");
							break;
						case "E:107 | Packet too large":
							loginStatus =
								"The username and/or password is too long!";
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
		$modalShown = false;
	}}
>
	<h2 slot="header">Login to Meower</h2>
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
							"You must specify a username and a password to login!";
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
					maxlength="64"
					value={password}
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
