<!--
	The Meower*-style loading animaion, as opposed to YOU SPIN ME RIGHT ROUND-
	*from Beta 4 and before, Beta 5 dropped this in favor of Meowy.
-->

<span class="loading"
	><span class="circle circle1" /><span class="circle circle2" /><span
		class="circle circle3"
	/></span
>

<style>
	.loading {
		display: inline-block;
		min-height: 4em;
		margin: 0;
		padding: 0;
	}
	.circle {
		width: 2em;
		height: 2em;
		border-radius: 100%;

		display: inline-block;
		background: var(--orange-button);
		margin-right: 1em;

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

	@keyframes jump {
		from {
			transform: translateY(0);
		}
		to {
			transform: translateY(2em);
		}
	}
</style>
