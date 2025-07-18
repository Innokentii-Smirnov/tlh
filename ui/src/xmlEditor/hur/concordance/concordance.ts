import { convertDictionary, updateDictionary } from '../common/utility';
import { add, remove } from '../common/utils';
import { isValid } from '../dict/morphologicalAnalysisValidator';

const sep = ',';

export class Attestation {
  text: string;
  line: string;
  constructor(text: string, line: string) {
    this.text = text;
    this.line = line;
  }
  toString(): string {
    return this.text + sep + this.line;
  }
}

const concordance = new Map<string, Set<string>>();

export function addAttestation(analysis: string, attestation: Attestation) {
  if (isValid(analysis)) {
    add(concordance, analysis, attestation.toString());
  }
}

export function removeAttestation(analysis: string, attestation: Attestation) {
  remove(concordance, analysis, attestation.toString());
}

export function getAttestations(analysis: string): Attestation[] {
  const current = concordance.get(analysis);
  if (current === undefined) {
    return [];
  } else {
    return Array.from(current).map((repr: string) => {
      const [text, line] = repr.split(sep);
      return new Attestation(text, line);
    });
  }
}

export function getConcordance(): { [key: string]: string[] } {
  return convertDictionary(concordance);
}

export function updateConcordance(object: { [key: string]: string[] }) {
  updateDictionary(concordance, object);
}
