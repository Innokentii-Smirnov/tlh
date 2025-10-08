import { XmlElementNode } from 'simple_xml';
import { Word, makeWord } from './wordConstructor';

export type Line = Word[];

export function makeLine(nodes: XmlElementNode[]): Line {
  const line: Line = [];
  for (const node of nodes) {
    const word = makeWord(node);
    line.push(word);
  }
  return line;
}
