<!--
	Home except it's now implemented.
-->
<script>
	import Loading from "../lib/Loading.svelte";
	import PostList from "../lib/PostList.svelte";
	import Container from "../lib/Container.svelte";
	import LargeCount from "../lib/LargeCount.svelte";

	import {apiUrl} from "../lib/urls.js";

	import {params, goto} from "@roxi/routify";

	let showResults = $params.type && $params.q; // causes duplicate requests without this due to remounting when page params change
	let errors = "";
</script>

{#if showResults}
	<div class="search-results">
		<Container>
			<h1>Search Results for "{$params.q}"</h1>
		</Container>
		<PostList
			fetchUrl="search/{$params.type}"
			queryParams={{q: $params.q}}
			postOrigin=""
			canPost={false}
		>
			<Container slot="error" let:error>
				Error loading results. Please try again.
				<pre><code>{error}</code></pre>
			</Container>
			<Container slot="empty">No results found.</Container>
		</PostList>
	</div>

	<style>
		h1 {
			margin: 0;
		}
	</style>
{:else}
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

					$goto(`/search?type=home&q=${input.value}`);
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

					$goto(`/search?type=users&q=${input.value}`);
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
			<form
				class="search"
				autocomplete="off"
				on:change={() => (errors = "")}
				on:submit|preventDefault={async e => {
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

						$goto(`/users/${username}`);
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
				/>
				<button type="submit">Go to User</button>
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
					There {stats.posts == 1 ? "is" : "are"}
					<LargeCount num={stats.posts} /> post{stats.posts == 1
						? ""
						: "s"},
					<LargeCount num={stats.chats} /> chats and
					<LargeCount num={stats.users} /> users on Meower.
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
{/if}
