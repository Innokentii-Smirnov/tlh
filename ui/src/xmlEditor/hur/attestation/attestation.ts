import { MorphologicalAnalysis } from '../../../model/morphologicalAnalysis';

export type Attestation = {
  text: string;
  line: string;
  morphologicalAnalysis: MorphologicalAnalysis;
}
