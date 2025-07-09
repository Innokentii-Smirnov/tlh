import { JSX, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { dictionary } from '../dictionary';
import { MorphologicalAnalysis, readMorphologicalAnalysis } from '../../../model/morphologicalAnalysis';
import { DictionaryUploader } from '../DictionaryUploader';
import { Entry, DictionaryViewer } from './DictionaryViewer';
import { groupBy } from '../utils';

interface Subentry {
  transcription: string;
  analysis: string;
}

export function DictionaryViewerContainer(): JSX.Element {
  
  const {t} = useTranslation('common');
  const [loaded, setLoaded] = useState(dictionary.size > 0);
  
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
    const morphologicalAnalysis = readMorphologicalAnalysis(1, analysis, []);
    if (morphologicalAnalysis !== undefined) {
      const transcriptions = Array.from(transcriptionSet).sort();
      entries.push({transcriptions, morphologicalAnalysis});
    }
  }
  
  return (
    <div className="container mx-auto">
      <h1 className="font-bold text-2xl text-center">{t('dictionaryViewer')}</h1>
      {!loaded ? <DictionaryUploader onUpload={() => setLoaded(true)}/> :
      <DictionaryViewer entries={entries} />}
    </div>
  );
}
