import { JSX, useState } from 'react';
import { MorphologicalAnalysis as Morph } from '../../../model/morphologicalAnalysis';
import { Attestation } from '../concordance/concordance';
import { getLine } from '../corpus/corpus';
import { ConcordanceEntryViewer } from '../concordanceEntryViewer/ConcordanceEntryViewer';
import { MorphologicalAnalysis } from '../../../graphql';

export interface Entry {
  transcriptions: string[];
  morphologicalAnalysis: Morph;
}

interface IProps {
  morphologicalAnalysis: MorphologicalAnalysis;
  handleSegmentationInput: (value: string) => void;
  handleSegmentationBlur: (value: string) => void;
  handleAnalysisInput: (value: string) => void;
  handleAnalysisBlur: (value: string) => void;
  initialShowAttestations: boolean;
}

export function WordformElement({ morphologicalAnalysis, handleSegmentationInput,
  handleSegmentationBlur, handleAnalysisInput, handleAnalysisBlur,
  initialShowAttestations }: IProps): JSX.Element {
  
  const { segmentation, gloss } = morphologicalAnalysis;
  const [showAttestations, setShowAttestations] = useState(initialShowAttestations);
  const transcriptions: string[] = [];
  const attestations: Attestation[] = [];
  
  return (
    <div>
      <div className="flex flex-row">
        <pre className="dict-entry">
          <input value={segmentation}
                 onInput={event => handleSegmentationInput(event.currentTarget.value)}
                 onBlur={event => handleSegmentationBlur(event.target.value)} />
          <input value={gloss}
                 onInput={event => handleAnalysisInput(event.currentTarget.value)}
                 onBlur={event => handleAnalysisBlur(event.target.value)} />
          <label>({transcriptions.join(', ')})</label>
          <br />
        </pre>
        <div className="p-2 vertical-align: top">
          <button onClick={() => setShowAttestations(!showAttestations)}>&#8744;</button>
        </div>
      </div>
      {showAttestations &&
        <ConcordanceEntryViewer attestations={attestations} getLine={getLine} />}
    </div>
  );
}
