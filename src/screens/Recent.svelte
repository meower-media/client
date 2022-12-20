<!--
	The recent posts page!
	It features a user's recent posts.
-->
<script>
	import {profileClicked} from "../lib/stores.js";
	import Post from "../lib/Post.svelte";
	import Container from "../lib/Container.svelte";
	import Loading from "../lib/Loading.svelte";
	import {link} from "../lib/clmanager.js";
	import {apiUrl, encodeApiURLParams} from "../lib/urls.js";

	import {fly} from "svelte/transition";
	import {flip} from "svelte/animate";

	let id = 0;
	export let posts = [];

	let pagesLoaded = 0;
	let pageLoading = false;
	let numPages = null;
	let postErrors = "";

	// As we use a Load More button and the home is sorted newest-first,
	// we need an offset for posts to be continuous.
	let postOffset = 0;

	/**
	 * Loads a page, with offset and overflow calculations.
	 *
	 * @param {number} [page] The page to load. If not present, simply clears the posts.
	 * @returns {Promise<array>} The posts array.
	 */
	async function loadPage(page) {
		pageLoading = true;
		if (page === undefined) {
			posts = [];
		} else {
			// 25 posts per page...
			let realPage = page + Math.floor(postOffset / 25);
			let realOffset = postOffset % 25;

			try {
				let path = `users/${$profileClicked}/posts?autoget&page=`;
				if (encodeApiURLParams) path = encodeURIComponent(path);
				const resp = await fetch(`${apiUrl}${path}${realPage}`);
				if (!resp.ok) {
					throw new Error(
						"Response code is not OK; code is " + resp.status
					);
				}
				const json = await resp.json();

				let realPosts = json.autoget;
				realPosts.splice(0, realOffset);

				numPages = json.pages;

				let overflowResp, overflowJson;
				if (realOffset > 0 && pagesLoaded < numPages) {
					overflowResp = await fetch(
						`${apiUrl}${path}${realPage + 1}`
					);
					if (!resp.ok) {
						throw new Error(
							"Overflow response code is not OK; code is " +
								resp.status
						);
					}
					overflowJson = await overflowResp.json();

					realPosts = realPosts.concat(
						overflowJson.autoget.slice(0, realOffset)
					);
				}

				for (const post of realPosts) {
					posts.push({
						id: id++,
						post_id: post.post_id,
						user: post.u,
						content: post.p,
						date: post.t.e,
					});
				}
				pagesLoaded = page;
			} catch (e) {
				pageLoading = false;
				throw e;
			}
		}
		posts = posts;
		pageLoading = false;
		return posts;
	}

	/**
	 * Adds events to listen for live post updates.
	 */
	function listenOnLink() {
		link.on("direct", cmd => {
			if (cmd.val.mode === "delete") {
				posts = posts.filter(post => post.post_id !== cmd.val.id);
			}
		});
	}
	if (link.ws.readyState === 1) {
		listenOnLink();
	} else {
		link.ws.addEventListener("open", listenOnLink);
	}
</script>

<div class="posts">
	{#await loadPage(1)}
		<div class="fullcenter">
			<Loading />
		</div>
	{:then}
		<Container>
			<h1>{$profileClicked}'s Recent Posts</h1>
			Here are {$profileClicked}'s recent posts.
		</Container>
		{#if posts.length < 1}
			{$profileClicked} hasn't made any posts yet.
		{:else}
			{#each posts as post (post.id)}
				<div
					transition:fly|local={{y: -50, duration: 250}}
					animate:flip={{duration: 250}}
				>
					<Post {post} />
				</div>
			{/each}
		{/if}
		<div class="center">
			{#if pageLoading}
				<Loading />
			{:else if numPages && numPages > pagesLoaded}
				<button
					class="load-more"
					on:click={() => loadPage(pagesLoaded + 1)}
				>
					Load More
				</button>
			{/if}
		</div>
	{:catch error}
		<Container>
			<h1>{$profileClicked}'s Recent Posts</h1>
			Error loading posts. Please try again.
			<pre><code>{error}</code></pre>
		</Container>
	{/await}
</div>

<style>
	.posts {
		height: 100%;
	}
	.center {
		text-align: center;
	}
	.load-more {
		width: 100%;
		margin-bottom: 1.88em;
	}
	.fullcenter {
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;

		width: 100vw;
		height: 100vh;

		position: fixed;
		top: 0;
		left: 0;
	}
</style>
