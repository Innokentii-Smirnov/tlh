import {ChangeEvent, JSX, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';

interface IProps {
  accept?: string;
  onLoad: (f: File) => Promise<void>;
  text?: string;
}

export function FileLoader({accept, onLoad, text}: IProps): JSX.Element {

  const {t} = useTranslation('common');
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [loading, setIsLoading] = useState(false);

  function handleFile(event: ChangeEvent<HTMLInputElement>): void {
    if (event.target.files && event.target.files.length > 0) {
      setIsLoading(true);
      
      for (const file of event.target.files) {
        onLoad(file);
      }
    }
  }

  return (
    <>
      <button type="button" className="p-2 rounded border border-slate-500 w-full" onClick={() => fileInput.current && fileInput.current.click()}
              disabled={loading}>
        {text || t('chooseFile')}
      </button>

      <input type="file" onChange={handleFile} accept={accept} ref={fileInput} hidden multiple />
    </>
  );
}