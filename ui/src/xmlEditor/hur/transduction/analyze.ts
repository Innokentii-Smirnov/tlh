import { hurrianSuffixPositions, hurrianEncliticSuffixPositions } from './hurrianSuffixPositions';
import { hurrianMorphemes as grammemesByPartOfSpeech } from './morphemes';

type Seq = string | string[];

function makeCategoryGroup(partOfSpeech: string, position: string, sep: string): string {
  const category: string = position.replace('2', '');

  const grammemes: { [key: string]: { [key: string]: Seq } } = grammemesByPartOfSpeech[partOfSpeech];

  if (grammemes[category] === undefined) {
    console.log(category);
  }

  const values: string = Object.keys(grammemes[category]).join('|');

  return '(?:' + sep + '(?<' + position + '>' + values + '))?';
}

export const partsOfSpeech: string[] = Object.keys(grammemesByPartOfSpeech)
  .filter((partOfSpeech) => partOfSpeech !== 'enclitic');

const enclitics: string = hurrianEncliticSuffixPositions
  .map((category: string) => makeCategoryGroup('enclitic', category, '='))
  .join('');

const expr: { [key: string]: RegExp } = {};

for (const pos of partsOfSpeech) {
  const suffixes: string = hurrianSuffixPositions[pos]
    .map((category: string) => makeCategoryGroup(pos, category, '-'))
    .join('');

  const segmentedGrammaticalMorphemes: string = suffixes + enclitics + '$';

  expr[pos] = new RegExp(segmentedGrammaticalMorphemes);
}

function expand(array: Seq[]): string[][] {
  let sequences: string[][] = [[]];

  for (const element of array) {
    if (typeof (element) === 'string') {
      for (const sequence of sequences) {
        sequence.push(element);
      }
    } else {
      const newSequences: string[][] = [];
      for (const sequence of sequences) {
        for (const subelement of element) {
          newSequences.push(sequence.concat([subelement]));
        }
      }
      sequences = newSequences;
    }
  }

  return sequences;
}

/**
 * Dieses Modul kann Segmentierungen morphologische Glossierung zuweisen.
 * Sowohl den vom Benutzer eingegebenen Segmentierungen als auch den automatisch erstellten.
 * Die Grammatik (Annotationen von Suffixen und ihre Reihenfolge) wird als 2 JSON-Dateien in "public" gespeichert.
 */
export function analyze(grammaticalMorphemes: string, pos: string): string[] | null {
  if (pos == 'indecl') {
    return null;
  }

  const match = grammaticalMorphemes.match(expr[pos]);
  if (match === null) {
    return null;
  }

  const groups = match.groups;
  if (groups === undefined) {
    return null;
  }

  const suffixChains: string[][] = expand(
    hurrianSuffixPositions[pos]
      .filter(position => groups[position] !== undefined)
      .map(position => {
        const grammemes: { [key: string]: Seq } = grammemesByPartOfSpeech[pos][position.replace('2', '')];
        return grammemes[groups[position]];
      })
  );

  const encliticChains: string[][] = expand(
    hurrianEncliticSuffixPositions
      .filter(position => groups[position] !== undefined)
      .map(position => {
        const grammemes: { [key: string]: Seq } = grammemesByPartOfSpeech.enclitic[position.replace('2', '')];
        return grammemes[groups[position]];
      })
  );

  const result: string[] = [];
  for (const suffixChain of suffixChains) {
    for (const encliticChain of encliticChains) {
      const chain: string = encliticChain.length > 0 ?
        suffixChain.join('-') + '=' + encliticChain.join('=') :
        suffixChain.join('-');
      result.push(chain);
    }
  }
  return result;
}
