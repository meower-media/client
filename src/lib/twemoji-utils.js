export function toHTMLElement(text) {
	const text_split = text.split("");
	
	for (const i in text_split) {
		if (text_split[i] == "<") {
			text_split[i] = "&lt";
		} else if (text_split[i] == ">") {
			text_split[i] = "&gt";
		} else if (text_split[i] == "\n") {
			text_split[i] = "<br>";
		}
	}
	
    const span = document.createElement("span");
    const p = document.createElement("p");
    p.innerText = text_split.join("");
    span.appendChild(p);
    return span;
}
