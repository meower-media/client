import {user} from "./stores.js";

let _user = null;
user.subscribe(v => {
	_user = v;
});

export const permissions = {
	SYSADMIN: 1,

	VIEW_REPORTS: 2,
	EDIT_REPORTS: 4,

	VIEW_NOTES: 8,
	EDIT_NOTES: 16,

	VIEW_POSTS: 32,
	DELETE_POSTS: 64,

	VIEW_ALTS: 128,
	VIEW_INBOXES: 256,
	CLEAR_USER_QUOTES: 512,
	CLEAR_USER_POSTS: 1024,
	SEND_ALERTS: 2048,
	KICK_USERS: 4096,
	VIEW_BAN_STATES: 8192,
	EDIT_BAN_STATES: 16384,
	DELETE_ACCOUNTS: 32768,

	VIEW_IPS: 65536,
	BLOCK_IPS: 131072,

	VIEW_CHATS: 262144,
	EDIT_CHATS: 524288,

	CREATE_ANNOUNCEMENTS: 1048576,

	VIEW_AUDIT_LOG: 2097152
};

export const permissionsList = [
	{
		value: permissions.VIEW_REPORTS,
		name: "View reports",
		description: "Allows viewing all pending and completed reports.",
	},
	{
		value: permissions.EDIT_REPORTS,
		dependsOn: permissions.VIEW_REPORTS,
		name: "Edit reports",
		description:
			"Allows changing the status of reports.<br />(requires 'View reports' permission",
	},

	{
		value: permissions.VIEW_NOTES,
		name: "View notes",
		description: "Allows viewing admin notes."
	},
	{
		value: permissions.EDIT_NOTES,
		dependsOn: permissions.VIEW_NOTES,
		name: "Edit notes",
		description: "Allows editing admin notes.<br />(requires 'View notes' permission)"
	},

	{
		value: permissions.VIEW_POSTS,
		name: "View posts",
		description: "Allows viewing all posts, even if they wouldn't usually have access to it or the post is soft-deleted.",
	},
	{
		value: permissions.DELETE_POSTS,
		dependsOn: permissions.VIEW_POSTS,
		name: "Edit posts",
		description:
			"Allows editing, deleting, and reinstating soft-deleted posts.<br />(requires 'View posts' permission)",
	},

	{
		value: permissions.VIEW_ALTS,
		name: "View alts",
		description: "Allows viewing a user's potential alts.",
	},
	{
		value: permissions.VIEW_INBOXES,
		name: "View inboxes",
		description: "Allows viewing a user's inbox.",
	},
	{
		value: permissions.CLEAR_USER_QUOTES,
		name: "Clear quotes",
		description:
			"Allows clearing a user's quote.",
	},
	{
		value: permissions.CLEAR_USER_POSTS,
		name: "Clear posts",
		description:
			"Allows clearing all of a user's home posts.",
	},
	{
		value: permissions.SEND_ALERTS,
		name: "Send alerts",
		description:
			"Allows sending alerts to users.",
	},
	{
		value: permissions.KICK_USERS,
		name: "Kick users",
		description: "Allows kicking users.",
	},
	{
		value: permissions.VIEW_BAN_STATES,
		name: "View ban states",
		description: "Allows viewing a user's ban state.",
	},
	{
		value: permissions.EDIT_BAN_STATES,
		dependsOn: permissions.VIEW_BAN_STATES,
		name: "Edit ban states",
		description:
			"Allows modifying a user's ban state.<br />(requires 'View ban states' permission)",
	},
	{
		value: permissions.DELETE_ACCOUNTS,
		name: "Delete accounts",
		description: "Allows scheduling an account for deletion or immediately deleting an account.",
	},

	{
		value: permissions.VIEW_IPS,
		name: "View IPs",
		description: "Allows viewing IP address info.",
	},
	{
		value: permissions.BLOCK_IPS,
		dependsOn: permissions.VIEW_IPS,
		name: "Block IPs",
		description:
			"Allows blocking/unblocking IP addresses.<br />(requires 'View IPs' permission)",
	},

	{
		value: permissions.VIEW_CHATS,
		name: "View chats",
		description: "Allows viewing private chats.",
	},
	{
		value: permissions.EDIT_CHATS,
		dependsOn: permissions.VIEW_CHATS,
		name: "Edit chats",
		description:
			"Allows editing, deleting, and reinstating private chats.<br />(requires 'View chats' permission)",
	},

	{
		value: permissions.CREATE_ANNOUNCEMENTS,
		name: "Create announcements",
		description: "Allows creating announcements.",
	},

	{
		value: permissions.VIEW_AUDIT_LOG,
		name: "View audit log",
		description: "Allows viewing the full moderator audit log.",
	},
];

export function hasPermission(permission) {
	if ((_user.permissions & permissions.SYSADMIN) === permissions.SYSADMIN) {
		return true;
	} else {
		return (_user.permissions & permission) === permission;
	}
}
