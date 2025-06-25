import BasicSegmenter from './basicSegmenter';
import { getPos } from '../partsOfSpeech';

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
    segmenter.add(segmentation);
  }

  segment(wordform: string): [string, string][] {
    const result: [string, string][] = [];
    for (const [pos, segmenter] of this.segmenters) {
      const segmentations = segmenter.segment(wordform);
      for (const segmentation of segmentations) {
        result.push([segmentation, pos]);
      }
    }
    return result;
  }
}

const segmenter = new Segmenter();
export default segmenter;
