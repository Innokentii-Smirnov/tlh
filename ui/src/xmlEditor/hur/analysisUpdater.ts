import { MorphologicalAnalysis } from '../../model/morphologicalAnalysis';
import { analyze } from './analyze';
import { getGrammaticalMorphemes } from './splitter';
import { Spec } from 'immutability-helper';
import { getStem } from './splitter';
import { getPos } from './glossUpdater';
import { retrieveGloss } from './glossProvider';

// 97
const codePointLowerA: number = 'a'.codePointAt(0) || 97;

// Falls der Benutzer eine neue Segmentierung eingegeben hat, muss diese neu analysiert werden.
export function updateHurrianAnalysis(oldma: MorphologicalAnalysis, referenceWord: string): Spec<MorphologicalAnalysis> {
  const grammaticalMorphemes = getGrammaticalMorphemes(referenceWord);

  const tags: string[] | null = analyze(grammaticalMorphemes, oldma.paradigmClass);

  const stem = getStem(referenceWord);
  const pos = getPos(oldma.paradigmClass);
  const glosses: Set<string> | null = retrieveGloss(stem, pos);
  let newTranslation: string | null;
  if (glosses === null) {
    newTranslation = null;
  } else {
    newTranslation = Array.from(glosses).sort().join('; ');
  }

  // no tags
  if (tags === null || tags.length === 0) {
    if (newTranslation === null) {
      return {
        referenceWord: { $set: referenceWord },
        encliticsAnalysis: { $set: undefined },
        selected: { $set: false }
      };
    } else {
      return {
        referenceWord: { $set: referenceWord },
        encliticsAnalysis: { $set: undefined },
        selected: { $set: false },
        translation: {$set: newTranslation}
      };
    }
  }

  // single tag
  if (tags.length === 1) {
    if (newTranslation === null) {
      return {
        referenceWord: { $set: referenceWord },
        analysis: { $set: tags[0] },
        encliticsAnalysis: { $set: undefined },
        selected: { $set: false }
      };
    } else {
      return {
        referenceWord: { $set: referenceWord },
        analysis: { $set: tags[0] },
        encliticsAnalysis: { $set: undefined },
        selected: { $set: false },
        translation: {$set: newTranslation}
      };
    }
  }

  // multiple tags
  if (newTranslation === null) {
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
  } else {
    return {
      referenceWord: { $set: referenceWord },
      analysisOptions: {
        $set: tags.map((tag, index) => ({
          letter: String.fromCodePoint(codePointLowerA + index),
                                        analysis: tag,
                                        selected: false
        }))
      },
      selected: { $set: false },
      translation: {$set: newTranslation}
    };
  }
}
