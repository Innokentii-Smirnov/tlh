import { useTranslation } from 'react-i18next';
import { FileLoader } from './FileLoader';
import { readText } from './textFileManager';

interface IProps {
  onUpload: (fileText: string, fileName: string) => void;
}

export function TextUploader({onUpload}: IProps) {
  
  const {t} = useTranslation('common');
  
  const onLoad = async (f: File) => {
      return readText(f).then((fileText: string) => onUpload(fileText, f.name));
  };
  
  return (
    <FileLoader accept="text/xml" onLoad={onLoad} text={t('uploadText')}/>
  );
}
