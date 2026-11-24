import { useTranslation } from 'react-i18next';
import { downloadEnglishTranslations } from './englishTranslationsFileManager';
import { blueButtonClasses } from '../../../../defaultDesign';

export function EnglishTranslationsDownloader() {
  
  const {t} = useTranslation('common');
  
  return (
    <button
      type="button"
      className={blueButtonClasses}
      onClick={downloadEnglishTranslations}>
      {t('exportEnglishTranslations')}
    </button>
  );
}
