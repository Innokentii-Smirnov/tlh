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
  handleSegmentationBlur: (value: string) => void;
  handleAnalysisInput: (value: string, optionIndex: number) => void;
  handleAnalysisBlur: (value: string, optionIndex: number) => void;
}

export function WordformElement({ entry, handleSegmentationInput,
  handleSegmentationBlur, handleAnalysisInput, handleAnalysisBlur }: IProps): JSX.Element {
  
  const { transcriptions, morphologicalAnalysis } = entry;
  const segmentation = morphologicalAnalysis.referenceWord;
  const { translation } = morphologicalAnalysis;
  const morphTags = getMorphTags(morphologicalAnalysis) || [];
  
  return (
    <pre className="dict-entry">
      <input value={segmentation}
             onInput={event => handleSegmentationInput(event.currentTarget.value)}
             onBlur={event => handleSegmentationBlur(event.target.value)} />
      {(morphTags).map((tag: string, index: number) => {
          const gloss = translation + 
            ((tag.startsWith('=') || tag.startsWith('.') || tag === '') ? '' : '-') +
            tag;
          return (
            <input value={gloss}
                   onInput={event => handleAnalysisInput(event.currentTarget.value, index)}
                   onBlur={event => handleAnalysisBlur(event.target.value, index)}
                   key={index} />
          );
        })
      }
      <label>({transcriptions.join(', ')})</label>
      <br />
    </pre>
  );
}
