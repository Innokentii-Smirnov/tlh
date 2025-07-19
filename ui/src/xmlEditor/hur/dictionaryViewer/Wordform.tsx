import { JSX } from 'react';
import { MorphologicalAnalysis } from '../../../model/morphologicalAnalysis';
import { getMorphTags } from '../common/utils';
import { getAttestations } from '../concordance/concordance';
import { getLine } from '../corpus/corpus';
import { ConcordanceEntryViewer } from '../concordanceEntryViewer/ConcordanceEntryViewer';

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
  
  const attestations = getAttestations(morphologicalAnalysis);
  
  return (
    <div>
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
      <ConcordanceEntryViewer attestations={attestations} getLine={getLine} />
    </div>
  );
}
