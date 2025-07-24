import { convertDictionary, updateDictionary } from '../common/utility';
import { add, remove, replaceKey } from '../common/utils';
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

const pattern = /(?<!\d)\d(?!\d)/g;

function padDigits(a: string): string {
  return a.replaceAll(pattern, digit => '0' + digit);
}

function compare(a: string, b: string): number {
  const newA = padDigits(a);
  const newB = padDigits(b);
  if (newA < newB) {
    return -1;
  } else if (newA > newB) {
    return 1;
  } else {
    return 0;
  }
}

export function quickGetAttestations(morphologicalAnalysis: MorphologicalAnalysis): string[] {
  const analysis = writeMorphAnalysisValue(morphologicalAnalysis);
  const current = concordance.get(analysis);
  if (current === undefined) {
    return [];
  } else {
    return Array.from(current);
  }
}

export function getAttestations(morphologicalAnalysis: MorphologicalAnalysis): Attestation[] {
  const analysis = writeMorphAnalysisValue(morphologicalAnalysis);
  const current = concordance.get(analysis);
  if (current === undefined) {
    return [];
  } else {
    return Array.from(current).sort(compare).map((repr: string) => {
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

export function updateConcordanceKey(oldAnalysis: string, newAnalysis: string): void {
  replaceKey(concordance, oldAnalysis, newAnalysis);
}

export function inConcordance(ma: MorphologicalAnalysis): boolean {
  const value = writeMorphAnalysisValue(ma);
  return concordance.has(value);
}
