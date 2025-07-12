import { JSX, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MorphologicalAnalysis, readMorphologicalAnalysis, writeMorphAnalysisValue }
  from '../../../model/morphologicalAnalysis';
import { DictionaryUploader } from '../dict/files/DictionaryUploader';
import { DictionaryViewer } from './DictionaryViewer';
import { Entry } from './Wordform';
import { groupBy } from '../common/utils';
import { Dictionary, setGlobalDictionary } from '../dict/dictionary';
import { modifyAnalysis } from '../dict/analysisModifier';
import { ModifyAnalysis } from './StemViewer';
import { addChange } from '../changes/changesAccumulator';

interface Subentry {
  transcription: string;
  analysis: string;
}

interface IProps {
  initialDictionary: Dictionary;
}

export function DictionaryViewerContainer({initialDictionary}: IProps): JSX.Element {
  
  const {t} = useTranslation('common');
  const [loaded, setLoaded] = useState(initialDictionary.size > 0);
  const [dictionary, setDictionary] = useState(initialDictionary);
  
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
  
  const boundModifyAnalysis: ModifyAnalysis = (transcriptions, analysis, modification) => {
    const accumulatedModification = (morphologicalAnalysis: MorphologicalAnalysis) => {
      const newMorphologicalAnalysis = modification(morphologicalAnalysis);
      const target = writeMorphAnalysisValue(newMorphologicalAnalysis);
      if (target !== analysis) {
        addChange(analysis, target);
      }
      return newMorphologicalAnalysis;
    };
    return modifyAnalysis(transcriptions, analysis, accumulatedModification, setDictionary);
  };
    
  useEffect(() => {
    setGlobalDictionary(dictionary);
  });
  
  return (
    <div className="container mx-auto">
      <h1 className="font-bold text-2xl text-center">{t('dictionaryViewer')}</h1>
      {!loaded ? <DictionaryUploader onUpload={() => setLoaded(true)}/> :
      <DictionaryViewer entries={entries} modifyAnalysis={boundModifyAnalysis} />}
    </div>
  );
}
