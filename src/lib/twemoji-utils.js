export function toHTMLElement(text) {
    const div = document.createElement("div");
    const p = document.createElement("p");
    p.innerText = text;
    div.appendChild(p);
    return div;
}