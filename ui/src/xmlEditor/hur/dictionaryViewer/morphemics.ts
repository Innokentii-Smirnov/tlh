import { GrammaticalMorpheme } from './grammaticalMorpheme';
import { MorphologicalAnalysis } from '../../../model/morphologicalAnalysis';
import { getGrammaticalMorphemesWithBoundary } from '../common/splitter';

const sep = ' ~ ';
const grammaticalMorphemeStringSplitPattern = /(?=[-=])/;
const morphTagSplitPattern = /(?=[-=])|(?<![123](?:SG|PL))(?=.ABS)/;
const errorForm = '';
const errorLabel = '';

export function getGrammaticalMorphemes(morphologicalAnalysis: MorphologicalAnalysis): GrammaticalMorpheme[] {
  const grammaticalMorphemeString = getGrammaticalMorphemesWithBoundary(
    morphologicalAnalysis.referenceWord
  );
  switch(morphologicalAnalysis._type) {
    case 'SingleMorphAnalysisWithoutEnclitics': {
      const { analysis } = morphologicalAnalysis;
      return getInflectionalSuffixesAndEnclitics(analysis, grammaticalMorphemeString);
    }
    case 'MultiMorphAnalysisWithoutEnclitics': {
      const { analysisOptions } = morphologicalAnalysis;
      const analyses = analysisOptions.map(({ analysis }) => analysis);
      const first = analyses[0];
      const grammaticalMorphemes = getInflectionalSuffixesAndEnclitics(first, grammaticalMorphemeString);
      for (const morphTag of analyses.slice(1)) {
        const grams = getInflectionalSuffixesAndEnclitics(morphTag, grammaticalMorphemeString);
        for (let i = 0; i < grams.length; i++) {
          const gram = grams[i];
          if (gram.form === grammaticalMorphemes[i].form) {
            if (!grammaticalMorphemes[i].label.includes(gram.label)) {
              grammaticalMorphemes[i].label += sep + gram.label;
            }
          }
        }
      }
      return grammaticalMorphemes;
    }
    default:
      return [];
  }
}

function preprocessMorphTag(morphTag: string): string {
  if (morphTag.startsWith('=') || morphTag.startsWith('.')) {
    return morphTag;
  } else {
    return '-' + morphTag;
  }
}

export function getInflectionalSuffixesAndEnclitics(morphTag: string, grammaticalMorphemeString: string): GrammaticalMorpheme[] {
  morphTag = preprocessMorphTag(morphTag);
  const labels = morphTag === '' ? [] : morphTag.split(morphTagSplitPattern);
  const forms = grammaticalMorphemeString === '' ? [] :
    grammaticalMorphemeString.split(grammaticalMorphemeStringSplitPattern);
  const grammaticalMorphemes: GrammaticalMorpheme[] = [];
  let labelIndex = 0, formIndex = 0;
  while (labelIndex < labels.length || formIndex < forms.length) {
    const label = labelIndex < labels.length ? labels[labelIndex] : errorLabel;
    labelIndex += 1;
    let form: string;
    if (label === '.ABS') {
      form = '';
    } else {
      form = formIndex < forms.length ? forms[formIndex] : errorForm;
      formIndex += 1;
    }
    const gram = new GrammaticalMorpheme(label, form);
    grammaticalMorphemes.push(gram);
  }
  return grammaticalMorphemes;
}
