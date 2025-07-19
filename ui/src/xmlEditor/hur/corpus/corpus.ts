import { updateMapping, convertMapping } from '../common/utility';
import { Attestation } from '../concordance/concordance';
import { XmlElementNode } from 'simple_xml';
import { Line, makeLine } from './lineConstructor';
import { findLine } from './lineFinder';

const corpus = new Map<string, Line>();

export function addLine(address: Attestation, nodes: XmlElementNode[]) {
  const line = makeLine(nodes);
  corpus.set(address.toString(), line);
}

export function addLineBySingleNodePath(address: Attestation, rootNode: XmlElementNode, path: number[]) {
  const line = findLine(rootNode, path);
  addLine(address, line);
}

export function updateCorpus(object: { [key: string]: Line }) {
  updateMapping(corpus, object);
}

export function getCorpus(): { [key: string]: Line } {
  return convertMapping(corpus);
}
