import { useTranslation } from 'react-i18next';
import { FileLoader } from '../../../../forms/FileLoader';
import { readDict } from './dictionaryFileManager';

interface IProps {
  onUpload: () => void;
}

export function DictionaryUploader({onUpload}: IProps) {
  
  const {t} = useTranslation('common');
  
  const onLoad = async (f: File) => {
      return readDict(f).then(onUpload);
  };
  
  return (
    <FileLoader accept="application/JSON" onLoad={onLoad} text={t('uploadDictionary')}/>
  );
}
