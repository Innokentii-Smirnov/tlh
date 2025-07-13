import { MorphologicalAnalysis } from '../../../model/morphologicalAnalysis';

export type Replacement = {
  text: string;
  line: string;
  source: MorphologicalAnalysis;
  target: MorphologicalAnalysis;
}
