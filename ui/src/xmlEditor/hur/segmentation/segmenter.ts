import BasicSegmenter, {PartialAnalysis} from './basicSegmenter';
import { getPos } from '../partsOfSpeech';
import { MorphologicalAnalysis } from '../../../model/morphologicalAnalysis';

export class Analysis extends PartialAnalysis {
  pos: string;

  constructor(segmentation: string, translation: string, morphTag: string, pos: string) {
    super(segmentation, translation, morphTag);
    this.pos = pos;
  }

  toString(): string {
    const det = '';
    return [this.segmentation, this.translation, this.morphTag, this.pos, det].join(' @ ');
  }
}

function getMorphTags(analysis: MorphologicalAnalysis): string[] | null {
  switch (analysis._type) {
    case 'SingleMorphAnalysisWithoutEnclitics':
      return [analysis.analysis];
    case 'MultiMorphAnalysisWithoutEnclitics':
      return analysis.analysisOptions.map(({analysis}) => analysis);
    default:
      return null;
  }
}

class Segmenter {
  segmenters = new Map<string, BasicSegmenter>();

  add(transcription: string, analysis: MorphologicalAnalysis) {
    const morphTags = getMorphTags(analysis);
    if (morphTags !== null) {
      const segmentation = analysis.referenceWord;
      const translation = analysis.translation;
      const template = analysis.paradigmClass;
      const pos = getPos(template, morphTags[0], translation);
      let segmenter = this.segmenters.get(pos);
      if (segmenter === undefined) {
        segmenter = new BasicSegmenter();
        this.segmenters.set(pos, segmenter);
      }
      segmenter.add(transcription, segmentation, translation, morphTags);
    }
  }

  segment(wordform: string): Analysis[] {
    const result: Analysis[] = [];
    for (const [pos, segmenter] of this.segmenters) {
      const partialAnalyses = segmenter.segment(wordform);
      for (const partialAnalysis of partialAnalyses) {
        const analysis = new Analysis(
          partialAnalysis.segmentation,
          partialAnalysis.translation,
          partialAnalysis.morphTag,
          pos
        );
        result.push(analysis);
      }
    }
    return result;
  }
}

const segmenter = new Segmenter();
export default segmenter;
