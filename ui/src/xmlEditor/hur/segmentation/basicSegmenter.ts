import { getStemAndGrammaticalMorphemesWithBoundary } from '../splitter';

export default class BasicSegmenter {
  stems = new Set<string>;
  suffixChains = new Map<string, Set<string>>();

  add(segmentation: string) {
    segmentation = segmentation.replaceAll(/\(.*\)/g, '');
    const [stem, segmentedGrammaticalMorphemes] =
      getStemAndGrammaticalMorphemesWithBoundary(segmentation);
    this.stems.add(stem);
    const grammaticalMorphemes = segmentedGrammaticalMorphemes
      .replaceAll('-', '').replaceAll('=', '');
    let current = this.suffixChains.get(grammaticalMorphemes);
    if (current === undefined) {
      current = new Set<string>();
      this.suffixChains.set(grammaticalMorphemes, current);
    }
    current.add(segmentedGrammaticalMorphemes);
  }

  segment(wordform: string): string[] {
    const segmentations: string[] = [];
    for (const [suffixChain, options] of this.suffixChains) {
      if (wordform.endsWith(suffixChain)) {
        const stem = wordform.substring(0, wordform.length - suffixChain.length);
        if (this.stems.has(stem)) {
          for (const option of options) {
            segmentations.push(stem + option);
          }
        }
      }
    }
    return segmentations;
  }
}