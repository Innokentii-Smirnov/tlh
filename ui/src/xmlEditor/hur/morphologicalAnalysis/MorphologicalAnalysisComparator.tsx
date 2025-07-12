import { JSX } from 'react';
import { MorphologicalAnalysis } from '../../../model/morphologicalAnalysis';
import { SelectableLetteredAnalysisOption } from '../../../model/analysisOptions';
import { MorphologicalAnalysisViewer } from './MorphologicalAnalysisViewer';

const rightArrow = <>&#10159;</>;

interface IProps {
  source: MorphologicalAnalysis;
  target: MorphologicalAnalysis;
}

export function MorphologicalAnalysisComparator({ source, target }: IProps): JSX.Element {
  
  return (
    <div className="display: table-row">
      <div className="display: table-cell">
        <MorphologicalAnalysisViewer morphologicalAnalysis={source} />
      </div>
      <div className="display: table-cell">
        {source.referenceWord !== target.referenceWord && rightArrow} <br/>
        { source._type === 'SingleMorphAnalysisWithoutEnclitics' ?
          (<>
            {(target._type === 'SingleMorphAnalysisWithoutEnclitics' &&
            source.analysis !== target.analysis) && rightArrow} <br/>
          </>) :
          (source._type === 'MultiMorphAnalysisWithoutEnclitics' &&
          target._type === 'MultiMorphAnalysisWithoutEnclitics') &&
          source.analysisOptions.map(
            (option: SelectableLetteredAnalysisOption, index: number) =>
            (<>
              {option.analysis !== target.analysisOptions[index].analysis && rightArrow}
              <br/>
            </>)
          )
        }
        {source.paradigmClass !== target.paradigmClass && rightArrow} <br/>
      </div>
      <div className="display: table-cell">
        <MorphologicalAnalysisViewer morphologicalAnalysis={target} />
      </div>
      <br/>
    </div>
  );
}
