import { JSX } from 'react';
import { MorphologicalAnalysis } from '../../../model/morphologicalAnalysis';
import { getMorphTags } from '../utils';

export interface Entry {
  transcriptions: string[];
  morphologicalAnalysis: MorphologicalAnalysis;
}

interface IProps {
  entry: Entry;
  handleSegmentationInput: (value: string) => void;
}

export function WordformElement({ entry, handleSegmentationInput }: IProps): JSX.Element {
  
  const { transcriptions, morphologicalAnalysis } = entry;
  const segmentation = morphologicalAnalysis.referenceWord;
  const { translation } = morphologicalAnalysis;
  const morphTags = getMorphTags(morphologicalAnalysis) || [];
  
  return (
    <pre className="dict-entry">
      <input value={segmentation}
             onInput={event => handleSegmentationInput(event.currentTarget.value)} />
      {(morphTags).map((tag: string, index: number) => {
          return (
            <label key={index}>
              {translation + 
              ((tag.startsWith('=') || tag.startsWith('.') || tag === '') ? '' : '-') +
              tag}
            </label>
          );
        })
      }
      <label>({transcriptions.join(', ')})</label>
      <br />
    </pre>
  );
}
