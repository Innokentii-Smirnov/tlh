import { MorphologicalAnalysis } from '../../model/morphologicalAnalysis';
import { analyze } from './analyze';
import { getGrammaticalMorphemes } from './splitter';
import { Spec } from 'immutability-helper';

// 97
const codePointLowerA: number = 'a'.codePointAt(0) || 97;

// Falls der Benutzer eine neue Segmentierung eingegeben hat, muss diese neu analysiert werden.
export function updateHurrianAnalysis(oldma: MorphologicalAnalysis, referenceWord: string): Spec<MorphologicalAnalysis> {
  const grammaticalMorphemes = getGrammaticalMorphemes(referenceWord);

  const tags: string[] | null = analyze(grammaticalMorphemes, oldma.paradigmClass);

  // no tags
  if (tags === null || tags.length === 0) {
    return {
      referenceWord: { $set: referenceWord },
      encliticsAnalysis: { $set: undefined },
      selected: { $set: false }
    };
  }

  // single tag
  if (tags.length === 1) {
    return {
      referenceWord: { $set: referenceWord },
      analysis: { $set: tags[0] },
      encliticsAnalysis: { $set: undefined },
      selected: { $set: false }
    };
  }

  // multiple tags
  return {
    referenceWord: { $set: referenceWord },
    analysisOptions: {
      $set: tags.map((tag, index) => ({
        letter: String.fromCodePoint(codePointLowerA + index),
        analysis: tag,
        selected: false
      }))
    },
    selected: { $set: false }
  };
}
