<script>
	import Modal from "../Modal.svelte";
	import LoginModal from "./Login.svelte";

	import {authHeader, user} from "../stores.js";
	import * as clm from "../clmanager.js";
	import * as modals from "../modals.js";
	import * as BGM from "../BGM.js";

	import {focus} from "@roxi/routify";
	import '@hcaptcha/vanilla-hcaptcha'	
	import {apiUrl} from "../urls";
	import { writable } from "svelte/store";
	import sleep from "../sleep";

	let username, password, confirmPassword, acceptTerms, captcha, loading, error;

	let captcha_enabled = writable(false);
	let captcha_sitekey = writable("");

	(async () => {
		const resp = await fetch(`${apiUrl}`);
		const data = await resp.json();
		if (data.error) {
			console.error("Failed to fetch captcha status!");
			return;
		} else {
			captcha_enabled.set(data.captcha.enabled);
			captcha_sitekey.set(data.captcha.sitekey);
		}

		if ($captcha_enabled) {
			await sleep(500)
			
			const element = document.getElementById("captcha");
			
			element.addEventListener("verified", (e) => {
				console.log("hCaptcha event:", e);
				// @ts-ignore
				captcha = e.token;
			});

			element.addEventListener("error", (e) => {
				console.error("hCaptcha error:", e);
				error = e.error.message;
			})
		}
	})();

	async function handle_signup() {
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

		const resp = await fetch(`${apiUrl}auth/register`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username,
				password,
				captcha,
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
					error = "Too many requests! Please try again later.";
					break;
				default:
					error = "Unexpected " + data.type + " error!";
			}
		}
	}
</script>

<Modal on:close={modals.closeLastModal}>
	<h2 slot="header">Join Meower</h2>
	<div slot="default">
		<form
			on:change={() => (error = "")}
			on:submit|preventDefault={handle_signup}
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

			{#if $captcha_enabled}
				<p><b>Captcha</b></p>
				<h-captcha id="captcha" site-key={$captcha_sitekey} theme="dark"></h-captcha>
				<br />
			{/if}
			
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
