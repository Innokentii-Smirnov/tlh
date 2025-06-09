import {SingleMorphologicalAnalysis} from '../../model/morphologicalAnalysis';
import {SelectableButton} from '../../genericElements/Buttons';
import {JSX} from 'react';

interface IProps {
  morphAnalysis: SingleMorphologicalAnalysis;
  toggleAnalysisSelection: (encLetter: string | undefined) => void;
}

export function EncliticsAnalysisDisplay({enclitics, analysis}: { enclitics: string, analysis: string }): JSX.Element {
  return (
    <>&nbsp;+=&nbsp; {enclitics} @ {analysis}</>
  );
}

const otherClasses = ['p-2', 'rounded', 'w-full'];
const sep = /-|=/;

export function SingleMorphAnalysisOptionButton({morphAnalysis, toggleAnalysisSelection}: IProps): JSX.Element {
  switch (morphAnalysis._type) {
    case 'SingleMorphAnalysisWithoutEnclitics':
      return (
        <div>
        <SelectableButton selected={morphAnalysis.selected} otherClasses={otherClasses} onClick={() => toggleAnalysisSelection(undefined)}>
          <>{morphAnalysis.analysis || morphAnalysis.paradigmClass}</>
        </SelectableButton>
        <div className="segmentation-box">
        {morphAnalysis.referenceWord.split(sep).map((morpheme: string, i:number) => {
          const tags: string[] = morphAnalysis.analysis.split(sep);
          return (
            <span key={i.toString()}
                  className="morpheme-box">
              <input type="text"
                key={i.toString()}
                className="field-box"
                defaultValue={morpheme}>
              </input>
              <input
                key={i.toString()}
                className="field-box"
                defaultValue={i > 0 ? tags[i - 1] : morphAnalysis.translation}>
              </input>
            </span>
          );
        })}
        </div>
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