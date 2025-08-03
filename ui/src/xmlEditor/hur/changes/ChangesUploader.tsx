import { useTranslation } from 'react-i18next';
import { FileLoader } from '../../../forms/FileLoader';
import { readChanges } from './changesFileManager';

interface IProps {
  onUpload: () => void;
}

export function ChangesUploader({onUpload}: IProps) {
  
  const {t} = useTranslation('common');
  
  const onLoad = async (f: File) => {
      return readChanges(f).then(onUpload);
  };
  
  return (
    <FileLoader accept="application/json" onLoad={onLoad} text={t('uploadChanges')}/>
  );
}
