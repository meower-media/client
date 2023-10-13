<script>
	import Loading from "./Loading.svelte";
	import FormattedDate from "./FormattedDate.svelte";

	import {authHeader} from "./stores.js";
	import {adminPermissions, hasPermission} from "./bitField.js";
	import {apiUrl} from "./urls.js";

	import {goto} from "@roxi/routify";

	export let identifier;

	let notes, savingStatus;

	async function getNotes() {
		const resp = await fetch(`${apiUrl}admin/notes/${identifier}`, {
			headers: $authHeader,
		});
		if (!resp.ok) {
			throw new Error("Response code is not OK; code is " + resp.status);
		}
		notes = await resp.json();
	}

	async function saveNotes() {
		savingStatus = "Saving...";
		try {
			const resp = await fetch(`${apiUrl}admin/notes/${notes._id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					...$authHeader,
				},
				body: JSON.stringify({notes: notes.notes}),
			});
			if (!resp.ok) {
				throw new Error(
					"Response code is not OK; code is " + resp.status
				);
			}
			notes = await resp.json();
			savingStatus = "Saved!";
		} catch (e) {
			savingStatus = "Error saving notes: " + e;
		}
	}
</script>

<div>
	{#await getNotes()}
		<Loading />
	{:then}
		<textarea
			class="white"
			placeholder="Write something..."
			disabled={!hasPermission(adminPermissions.EDIT_NOTES)}
			bind:value={notes.notes}
			on:change={saveNotes}
		/>
		{#if notes.last_modified_at && notes.last_modified_by}
			Last modified <FormattedDate
				date={notes.last_modified_at}
				relative={true}
			/> by
			<a
				href="/"
				on:click|preventDefault={() =>
					$goto(`/users/${notes.last_modified_by}`)}
				>{notes.last_modified_by}</a
			>
		{/if}
		{#if savingStatus}
			<br /><b>{savingStatus}</b>
		{/if}
	{:catch e}
		Error loading notes: {e}
	{/await}
</div>

<style>
	textarea {
		display: block;
		margin-bottom: 0.25em;
		resize: vertical;
		width: 100%;
	}
</style>
