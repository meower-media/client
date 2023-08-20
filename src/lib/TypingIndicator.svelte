<!--
	Shows you who's typing.
-->
<script>
	import Container from "../lib/Container.svelte";
	import {user} from "../lib/stores.js";
	import {typing} from "../lib/typingIndicator.js";

	export let forPage = "home";

	let _typing = [];
	typing.subscribe(val => {
		_typing = val[forPage];
		if (_typing === undefined) _typing = [];
		_typing = _typing.filter(selectedUser => selectedUser !== $user.name);
	});
</script>

{#if _typing.length > 0}
	<Container>
		<span class="loading">
			<span class="circle circle1" />
			<span class="circle circle2" />
			<span class="circle circle3" />
			{#if _typing.length === 1}
				<span class="text"><b>{_typing[0]}</b> is typing...</span>
			{:else if _typing.length === 2}
				<span class="text"
					><b>{_typing[0]}</b> and <b>{_typing[1]}</b> are typing...</span
				>
			{:else if _typing.length >= 3}
				<span class="text">3 or more people are typing...</span>
			{/if}
		</span>
	</Container>
{/if}

<style>
	.loading {
		align-items: center;
		display: flex;
		height: 20px;
	}
	.circle {
		width: 10px;
		height: 10px;
		border-radius: 100%;

		display: inline-block;
		background: var(--orange-button);
		margin-right: 4px;

		animation: jump 0.5s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95)
			alternate;
	}

	.circle1 {
		animation-delay: 0s;
	}
	.circle2 {
		animation-delay: -0.166s;
	}
	.circle3 {
		animation-delay: -0.333s;
	}

	.text {
		margin-left: 6px;
	}

	@keyframes jump {
		from {
			transform: translateY(0);
		}
		to {
			transform: translateY(-5px);
		}
	}
</style>
