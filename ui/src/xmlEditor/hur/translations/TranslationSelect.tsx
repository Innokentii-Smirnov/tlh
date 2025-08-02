import {JSX} from 'react';
import {retrieveGloss} from './glossProvider';

interface IProps {
  stem: string;
  partOfSpeech: string;
  selectedTranslations: string[];
  handleChange: (newTranslations: string[]) => void;
}

export function TranslationSelect({stem, partOfSpeech, selectedTranslations, handleChange}: IProps): JSX.Element {
  const optionSet = new Set<string>(selectedTranslations);
  const storedOptions = retrieveGloss(stem, partOfSpeech);
  if (storedOptions !== null) {
    for (const option of storedOptions) {
      optionSet.add(option);
    }
  }
  const options = Array.from(optionSet).sort();
  return (
    <select multiple
            value={selectedTranslations}
            onChange={(event) => handleChange([event.target.value])}>
      {options.map((translation: string) =>
        <option value={translation} key={translation}>{translation}</option>)
      }
    </select>
  );
}
