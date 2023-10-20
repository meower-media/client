<script>
	import Modal from "../../Modal.svelte";
	import Loading from "../../Loading.svelte";
	import Post from "../../Post.svelte";
	import AdminNotes from "../../AdminNotes.svelte";

	import {authHeader} from "../../stores.js";
	import {adminPermissions, hasPermission} from "../../bitField.js";
	import {apiUrl} from "../../urls.js";
	import * as modals from "../../modals.js";

	export let modalData;

	let {postid} = modalData;

	let post;

	async function getPost() {
		const resp = await fetch(`${apiUrl}admin/posts/${postid}`, {
			headers: $authHeader,
		});
		if (!resp.ok) {
			throw new Error("Response code is not OK; code is " + resp.status);
		}
		post = await resp.json();
	}
</script>

<Modal showClose={true} on:close={modals.closeLastModal}>
	<h2 slot="header">Moderate {postid}</h2>
	<div slot="default">
		{#await getPost()}
			<Loading />
		{:then}
			<h2>Current post</h2>
			<Post
				post={{
					post_id: post.post_id,
					post_origin: post.post_origin,
					user: post.u,
					content: post.p,
					unfiltered_content: post.unfiltered_p,
					date: post.t.e,
					edited_at: post.edited_at,
					isDeleted: post.isDeleted,
					mod_deleted: post.mod_deleted,
					deleted_at: post.deleted_at,
				}}
				adminView={true}
			/>

			{#if post.edited_at}
				<br />

				<h2>Revisions</h2>
				{#each post.revisions as revision}
					<Post
						post={{
							post_id: post.post_id,
							post_origin: post.post_origin,
							user: post.u,
							content: revision.old_content,
							unfiltered_content: null,
							date: revision.time,
							edited_at: null,
							isDeleted: false,
							mod_deleted: null,
							deleted_at: null,
						}}
						buttons={false}
					/>
				{/each}
			{/if}

			{#if hasPermission(adminPermissions.VIEW_NOTES)}
				<br />

				<h2>Notes</h2>
				<AdminNotes identifier={post._id} />
			{/if}
		{:catch error}
			{error}
		{/await}
		<div />
	</div>
</Modal>
