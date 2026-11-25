import {findFirstXmlElementByTagName, isXmlElementNode, XmlElementNode} from 'simple_xml';
import {XmlSingleInsertableEditableNodeConfig} from '../editorConfig';
import classNames from 'classnames';
import {WordNodeEditor} from './WordNodeEditor';
import {SpacesEditor} from './SpacesEditor';
import {selectedNodeClass} from '../tlhXmlEditorConfig';
import {ReactElement} from 'react';
import {getPriorSibling} from '../../nodeIterators';
import {isHurrian} from '../nodeLanguage';
import {hasDeprecatedAnalyses} from '../hur/colourMarking/hasDeprecatedAnalyses';
import {isNotAnnotated} from '../hur/colourMarking/isNotAnnotated';
import {containsPreservedSign} from '../hur/colourMarking/containsPreservedSign';
import {isFragmentary} from '../hur/colourMarking/isFragmentary';
import {HurrianAnnotationConfig, defaultHurrianAnnotationConfig} from '../hurrianAnnotationConfig';

const isOnlySpaces = ({children}: XmlElementNode): boolean => children.length === 1 && isXmlElementNode(children[0]) && children[0].tagName === 'space';

function backgroundColor(node: XmlElementNode<'w'>, isSelected: boolean, selectedMorphology: string | undefined,
                         path: number[], rootNode: XmlElementNode | undefined,
                         hurrianAnnotationConfig: HurrianAnnotationConfig | undefined): string | undefined {
  if (isSelected) { // Prio 1: current selection
    return selectedNodeClass;
  }

  if (node.attributes.editingQuestion !== undefined) { // Prio 2: has editing question
    return 'bg-blue-300';
  }

  if (hasDeprecatedAnalyses(node, path, rootNode)) {
    return 'bg-orange-300';
  }

  if (selectedMorphology !== undefined && selectedMorphology.length === 0 && selectedMorphology !== '???' && selectedMorphology !== 'DEL' && !isHurrian(node, path, rootNode)) {
    // Prio 3: has no morphology selected
    return 'bg-yellow-300';
  }

  if (selectedMorphology === '???') {
    return 'bg-red-500';
  }

  if (hurrianAnnotationConfig === undefined) {
    hurrianAnnotationConfig = defaultHurrianAnnotationConfig;
  }

  if (isNotAnnotated(node) && isHurrian(node, path, rootNode)) {
  const {highlightUnannotatedFragmentaryForms} = hurrianAnnotationConfig;
    if (highlightUnannotatedFragmentaryForms) {
      if (containsPreservedSign(node)) {
        return 'bg-yellow-300';
      }
    } else {
      if (!isFragmentary(node, path, rootNode)) {
        return 'bg-yellow-300';
      }
    }
  }

  return undefined;
}


export const wordNodeConfig: XmlSingleInsertableEditableNodeConfig<'w'> = {
  replace: ({rootNode, node, path, renderChildren, isSelected, hurrianAnnotationConfig}): ReactElement => {

    const lbElement = rootNode
      ? getPriorSibling(rootNode, path, 'lb')
      : undefined;

    const textElement = rootNode
      ? findFirstXmlElementByTagName(rootNode, 'text')
      : undefined;

    const classes = classNames(
      node.attributes.lg || lbElement?.attributes.lg || textElement?.attributes.lg,
      isOnlySpaces(node)
        ? [isSelected ? selectedNodeClass : 'bg-gray-200']
        : [
          backgroundColor(node, isSelected, node.attributes.mrp0sel?.trim(), path, rootNode, hurrianAnnotationConfig),
          {'text-red-600': node.children.length === 0}
        ]
    );

    return (
      <>
        &nbsp;
        <span className={classes} title={node.attributes.editingQuestion}>{node.children.length === 0 ? <span>&#x2715;</span> : renderChildren()}</span>
        &nbsp;
      </>
    );
  },
  edit: (props) =>
    isOnlySpaces(props.node)
      ? <SpacesEditor {...props}/>
      : <WordNodeEditor {...props}/>,
  insertablePositions: {
    beforeElement: ['w'],
    afterElement: ['lb', 'w'],
    asFirstChildOf: ['devi'],
    asLastChildOf: ['div1', 'cl', 'devi']
  }
};