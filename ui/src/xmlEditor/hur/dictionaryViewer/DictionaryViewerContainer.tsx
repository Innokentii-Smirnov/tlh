import { JSX, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { readMorphAnalysisValue } from '../morphologicalAnalysis/auxiliary';
import { DictionaryUploader } from '../dict/files/DictionaryUploader';
import { DictionaryViewer } from './DictionaryViewer';
import { Entry } from './Wordform';
import { groupBy } from '../common/utils';
import { Dictionary, setGlobalDictionary } from '../dict/dictionary';
import { locallyStoreHurrianData } from '../dictLocalStorage/hurrianDataLocalStorage';
import { modifyAnalysis } from '../dict/analysisModifier';
import { updatesStream } from '../lexicalDatabaseInteraction';

interface Subentry {
  transcription: string;
  analysis: string;
}

interface IProps {
  getInitialDictionary: () => Dictionary;
}

export function DictionaryViewerContainer({getInitialDictionary}: IProps): JSX.Element {
  
  const {t} = useTranslation('common');
  const initialDictionary = getInitialDictionary();
  const [loaded, setLoaded] = useState(initialDictionary.size > 0);
  const [dictionary, setDictionary] = useState(initialDictionary);

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (event.data !== 'Starting' && event.data !== '"Initial message"') {
        const { transcriptions, origin, target } = JSON.parse(event.data);
        const newMorphologicalAnalysis = readMorphAnalysisValue(target);
        if (newMorphologicalAnalysis !== undefined) {
          setDictionary(dictionary =>
            modifyAnalysis(dictionary, transcriptions, origin, newMorphologicalAnalysis)
          );
        }
      }
    };
    updatesStream.addEventListener('replaceMorphologicalAnalysis', listener);
    return (() => updatesStream.removeEventListener('replaceMorphologicalAnalysis', listener));
  }, []);
  
  const subentries: Subentry[] = [];
  
  for (const [transcription, analyses] of dictionary.entries()) {
    for (const analysis of analyses) {
      subentries.push({transcription, analysis});
    }
  }
  
  const grouped = groupBy(subentries,
    (subentry: Subentry) => subentry.analysis,
    (subentry: Subentry) => subentry.transcription
  );
  
  const entries: Entry[] = [];
  
  for (const [analysis, transcriptionSet] of grouped.entries()) {
    const morphologicalAnalysis = readMorphAnalysisValue(analysis);
    if (morphologicalAnalysis !== undefined) {
      const transcriptions = Array.from(transcriptionSet).sort();
      entries.push({transcriptions, morphologicalAnalysis});
    }
  }
    
  useEffect(() => {
    setGlobalDictionary(dictionary);
    locallyStoreHurrianData();
  });
  
  return (
    <div className="container mx-auto">
      <h1 className="font-bold text-2xl text-center">{t('dictionaryViewer')}</h1>
      {!loaded ? <DictionaryUploader onUpload={() => setLoaded(true)} /> :
      <DictionaryViewer entries={entries} setDictionary={setDictionary} />}
    </div>
  );
}
