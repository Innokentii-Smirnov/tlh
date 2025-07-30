import { updateMapping, convertMapping } from '../common/utility';
import { Attestation, quickGetAttestations, updateConcordance } from '../concordance/concordance';
import { XmlElementNode, getElementByPath } from 'simple_xml';
import { Line, makeLine } from './lineConstructor';
import { makeWord, updateMorphologicalAnalysis } from './wordConstructor';
import { findLine, findLineStart, getParent } from './lineFinder';
import { readMorphAnalysisValue } from '../morphologicalAnalysis/auxiliary';

const corpus = new Map<string, Line>();

/*fetch('Concordance.json')
  .then(response => response.json())
  .then(json => {
    const {concordance, corpus} = json;
    updateConcordance(concordance);
    updateCorpus(corpus);
  });*/

function addLine(address: string, nodes: XmlElementNode[]): void {
  const line = makeLine(nodes);
  corpus.set(address, line);
}

function updateLine(line: Line, position: number, node: XmlElementNode): void {
  const word = makeWord(node);
  if (word !== undefined) {
    line[position] = word;
  }
}

export function addOrUpdateLineBySingleNodePath(address: Attestation,
                                                rootNode: XmlElementNode, path: number[]) {
  const key = address.toString();
  const storedLine = corpus.get(key);
  if (storedLine !== undefined) {
    const current = path[path.length - 1];
    const parent = getParent(rootNode, path);
    const start = findLineStart(current, parent);
    const position = current - (start + 1);
    const node = getElementByPath(rootNode, path);
    updateLine(storedLine, position, node);
  } else {
    const nodes = findLine(rootNode, path);
    addLine(key, nodes);
  }
}

export function updateCorpus(object: { [key: string]: Line }) {
  updateMapping(corpus, object);
}

export function getCorpus(): { [key: string]: Line } {
  return convertMapping(corpus);
}

export function getLine(attestation: Attestation): Line {
  return corpus.get(attestation.toString()) || [];
}

export function replaceMorphologicalAnalysis(oldAnalysis: string, newAnalysis: string): void {
  const oldMa = readMorphAnalysisValue(oldAnalysis);
  if (oldMa !== undefined) {
    const newMa = readMorphAnalysisValue(newAnalysis);
    for (const attestation of quickGetAttestations(oldMa)) {
      const line = corpus.get(attestation);
      if (line !== undefined) {
        for (let i = 0; i < line.length; i++) {
          const word = line[i];
          line[i] = updateMorphologicalAnalysis(word, oldMa, newMa);
        }
      }
    }
  }
}
