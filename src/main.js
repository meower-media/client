console.log('%cStop!', 'color: #F00; font-size: 30px; -webkit-text-stroke: 1px black; font-weight:bold');
console.log(
	'This is part of your browser intended for developers. ' +
	'If someone told you to copy-and-paste something here, ' +
	'don\'t do it! It could allow them to take over your ' +
	'Meower account, and do many other harmful things, causing a ban or account deletion. ' +
	'However, dont let this detur you from being here, as it can be a nice learning resource ' +
	'For people who want to make their own meower client! ' +
	'If you accidentally do end up running a harmful script,' +
	' Go to Settings > Security and Then hit "Logout Everywhere"'
);

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
