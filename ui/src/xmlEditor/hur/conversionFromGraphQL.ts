import { MorphologicalAnalysesByTranscriptionQuery } from '../../graphql';
import { MorphologicalAnalysis, SingleMorphologicalAnalysisWithoutEnclitics } from '../../model/morphologicalAnalysis';
import { makeSegmentation } from './common/auxiliary';

export function convertMorphologicalAnalysesFromGraphQL(query: MorphologicalAnalysesByTranscriptionQuery): MorphologicalAnalysis[] {
  const graphQLMorphologicalAnalyses = query.wordform.morphosyntacticWords
    .map(morphosyntacticWord => morphosyntacticWord.morphologicalAnalysis);
  const morphologicalAnalyses: MorphologicalAnalysis[] = [];
  for (const graphQLMorphologicalAnalysis of graphQLMorphologicalAnalyses) {
    let number = 1;
    const { stem, suffixChain } = graphQLMorphologicalAnalysis;
    const stemForm = stem.form;
    const paradigmClass = stem.pos;
    const translation = stem.deu;
    const { suffixes } = suffixChain;
    const analysis = suffixChain.morphTag;
    const referenceWord = makeSegmentation(stemForm, suffixes);
    const morphologicalAnalysis: SingleMorphologicalAnalysisWithoutEnclitics = {
      _type: 'SingleMorphAnalysisWithoutEnclitics',
      number,
      referenceWord,
      translation,
      analysis,
      paradigmClass,
      determinative: '',
      encliticsAnalysis: undefined,
      selected: false
    };
    morphologicalAnalyses.push(morphologicalAnalysis);
    number += 1;
  }
  return morphologicalAnalyses;
}
