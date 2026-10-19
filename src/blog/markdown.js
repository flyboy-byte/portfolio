import { Marked } from "marked";
import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import cpp from "highlight.js/lib/languages/cpp";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import python from "highlight.js/lib/languages/python";
import rust from "highlight.js/lib/languages/rust";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";

const langs = { bash, sh: bash, shell: bash, zsh: bash, cpp, c: cpp, javascript, js: javascript, jsx: javascript,
  json, python, py: python, rust, xml, html: xml, yaml, yml: yaml };
Object.entries(langs).forEach(([name, def]) => hljs.registerLanguage(name, def));

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Posts are written by the site owner and committed to the repo, so raw HTML in
// markdown is trusted. Do not feed user-supplied markdown through this.
const md = new Marked({
  gfm: true,
  renderer: {
    code({ text, lang }) {
      const l = (lang || "").split(/\s/)[0];
      const html = l && hljs.getLanguage(l) ? hljs.highlight(text, { language: l }).value : esc(text);
      return `<pre><code class="hljs${l ? ` language-${l}` : ""}">${html}</code></pre>\n`;
    },
  },
});

export const renderMarkdown = (body) => md.parse(body);
