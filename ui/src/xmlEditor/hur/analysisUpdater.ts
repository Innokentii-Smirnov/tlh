import { MorphologicalAnalysis } from '../../model/morphologicalAnalysis';
import { Spec } from 'immutability-helper';
import { getStem } from './splitter';
import { getPos } from './glossUpdater';
import { retrieveGloss } from './glossProvider';

// Falls der Benutzer eine neue Segmentierung eingegeben hat, muss diese neu analysiert werden.
export function updateHurrianAnalysis(oldma: MorphologicalAnalysis, referenceWord: string): Spec<MorphologicalAnalysis> {
  const stem = getStem(referenceWord);
  const pos = getPos(oldma.paradigmClass);
  const glosses: Set<string> | null = retrieveGloss(stem, pos);
  if (glosses === null) {
    return {
      referenceWord: { $set: referenceWord },
    };
  } else {
    const newTranslation: string = Array.from(glosses).sort().join('; ');
    return {
      referenceWord: { $set: referenceWord },
      translation: { $set: newTranslation }
    };
  }
}
