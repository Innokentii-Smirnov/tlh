import { XmlElementNode } from 'simple_xml';
import { readSelectedMorphology, SelectedMorphAnalysis }
  from '../../../model/selectedMorphologicalAnalysis';
import { readMorphologiesFromNode, MorphologicalAnalysis } from '../../../model/morphologicalAnalysis';
import { isSelected, getFirstSelectedMorphTag } from '../morphologicalAnalysis/auxiliary';
import { makeGloss } from '../common/auxiliary';
import { getText } from '../common/xmlUtilities';

export type Word = {
  transliteration: string;
  segmentation: string;
  gloss: string;
}

function getSegmentationAndGloss(morphologicalAnalysis: MorphologicalAnalysis | undefined): [string, string] {
  let segmentation: string;
  let gloss: string;
  if (morphologicalAnalysis !== undefined) {
    segmentation = morphologicalAnalysis.referenceWord;
    const { translation } = morphologicalAnalysis;
    const morphTag = getFirstSelectedMorphTag(morphologicalAnalysis);
    if (morphTag !== undefined) {
      gloss = makeGloss(translation, morphTag);
    } else {
      gloss = translation;
    }
  } else {
    segmentation = '';
    gloss = '';
  }
  return [segmentation, gloss];
}

export function updateMorphologicalAnalysis(word: Word,
                                            oldMa: MorphologicalAnalysis | undefined,
                                            newMa: MorphologicalAnalysis | undefined): Word {
  const [oldSegmentation, oldGloss] = getSegmentationAndGloss(oldMa);
  if (word.segmentation === oldSegmentation && word.gloss === oldGloss) {
    const { transliteration } = word;
    const [segmentation, gloss] = getSegmentationAndGloss(newMa);
    return { transliteration, segmentation, gloss };
  } else {
    return word;
  }
}

export function makeWordFromMorphologies(transliteration: string,
                                         morphologies: MorphologicalAnalysis[]): Word {
  const morphologicalAnalysis = morphologies.find(isSelected);
  const [segmentation, gloss] = getSegmentationAndGloss(morphologicalAnalysis);
  const word = { transliteration, segmentation, gloss };
  return word;
}

export function makeWord(node: XmlElementNode): Word | undefined {
  const transliteration = getText(node);
  const selectedMorphologies: SelectedMorphAnalysis[] = node.attributes.mrp0sel !== undefined
    ? readSelectedMorphology(node.attributes.mrp0sel)
    : [];
  const morphologies = readMorphologiesFromNode(node, selectedMorphologies);
  return makeWordFromMorphologies(transliteration, morphologies);
}
