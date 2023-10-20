<script>
	import Modal from "../../Modal.svelte";

	import {authHeader} from "../../stores.js";
	import {adminPermissions, hasPermission} from "../../bitField.js";
	import {apiUrl} from "../../urls.js";
	import * as modals from "../../modals.js";

	import {onMount} from "svelte";

	const permissions = [
		{
			value: adminPermissions.VIEW_REPORTS,
			name: "View reports",
			description: "Allows viewing all pending and completed reports.",
		},
		{
			value: adminPermissions.EDIT_REPORTS,
			dependsOn: adminPermissions.VIEW_REPORTS,
			name: "Edit reports",
			description:
				"Allows changing the status of reports.<br />(requires 'View reports' permission)",
		},

		{
			value: adminPermissions.VIEW_NOTES,
			name: "View notes",
			description: "Allows viewing admin notes.",
		},
		{
			value: adminPermissions.EDIT_NOTES,
			dependsOn: adminPermissions.VIEW_NOTES,
			name: "Edit notes",
			description:
				"Allows editing admin notes.<br />(requires 'View notes' permission)",
		},

		{
			value: adminPermissions.VIEW_POSTS,
			name: "View posts",
			description:
				"Allows viewing all posts, even if they wouldn't usually have access to it or the post is soft-deleted.",
		},
		{
			value: adminPermissions.DELETE_POSTS,
			dependsOn: adminPermissions.VIEW_POSTS,
			name: "Delete posts",
			description:
				"Allows deleting and reinstating posts.<br />(requires 'View posts' permission)",
		},

		{
			value: adminPermissions.VIEW_ALTS,
			name: "View alts",
			description: "Allows viewing a user's potential alts.",
		},
		{
			value: adminPermissions.SEND_ALERTS,
			name: "Send alerts",
			description: "Allows sending alerts to users.",
		},
		{
			value: adminPermissions.KICK_USERS,
			name: "Kick users",
			description: "Allows kicking users.",
		},
		{
			value: adminPermissions.CLEAR_USER_QUOTES,
			name: "Clear quotes",
			description: "Allows clearing a user's quote.",
		},
		{
			value: adminPermissions.VIEW_BAN_STATES,
			name: "View ban states",
			description: "Allows viewing a user's ban state.",
		},
		{
			value: adminPermissions.EDIT_BAN_STATES,
			dependsOn: adminPermissions.VIEW_BAN_STATES,
			name: "Edit ban states",
			description:
				"Allows modifying a user's ban state.<br />(requires 'View ban states' permission)",
		},
		{
			value: adminPermissions.DELETE_USERS,
			name: "Delete users",
			description:
				"Allows scheduling an account for deletion or immediately deleting an account.",
		},

		{
			value: adminPermissions.VIEW_IPS,
			name: "View IPs",
			description: "Allows viewing IP address info.",
		},
		{
			value: adminPermissions.BLOCK_IPS,
			dependsOn: adminPermissions.VIEW_IPS,
			name: "Block IPs",
			description:
				"Allows blocking/unblocking IP addresses.<br />(requires 'View IPs' permission)",
		},

		{
			value: adminPermissions.VIEW_CHATS,
			name: "View chats",
			description: "Allows viewing private chats.",
		},
		{
			value: adminPermissions.EDIT_CHATS,
			dependsOn: adminPermissions.VIEW_CHATS,
			name: "Edit chats",
			description:
				"Allows editing, deleting, and reinstating private chats.<br />(requires 'View chats' permission)",
		},

		{
			value: adminPermissions.SEND_ANNOUNCEMENTS,
			name: "Send announcements",
			description: "Allows sending announcements.",
		},
	];

	export let modalData;

	let {user} = modalData;

	let selectedPermissions = [],
		saving,
		error;

	$: {
		for (let permission of permissions) {
			if (selectedPermissions.includes(permission.value)) {
				if (
					permission.dependsOn &&
					!selectedPermissions.includes(permission.dependsOn)
				) {
					selectedPermissions.splice(
						selectedPermissions.indexOf(permission.value),
						1
					);
				}
			}
		}
	}

	onMount(() => {
		if (
			(user.permissions & adminPermissions.SYSADMIN) ===
			adminPermissions.SYSADMIN
		) {
			selectedPermissions = [adminPermissions.SYSADMIN];
		} else {
			selectedPermissions = [];
			for (let permission of permissions) {
				if (
					(user.permissions & permission.value) ===
					permission.value
				) {
					if (
						!permission.dependsOn ||
						(user.permissions & permission.dependsOn) ===
							permission.dependsOn
					) {
						selectedPermissions.push(permission.value);
					}
				}
			}
		}
	});

	async function savePermissions() {
		error = "";
		saving = true;
		try {
			let permissionsBitField = 0;
			for (let permission of selectedPermissions) {
				permissionsBitField |= permission;
			}
			const resp = await fetch(`${apiUrl}admin/users/${user._id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					...$authHeader,
				},
				body: JSON.stringify({
					permissions: permissionsBitField,
				}),
			});
			if (!resp.ok) {
				throw new Error(
					"Response code is not OK; code is " + resp.status
				);
			}
			modals.closeLastModal();
		} catch (e) {
			error = e;
			saving = false;
		}
	}
</script>

<Modal on:close={modals.closeLastModal}>
	<h2 slot="header">
		{user._id}'s Admin Permissions
	</h2>
	<div slot="default">
		{#if selectedPermissions.includes(adminPermissions.SYSADMIN)}
			<label>
				<input type="checkbox" disabled checked />
				Sysadmin
			</label><br />
			Allows access to every permission possible.<br /><br />
		{:else}
			{#each permissions as permission}
				<label>
					<input
						type="checkbox"
						value={permission.value}
						disabled={saving ||
							!hasPermission(adminPermissions.SYSADMIN) ||
							(permission.dependsOn &&
								!selectedPermissions.includes(
									permission.dependsOn
								))}
						bind:group={selectedPermissions}
					/>
					{permission.name}
				</label><br />
				{@html permission.description}<br /><br />
			{/each}
		{/if}
		{#if error}
			<p style="color: crimson;">{error}</p>
		{:else}
			<br />
		{/if}
		<div class="modal-buttons">
			<button
				type="button"
				disabled={saving}
				on:click={modals.closeLastModal}>Close</button
			>
			{#if hasPermission(adminPermissions.SYSADMIN) && !selectedPermissions.includes(adminPermissions.SYSADMIN)}
				<button
					type="submit"
					disabled={saving}
					on:click={savePermissions}>Save Permissions</button
				>
			{/if}
		</div>
	</div>
</Modal>

<style>
	label,
	input[type="checkbox"] {
		vertical-align: middle;
	}

	input[type="checkbox"] {
		border: none;
	}
</style>
