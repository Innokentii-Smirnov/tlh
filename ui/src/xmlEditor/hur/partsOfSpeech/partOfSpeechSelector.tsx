import { JSX } from 'react';
import { getPartsOfSpeech } from '../partsOfSpeech';

export function PartOfSpeechSelector(initialPartOfSpeech: string): JSX.Element {
  return (
    <select defaultValue={initialPartOfSpeech}>
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
