import { JSX, useState, useEffect } from 'react';
import { getStem } from '../common/splitter';
import { groupBy } from '../common/utils';
import { StemViewer, Stem } from './StemViewer';
import { Entry } from './Wordform';
import { DictionaryDownloader } from '../dict/files/DictionaryDownloader';
import { ChangesDownloader } from '../changes/ChangesDownloader';
import { writeMorphAnalysisValue } from '../../../model/morphologicalAnalysis';
import { SetDictionary } from '../dict/dictionary';
import { compare } from '../common/comparison';
import { blueButtonClasses } from '../../../defaultDesign';
import { useTranslation } from 'react-i18next';
import { getEnglishTranslationKey, EnglishTranslations, setGlobalEnglishTranslations } from '../translations/englishTranslations';
import update from 'immutability-helper';
import { useStemQuery } from '../../../graphql';

interface IProps {
  entries: Entry[];
  initialEnglishTranslations: EnglishTranslations;
  setDictionary: SetDictionary;
}

function keyFunc({morphologicalAnalysis}: Entry): string {
  return [getStem(morphologicalAnalysis.referenceWord),
          morphologicalAnalysis.translation,
          morphologicalAnalysis.paradigmClass].join('@');
}

function valueFunc(entry: Entry): Entry {
  return entry;
}

export function DictionaryViewer({entries, setDictionary, initialEnglishTranslations}: IProps): JSX.Element {
  
  const {t} = useTranslation('common');
  
  const [unfolded, setUnfolded] = useState(false);
  const [allUnfolded, setAllUnfolded] = useState(false);
  const toggleAllUnfolded = () => setAllUnfolded((value: boolean) => !value);
  
  useEffect(() => {
    setUnfolded(true);
  });

  const [englishTranslations, setEnglishTranslations] = useState<EnglishTranslations>(initialEnglishTranslations);

  useEffect(() => {
    setGlobalEnglishTranslations(englishTranslations);
  }, [englishTranslations]);
  
  const grouped = groupBy(entries, keyFunc, valueFunc);
  
  const stems = Array.from(grouped.keys()).sort(compare);
  
  return (
    <div className="grid grid-cols-2 gap-2 my-2 uneven-columns">
      <div className="mt-2">
        Click on the button &quot;&#8744;&quot; or a stem&apos;s number to see its derivatives and inflected forms. <br /> 
        Click on a similar button next to a word to see its attestations. <br />
        <br />
        {stems.map((stem: string, index: number) => {
          const group = grouped.get(stem);
          const entries: Entry[] = group === undefined ? [] : Array.from(group);
          const stemObject = new Stem((index + 1).toString() + '.@' + stem);
          const key = entries
            .map(entry => writeMorphAnalysisValue(entry.morphologicalAnalysis))
            .join('|');
          const englishTranslationKey = getEnglishTranslationKey(stemObject.form,
                                                                 stemObject.pos,
                                                                 stemObject.translation);
          let englishTranslation: string;
          const maybeEnglishTranslation: string | undefined = englishTranslations.get(englishTranslationKey);
          if (maybeEnglishTranslation === undefined) {
            const { loading, error, data } = useStemQuery({
              variables: {form: stemObject.form,
                          pos: stemObject.pos,
                          deu: stemObject.translation}
            });
            if (loading || error) {
              englishTranslation = '';
              console.log(loading, error);
            } else {
              if (data !== undefined &&
                  data.stem !== undefined && data.stem !== null) {
                console.log(data);
                englishTranslation = data.stem.eng;
              } else {
                englishTranslation = '';
              }
            }
          } else {
            englishTranslation = maybeEnglishTranslation;
          }
          const setEnglishTranslation = (newEnglishTranslation: string) => {
            if (!(englishTranslation === '' && newEnglishTranslation === '')) {
              setEnglishTranslations(oldEnglishTranslations => update(
                oldEnglishTranslations, {$add: [[englishTranslationKey, newEnglishTranslation]]}
              ));
            }
          };

          const updateEnglishTranslationKey = (newEnglishTranslationKey: string) =>
          setEnglishTranslations(oldEnglishTranslations => update(
            oldEnglishTranslations,
            {
              $add: [[newEnglishTranslationKey, englishTranslation]],
              $remove: [englishTranslationKey]
            }
          ));
          return (
            <StemViewer
              stem={stemObject}
              initialEntries={entries}
              key={key} 
              setDictionary={setDictionary}
              initialUnfolded={unfolded}
              allUnfolded={allUnfolded}
              englishTranslation={englishTranslation}
              onEnglishTranslationBlur={setEnglishTranslation}
              updateEnglishTranslationKey={updateEnglishTranslationKey}/>
          );
        })}
      </div>
      <div>
        <div className="button-stack">
          <DictionaryDownloader />
          <ChangesDownloader />
          <button type="button" className={blueButtonClasses} onClick={toggleAllUnfolded}>
            {allUnfolded ? t('foldAll') : t('unfoldAll')}
          </button>
        </div>
      </div>
    </div>
  );
}
