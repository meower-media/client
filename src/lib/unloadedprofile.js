/**
 * Returns the "default" profile, used when logged out.
 *
 * @returns {object} The unloaded profile.
 */

import {systemDarkMode} from "./responsiveness.js";

export const unloadedProfile = {
	name: null,
	theme: "orange",
	mode: !systemDarkMode(),
	sfx: true,
	bgm: false,
	bgm_song: 2,
	layout: "new",
	pfp_data: 1,
	quote: "",
}