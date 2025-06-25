import BasicSegmenter, {PartialAnalysis} from './basicSegmenter';
import { getPos } from '../partsOfSpeech';

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

class Segmenter {
  segmenters = new Map<string, BasicSegmenter>();

  add(analysis: string) {
    const fields = analysis.split('@').map(field => field.trim());
    const segmentation = fields[0];
    const translation = fields[1];
    const morphTag = fields[2];
    const template = fields[3];
    const pos = getPos(template, morphTag, translation);
    let segmenter = this.segmenters.get(pos);
    if (segmenter === undefined) {
      segmenter = new BasicSegmenter();
      this.segmenters.set(pos, segmenter);
    }
    segmenter.add(segmentation, translation, morphTag);
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
