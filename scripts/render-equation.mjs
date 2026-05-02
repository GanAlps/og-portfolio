// Renders a TeX snippet to SVG using mathjax-node 2.x.
// Usage: node scripts/render-equation.mjs <tex_file> <out_svg>

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const mjAPI = require("mathjax-node");

const [, , inFile, outFile] = process.argv;
if (!inFile || !outFile) {
  console.error("usage: render-equation.mjs <tex_file> <out_svg>");
  process.exit(2);
}

const tex = fs.readFileSync(inFile, "utf8").trim();

mjAPI.config({
  MathJax: {
    SVG: { font: "STIX-Web" },
  },
});
mjAPI.start();

mjAPI
  .typeset({
    math: tex,
    format: "TeX",
    svg: true,
    speakText: false,
  })
  .then((data) => {
    if (data.errors) {
      console.error("MathJax errors:", data.errors);
      process.exit(1);
    }
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, data.svg, "utf8");
    console.log(`wrote ${outFile} (${data.svg.length} bytes)`);
  })
  .catch((err) => {
    console.error("render failed:", err);
    process.exit(1);
  });
