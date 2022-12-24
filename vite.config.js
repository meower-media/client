import {defineConfig} from "vite";
import {svelte} from "@sveltejs/vite-plugin-svelte";

// import replace from "@rollup/plugin-replace";
// import {injectManifest} from "rollup-plugin-workbox";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		svelte(),
		/*
		injectManifest({
			swSrc: "sw.js",
			swDest: "dist/sw.js",
			globDirectory: "dist",
			globPatterns: ["**\/*.{js,css,html,svg,png,ttf}"],
			mode: "production"
		}),
		replace({
			is_vite_preview: true,
			preventAssignment: true,
		}),
		*/
	],
	base: "./",
});
