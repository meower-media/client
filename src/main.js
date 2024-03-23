import App from "./App.svelte";

try {
	if (navigator.serviceWorker) {
		navigator.serviceWorker.getRegistration().then(registration => {
			if (registration) {
				registration.unregister();
			}
		});
	}
} catch (e) {
	console.error(e);
}

const app = new App({
	target: document.getElementById("app"),
});

export default app;
