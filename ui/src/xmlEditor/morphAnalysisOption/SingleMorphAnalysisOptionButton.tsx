import {SingleMorphologicalAnalysis} from '../../model/morphologicalAnalysis';
import {SelectableButton} from '../../genericElements/Buttons';
import {JSX} from 'react';
import {MorphemesEditor} from './MorphemesEditor';

interface IProps {
  morphAnalysis: SingleMorphologicalAnalysis;
  toggleAnalysisSelection: (encLetter: string | undefined) => void;
  setReferenceWord: (newReferenceWord: string) => void;
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
  setReferenceWord
}: IProps
): JSX.Element {
  switch (morphAnalysis._type) {
    case 'SingleMorphAnalysisWithoutEnclitics':
      return (
        <div>
          <SelectableButton selected={morphAnalysis.selected} otherClasses={otherClasses} onClick={() => toggleAnalysisSelection(undefined)}>
            <>{morphAnalysis.analysis || morphAnalysis.paradigmClass}</>
          </SelectableButton>
          <MorphemesEditor
            segmentation={morphAnalysis.referenceWord}
            translation={morphAnalysis.translation}
            analysis={morphAnalysis.analysis}
            onSegmentationChange={setReferenceWord}
          />
        </div>
      );

    case 'SingleMorphAnalysisWithSingleEnclitics':
      return (
        <SelectableButton selected={morphAnalysis.selected} otherClasses={otherClasses} onClick={() => toggleAnalysisSelection(undefined)}>
          <>{morphAnalysis.analysis} <EncliticsAnalysisDisplay enclitics={morphAnalysis.encliticsAnalysis.enclitics}
                                                               analysis={morphAnalysis.encliticsAnalysis.analysis}/></>
        </SelectableButton>
      );

    case 'SingleMorphAnalysisWithMultiEnclitics':
      return (
        <>
          {morphAnalysis.encliticsAnalysis.analysisOptions.map(({letter, analysis, selected}) =>
            <SelectableButton key={letter} selected={selected} otherClasses={['mb-1', ...otherClasses]} onClick={() => toggleAnalysisSelection(letter)}>
              <>{letter} - {morphAnalysis.analysis} <EncliticsAnalysisDisplay enclitics={morphAnalysis.encliticsAnalysis.enclitics} analysis={analysis}/></>
            </SelectableButton>
          )}
        </>
      );
  }
}