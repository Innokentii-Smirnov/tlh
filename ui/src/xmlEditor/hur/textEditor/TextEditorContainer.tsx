import { JSX, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextUploader } from './TextUploader';
import { applyChanges } from '../changes/changesAccumulator';
import { downloadText } from './textFileManager';
import { readMorphAnalysisValue } from '../morphologicalAnalysis/auxiliary';
import update from 'immutability-helper';
import { TextEditor } from './TextEditor';
import { Replacement } from '../replacement/replacement';
import { removeSuffix } from '../common/auxiliary';
import { ChangesListClearer } from './ChangesListClearer';

interface IProps {
  clearChanges: () => void;
}

export function TextEditorContainer({ clearChanges }: IProps): JSX.Element {

  const {t} = useTranslation('common');
  
  const initialReplacements: Replacement[] = [];
  const [replacements, setReplacements] = useState(initialReplacements);
  
  const onChange = (text: string, line: string, initialAnalysis: string, result: string) => {
    const source = readMorphAnalysisValue(initialAnalysis);
    const target = readMorphAnalysisValue(result);
    if (source !== undefined && target !== undefined) {
      const replacement: Replacement = { text, line, source, target };
      setReplacements(replacements => update(replacements, {$push: [replacement]}));
    }
  };
  
  return (
    <div className="container mx-auto">
      <h2 className="font-bold text-2xl text-center">{t('textEditor')}</h2>
      <br/>
      <TextUploader onUpload={(text: string, fileName: string) => {
          const textName = removeSuffix(fileName, '.xml');
          const boundOnChange = (line: string, initialAnalysis: string, result: string) =>
            onChange(textName, line, initialAnalysis, result);
          downloadText(applyChanges(text, boundOnChange), fileName);
        }}
        cleanUp={() => setReplacements([])} />
      <ChangesListClearer clearChanges={clearChanges} />
      <TextEditor replacements={replacements} />
    </div>
  );
}
