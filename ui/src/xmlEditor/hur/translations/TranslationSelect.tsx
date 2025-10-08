import {JSX, ChangeEvent} from 'react';
import {retrieveGloss} from './glossProvider';

interface IProps {
  stem: string;
  partOfSpeech: string;
  selectedTranslations: string[];
  handleChange: (newTranslations: string[]) => void;
}

const maxDisplayedOptionsCount = 5;

export function TranslationSelect({stem, partOfSpeech, selectedTranslations, handleChange}: IProps): JSX.Element {
  const optionSet = new Set<string>();
  for (const selectedTranslation of selectedTranslations) {
    optionSet.add(selectedTranslation);
  }
  const storedOptions = retrieveGloss(stem, partOfSpeech);
  if (storedOptions !== null) {
    for (const option of storedOptions) {
      optionSet.add(option);
    }
  }
  const options = Array.from(optionSet).sort();
  const handleTranlationsChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newTranslations = Array.from(event.target.selectedOptions)
      .map((option: HTMLOptionElement) => option.value);
    handleChange(newTranslations);
  };
  const size = Math.min(options.length, maxDisplayedOptionsCount);
  return (
    <select multiple
            value={selectedTranslations}
            onChange={handleTranlationsChange}
            size={size}>
      {options.map((translation: string) =>
        <option value={translation} key={translation}>{translation}</option>)
      }
    </select>
  );
}
