import { useTranslation } from 'react-i18next';
import { downloadChanges } from './changesFileManager';
import { downloadNumericIDs } from '../numericIDs/files/numericIDsFileManager';
import { downloadEnglishTranslations } from '../translations/files/englishTranslationsFileManager';
import { downloadReferences } from '../references/files/referencesFileManager';
import { blueButtonClasses } from '../../../defaultDesign';

export function ChangesDownloader() {
  
  const {t} = useTranslation('common');
  
  return (
    <button
      type="button"
      className={blueButtonClasses}
      onClick={() => {
        alert('Ch');
        downloadChanges();
        alert('N');
        downloadNumericIDs();
        downloadEnglishTranslations();
        downloadReferences();
      }}>
      {t('exportChanges')}
    </button>
  );
}
