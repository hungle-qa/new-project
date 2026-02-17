export interface HtmlNode {
  id: string
  tagName: string
  classes: string[]
  attributes: Record<string, string>
  children: HtmlNode[]
  textContent?: string
  path: number[]
}

let nodeIdCounter = 0

function generateId(): string {
  return `node-${++nodeIdCounter}`
}

function parseElement(element: Element, path: number[]): HtmlNode {
  // Use getAttribute to handle both HTML and SVG elements
  // (SVG elements have className as SVGAnimatedString, not string)
  const classAttr = element.getAttribute('class') || ''
  const classes = classAttr ? classAttr.split(/\s+/).filter(Boolean) : []

  const attributes: Record<string, string> = {}
  for (const attr of Array.from(element.attributes)) {
    if (attr.name !== 'class') {
      attributes[attr.name] = attr.value
    }
  }

  const children: HtmlNode[] = []
  let textContent: string | undefined

  for (let i = 0; i < element.childNodes.length; i++) {
    const child = element.childNodes[i]
    if (child.nodeType === Node.ELEMENT_NODE) {
      children.push(parseElement(child as Element, [...path, children.length]))
    } else if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent?.trim()
      if (text) {
        textContent = textContent ? `${textContent} ${text}` : text
      }
    }
  }

  return {
    id: generateId(),
    tagName: element.tagName.toLowerCase(),
    classes,
    attributes,
    children,
    textContent,
    path
  }
}

export function parseHtmlToTree(html: string): HtmlNode[] {
  nodeIdCounter = 0
  const parser = new DOMParser()
  const doc = parser.parseFromString(`<div id="__root__">${html}</div>`, 'text/html')
  const root = doc.getElementById('__root__')

  if (!root) return []

  const nodes: HtmlNode[] = []
  for (let i = 0; i < root.children.length; i++) {
    nodes.push(parseElement(root.children[i], [i]))
  }

  return nodes
}

function nodeToHtml(node: HtmlNode, indent: number = 0): string {
  const spaces = '  '.repeat(indent)
  const classAttr = node.classes.length > 0 ? ` class="${node.classes.join(' ')}"` : ''

  const otherAttrs = Object.entries(node.attributes)
    .map(([key, value]) => ` ${key}="${value}"`)
    .join('')

  const selfClosingTags = ['img', 'br', 'hr', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'param', 'source', 'track', 'wbr']

  if (selfClosingTags.includes(node.tagName)) {
    return `${spaces}<${node.tagName}${classAttr}${otherAttrs} />`
  }

  const hasChildren = node.children.length > 0
  const hasText = node.textContent && node.textContent.trim()

  if (!hasChildren && !hasText) {
    return `${spaces}<${node.tagName}${classAttr}${otherAttrs}></${node.tagName}>`
  }

  if (!hasChildren && hasText) {
    return `${spaces}<${node.tagName}${classAttr}${otherAttrs}>${node.textContent}</${node.tagName}>`
  }

  const childrenHtml = node.children
    .map(child => nodeToHtml(child, indent + 1))
    .join('\n')

  if (hasText) {
    return `${spaces}<${node.tagName}${classAttr}${otherAttrs}>\n${spaces}  ${node.textContent}\n${childrenHtml}\n${spaces}</${node.tagName}>`
  }

  return `${spaces}<${node.tagName}${classAttr}${otherAttrs}>\n${childrenHtml}\n${spaces}</${node.tagName}>`
}

export function treeToHtml(nodes: HtmlNode[]): string {
  return nodes.map(node => nodeToHtml(node, 0)).join('\n')
}

export function getNodeByPath(nodes: HtmlNode[], path: number[]): HtmlNode | null {
  if (path.length === 0) return null

  let current: HtmlNode | undefined = nodes[path[0]]
  for (let i = 1; i < path.length; i++) {
    if (!current) return null
    current = current.children[path[i]]
  }

  return current || null
}

export function updateNodeClasses(
  nodes: HtmlNode[],
  path: number[],
  classes: string[]
): HtmlNode[] {
  if (path.length === 0) return nodes

  return nodes.map((node, index) => {
    if (index !== path[0]) return node

    if (path.length === 1) {
      return { ...node, classes }
    }

    return {
      ...node,
      children: updateNodeClasses(node.children, path.slice(1), classes)
    }
  })
}

export function findNodeById(nodes: HtmlNode[], id: string): HtmlNode | null {
  for (const node of nodes) {
    if (node.id === id) return node
    const found = findNodeById(node.children, id)
    if (found) return found
  }
  return null
}
