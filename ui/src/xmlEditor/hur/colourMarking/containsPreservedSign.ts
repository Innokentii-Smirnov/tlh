import {isXmlElementNode, isXmlTextNode, XmlNode} from 'simple_xml';

const fragmentaryStringPattern = /^([-x ]|\(-\))*$/;

function isFragmentaryString(s: string): boolean {
  return fragmentaryStringPattern.test(s);
}

export function containsPreservedSign(node: XmlNode): boolean {
  if (isXmlElementNode(node)) {
    return node.children.some(containsPreservedSign);
  } else if (isXmlTextNode(node)) {
    return !isFragmentaryString(node.textContent);
  } else {
    return false;
  }
}
