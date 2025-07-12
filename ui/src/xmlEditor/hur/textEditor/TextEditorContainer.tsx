import { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { TextUploader } from './TextUploader';
import { applyChanges } from '../changes/changesAccumulator';
import { downloadText } from './textFileManager';

export function TextEditorContainer(): JSX.Element {
  
  const {t} = useTranslation('common');
  
  return (
    <div className="container mx-auto">
      <h2 className="font-bold text-2xl text-center">{t('textEditor')}</h2>
      <br/>
      <TextUploader onUpload={(text: string, fileName: string) => {
        downloadText(applyChanges(text), fileName);
      }} />
    </div>
  );
}
