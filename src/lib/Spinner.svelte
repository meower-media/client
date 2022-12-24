<!-- You spin me right round baby right round... -->

<div class="spinner check" />

<style>
	.spinner {
		display: inline-block;

		width: 1.5em;
		height: 1.5em;
		border: solid 0.25em var(--orange);
		border-right-color: transparent;

		filter: drop-shadow(-1px -1px 0 var(--foreground))
			drop-shadow(1px -1px 0 var(--foreground))
			drop-shadow(-1px 1px 0 var(--foreground))
			drop-shadow(1px 1px 0 var(--foreground))
			drop-shadow(0px -1px 0 var(--foreground))
			drop-shadow(0px 1px 0 var(--foreground))
			drop-shadow(-1px 0px 0 var(--foreground))
			drop-shadow(1px 0px 0 var(--foreground));

		border-radius: 50%;

		animation: spin 1s infinite linear;
	}

	@keyframes spin {
		from {
			transform: rotate(0turn);
		}
		to {
			transform: rotate(1turn);
		}
	}
</style>
