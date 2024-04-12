<script>
	export let data;

	// Upon login set the user and stuff and go to home

	let c = data.isclient
</script>

<svelte:head>
	<title>Meower - Login</title>
	<meta name="description" content="A social media platform" />
</svelte:head>

{#if c}
	<div class='login'>
		<h1>NOT meo</h1>
		<form>
			<input type='text' placeholder='Username' class='login-input text'>
			<input type='password' placeholder='Password' class='login-input text'>
			<button class='login-input text'>Log in</button>
		</form>
		<small>Meo orginally by eri</small> 
		<small>NOT meo 1.0</small>
	</div>
{:else}
	Loading Page...
{/if}

<style>
	.login {
		display: flex;
		flex-direction: column;
		margin-left: auto;
		margin-right: auto;
		max-width: 500px;
	}

	.login-input {
		padding: 1em;
		margin-bottom: .2cm;
	}
</style>