import { getHurrianLexicalDatabaseUpdatesUrl } from '../../urls';
import { dictionary, setGlobalDictionary } from './dict/dictionary';
import { readMorphAnalysisValue } from './morphologicalAnalysis/auxiliary';
import { modifyAnalysis } from './dict/analysisModifier';
import { updateConcordanceKey } from './concordance/concordance';
import { replaceMorphologicalAnalysis } from './corpus/corpus';
export const updatesStream = new EventSource(getHurrianLexicalDatabaseUpdatesUrl);
export function enableLexicalDatabaseUpdateHandling(): void {
  const replaceMorphologicalAnalysisListener = (event: MessageEvent) => {
    if (event.data !== 'Starting' && event.data !== '"Initial message"') {
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
    }
  };
  updatesStream.addEventListener('replaceMorphologicalAnalysis',
                                 replaceMorphologicalAnalysisListener);
}
