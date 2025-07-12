import { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { readMorphAnalysisValue } from '../morphologicalAnalysis/auxiliary';
import { MorphologicalAnalysisViewer } from '../morphologicalAnalysis/MorphologicalAnalysisViewer';
import { SelectableLetteredAnalysisOption } from '../../../model/analysisOptions';

const rightArrow = <>&#10159;</>;

interface IProps {
  changes: Map<string, string>;
}

export function ChangesViewer({ changes }: IProps): JSX.Element {
  
  const {t} = useTranslation('common');
  
  return (
    <div>
      <h2 className="font-bold text-2xl text-center">{t('changes')}</h2>
      <br/>
      <div className="display: table">
        {Array.from(changes.entries()).map((entry: [string, string], index: number) => {
          const [sourceString, targetString] = entry;
          const source = readMorphAnalysisValue(sourceString);
          const target = readMorphAnalysisValue(targetString);
          if (source !== undefined && target !== undefined) {
            return (
              <div key={index} className="display: table-row">
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
          } else {
            return (
              <div key={index}>
                At least one analysis is incorrect.<br/>
                Source: &quot;{sourceString}&quot;.<br/>
                Target: &quot;{targetString}&quot;.<br/>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}