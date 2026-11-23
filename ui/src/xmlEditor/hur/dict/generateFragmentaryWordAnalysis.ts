import { SingleMorphologicalAnalysisWithoutEnclitics } from '../../../model/morphologicalAnalysis';
import { openingBracket, closingBracket,
  unknownMeaningSymbol, unclearPartOfSpeechSymbol
} from '../common/symbols';

const fragmentaryWordMorphTag = '';
const initialFragmentarySignsPattern = /^(x-?)+/;
const finalFragmentarySignsPattern = /(-?x)+$/;
const initialFragmentarySignsAfterBracketPatttern = /(?<=^\])-?(x-?)+/;
const finalFragmentarySignsBeforeBracketPatttern = /(-?x)+-?(?=\[$)/;

function generateFragmentaryWordSegmentation(transcription: string): string {
  return transcription
    .replace(initialFragmentarySignsPattern, closingBracket)
    .replace(finalFragmentarySignsPattern, openingBracket)
    .replace(initialFragmentarySignsAfterBracketPatttern, '')
    .replace(finalFragmentarySignsBeforeBracketPatttern, '');
}

export function generateFragmentaryWordAnalysis(transcription: string): SingleMorphologicalAnalysisWithoutEnclitics {
  const ma: SingleMorphologicalAnalysisWithoutEnclitics = {
    number: 1,
    referenceWord: generateFragmentaryWordSegmentation(transcription),
    translation: unknownMeaningSymbol,
    analysis: fragmentaryWordMorphTag,
    paradigmClass: unclearPartOfSpeechSymbol,
    determinative: '',
    _type: 'SingleMorphAnalysisWithoutEnclitics',
    encliticsAnalysis: undefined,
    selected: false,
  };
  return ma;
}
