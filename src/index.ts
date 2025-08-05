import highlightJs from "highlight.js";
import highlightJsCss from "highlight.js/styles/a11y-dark.min.css";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import stripIndent from "strip-indent";
import { registerClassiCubeScript } from "./grammar";

async function main() {
  const markdownElements = Array.from(document.querySelectorAll("pre"));

  for (const pre of markdownElements) {
    const stripped = stripIndent(pre.innerText);
    pre.innerText = stripped;
  }

  const style = document.createElement("style");
  style.textContent = highlightJsCss;
  document.head.appendChild(style);

  highlightJs.registerLanguage("classicube-script", registerClassiCubeScript);

  const marked = new Marked(
    markedHighlight({
      async: true,
      emptyLangClass: "hljs",
      langPrefix: "hljs language-",
      highlight(code, lang) {
        const language = highlightJs.getLanguage(lang) ? lang : "plaintext";
        return highlightJs.highlight(code, { language }).value;
      },
    })
  );

  for (const pre of markdownElements) {
    const html = await marked.parse(pre.innerText);
    const div = document.createElement("div");
    div.innerHTML = html;
    pre.replaceWith(div);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    main();
  });
} else {
  main();
}
