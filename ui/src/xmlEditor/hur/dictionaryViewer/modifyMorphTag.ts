import { MorphologicalAnalysis } from '../../../model/morphologicalAnalysis';
import update from 'immutability-helper';
import mergeIdenticalOptions from '../morphologicalAnalysis/optionMerger';

type MorphTagModification = (segmentation: string, morphTag: string) => string;

export default function modifyMorphTag(morphTagModification: MorphTagModification) {
  const setMorphTag = (morphologicalAnalysis: MorphologicalAnalysis) => {
    switch(morphologicalAnalysis._type) {
      case 'SingleMorphAnalysisWithoutEnclitics': {
        const segmentation = morphologicalAnalysis.referenceWord;
        const morphTag = morphologicalAnalysis.analysis;
        return update(morphologicalAnalysis,
                      { analysis: { $set: morphTagModification(segmentation, morphTag) } });
      }
      case 'MultiMorphAnalysisWithoutEnclitics': {
        const segmentation = morphologicalAnalysis.referenceWord;
        const { analysisOptions } =  morphologicalAnalysis;
        const newMa = update(morphologicalAnalysis, {
          analysisOptions: {
            $set: analysisOptions.map(option => update(option, {
              analysis: {
                $set: morphTagModification(segmentation, option.analysis)
              }
            }))
          }
        });
        return mergeIdenticalOptions(newMa);
      }
      default:
        return morphologicalAnalysis;
    }
  };
  return setMorphTag;
}
