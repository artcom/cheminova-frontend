import { PAGE_REGISTRY } from "@/experience/pageRegistry"

const CHARACTER_TYPE = "choose-character"

export function pickLocaleRoot(content, locale) {
  if (!Array.isArray(content) || content.length === 0) return null
  return content.find((entry) => entry.locale === locale) ?? content[0]
}

export function indexTree(root) {
  const byId = new Map()
  const byTranslationKey = new Map()

  const visit = (node, parent, characterNode) => {
    const entry = {
      node,
      parentId: parent?.id ?? null,
      characterNode: node.type === CHARACTER_TYPE ? node : characterNode,
    }
    byId.set(node.id, entry)
    byTranslationKey.set(node.translationKey, entry)
    for (const child of node.children ?? []) {
      visit(child, node, entry.characterNode)
    }
  }

  if (root) visit(root, null, null)

  return { root, byId, byTranslationKey }
}

export function buildExperienceTree(content, locale) {
  return indexTree(pickLocaleRoot(content, locale))
}

const isPassthrough = (node) =>
  Boolean(node && PAGE_REGISTRY[node.type]?.passthrough)

export function firstRenderableNode(node) {
  let current = node
  while (isPassthrough(current)) {
    current = current.children?.[0] ?? null
  }
  return current
}

export function nextNode(node) {
  const children = node?.children ?? []
  return children.length === 1 ? firstRenderableNode(children[0]) : null
}

export function branchesOf(node) {
  const children = node?.children ?? []
  return children.length > 1 ? children : []
}

export function findByType(tree, type) {
  for (const { node } of tree.byId.values()) {
    if (node.type === type) return node
  }
  return null
}

export function siblingsOf(tree, node) {
  const entry = node ? tree.byId.get(node.id) : null
  if (!entry) return []
  if (entry.parentId === null) return [entry.node]
  return tree.byId.get(entry.parentId)?.node.children ?? []
}

export function ancestorsOf(tree, nodeId) {
  const path = []
  let entry = tree.byId.get(nodeId)
  while (entry) {
    path.unshift(entry.node)
    entry = entry.parentId === null ? null : tree.byId.get(entry.parentId)
  }
  return path
}

export function descendantOfType(node, type) {
  for (const child of node?.children ?? []) {
    if (child.type === type) return child
    const deeper = descendantOfType(child, type)
    if (deeper) return deeper
  }
  return null
}

export function nearestAncestorOfType(tree, nodeId, type) {
  const path = ancestorsOf(tree, nodeId)
  for (let index = path.length - 2; index >= 0; index -= 1) {
    if (path[index].type === type) return path[index]
  }
  return null
}

export function translationKeyOf(allLocalesContent, nodeId) {
  const visit = (node) => {
    if (node.id === nodeId) return node.translationKey
    for (const child of node.children ?? []) {
      const found = visit(child)
      if (found) return found
    }
    return null
  }

  for (const root of allLocalesContent ?? []) {
    const found = visit(root)
    if (found) return found
  }

  return null
}

export function remapToLocale(tree, node) {
  if (!node) return null
  const direct = tree.byTranslationKey.get(node.translationKey)
  if (direct) return direct.node
  return null
}
