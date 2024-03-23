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
