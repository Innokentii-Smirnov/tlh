import {MorphologicalAnalysis} from '../../model/morphologicalAnalysis';
import {JSX, useEffect, useState} from 'react';
import {MorphAnalysisOptionButtons} from './MorphAnalysisButtons';
import {MorphAnalysisOptionEditor} from './MorphAnalysisOptionEditor';

export interface CanToggleAnalysisSelection {
  toggleAnalysisSelection: (letter: string | undefined, encLetter: string | undefined, targetState: boolean | undefined) => void;
}

interface IProps extends CanToggleAnalysisSelection {
  morphologicalAnalysis: MorphologicalAnalysis;
  updateMorphology: (ma: MorphologicalAnalysis) => void;
  setKeyHandlingEnabled: (b: boolean) => void;
  hurrian: boolean;
}

export function MorphAnalysisOptionContainer({
  morphologicalAnalysis,
  updateMorphology,
  toggleAnalysisSelection,
  setKeyHandlingEnabled,
  hurrian,
}: IProps): JSX.Element {

  const [isUpdateMode, setIsUpdateMode] = useState(false);

  useEffect(() => {
    // Enable key handling again after unmounting this component!
    return () => {
      isUpdateMode && setKeyHandlingEnabled(true);
    };
  });

  function disableUpdateMode(): void {
    setKeyHandlingEnabled(true);
    setIsUpdateMode(false);
  }

  function enableUpdateMode(): void {
    setKeyHandlingEnabled(false);
    setIsUpdateMode(true);
  }

  function onEditSubmit(ma: MorphologicalAnalysis): void {
    disableUpdateMode();
    updateMorphology(ma);
  }

  return isUpdateMode
    ? <MorphAnalysisOptionEditor initialMorphologicalAnalysis={morphologicalAnalysis} onSubmit={onEditSubmit} cancelUpdate={disableUpdateMode} hurrian={hurrian}/>
    : <MorphAnalysisOptionButtons initialMorphologicalAnalysis={morphologicalAnalysis} toggleAnalysisSelection={toggleAnalysisSelection}
                                  enableEditMode={enableUpdateMode}
                                  onSubmit={onEditSubmit}/>;
}
