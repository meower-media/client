export function toHTMLElement(text) {
	const filteredText = text
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&apos;")
		.replaceAll("\n", "<br>");

	const span = document.createElement("span");
	const p = document.createElement("p");
	p.innerText = filteredText;
	span.appendChild(p);
	return span;
}
