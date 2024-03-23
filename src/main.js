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

function app() {
	new App({
		target: document.getElementById("app"),
	});
}

var UA = navigator.userAgent.split(" ")
// @ts-ignore
UA = UA[UA.length-1]
var UA2 = UA[UA.length-2]

if (UA.includes("/")) {
	// @ts-ignore
	if ((UA.split("/")[0] == "Firefox" || UA.split("/")[0] == "OPR")) {
		// @ts-ignore
		if (parseInt(UA.split("/")[1]) >= 80) {
			app()
		} else {
			document.body.innerHTML += '<div id="browser-support">	<img src="/src/assets/outdated.png" height="600px">	<a href="https://www.youtube.com/watch?v=Cz4aTSnFVvk" id="vivaldi" class="all-browsers"></a>	<a href="https://www.mozilla.org/firefox/" id="firefox" class="all-browsers small"></a>	<a href="https://www.google.com/chrome/" id="chrome" class="all-browsers small"></a>	<a href="https://www.opera.com/download" id="opera" class="all-browsers small"></a></div>'
		}
	}
}

if (UA2.includes("/")) {
	if (UA2.split("/")[0] == "Chrome") { // Of course chrome needs the special treatment...
		if (parseInt(UA2.split("/")[1]) >= 80) {
			app()
		} else {
			document.body.innerHTML += '<div id="browser-support">	<img src="/src/assets/outdated.png" height="600px">	<a href="https://www.youtube.com/watch?v=Cz4aTSnFVvk" id="vivaldi" class="all-browsers"></a>	<a href="https://www.mozilla.org/firefox/" id="firefox" class="all-browsers small"></a>	<a href="https://www.google.com/chrome/" id="chrome" class="all-browsers small"></a>	<a href="https://www.opera.com/download" id="opera" class="all-browsers small"></a></div>'
		}
	}
}			

export default app;
