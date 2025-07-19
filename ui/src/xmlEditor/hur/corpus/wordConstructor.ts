import { XmlElementNode } from 'simple_xml';
import { readSelectedMorphology, SelectedMorphAnalysis }
  from '../../../model/selectedMorphologicalAnalysis';
import { readMorphologiesFromNode } from '../../../model/morphologicalAnalysis';
import { isSelected, getFirstSelectedMorphTag } from '../morphologicalAnalysis/auxiliary';
import { makeGloss } from '../common/auxiliary';
import { getText } from '../common/xmlUtilities';

export type Word = {
  transliteration: string;
  segmentation: string;
  gloss: string;
}

export function makeWord(node: XmlElementNode): Word | undefined {
  const transliteration = getText(node);
  const selectedMorphologies: SelectedMorphAnalysis[] = node.attributes.mrp0sel !== undefined
    ? readSelectedMorphology(node.attributes.mrp0sel)
    : [];
  const morphologies = readMorphologiesFromNode(node, selectedMorphologies);
  const ma = morphologies.find(isSelected);
  let segmentation: string;
  let gloss: string;
  if (ma !== undefined) {
    segmentation = ma.referenceWord;
    const { translation } = ma;
    const morphTag = getFirstSelectedMorphTag(ma);
    if (morphTag !== undefined) {
      gloss = makeGloss(translation, morphTag);
    } else {
      gloss = translation;
    }
  } else {
    segmentation = '';
    gloss = '';
  }
  const word = { transliteration, segmentation, gloss };
  return word;
}
