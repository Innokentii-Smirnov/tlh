import { useTranslation } from 'react-i18next';
import { downloadDictionary } from './dictionaryFileManager';
import { blueButtonClasses } from '../../../../defaultDesign';

export function DictionaryDownloader() {
  
  const {t} = useTranslation('common');
  
  return (
    <button
      type="button"
      className={blueButtonClasses}
      onClick={downloadDictionary}>
      {t('exportDict')}
    </button>
  );
}
