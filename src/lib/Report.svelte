<script>
	import Container from "./Container.svelte";
	import FormattedDate from "./FormattedDate.svelte";
	import Post from "./Post.svelte";
	import ProfileView from "./ProfileView.svelte";

	import ReportNotesModal from "./modals/moderation/ReportNotes.svelte";

	import {authHeader} from "./stores.js";
	import {apiUrl} from "./urls.js";
	import * as modals from "./modals.js";

	import {goto} from "@roxi/routify";

	const reportTypeNames = {
		post: "Post",
		user: "User",
	};

	const reportStatusNames = {
		pending: "Pending",
		no_action_taken: "Completed with no action taken",
		action_taken: "Completed with action taken",
	};

	export let report;

	let loading, error;

	async function changeStatus(newStatus) {
		error = null;
		loading = true;
		try {
			const resp = await fetch(`${apiUrl}admin/reports/${report._id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					...$authHeader,
				},
				body: JSON.stringify({
					status: newStatus,
				}),
			});
			if (!resp.ok) {
				throw new Error(
					"Response code is not OK; code is " + resp.status
				);
			}
			report.status = newStatus;
			report.escalated = false;
			loading = false;
		} catch (e) {
			error = e;
			loading = false;
		}
	}

	async function escalate() {
		error = null;
		loading = true;
		try {
			const resp = await fetch(
				`${apiUrl}admin/reports/${report._id}/escalate`,
				{
					method: "POST",
					headers: $authHeader,
				}
			);
			if (!resp.ok) {
				throw new Error(
					"Response code is not OK; code is " + resp.status
				);
			}
			report.status = "pending";
			report.escalated = true;
			loading = false;
		} catch (e) {
			error = e;
			loading = false;
		}
	}
</script>

<Container>
	<b>Report ID:</b>
	{report._id}<br />
	<b>Report Type:</b>
	{reportTypeNames[report.type] || "Unknown"}<br />
	<b>Report Status:</b>
	{reportStatusNames[report.status] || "Unknown"}
	{#if report.escalated}(escalated){/if}<br />
	{#if report.type === "post" && report.content}
		<b>Post Origin: </b>
		{#if report.content.post_origin === "home"}
			<a href="/" on:click|preventDefault={$goto("/home")}> Home </a><br
			/>
		{:else if report.content.post_origin === "inbox"}
			<a
				href="/"
				on:click|preventDefault={$goto(
					`/users/${report.content.u}/admin/inbox`
				)}
			>
				{report.content.u}'s inbox
			</a><br />
		{:else}
			<a
				href="/"
				on:click|preventDefault={$goto(
					`/chats/${report.content.post_origin}`
				)}
			>
				{report.content.post_origin}
			</a><br />
		{/if}
	{/if}
	<b>Reports:</b><br />
	<ul>
		{#each report.reports as _report}
			<li>
				<b>User:</b>
				<a
					href="/"
					on:click|preventDefault={$goto(`/users/${_report.user}`)}
					>{_report.user}</a
				><br />
				<b>Time:</b>
				<FormattedDate date={_report.time} /><br />
				<b>Reason:</b>
				{_report.reason}<br />
				{#if _report.comment}
					<b>Comment:</b>
					{_report.comment}
				{/if}
			</li>
		{/each}
	</ul>
	<br />

	{#if !report.content}
		<p><i>Failed to load content!</i></p>
	{:else if report.type === "post"}
		<Post
			post={{
				post_id: report.content.post_id,
				post_origin: report.content.post_origin,
				user: report.content.u,
				content: report.content.p,
				unfiltered_content: report.unfiltered_p,
				date: report.content.t.e,
				edited_at: report.content.edited_at,
				isDeleted: report.content.isDeleted,
				mod_deleted: report.content.mod_deleted,
				deleted_at: report.content.deleted_at,
			}}
		/>
	{:else if report.type === "user"}
		<ProfileView
			canClick={true}
			canDoActions={true}
			small={true}
			profile={report.content}
		/>
	{/if}

	{#if error}
		<p style="color: crimson;">{error}</p>
	{/if}

	<div class="settings-controls">
		<button
			class="circle scroll"
			title="View/edit notes"
			disabled={loading}
			on:click={() =>
				modals.showModal(ReportNotesModal, {reportid: report._id})}
		/>
		{#if report.status === "pending"}
			{#if !report.escalated}
				<button
					class="circle siren"
					title="Escalate"
					disabled={loading}
					on:click={escalate}
				/>
			{/if}
			<button
				class="circle close"
				title="Mark as completed with no action taken"
				disabled={loading}
				on:click={async () => await changeStatus("no_action_taken")}
			/>
			<button
				class="circle check"
				title="Mark as completed with action taken"
				disabled={loading}
				on:click={async () => await changeStatus("action_taken")}
			/>
		{:else}
			<button
				class="circle pen"
				title="Change status"
				on:click={() => (report.status = "pending")}
			/>
		{/if}
	</div>
</Container>
