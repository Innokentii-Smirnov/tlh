import { JSX } from 'react';
import { getPartsOfSpeech } from './partsOfSpeech';

interface IProps {
  partOfSpeech: string;
  onChange: (value: string) => void;
}

export function PartOfSpeechSelector({ partOfSpeech, onChange }: IProps): JSX.Element {
  return (
    <select value={partOfSpeech}
            onChange={event => onChange(event.target.value)}>
      {
        getPartsOfSpeech().map((partOfSpeech: string, index: number) => {
          return (
            <option value={partOfSpeech} key={index}>
              {partOfSpeech}
            </option>
          );
        })
      }
    </select>
  );
}
