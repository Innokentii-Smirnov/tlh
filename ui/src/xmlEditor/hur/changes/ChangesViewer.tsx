import { JSX } from 'react';
import { readMorphAnalysisValue } from '../morphologicalAnalysis/auxiliary';
import { MorphologicalAnalysisComparator }
  from '../morphologicalAnalysis/MorphologicalAnalysisComparator';

interface IProps {
  changes: Map<string, string>;
}

export function ChangesViewer({ changes }: IProps): JSX.Element {
  
  return (
    <div className="display: table">
      {Array.from(changes.entries()).map((entry: [string, string], index: number) => {
        const [sourceString, targetString] = entry;
        const source = readMorphAnalysisValue(sourceString);
        const target = readMorphAnalysisValue(targetString);
        if (source !== undefined && target !== undefined) {
          return (
            <MorphologicalAnalysisComparator source={source} target={target} key={index} />
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
  );
}
