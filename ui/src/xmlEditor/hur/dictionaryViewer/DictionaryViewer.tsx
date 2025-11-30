import { JSX, useState, useEffect } from 'react';
import { getStem } from '../common/splitter';
import { groupBy } from '../common/utils';
import { StemViewer, Stem } from './StemViewer';
import { Entry } from './Wordform';
import { DictionaryDownloader } from '../dict/files/DictionaryDownloader';
import { ChangesDownloader } from '../changes/ChangesDownloader';
import { writeMorphAnalysisValue } from '../../../model/morphologicalAnalysis';
import { SetDictionary } from '../dict/dictionary';
import { compareStems } from '../common/comparison';
import { blueButtonClasses } from '../../../defaultDesign';
import { useTranslation } from 'react-i18next';
import { getEnglishTranslationKey, EnglishTranslations, setGlobalEnglishTranslations } from '../translations/englishTranslations';
import update from 'immutability-helper';
import { useAllStemsQuery, Stem as GQStem } from '../../../graphql';

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

  const { data, loading, error } = useAllStemsQuery({
    variables: {
    },
  });
  
  let stems: GQStem[];

  if (loading || error || data === undefined) {
    console.log(loading, error);
    stems = [];
  } else {
    stems = data.allStems.sort(compareStems);
  }
  
  return (
    <div className="grid grid-cols-2 gap-2 my-2 uneven-columns">
      <div className="mt-2">
        Click on the button &quot;&#8744;&quot; or a stem&apos;s number to see its derivatives and inflected forms. <br /> 
        Click on a similar button next to a word to see its attestations. <br />
        <br />
        {stems.map((gqStem: GQStem, index: number) => {
          const {form, pos, deu, eng} = gqStem;
          const stem = new Stem(index + 1, form, deu, pos);
          const group = grouped.get(stem.toString());
          const entries: Entry[] = group === undefined ? [] : Array.from(group);
          const key = entries
            .map(entry => writeMorphAnalysisValue(entry.morphologicalAnalysis))
            .join('|');
          const englishTranslationKey = getEnglishTranslationKey(form, pos, deu);
          const englishTranslation = eng;
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
              stemListIndex={index}
              stem={gqStem}
              initialEntries={entries}
              key={key}
              setDictionary={setDictionary}
              initialUnfolded={unfolded}
              allUnfolded={allUnfolded}
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
