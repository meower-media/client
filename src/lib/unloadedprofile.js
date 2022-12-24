/**
 * Returns the "default" profile, used when logged out.
 *
 * @returns {object} The unloaded profile.
 */
export default function unloadedProfile() {
	return {
		name: null,
		theme: "orange",
		mode: true,
		sfx: true,
		bgm: true,
		bgm_song: 2,
		layout: "new",
		pfp_data: 1,
		quote: "",
	};
}
