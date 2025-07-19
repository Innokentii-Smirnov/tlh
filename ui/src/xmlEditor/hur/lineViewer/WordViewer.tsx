import { JSX } from 'react';
import { Word } from '../corpus/wordConstructor';

interface IProps {
  word: Word;
}

export function WordViewer({ word }: IProps): JSX.Element {
  const { transliteration, segmentation, gloss } = word;
  
  return (
    <div className="corpus-word">
      <div className="corpus-word-field">
        {transliteration}
      </div>
      <div className="corpus-word-field">
        {segmentation}
      </div>
      <div className="corpus-word-field">
        {gloss}
      </div>
    </div>
  );
}
