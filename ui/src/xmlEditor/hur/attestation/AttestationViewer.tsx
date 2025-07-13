import { JSX } from 'react';
import { Attestation } from './attestation';
import { MorphologicalAnalysisViewer } from '../morphologicalAnalysis/MorphologicalAnalysisViewer';

interface IProps {
  attestation: Attestation;
}

export function AttestationViewer({ attestation }: IProps): JSX.Element {
  const { text, line, morphologicalAnalysis } = attestation;
  return (
    <div className="display: table-row">
      <div className="info-box">{text}</div>
      <div className="info-box">{line}</div>
      <div className="display: table-cell">
        <MorphologicalAnalysisViewer morphologicalAnalysis={morphologicalAnalysis} />
      </div>
    </div>
  );
}
