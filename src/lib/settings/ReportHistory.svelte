<script>
    import Container from "../Container.svelte";
	import PagedList from "../PagedList.svelte";
	import FormattedDate from "../FormattedDate.svelte";

	import {authHeader} from "../stores.js";
	import {apiUrl} from "../urls.js";

	import {createEventDispatcher} from "svelte";
	import {goto} from "@roxi/routify";

	const dispatch = createEventDispatcher();

	let reports = [];
	let firstLoad = true;

	async function loadReportsPage(page = 1) {
		const resp = await fetch(
			`${apiUrl}me/reports?autoget=1&page=${page}`,
			{
				headers: $authHeader,
			}
		);
		if (!resp.ok) {
			throw new Error("Response code is not OK; code is " + resp.status);
		}
		const json = await resp.json();
		const numPages = json["pages"];
		const result = json["autoget"];

		if (firstLoad) dispatch("loaded");
		firstLoad = true;

		return {
			numPages,
			result,
		};
	}
</script>

<Container>
	<h1>Report History</h1>
	Here are all of the reports you have made and their current review status. Thanks for your help with keeping Meower a safe & welcoming place!
</Container>

<PagedList bind:items={reports} loadPage={loadReportsPage}>
	<svelte:fragment slot="loaded" let:items={_reports}>
		<table>
			<tr>
				<th>Content</th>
				<th>Reason</th>
				<th>Time</th>
				<th>Status</th>
			</tr>
			{#each _reports as report}
				<tr>
					<td>
						{#if report.type === "post"}
							{#if report.content}
								<a
									href="/"
									on:click|preventDefault={$goto(
										`/posts/${report.content_id}`
									)}
								>
									{report.content.u}'s post
								</a>
								
							{:else}
								<i>Unknown post</i>
							{/if}
						{:else if report.type === "user"}
							{#if report.content}
								<a
									href="/"
									on:click|preventDefault={$goto(
										`/users/${report.content_id}`
									)}
								>
									{report.content_id}
								</a>
							{:else}
								<i>Unknown user</i>
							{/if}
						{:else}
							<i>Unknown</i>
						{/if}
					</td>
					<td>
						{report.reason}<br />
						<i>{report.comment}</i>
					</td>
					<td style="max-width: 5em;">
						<FormattedDate
							date={report.time}
							relative={true}
						/>
					</td>
					<td style="max-width: 5em;">
						{#if report.status === "pending"}
							Pending
						{:else if report.status === "no_action_taken"}
							No action taken
						{:else if report.status === "action_taken"}
							Action taken
						{:else}
							Unknown
						{/if}
					</td>
				</tr>
			{/each}
		</table>
	</svelte:fragment>
	<slot nam="error" slot="error" let:error {error}>
		<Container>
			Error loading reports. Please try again.
			<pre><code>{error}</code></pre>
		</Container>
	</slot>
	<slot name="empty" slot="empty">
		<Container>
			Looks like you haven't made any reports yet.
		</Container>
	</slot>
</PagedList>

<style>
	table {
		width: 100%;
		max-width: 100%;
		text-align: center;
		border-collapse: collapse;
		overflow: hidden;
	}

	th,
	td {
		border: solid 2px var(--orange);
		padding: 0.5em;
		outline: none;
		word-break: break-all;
	}
</style>