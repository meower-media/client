<script>
	import {mainPage as page, profileClicked, searchQuery, searchType} from "../lib/stores.js";
	import {apiUrl} from "../lib/urls.js";
	import Loading from "../lib/Loading.svelte";
	import Container from "../lib/Container.svelte";

	let errors = "";
</script>

<div class="Search">
	<Container>
		<h1>Search</h1>
		<i>meower search, statistics and more</i>
	</Container>
	<Container>
		<h1>Search Home</h1>
		<form
			class="search"
			autocomplete="off"
			on:submit|preventDefault={async e => {
				// @ts-ignore
				const input = e.target.elements.query;

				searchQuery.set(input.value);
				searchType.set("home");
				page.set("searchresults");
			}}
		>
			<input
				type="search"
				class="white"
				placeholder="Find posts and maybe even relics."
				maxlength="360"
				name="query"
				autocomplete="false"
				on:keydown={e => {
					if (e.key == "Enter") {
						e.preventDefault();
						// @ts-ignore
						e.target.form.requestSubmit();
					}
				}}
			/>
			<button>Search</button>
		</form>
	</Container>
	<Container>
		<h1>Search Users</h1>
		<form
			class="search"
			autocomplete="off"
			on:submit|preventDefault={async e => {
				// @ts-ignore
				const input = e.target.elements.query;

				searchQuery.set(input.value);
				searchType.set("users");
				page.set("searchresults");
			}}
		>
			<input
				type="search"
				class="white"
				placeholder="Find all the legit users, memes, bots and namesnipes."
				maxlength="20"
				name="query"
				autocomplete="false"
				on:keydown={e => {
					if (e.key == "Enter") {
						e.preventDefault();
						// @ts-ignore
						e.target.form.requestSubmit();
					}
				}}
			/>
			<button>Search</button>
		</form>
	</Container>
	<Container>
		<h1>Go to User</h1>
		<p>
			Note that usernames are currently case-sensitive (e.g going to
			MikeDEV will work, but going to mikedev or MIKEDEV won't)!
		</p>
		<form
			class="search"
			autocomplete="off"
			on:submit|preventDefault={async e => {
				errors = "";

				// @ts-ignore
				const input = e.target.elements.user;

				const userNotFound = () => {
					throw "This user does not exist!";
				};

				try {
					input.disabled = true;

					const username = input.value;

					if (!username) userNotFound();

					const url =
						apiUrl + "users/" + encodeURIComponent(username);

					if (
						url.includes("/..") ||
						decodeURIComponent(url).includes("/..")
					)
						userNotFound();

					const resp = await fetch(url);
					if (!resp.ok) userNotFound();

					profileClicked.set(username);
					page.set("profile");
				} catch (e) {
					errors = e;
				} finally {
					input.disabled = false;
				}
			}}
		>
			<input
				type="text"
				class="white"
				placeholder="Username"
				name="user"
				autocomplete="false"
				on:keydown={e => {
					if (e.key == "Enter") {
						e.preventDefault();
						// @ts-ignore
						e.target.form.requestSubmit();
					}
				}}
			/>
			<button>Go to User</button>
		</form>
		<div class="errors">{errors}</div>
	</Container>
	<Container>
		<h1>Statistics</h1>
		{#await fetch(apiUrl + "statistics")}
			<div class="center">
				<Loading />
			</div>
		{:then resp}
			{#await resp.json()}
				<div class="center">
					<Loading />
				</div>
			{:then stats}
				There are {(stats.posts / 1000).toFixed(2)}k posts, {stats.chats}
				chats and {(stats.users / 1000).toFixed(2)}k users on Meower.
			{/await}
		{/await}
	</Container>
</div>

<style>
	.center {
		text-align: center;
	}
	.errors {
		color: red;
		font-size: 75%;
		font-weight: bold;
		margin: 0.25em 0;
	}

	.search {
		display: flex;
		flex-wrap: nowrap;
		gap: 0.25em;
	}
	.search > input {
		flex-grow: 1;
		flex-shrink: 1;
	}
	.search > button {
		flex-shrink: 0;
	}
</style>
