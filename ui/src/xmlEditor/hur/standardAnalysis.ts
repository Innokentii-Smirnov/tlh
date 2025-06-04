import { segment } from './segment';
import { analyze } from './analyze';
import { MorphologicalAnalysis } from '../../model/morphologicalAnalysis';
import { SelectableLetteredAnalysisOption } from '../../model/analysisOptions';
import { getGrammaticalMorphemes } from './splitter';

function postprocessSegmentation(segmentation: string): string {
  if (segmentation.endsWith('-')) {
    segmentation = segmentation.substring(0, segmentation.length - 1);
  }
  return segmentation;
}

// Erstellt morphologische Analysen für Wörter, die im Lexicon fehlen.
// Das unbekannte Wort wird zuerst durch die Funktion "segment" in Morpheme getrennt, möglicherweise auf mehrere verschiedene Weisen.
// Der grammatische Teil der Segmentierung, die Suffixe und Enklitika, werden dann durch "analyze" grammatisch analysiert. Auch hier mehrere Optionen möglich.
// Der Stamm wird an diesem Schritt noch nicht im Wörterbuch nachgeschlagen.
export function makeStandardAnalyses(transcription: string): MorphologicalAnalysis[] {
  const analyses: MorphologicalAnalysis[] = [];
  const segmentations: [string, string][] = segment(transcription);

  for (let i = 0; i < segmentations.length; i++) {
    const [initialSegmentation, pos] = segmentations[i];
    const segmentation = postprocessSegmentation(initialSegmentation);
    let ma: MorphologicalAnalysis;
    const grammaticalMorphemes = getGrammaticalMorphemes(segmentation);
    const tags: string[] | null = analyze(grammaticalMorphemes, pos);
    if (tags !== null && tags.length > 0) {
      if (tags.length == 1) {
        ma = {
          number: i + 1,
          referenceWord: segmentation,
          translation: '',
          analysis: tags[0],
          paradigmClass: pos,
          determinative: '',
          _type: 'SingleMorphAnalysisWithoutEnclitics',
          encliticsAnalysis: undefined,
          selected: false
        };
      }
      else {
        const analysisOptions: SelectableLetteredAnalysisOption[] = [];
        let c = 97; // Code von 'a'
        for (const tag of tags) {
          const analysisOption: SelectableLetteredAnalysisOption =
          {
            letter: String.fromCodePoint(c),
            analysis: tag,
            selected: false
          };
          c++;
          analysisOptions.push(analysisOption);
        }
        ma = {
          number: i + 1,
          referenceWord: segmentation,
          translation: '',
          analysisOptions,
          paradigmClass: pos,
          determinative: '',
          _type: 'MultiMorphAnalysisWithoutEnclitics',
          encliticsAnalysis: undefined
        };
      }
    }
    else {
      ma = {
        number: i + 1,
        referenceWord: segmentation,
        translation: '',
        analysis: '',
        paradigmClass: pos,
        determinative: '',
        _type: 'SingleMorphAnalysisWithoutEnclitics',
        encliticsAnalysis: undefined,
        selected: false
      };
    }
    analyses.push(ma);
  }
  return analyses;
}
