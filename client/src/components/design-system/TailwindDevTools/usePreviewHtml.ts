import { HtmlNode } from '../utils/parseHtmlTree'

/**
 * Generate preview HTML with highlights for visual mode
 */
export function generateVisualPreviewHtml(
  htmlTree: HtmlNode[],
  selectedPath: number[],
  getEffectiveClasses: (node: HtmlNode, path: number[]) => string[]
): string {
  const generateNodeHtml = (node: HtmlNode, path: number[]): string => {
    const effectiveClasses = getEffectiveClasses(node, path)
    const isSelected = JSON.stringify(path) === JSON.stringify(selectedPath)

    const highlightStyle = isSelected ? 'outline: 2px dashed #3b82f6; outline-offset: 2px;' : ''

    const classAttr = effectiveClasses.length > 0 ? ` class="${effectiveClasses.join(' ')}"` : ''
    const styleAttr = highlightStyle ? ` style="${highlightStyle}"` : ''
    const dataAttr = ` data-path="${path.join('-')}"`

    const otherAttrs = Object.entries(node.attributes)
      .map(([key, value]) => ` ${key}="${value}"`)
      .join('')

    const selfClosingTags = ['img', 'br', 'hr', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'param', 'source', 'track', 'wbr']

    if (selfClosingTags.includes(node.tagName)) {
      return `<${node.tagName}${classAttr}${otherAttrs}${styleAttr}${dataAttr} />`
    }

    const childrenHtml = node.children
      .map((child, i) => generateNodeHtml(child, [...path, i]))
      .join('')

    const textContent = node.textContent || ''

    return `<${node.tagName}${classAttr}${otherAttrs}${styleAttr}${dataAttr}>${textContent}${childrenHtml}</${node.tagName}>`
  }

  const bodyContent = htmlTree.map((node, i) => generateNodeHtml(node, [i])).join('')

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      min-height: 100vh;
      margin: 0;
      padding: 30px;
      background: #f9fafb;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    [data-path] {
      cursor: pointer;
    }
    [data-path].hovered {
      outline: 1px dashed #9ca3af !important;
      outline-offset: 1px;
    }
  </style>
</head>
<body>
  ${bodyContent}
  <script>
    let hoveredEl = null;
    document.querySelectorAll('[data-path]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const path = el.dataset.path;
        window.parent.postMessage({ type: 'select', path }, '*');
      });
      el.addEventListener('mouseenter', (e) => {
        e.stopPropagation();
        if (hoveredEl) hoveredEl.classList.remove('hovered');
        el.classList.add('hovered');
        hoveredEl = el;
        window.parent.postMessage({ type: 'hover', path: el.dataset.path }, '*');
      });
      el.addEventListener('mouseleave', (e) => {
        el.classList.remove('hovered');
        hoveredEl = null;
        window.parent.postMessage({ type: 'hover', path: null }, '*');
      });
    });
  </script>
</body>
</html>`
}

/**
 * Generate preview HTML for code mode (uses raw HTML directly)
 */
export function generateCodePreviewHtml(rawHtml: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      min-height: 100vh;
      margin: 0;
      padding: 30px;
      background: #f9fafb;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
  </style>
</head>
<body>
  ${rawHtml}
</body>
</html>`
}
