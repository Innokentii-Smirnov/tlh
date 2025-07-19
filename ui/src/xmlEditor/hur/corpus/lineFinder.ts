import { XmlElementNode, isXmlElementNode, getElementByPath } from 'simple_xml';

export function findLine(rootNode: XmlElementNode, path: number[]): XmlElementNode[] {
  const parent = getElementByPath(rootNode, path.slice(0, -1));
  
  const current = path[path.length  - 1];
  let start = current;
  while (start >= 0) {
    const child = parent.children[start];
    if (isXmlElementNode(child)) {
      if (child.tagName === 'w') {
        start--;
      } else {
        break;
      }
    }
  }
  let end = current + 1;
  while (end < parent.children.length) {
    const child = parent.children[end];
    if (isXmlElementNode(child)) {
      if (child.tagName === 'w') {
        end++;
      } else {
        break;
      }
    }
  }
  
  const line: XmlElementNode[] = [];
  for (const xmlNode of parent.children.slice(start + 1, end)) {
    if (isXmlElementNode(xmlNode)) {
      line.push(xmlNode);
    }
  }
  return line;
}
