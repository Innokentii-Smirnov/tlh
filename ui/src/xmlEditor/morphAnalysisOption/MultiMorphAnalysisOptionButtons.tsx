import {MultiMorphologicalAnalysis, MultiMorphologicalAnalysisWithoutEnclitics,
  MultiMorphologicalAnalysisWithSingleEnclitics, MultiMorphologicalAnalysisWithMultiEnclitics
} from '../../model/morphologicalAnalysis';
import {JSX} from 'react';
import {EncliticsAnalysisDisplay} from './SingleMorphAnalysisOptionButton';
import {MultiMorphAnalysisSelection} from './MultiMorphAnalysisSelection';
import {MultiMorphMultiEncAnalysisSelection} from './MultiMorphMultiEncAnalysisSelection';
import {SelectableButton} from '../../genericElements/Buttons';
import {MultiMorphMultiSelectionButton} from './MultiMorphMultiSelectionButton';
import {MorphemesEditor} from './MorphemesEditor';


const otherClasses = ['p-2', 'rounded', 'w-full'];

interface IProps {
  morphAnalysis: MultiMorphologicalAnalysis;
  initialMorphAnalysis: MultiMorphologicalAnalysis;
  toggleAnalysisSelection: (letter: string, encLetter: string | undefined) => void;
  setReferenceWord: (newReferenceWord: string) => void;
  setTranslation: (newTranslation: string) => void;
  setAnalysis: (num: number, newAnalysis: string) => void;
  hurrian: boolean;
  updateNodeMorphology: () => void;
}

export function MultiMorphAnalysisOptionButtons({morphAnalysis, initialMorphAnalysis, toggleAnalysisSelection, setReferenceWord, setTranslation, setAnalysis, hurrian, updateNodeMorphology}: IProps): JSX.Element {
  switch (morphAnalysis._type) {
    case 'MultiMorphAnalysisWithoutEnclitics':
      return (
        <div>
          <MultiMorphAnalysisSelection ma={morphAnalysis}/>

          {morphAnalysis.analysisOptions.map(({letter, analysis}, index) => {
            const options = (initialMorphAnalysis as MultiMorphologicalAnalysisWithoutEnclitics).analysisOptions;
            const selected = options && index < options.length ? options[index].selected : false;
            return (
              <div key={index} className="mb-1">
                <SelectableButton selected={selected} otherClasses={otherClasses} onClick={() => toggleAnalysisSelection(letter, undefined)}>
                  <>{letter} - {analysis}</>
                </SelectableButton>
                {hurrian && <MorphemesEditor
                  segmentation={morphAnalysis.referenceWord}
                  translation={morphAnalysis.translation}
                  analysis={analysis}
                  onSegmentationChange={setReferenceWord}
                  onTranslationChange={setTranslation}
                  onAnalysisChange={(newAnalysis: string) => {
                    setAnalysis(index, newAnalysis);
                  }
                  }
                  updateNodeMorphology={updateNodeMorphology}
                  />
                }
              </div>
            );
          })
          }
        </div>
      );

    case 'MultiMorphAnalysisWithSingleEnclitics':
      {
        const ma = initialMorphAnalysis as MultiMorphologicalAnalysisWithSingleEnclitics;
        return (
          <div>
            <MultiMorphAnalysisSelection ma={ma}/>

            {ma.analysisOptions.map(({letter, analysis, selected}, index) => <div key={index} className="mb-1">
              <SelectableButton selected={selected} otherClasses={otherClasses} onClick={() => toggleAnalysisSelection(letter, undefined)}>
                <>{letter} - {analysis} <EncliticsAnalysisDisplay enclitics={ma.encliticsAnalysis.enclitics}
                                                                  analysis={ma.encliticsAnalysis.analysis}/></>
              </SelectableButton>
            </div>)}
          </div>
        );
      }

    case 'MultiMorphAnalysisWithMultiEnclitics':
      {
        const ma = initialMorphAnalysis as MultiMorphologicalAnalysisWithMultiEnclitics;
        return (
          <div>
            <MultiMorphMultiEncAnalysisSelection ma={ma}/>

            {ma.analysisOptions.map((morphAnalysisOption, index) =>
              <MultiMorphMultiSelectionButton key={index} ma={ma} morphAnalysisOption={morphAnalysisOption}
                                              enclitics={ma.encliticsAnalysis.enclitics}
                                              encliticsAnalysisOptions={ma.encliticsAnalysis.analysisOptions}
                                              toggleAnalysisSelection={(letterIndex) => toggleAnalysisSelection(morphAnalysisOption.letter, letterIndex)}/>
            )}
          </div>
        );
      }
  }
}
