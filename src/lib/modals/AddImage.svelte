<!--Adding images. not really-->

<script>
	import Modal from "../Modal.svelte";
	import Container from "../Container.svelte";
	import FormattedDate from "../FormattedDate.svelte";
	import PFP from "../PFP.svelte";
	import LiText from "../LiText.svelte";

	import {postInput, user} from "../stores.js";
	import {IMAGE_HOST_WHITELIST} from "../hostWhitelist.js";
	import * as modals from "../modals.js";

	import {focus} from "@roxi/routify";

	let imgUrl;
	let imgName;

	let images = [];
	let content = $postInput.value || "[: ]";
	let post = {
		post_id: "",
		post_origin: "home",
		user: $user.name,
		content: content,
		date: Math.floor(Date.now() / 1000),
		isDeleted: false,
	};

	import {default as loadProfile} from "../loadProfile.js";

	/**
	 * Initialize this post's special behavior (user profile, images)).
	 */
	function initPostUser() {
		if (!post.user) return;

		let i = 0;

		// Match image syntax
		// ([title: https://url])
		const iterator = post.content.matchAll(
			/\[([^\]]+?): (https:\/\/[^\]]+?)\]/gs
		);
		images = [];
		while (true) {
			i += 1;
			const result = iterator.next();
			if (result.done) break;

			try {
				new URL(result.value[2]);
			} catch (e) {
				continue;
			}

			if (
				!IMAGE_HOST_WHITELIST.some(o =>
					result.value[2].toLowerCase().startsWith(o.toLowerCase())
				)
			) {
				return;
			}

			images.push({
				title: result.value[1],
				url: result.value[2],
				id: i,
			});
			// Prevent flooding
			if (images.length >= 3) break;
		}
		images = images;

		loadProfile(post.user);
	}

	$: noPFP =
		post.user === "Notification" ||
		post.user.startsWith("Notification to ") ||
		post.user === "Announcement" ||
		post.user === "Server";

	function change() {
		const full =
			$postInput.value + " [" + imgName.value + ": " + imgUrl.value + "]";
		post.content = full;
		initPostUser();

		if (imgName.value === "") {
			postErrors = "The image must have a name!";
			return;
		}
		if (!imgUrl.value.startsWith("https://")) {
			postErrors = "The image URL must start with https://!";
			return;
		}

		const iterator = full.matchAll(/\[([^\]]+?): (https:\/\/[^\]]+?)\]/gs);
		const result = iterator.next();
		if (result.done) {
			postErrors = "";
			return;
		}

		try {
			new URL(result.value[2]);
		} catch (e) {
			console.log("weird");
		}

		if (
			!IMAGE_HOST_WHITELIST.some(o =>
				result.value[2].toLowerCase().startsWith(o.toLowerCase())
			)
		) {
			postErrors =
				"This image is not on the image host whitelist! Allowed image hosts are: " +
				IMAGE_HOST_WHITELIST.map(url =>
					url.replaceAll("https://", "").replaceAll("/", "")
				).join(", ");
		} else {
			postErrors = "";
		}
	}

	let postErrors = "The image must have a name!";
</script>

<Modal on:close={modals.closeLastModal}>
	<h2 slot="header">Add Image to Post</h2>
	<div slot="default">
		<input
			type="text"
			name="imageName"
			class="long white"
			placeholder="Image Name"
			autocomplete="off"
			bind:this={imgName}
			on:change={change}
			use:focus
		/>
		<input
			type="text"
			name="ImageURL"
			class="long white"
			placeholder="Image URL"
			autocomplete="off"
			bind:this={imgUrl}
			on:change={change}
		/>
		<br /><br />
		<h2>Preview</h2>
		<div id="Preview">
			<Container>
				<div class="post-header">
					<button class="pfp">
						{#await noPFP ? Promise.resolve(true) : loadProfile(post.user)}
							<PFP
								icon={-2}
								alt="{post.user}'s profile picture"
								online={true}
							/>
						{:then}
							<PFP
								icon={noPFP}
								alt="{post.user}'s profile picture"
								online={true}
							/>
						{:catch}
							<PFP
								icon={-2}
								alt="{post.user}'s profile picture"
								online={true}
							/>
						{/await}
					</button>
					<div class="creatordate">
						<div class="creator">
							<h2>
								<LiText text={post.user} />
							</h2>
						</div>

						<FormattedDate date={post.date} />
					</div>
				</div>
				<p class="post-content">
					{post.content.replaceAll(
						/\[([^\]]+?): (https:\/\/[^\]]+?)\]/gs,
						""
					)}
				</p>
				<div class="post-images">
					{#each images as { title, url }}
						<a href={url} target="_blank" rel="noreferrer"
							><img
								src={url}
								alt={title}
								{title}
								class="post-image"
							/>
						</a>
					{/each}
				</div>
			</Container>
		</div>
		<p>{postErrors}</p>
		<div class="modal-buttons">
			<button on:click={modals.closeLastModal}>Close</button>
			<button
				disabled={postErrors !== ""}
				on:click={() => {
					$postInput.value +=
						" [" + imgName.value + ": " + imgUrl.value + "]";
					modals.closeLastModal();
				}}
			>
				Add
			</button>
		</div>
	</div>
</Modal>

<style>
	.long {
		width: 100%;
		margin: 0;
		margin-bottom: 0.2em;
	}

	.pfp {
		margin-right: 0.2em;
		padding: 0;
		border: none;
		background: none !important;
		color: inherit;
	}
	.post-header {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		max-width: 100%;
	}

	.creatordate {
		margin-left: 0.5em;
	}
	.creator {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5em;
	}
	.creator h2 {
		font-size: 200%;
		margin: 0;
		overflow-wrap: anywhere;
	}
	.post-content {
		white-space: pre-wrap;
	}

	.post-image {
		max-height: 12em;
		max-width: 100%;
	}

	.post-images {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25em;
	}
</style>
