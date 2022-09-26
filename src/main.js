import App from "./App.svelte";

try {
	if (navigator.serviceWorker) {
		navigator.serviceWorker.register(
			"../sw.js", {
				type: import.meta.env.DEV ? "module" : "classic"
		);
	}
} catch(e) {
	console.error(e);
}

const app = new App({
    target: document.getElementById("app")
});

export default app;
