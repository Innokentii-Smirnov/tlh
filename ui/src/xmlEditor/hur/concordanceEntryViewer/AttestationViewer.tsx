import { JSX } from 'react';
import { Attestation } from '../concordance/concordance';
import { Line } from '../corpus/lineConstructor';
import { LineViewer } from './LineViewer';
import { getCTH } from '../concordance/cthProvider';

interface IProps {
  attestation: Attestation;
  words: Line;
}

export function AttestationViewer({ attestation, words }: IProps): JSX.Element {
  const { text, line } = attestation;
  return (
    <div className="display: table-row">
      <div className="info-box">{text}<br/>{getCTH(text)}</div>
      <div className="info-box">{line}</div>
      <div className="display: table-cell">
        <LineViewer line={words.filter(word => word !== null)} />
      </div>
    </div>
  );
}
