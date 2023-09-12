<script>
	import Modal from "../Modal.svelte";
	import Loading from "../Loading.svelte";

	import * as modals from "../modals.js";

	import {authHeader, userToMod} from "../stores.js";
	import {
		permissions as adminPermissions,
		hasPermission,
	} from "../adminPermissions.js";
	import {apiUrl} from "../urls.js";

	let bitFieldValues = [];
	let canSetPermissions, savingStatus;

	const permissions = [
		{
			value: adminPermissions.DELETE_POSTS,
			name: "Delete posts",
			description:
				"Allows deleting/reinstating posts.<br />(grants access to the posts report queue)",
		},

		{
			value: adminPermissions.VIEW_ALTS,
			name: "View alts",
			description: "Allows viewing a user's potential alts.",
		},
		{
			value: adminPermissions.VIEW_INBOXES,
			name: "View inboxes",
			description: "Allows viewing a user's inbox.",
		},
		{
			value: adminPermissions.CLEAR_USER_QUOTES,
			name: "Clear quotes",
			description:
				"Allows clearing a user's quote.<br />(grants access to the users report queue)",
		},
		{
			value: adminPermissions.CLEAR_USER_POSTS,
			name: "Clear posts",
			description:
				"Allows clearing all of a user's home posts.<br />(grants access to the users report queue)",
		},
		{
			value: adminPermissions.SEND_ALERTS,
			name: "Send alerts",
			description:
				"Allows sending alerts to users.<br />(grants access to the users report queue)",
		},
		{
			value: adminPermissions.KICK_USERS,
			name: "Kick users",
			description: "Allows kicking users.",
		},
		{
			value: adminPermissions.VIEW_BAN_STATE,
			name: "View ban states",
			description: "Allows viewing a user's ban state.",
		},
		{
			value: adminPermissions.EDIT_BAN_STATE,
			dependsOn: adminPermissions.VIEW_BAN_STATE,
			name: "Edit ban states",
			description:
				"Allows modifying a user's ban state.<br />(grants access to the users report queue)<br />(requires 'View ban states' permission)",
		},
		{
			value: adminPermissions.IMPERSONATE_USERS,
			name: "Impersonate users",
			description:
				"Allows logging into a user's account without their password.",
		},
		{
			value: adminPermissions.DELETE_USERS,
			name: "Delete users",
			description: "Allows deleting a user's account.",
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
			value: adminPermissions.SEND_ANNOUNCEMENTS,
			name: "Send announcements",
			description: "Allows sending announcements to users' inboxes.",
		},

		{
			value: adminPermissions.VIEW_AUDIT_LOG,
			name: "View audit log",
			description: "Allows viewing the full audit log.",
		},
	];

	$: {
		for (let permission of permissions) {
			if (
				permission.dependsOn &&
				bitFieldValues.includes(permission.value) &&
				!bitFieldValues.includes(permission.dependsOn)
			) {
				bitFieldValues.splice(
					bitFieldValues.indexOf(permission.value),
					1
				);
			}
		}
	}

	async function getPermissions() {
		const resp = await fetch(`${apiUrl}users/${$userToMod}`);
		if (!resp.ok) {
			throw new Error("Response code is not OK; code is " + resp.status);
		}
		const user = await resp.json();
		bitFieldValues = [];
		if (
			(user.permissions & adminPermissions.SYSADMIN) ===
			adminPermissions.SYSADMIN
		) {
			bitFieldValues.push(adminPermissions.SYSADMIN);
		} else {
			for (let permission of permissions) {
				if (
					(user.permissions & permission.value) ===
					permission.value
				) {
					bitFieldValues.push(permission.value);
				}
			}
		}
		canSetPermissions =
			hasPermission(adminPermissions.SET_USER_PERMISSIONS) &&
			!(
				(user.permissions & adminPermissions.SYSADMIN) ===
				adminPermissions.SYSADMIN
			);
	}

	async function savePermissions() {
		savingStatus = "Saving...";
		try {
			let permissionsBitField = 0;
			for (let permission of bitFieldValues) {
				permissionsBitField |= permission;
			}
			const resp = await fetch(`${apiUrl}users/${$userToMod}`, {
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
			modals.showModal("moderateUser");
		} catch (e) {
			savingStatus = "Error while saving: " + e;
		}
	}
</script>

<Modal on:close={() => modals.showModal("moderateUser")}>
	<h2 slot="header">
		{$userToMod}'s Admin Permissions
	</h2>
	<div slot="default">
		{#await getPermissions()}
			<Loading />
		{:then}
			{#if bitFieldValues.includes(adminPermissions.SYSADMIN)}
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
							bind:group={bitFieldValues}
							value={permission.value}
							disabled={!canSetPermissions ||
								(permission.dependsOn &&
									!bitFieldValues.includes(
										permission.dependsOn
									))}
						/>
						{permission.name}
					</label><br />
					{@html permission.description}<br /><br />
				{/each}
				<br />
				{#if savingStatus}<b>{savingStatus}</b><br /><br />{/if}
			{/if}
			<div class="modal-buttons">
				<button
					type="button"
					on:click={() => modals.showModal("moderateUser")}
					>Close</button
				>
				{#if canSetPermissions}
					<button
						type="submit"
						disabled={savingStatus === "Saving..."}
						on:click={async () => await savePermissions()}
						>Save Permissions</button
					>
				{/if}
			</div>
		{:catch e}
			Error loading permissions: {e}
		{/await}
	</div>
</Modal>

<style>
	label,
	input[type="checkbox"] {
		vertical-align: middle;
	}
</style>
