import {XmlElementNode} from 'simple_xml';
import {isHurrian} from '../../nodeLanguage';
import {containsPreservedSign} from './containsPreservedSign';
import {isNotAnnotated} from './isNotAnnotated';

export function isPartiallyPreservedNotAnnotatedHurrian(node: XmlElementNode<'w'>,
                                                    path: number[],
                                                    rootNode: XmlElementNode | undefined): boolean {
  return isNotAnnotated(node) && containsPreservedSign(node) && isHurrian(node, path, rootNode);
}
