export type CodeLang = "ts" | "json";

const TS_KEYWORDS = new Set([
  "import",
  "from",
  "const",
  "let",
  "async",
  "await",
  "new",
  "return",
  "true",
  "false",
  "null",
  "export",
  "type",
  "interface",
]);

const TS_TYPES = new Set([
  "Application",
  "View3D",
  "Mesh3D",
  "CubeGeometry",
  "TorusKnotGeometry",
  "IcosahedronGeometry",
  "SphereGeometry",
  "PlaneGeometry",
  "Material3D",
  "PhongMaterial",
  "ToonMaterial",
  "DirectionalLight",
  "OrbitCamera",
  "Container",
  "Graphics",
  "Text",
  "Point",
  "Vector3",
]);

function appendToken(parent: HTMLElement, text: string, className: string) {
  if (!text) return;
  const span = document.createElement("span");
  span.className = className;
  span.textContent = text;
  parent.appendChild(span);
}

function tokenizeLine(line: string, lang: CodeLang, target: HTMLElement) {
  if (lang === "json") {
    const jsonPattern = /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|\b\d+(?:\.\d+)?\b/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = jsonPattern.exec(line)) !== null) {
      if (match.index > lastIndex) {
        appendToken(target, line.slice(lastIndex, match.index), "text-[#E5E5E5]");
      }
      if (match[1]) {
        const cls = match[2] ? "text-[#93c5fd]" : "text-[#4ade80]";
        appendToken(target, match[1], cls);
        if (match[2]) appendToken(target, match[2], "text-[#A3A3A3]");
      } else if (match[3]) {
        appendToken(target, match[3], "text-[#E72264]");
      } else {
        appendToken(target, match[0], "text-[#fbbf24]");
      }
      lastIndex = jsonPattern.lastIndex;
    }
    if (lastIndex < line.length) {
      appendToken(target, line.slice(lastIndex), "text-[#E5E5E5]");
    }
    return;
  }

  // TypeScript tokenizer: comments, strings, numbers, identifiers
  const tsPattern =
    /(\/\/.*$)|('(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*")|\b(0x[0-9a-fA-F]+|\d+(?:\.\d+)?)\b|\b([A-Za-z_$][A-Za-z0-9_$]*)\b/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tsPattern.exec(line)) !== null) {
    if (match.index > lastIndex) {
      appendToken(target, line.slice(lastIndex, match.index), "text-[#A3A3A3]");
    }
    if (match[1]) {
      appendToken(target, match[1], "text-[#737373]");
    } else if (match[2]) {
      appendToken(target, match[2], "text-[#4ade80]");
    } else if (match[3]) {
      appendToken(target, match[3], "text-[#fbbf24]");
    } else if (match[4]) {
      const ident = match[4];
      if (TS_KEYWORDS.has(ident)) {
        appendToken(target, ident, "text-[#E72264]");
      } else if (TS_TYPES.has(ident)) {
        appendToken(target, ident, "text-[#93c5fd]");
      } else {
        appendToken(target, ident, "text-[#F5F5F5]");
      }
    }
    lastIndex = tsPattern.lastIndex;
  }

  if (lastIndex < line.length) {
    appendToken(target, line.slice(lastIndex), "text-[#A3A3A3]");
  }
}

export function renderHighlightedCode(codeEl: HTMLElement, code: string, lang: CodeLang) {
  const fragment = document.createDocumentFragment();
  const lines = code.split("\n");

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const row = document.createElement("span");
    row.className = "code-line";
    row.dataset.line = String(lineNum);

    const ln = document.createElement("span");
    ln.className = "code-ln";
    ln.setAttribute("aria-hidden", "true");
    ln.textContent = String(lineNum).padStart(2, " ");
    row.appendChild(ln);

    const content = document.createElement("span");
    content.className = "code-content";
    if (line.length === 0) {
      content.textContent = " ";
    } else {
      tokenizeLine(line, lang, content);
    }
    row.appendChild(content);
    fragment.appendChild(row);
  });

  codeEl.replaceChildren(fragment);
  codeEl.dataset.rawCode = code;
}

export function highlightCodeLines(codeEl: HTMLElement, range: readonly [number, number] | null) {
  const rows = codeEl.querySelectorAll<HTMLElement>(".code-line");
  rows.forEach((row) => {
    const num = Number(row.dataset.line);
    if (!range) {
      row.classList.remove("is-highlighted", "is-dimmed");
      return;
    }
    const inRange = num >= range[0] && num <= range[1];
    row.classList.toggle("is-highlighted", inRange);
    row.classList.toggle("is-dimmed", !inRange);
  });
}

