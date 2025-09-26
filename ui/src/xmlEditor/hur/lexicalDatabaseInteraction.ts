import { getHurrianLexicalDatabaseUpdatesUrl } from '../../urls';
import { dictionary, setGlobalDictionary } from './dict/dictionary';
import { readMorphAnalysisValue } from './morphologicalAnalysis/auxiliary';
import { modifyAnalysis } from './dict/analysisModifier';
import { localChangeStem, localChangePos, localChangeTranslation } from './translations/modifyTranslations';
import { updateConcordanceKey, localAddAttestation, localRemoveAttestation }
  from './concordance/concordance';
import { replaceMorphologicalAnalysis } from './corpus/corpus';
export const updatesStream = new EventSource(getHurrianLexicalDatabaseUpdatesUrl);
export function enableLexicalDatabaseUpdateHandling(): void {
  const replaceMorphologicalAnalysisListener = (event: MessageEvent) => {
    const { transcriptions, origin, target } = JSON.parse(event.data);
    const newMorphologicalAnalysis = readMorphAnalysisValue(target);
    if (newMorphologicalAnalysis !== undefined) {
      const newDictionary = modifyAnalysis(dictionary, transcriptions,
                                            origin, newMorphologicalAnalysis);
      setGlobalDictionary(newDictionary);
    }
    // The corpus should be updated before the concordance
    // Since the old analysis is used to find the lines to update
    replaceMorphologicalAnalysis(origin, target);
    updateConcordanceKey(origin, target);
  };
  const replaceStemListener = (event: MessageEvent) => {
    const { oldStem, newStem, pos, translation } = JSON.parse(event.data);
    localChangeStem(oldStem, newStem, pos, translation);
  };
  const replacePosListener = (event: MessageEvent) => {
    const { stem, oldPos, newPos, translation } = JSON.parse(event.data);
    localChangePos(stem, oldPos, newPos, translation);
  };
  const replaceTranslationListener = (event: MessageEvent) => {
    const { stem, pos, oldTranslation, newTranslation } = JSON.parse(event.data);
    localChangeTranslation(stem, pos, oldTranslation, newTranslation);
  };
  const addAttestationListener = (event: MessageEvent) => {
    const { analysis, attestation } = JSON.parse(event.data);
    console.log('Adding', analysis, attestation);
    localAddAttestation(analysis, attestation);
  };
  const removeAttestationListener = (event: MessageEvent) => {
    const { analysis, attestation } = JSON.parse(event.data);
    console.log('Removing', analysis, attestation);
    localRemoveAttestation(analysis, attestation);
  };
  updatesStream.addEventListener('replaceMorphologicalAnalysis',
                                 replaceMorphologicalAnalysisListener);
  updatesStream.addEventListener('replaceStem',
                                 replaceStemListener);
  updatesStream.addEventListener('replacePos',
                                 replacePosListener);
  updatesStream.addEventListener('replaceTranslation',
                                 replaceTranslationListener);
  updatesStream.addEventListener('addAttestation',
                                 addAttestationListener);
  updatesStream.addEventListener('removeAttestation',
                                 removeAttestationListener);
}
