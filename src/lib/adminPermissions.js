import {user} from "./stores.js";

let _user = null;
user.subscribe(v => {
	_user = v;
});

export const permissions = {
	SYSADMIN: 1,

	DELETE_POSTS: 2,

	VIEW_ALTS: 4,
	VIEW_INBOXES: 8,
	CLEAR_USER_QUOTES: 16,
	CLEAR_USER_POSTS: 32,
	SEND_ALERTS: 64,
	KICK_USERS: 128,
	VIEW_BAN_STATE: 256,
	EDIT_BAN_STATE: 512,
	IMPERSONATE_USERS: 1024,
	DELETE_USERS: 2048,

	VIEW_IPS: 4096,
	BLOCK_IPS: 8192,

	VIEW_CHATS: 16384,
	EDIT_CHATS: 32768,

	VIEW_NOTES: 65536,
	EDIT_NOTES: 131072,

	SEND_ANNOUNCEMENTS: 262144,

	VIEW_AUDIT_LOG: 524288,
};

export function hasPermission(permission) {
	if ((_user.permissions & permissions.SYSADMIN) === permissions.SYSADMIN) {
		return true;
	} else {
		return (_user.permissions & permission) === permission;
	}
}

export function hasAnyPermission(permissionsList) {
	if ((_user.permissions & permissions.SYSADMIN) === permissions.SYSADMIN) {
		return true;
	} else {
		for (let permission of permissionsList) {
			if ((_user.permissions & permission) === permission) return true;
		}
		return false;
	}
}
