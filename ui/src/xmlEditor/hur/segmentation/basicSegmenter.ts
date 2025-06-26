import { getStemAndGrammaticalMorphemesWithBoundary } from '../splitter';
import { add, removeMacron } from '../utils';

class Stem {
  form: string;
  translation: string;

  constructor(form: string, translation: string) {
    this.form = form;
    this.translation = translation;
  }

  toString(): string {
    return this.form + '@' + this.translation;
  }
}

class SuffixChain {
  segmentation: string;
  morphTag: string;

  constructor(segmentation: string, morphTag: string) {
    this.segmentation = segmentation;
    this.morphTag = morphTag;
  }

  toString(): string {
    return this.segmentation + '@' + this.morphTag;
  }
}

const inParentheses = /\(.*\)/g;
const boundary = /[-=]/g;

function preprocessStem(stem: string): string {
  return stem.replaceAll(inParentheses, '')
    .replaceAll('+', '');
}

function preprocessSuffixChain(stem: string): string {
  return stem.replaceAll(inParentheses, '').replaceAll(boundary, '');
}

export class PartialAnalysis {
  segmentation: string;
  translation: string;
  morphTag: string;

  constructor(segmentation: string, translation: string, morphTag: string) {
    this.segmentation = segmentation;
    this.translation = translation;
    this.morphTag = morphTag;
  }
}

export default class BasicSegmenter {
  stems = new Map<string, Set<string>>();
  suffixChains = new Map<string, Set<string>>();

  add(transcription: string, segmentation: string, translation: string, analysis: string) {
    const [underlyingStem, underlyingSuffixChain] =
      getStemAndGrammaticalMorphemesWithBoundary(segmentation);
    if (underlyingStem !== '') {
      const preprocessedStem = preprocessStem(underlyingStem);
      const preprocessedSuffixChain = preprocessSuffixChain(underlyingSuffixChain);
      const surfaceStem = transcription.endsWith(preprocessedSuffixChain) ?
        transcription.substring(0, transcription.length - preprocessedSuffixChain.length) :
        preprocessedStem;
      const surfaceSuffixChain = transcription.startsWith(preprocessedStem) ?
        transcription.substring(preprocessedStem.length) :
        preprocessedSuffixChain;
      const stem = new Stem(underlyingStem, translation);
      add(this.stems, surfaceStem, stem.toString());
      const suffixChain = new SuffixChain(underlyingSuffixChain, analysis);
      add(this.suffixChains, surfaceSuffixChain, suffixChain.toString());
    }
  }

  segment(wordform: string): PartialAnalysis[] {
    const segmentations: PartialAnalysis[] = [];
    for (const [suffixChain, options] of this.suffixChains) {
      if (wordform.endsWith(suffixChain) || removeMacron(wordform).endsWith(suffixChain)) {
        const surfaceStem = wordform.substring(0, wordform.length - suffixChain.length);
        const stems = this.stems.has(surfaceStem) ?
          this.stems.get(surfaceStem) :
          this.stems.get(removeMacron(surfaceStem));
        if (stems !== undefined) {
          for (const option of options) {
            for (const stem of stems) {
              const [underlyingStem, translation] = stem.split('@');
              const [segmentedSuffixChain, morphTag] = option.split('@');
              const segmentation = underlyingStem + segmentedSuffixChain;
              const result =
                new PartialAnalysis(segmentation, translation, morphTag);
              segmentations.push(result);
            }
          }
        }
      }
    }
    return segmentations;
  }
}