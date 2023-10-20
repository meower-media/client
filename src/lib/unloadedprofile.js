/**
 * Returns the "default" profile, used when logged out.
 *
 * @returns {object} The unloaded profile.
 */

import {systemDarkMode} from "./responsiveness.js";

export default function unloadedProfile() {
	return {
		name: null,
		flags: 0,
		permissions: 0,
		unread_inbox: false,
		theme: "orange",
		mode: !systemDarkMode(),
		sfx: true,
		bgm: false,
		bgm_song: 2,
		layout: "new",
		debug: false,
		hide_blocked_users: false,
		favorited_chats: [],
		pfp_data: 1,
		quote: "",
		ban: {
			state: "None",
			expires: 0,
			reason: "",
		},
	};
}
