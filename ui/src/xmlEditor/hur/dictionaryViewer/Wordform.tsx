import { JSX, useState } from 'react';
import { MorphologicalAnalysis as Morph } from '../../../model/morphologicalAnalysis';
import { Attestation } from '../concordance/concordance';
import { getLine } from '../corpus/corpus';
import { ConcordanceEntryViewer } from '../concordanceEntryViewer/ConcordanceEntryViewer';
import { MorphologicalAnalysis, useTranscriptionsByMorphologicalAnalysisIdQuery,
         Wordform } from '../../../graphql';
import { makeSegmentation, makeGloss } from '../common/auxiliary';

export interface Entry {
  transcriptions: string[];
  morphologicalAnalysis: Morph;
}

interface IProps {
  stem: string;
  deu: string;
  morphologicalAnalysis: MorphologicalAnalysis;
  handleSegmentationInput: (value: string) => void;
  handleSegmentationBlur: (value: string) => void;
  handleAnalysisInput: (value: string) => void;
  handleAnalysisBlur: (value: string) => void;
  initialShowAttestations: boolean;
}

export function WordformElement({ stem, deu, morphologicalAnalysis, handleSegmentationInput,
  handleSegmentationBlur, handleAnalysisInput, handleAnalysisBlur,
  initialShowAttestations }: IProps): JSX.Element {
  
  const { id, suffixes, morphTag } = morphologicalAnalysis;
  const segmentation = makeSegmentation(stem, suffixes);
  const gloss = makeGloss(deu, morphTag);
  const [showAttestations, setShowAttestations] = useState(initialShowAttestations);

  const { data, loading, error } = useTranscriptionsByMorphologicalAnalysisIdQuery({
    variables: {
      morphologicalAnalysisId: id
    },
  });
  let transcriptions: string[];
  if (loading || error || data === undefined) {
    console.log(loading, error);
    transcriptions = [];
  } else {
    transcriptions = data.transcriptionsByMorphologicalAnalysisId.map(
      (wordform: Wordform) => wordform.transcription
    );
  }

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
