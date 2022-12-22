/** @file Provides a function for parsing Markdown. */

import {marked} from "marked";
import DOMPurify from "dompurify";
import {mainPage, profileClicked} from "./stores.js";

const dp = new DOMPurify();

const config = {
	FORBID_TAGS: ["style", "head", "body", "svg", "form",],
	FORBID_ATTR: ["style", 'action', 'background', "poster",],
};

dp.addHook("beforeSanitizeAttributes", function (node) {
	// Do mentions
	if (node.parentNode && node.nodeName && node.nodeName === "#text") {
		const fragment = document.createElement("div");
		const replacedHTML = node.textContent.replace(
			/\@([-_a-zA-Z0-9]+)/gi,
			`<a href="#" data-user="$1">@$1</a>`
		);
		fragment.innerHTML = replacedHTML;
		for (const el of [...fragment.childNodes]) {
			node.parentNode.insertBefore(
				el.nodeName && el.nodeName === "#text"
					? document.createTextNode(el.wholeText)
					: el,
				node
			);
		}
		node.remove();
	}
});

dp.addHook("afterSanitizeAttributes", function(node) {
	// Run images through a proxy
	if (node.hasAttribute("src")) {
		node.setAttribute(
			"src",
			`https://api.allorigins.win/raw?url=${
				encodeURIComponent(node.getAttribute("src"))
			}`
		);
	}
});

export default function(md) {
	try {
		return dp.sanitize(marked.parse(md), config);
	} catch(e) {
		return `Error rendering post: <pre><code>${
			md.replaceAll("<", "&lt;")
		}</code></pre>`
	}
}

export function doMentionsFor(el) {
	for (const node of el.querySelectorAll("a[data-user]")) {
		node.addEventListener("click", (e) => {
			e.preventDefault();
			profileClicked.set(node.dataset.user);
			mainPage.set("profile");
		});
	}
}