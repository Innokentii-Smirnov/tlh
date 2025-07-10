import { JSX } from 'react';
import { MorphologicalAnalysis } from '../../../model/morphologicalAnalysis';
import { getMorphTags } from '../utils';

export interface Entry {
  transcriptions: string[];
  morphologicalAnalysis: MorphologicalAnalysis;
}

interface IProps {
  entry: Entry;
}

export function WordformElement({ entry }: IProps): JSX.Element {
  
  const { transcriptions, morphologicalAnalysis } = entry;
  const segmentation = morphologicalAnalysis.referenceWord;
  const { translation } = morphologicalAnalysis;
  const morphTags = getMorphTags(morphologicalAnalysis) || [];
  
  return (
    <>
      <pre>&#9;{segmentation}</pre>
      {(morphTags).map((tag: string, index: number) => {
          return (
            <pre key={index}>&#9;{translation + 
            ((tag.startsWith('=') || tag.startsWith('.') || tag === '') ? '' : '-') +
            tag}</pre>
          );
        })
      }
      <pre>&#9;({transcriptions.join(', ')})</pre>
      <br />
    </>
  );
}
