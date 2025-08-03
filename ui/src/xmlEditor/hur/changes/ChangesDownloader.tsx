import { useTranslation } from 'react-i18next';
import { downloadChanges } from './changesFileManager';
import { blueButtonClasses } from '../../../defaultDesign';

export function ChangesDownloader() {
  
  const {t} = useTranslation('common');
  
  return (
    <button
      type="button"
      className={blueButtonClasses}
      onClick={downloadChanges}>
      {t('exportChanges')}
    </button>
  );
}
