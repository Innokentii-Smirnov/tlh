import { getStemAndGrammaticalMorphemesWithBoundary } from '../splitter';
import { add, removeMacron, groupBy } from '../utils';
import SuffixTrie from './suffixTrie';

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
  morphTags: string[];

  constructor(segmentation: string, translation: string, morphTags: string[]) {
    this.segmentation = segmentation;
    this.translation = translation;
    this.morphTags = morphTags;
  }
}

export default class BasicSegmenter {
  stems = new Map<string, Set<string>>();
  suffixChains = new Map<string, Set<string>>();
  suffixTrie = new SuffixTrie();

  add(transcription: string, segmentation: string, translation: string, morphTags: string[]) {
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
      for (const morphTag of morphTags) {
        const suffixChain = new SuffixChain(underlyingSuffixChain, morphTag);
        add(this.suffixChains, surfaceSuffixChain, suffixChain.toString());
      }
      this.suffixTrie.add(surfaceSuffixChain);
    }
  }

  segment(wordform: string): PartialAnalysis[] {
    const segmentations: PartialAnalysis[] = [];
    let candidates: string[] = this.suffixTrie.getAllSuffixes(wordform);
    candidates = candidates.concat(this.suffixTrie.getAllSuffixes(removeMacron(wordform)));
    for (const suffixChain of candidates) {
      const options = this.suffixChains.get(suffixChain);
      if (options !== undefined) {
        const surfaceStem = wordform.substring(0, wordform.length - suffixChain.length);
        const stems = this.stems.has(surfaceStem) ?
          this.stems.get(surfaceStem) :
          this.stems.get(removeMacron(surfaceStem));
        if (stems !== undefined) {
          const suffixChains: SuffixChain[] = Array.from(options).map(option => {
            const [segmentation, morphTag] = option.split('@');
            return new SuffixChain(segmentation, morphTag);
          });
          const grouped: Map<string, Set<string>> = groupBy(
            suffixChains,
            (suffixChain: SuffixChain) => suffixChain.segmentation,
            (suffixChain: SuffixChain) => suffixChain.morphTag
          );
          for (const [segmentedSuffixChain, morphTagSet] of grouped) {
            const morphTags = Array.from(morphTagSet).sort();
            for (const stem of stems) {
              const [underlyingStem, translation] = stem.split('@');
              const segmentation = underlyingStem + segmentedSuffixChain;
              const result =
                new PartialAnalysis(segmentation, translation, morphTags);
              segmentations.push(result);
            }
          }
        }
      }
    }
    return segmentations;
  }
  
  segmentOov(wordform: string): PartialAnalysis[] {
    const segmentations: PartialAnalysis[] = [];
    const suffixChain: string | null = this.suffixTrie.getLongestSuffix(wordform);
    if (suffixChain !== null && suffixChain !== '') {
      const options = this.suffixChains.get(suffixChain);
      if (options !== undefined) {
        const surfaceStem = wordform.substring(0, wordform.length - suffixChain.length);
        const suffixChains: SuffixChain[] = Array.from(options).map(option => {
          const [segmentation, morphTag] = option.split('@');
          return new SuffixChain(segmentation, morphTag);
        });
        const grouped: Map<string, Set<string>> = groupBy(
          suffixChains,
          (suffixChain: SuffixChain) => suffixChain.segmentation,
          (suffixChain: SuffixChain) => suffixChain.morphTag
        );
        for (const [segmentedSuffixChain, morphTagSet] of grouped) {
          const morphTags = Array.from(morphTagSet).sort();
          const underlyingStem = surfaceStem; 
          const translation = '';
          const segmentation = underlyingStem + segmentedSuffixChain;
          const result =
            new PartialAnalysis(segmentation, translation, morphTags);
          segmentations.push(result);
        }
      }
    }
    return segmentations;
  }
}