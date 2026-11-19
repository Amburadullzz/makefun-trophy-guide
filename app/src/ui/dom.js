// A four-function DOM helper: build elements, set attributes, clear a node, and a scoped query.
// Everything the views need, nothing that needs a framework.

/** Creates an element: `el('li', { class: 'trophy', onclick }, ...children)`. */
export function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || value === null || value === false) continue;
    if (key === 'class') node.className = value;
    else if (key === 'text') node.textContent = value;
    else if (key === 'html') node.innerHTML = value;
    else if (key.startsWith('on') && typeof value === 'function') node.addEventListener(key.slice(2), value);
    else if (value === true) node.setAttribute(key, '');
    else node.setAttribute(key, String(value));
  }
  for (const child of children.flat()) {
    if (child === undefined || child === null || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return node;
}

/** Empties a node without touching anything else. */
export function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

/** The grade badge, reused by the list, the roadmap chips and the drawer. */
export function gradeMark(grade) {
  const letter = grade[0].toUpperCase();
  return el('span', { class: `grade grade--${grade}`, title: `${grade} trophy`, 'aria-label': `${grade} trophy` }, letter);
}

/** The kind label used on rows and in the drawer. */
export function kindLabel(kind, labels) {
  return el('span', { class: 'kind' }, labels[kind] ?? kind);
}
