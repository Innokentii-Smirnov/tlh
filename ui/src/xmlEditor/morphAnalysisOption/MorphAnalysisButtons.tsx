import {JSX, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {SingleMorphAnalysisOptionButton} from './SingleMorphAnalysisOptionButton';
import {isSingleMorphologicalAnalysis, MorphologicalAnalysis, SingleMorphologicalAnalysis, MultiMorphologicalAnalysis} from '../../model/morphologicalAnalysis';
import {CanToggleAnalysisSelection} from './MorphAnalysisOptionContainer';
import {MultiMorphAnalysisOptionButtons} from './MultiMorphAnalysisOptionButtons';
import classNames from 'classnames';
import {analysisIsInNumerus, numeri, NumerusOption, stringifyNumerus} from './numerusOption';
import update from 'immutability-helper';

interface IProps extends CanToggleAnalysisSelection {
  initialMorphologicalAnalysis: MorphologicalAnalysis;
  enableEditMode: () => void;
  onSubmit: (ma: MorphologicalAnalysis) => void;
}

export function MorphAnalysisOptionButtons({initialMorphologicalAnalysis, toggleAnalysisSelection, enableEditMode, onSubmit}: IProps): JSX.Element {

  const {t} = useTranslation('common');
  const [isReduced, setIsReduced] = useState(false);
  const [lastNumerusSelected, setLastNumerusSelected] = useState<NumerusOption>();

  const [morphologicalAnalysis, setMorphAnalysis] = useState(initialMorphologicalAnalysis);
  const setReferenceWord = (value: string): void => {
    setMorphAnalysis((ma) => update(ma, { referenceWord: { $set: value } }));
    onSubmit(morphologicalAnalysis);
  };
  const setTranslation = (value: string): void => {
    setMorphAnalysis((ma) => update(ma, { translation: { $set: value } }));
    onSubmit(morphologicalAnalysis);
  };
  const setSingleMorphAnalysis = (value: string): void => {
    setMorphAnalysis((ma) => update(ma as SingleMorphologicalAnalysis, { analysis: { $set: value } }));
    onSubmit(morphologicalAnalysis);
  };

  const {number, translation, referenceWord, paradigmClass, determinative} = morphologicalAnalysis;
  const isSingleAnalysisOption = isSingleMorphologicalAnalysis(morphologicalAnalysis);

  function selectAll(ma: MultiMorphologicalAnalysis, numerus: NumerusOption): void {
    const targetState: boolean = lastNumerusSelected === undefined || lastNumerusSelected !== numerus;

    setLastNumerusSelected((current) => current === numerus ? undefined : numerus);

    ma.analysisOptions.forEach(({letter, analysis}) => {
      if (numerus === undefined || analysisIsInNumerus(analysis, numerus)) {
        toggleAnalysisSelection(letter, undefined, targetState);
      }
    });
  }

  return (
    <div className="mt-2">
      <div className="flex flex-row">
        <button onClick={() => setIsReduced((value) => !value)} className="p-2 rounded-l border-l border-y border-slate-500 font-bold text-lg">
          {isReduced ? <span>&gt;</span> : <span>&or;</span>}
        </button>

        <span className="p-2 border-l border-y border-slate-500">{number}</span>

        <div className="flex-grow p-2 border-l border-y border-slate-500 bg-gray-100">
          <span className="text-red-600">{translation}</span>&nbsp;({referenceWord},&nbsp;
          {t('paradigmClass')}:&nbsp;<span className="text-red-600">{paradigmClass}</span>
          {determinative && <span>, {t('determinative')}:&nbsp;<span className="text-red-600">{determinative}</span></span>})&nbsp;
        </div>

        {!isSingleAnalysisOption && <>
          {numeri.map((numerus) =>
            <button key={numerus} type="button" className={classNames('p-2', 'border', 'border-teal-300', {'bg-teal-300': lastNumerusSelected === numerus})}
                    onClick={() => selectAll(morphologicalAnalysis, numerus)} tabIndex={-1}>
              {stringifyNumerus(numerus, t)}
            </button>)}
        </>}

        <button type="button" className="p-2 rounded-r border border-slate-500" onClick={enableEditMode}
                title={t('editMorphologicalAnalyses') || 'editMorphologicalAnalyses'}>
          &#x2699;
        </button>
      </div>

      {!isReduced && <div className="mt-2">
        {isSingleAnalysisOption
          ? <SingleMorphAnalysisOptionButton morphAnalysis={morphologicalAnalysis}
                                             toggleAnalysisSelection={(encLetter) => toggleAnalysisSelection(undefined, encLetter, undefined)}
                                             setReferenceWord={setReferenceWord}
                                             setTranslation={setTranslation}
                                             setAnalysis={setSingleMorphAnalysis}/>
          : <MultiMorphAnalysisOptionButtons morphAnalysis={morphologicalAnalysis}
                                             toggleAnalysisSelection={(letter, encLetter) => toggleAnalysisSelection(letter, encLetter, undefined)}
                                             setReferenceWord={setReferenceWord}
                                             setTranslation={setTranslation}/>}

      </div>}
    </div>
  );
}
