import {MorphologicalAnalysis, SingleMorphologicalAnalysis, SingleMorphologicalAnalysisWithoutEnclitics,
  SingleMorphologicalAnalysisWithSingleEnclitics, SingleMorphologicalAnalysisWithMultiEnclitics
} from '../../model/morphologicalAnalysis';
import {SelectableButton} from '../../genericElements/Buttons';
import {JSX} from 'react';
import {MorphemesEditor} from './MorphemesEditor';
import { Spec } from 'immutability-helper';

interface IProps {
  morphAnalysis: SingleMorphologicalAnalysis;
  toggleAnalysisSelection: (encLetter: string | undefined) => void;
  setAnalysis: (newTranslation: string) => void;
  hurrian: boolean;
  updateMorphology: (ma: Spec<MorphologicalAnalysis>) => void;
}

export function EncliticsAnalysisDisplay({enclitics, analysis}: { enclitics: string, analysis: string }): JSX.Element {
  return (
    <>&nbsp;+=&nbsp; {enclitics} @ {analysis}</>
  );
}

const otherClasses = ['p-2', 'rounded', 'w-full'];

export function SingleMorphAnalysisOptionButton({
  morphAnalysis,
  toggleAnalysisSelection,
  setAnalysis,
  hurrian,
  updateMorphology
}: IProps
): JSX.Element {
  switch (morphAnalysis._type) {
    case 'SingleMorphAnalysisWithoutEnclitics':
      return (
        <div>
          <SelectableButton
            selected={(morphAnalysis as SingleMorphologicalAnalysisWithoutEnclitics).selected}
            otherClasses={otherClasses}
            onClick={() => toggleAnalysisSelection(undefined)}>
            <>{morphAnalysis.analysis || morphAnalysis.paradigmClass}</>
          </SelectableButton>
          {hurrian && <MorphemesEditor
            segmentation={morphAnalysis.referenceWord}
            translation={morphAnalysis.translation}
            analysis={morphAnalysis.analysis}
            onAnalysisChange={setAnalysis}
            updateMorphology={updateMorphology}
            paradigmClass={morphAnalysis.paradigmClass}
          />}
        </div>
      );

    case 'SingleMorphAnalysisWithSingleEnclitics':
      {
        const ma = morphAnalysis as SingleMorphologicalAnalysisWithSingleEnclitics;
        return (
          <SelectableButton selected={ma.selected} otherClasses={otherClasses} onClick={() => toggleAnalysisSelection(undefined)}>
            <>{ma.analysis} <EncliticsAnalysisDisplay enclitics={ma.encliticsAnalysis.enclitics}
                                                                analysis={ma.encliticsAnalysis.analysis}/></>
          </SelectableButton>
        );
      }

    case 'SingleMorphAnalysisWithMultiEnclitics':
      {
        const ma = morphAnalysis as SingleMorphologicalAnalysisWithMultiEnclitics;
        return (
          <>
            {ma.encliticsAnalysis.analysisOptions.map(({letter, analysis, selected}) =>
              <SelectableButton key={letter} selected={selected} otherClasses={['mb-1', ...otherClasses]} onClick={() => toggleAnalysisSelection(letter)}>
                <>{letter} - {ma.analysis} <EncliticsAnalysisDisplay enclitics={ma.encliticsAnalysis.enclitics} analysis={analysis}/></>
              </SelectableButton>
            )}
          </>
        );
      }
  }
}