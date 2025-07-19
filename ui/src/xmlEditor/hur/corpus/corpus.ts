import { updateMapping, convertMapping } from '../common/utility';
import { Attestation } from '../concordance/concordance';
import { XmlElementNode, getElementByPath } from 'simple_xml';
import { Line, makeLine } from './lineConstructor';
import { makeWord } from './wordConstructor';
import { findLine, findLineStart, getParent } from './lineFinder';

const corpus = new Map<string, Line>();

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
