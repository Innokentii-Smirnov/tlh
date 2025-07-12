import { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Macroeditor } from './Macroeditor';

interface IProps {
  changes: Map<string, string>;
}

export function MacroeditorContainer({ changes }: IProps): JSX.Element {

  const {t} = useTranslation('common');
  
  return (
    <div className="container mx-auto">
      <h1 className="font-bold text-2xl text-center">{t('macroeditor')}</h1>
      <Macroeditor changes={changes} />
    </div>
  );
}
