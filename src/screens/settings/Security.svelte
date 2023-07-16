<script>
	import {modalShown, modalPage} from "../../lib/stores.js";
	import Container from "../../lib/Container.svelte";
</script>

<Container>
	<div class="settings-controls">
		<button
			class="circle settings"
			on:click={() => {
				$modalPage = "changePassword";
				$modalShown = true;
			}}
		/>
	</div>

	<h2>Change Password</h2>
	Change your account password.
</Container>

<Container>
	<h2>Multi-factor Authentication</h2>
	<Container>
		<div class="settings-controls">
			<button
				class="circle close"
				on:click={() => {
					$modalPage = "changePassword";
					$modalShown = true;
				}}
			/>
		</div>

		<h2>My Phone</h2>
		<i>Authenticator app</i>
	</Container>
</Container>

<Container>
	<div class="settings-controls">
		<button
			class="circle settings"
			on:click={() => {
				$modalPage = "changePassword";
				$modalShown = true;
			}}
		/>
	</div>

	<h2>Export data</h2>
	Export all data associated with your account.
</Container>
<Container>
	<div class="settings-controls">
		<button
			class="circle settings"
			on:click={() => {
				$modalPage = "changePassword";
				$modalShown = true;
			}}
		/>
	</div>

	<h2>Delete account</h2>
	Delete your account and all of its data.
</Container>
