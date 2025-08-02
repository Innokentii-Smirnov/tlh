import {JSX} from 'react';
import {splitTranslationIntoWords, joinTranslationWords} from './glossProvider';
import {TranslationSelect} from './TranslationSelect';

interface IProps {
  stem: string;
  partOfSpeech: string;
  translation: string;
  handleChange: (newTranslation: string) => void;
}

export function TranslationEditor({stem, partOfSpeech, translation, handleChange}: IProps): JSX.Element {
  const translationWords = splitTranslationIntoWords(translation);
  const handleTranslationWordsChange = (newTranslationWords: string[]) => {
    const newTranslation = joinTranslationWords(newTranslationWords);
    handleChange(newTranslation);
  };
  return (
    <TranslationSelect stem={stem}
                      partOfSpeech={partOfSpeech}
                      selectedTranslations={translationWords}
                      handleChange={handleTranslationWordsChange} />
  );
}
