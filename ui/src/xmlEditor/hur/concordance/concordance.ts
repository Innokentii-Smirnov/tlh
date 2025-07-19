import { convertDictionary, updateDictionary } from '../common/utility';
import { add, remove } from '../common/utils';
import { isValid, normalize } from '../dict/morphologicalAnalysisValidator';
import { writeMorphAnalysisValue, MorphologicalAnalysis } from '../../../model/morphologicalAnalysis';
import { readMorphAnalysisValue } from '../morphologicalAnalysis/auxiliary';

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

function preprocess(analysis: string): string {
  analysis = normalize(analysis, true, false) || analysis;
  const ma = readMorphAnalysisValue(analysis);
  if (ma === undefined) {
    return analysis;
  } else {
    return writeMorphAnalysisValue(ma);
  }
}

export function addAttestation(analysis: string, attestation: Attestation) {
  if (isValid(analysis)) {
    add(concordance, preprocess(analysis), attestation.toString());
  }
}

export function removeAttestation(analysis: string, attestation: Attestation) {
  remove(concordance, preprocess(analysis), attestation.toString());
}

export function getAttestations(morphologicalAnalysis: MorphologicalAnalysis): Attestation[] {
  const analysis = writeMorphAnalysisValue(morphologicalAnalysis);
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
