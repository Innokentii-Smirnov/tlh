import { JSX, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { dictionary } from '../dictionary';
import { MorphologicalAnalysis, readMorphologicalAnalysis } from '../../../model/morphologicalAnalysis';
import { DictionaryUploader } from '../DictionaryUploader';
import { DictionaryViewer } from './DictionaryViewer';

export function DictionaryViewerContainer(): JSX.Element {
  
  const {t} = useTranslation('common');
  const [loaded, setLoaded] = useState(dictionary.size > 0);
  
  const morphologicalAnalyses: MorphologicalAnalysis[] = [];
  
  for (const analyses of dictionary.values()) {
    for (const analysis of analyses) {
      const morphologicalAnalysis = readMorphologicalAnalysis(1, analysis, []);
      if (morphologicalAnalysis !== undefined) {
        morphologicalAnalyses.push(morphologicalAnalysis);
      }
    }
  }
  
  return (
    <div className="container mx-auto">
      <h1 className="font-bold text-2xl text-center">{t('dictionaryViewer')}</h1>
      {!loaded ? <DictionaryUploader onUpload={() => setLoaded(true)}/> :
      <DictionaryViewer morphologicalAnalyses={morphologicalAnalyses} />}
    </div>
  );
}
