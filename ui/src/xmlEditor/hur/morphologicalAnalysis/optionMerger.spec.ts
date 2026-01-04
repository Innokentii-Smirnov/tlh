import mergeIdenticalOptions from './optionMerger';
import { readMorphAnalysisValue } from '../morphologicalAnalysis/auxiliary';
import { MultiMorphologicalAnalysisWithoutEnclitics, writeMorphAnalysisValue }
from '../../../model/morphologicalAnalysis';

describe('merging identical options', () => {

  test.each<[string, string]>([
    ['tav-ud-o @ u.B. @ { a → NEG-MOD.PAT} { b → NEG-MOD.PAT} @ verb @ ',
     'tav-ud-o @ u.B. @ { a → NEG-MOD.PAT} @ verb @ '],
    ['nav-an-ed-a @ weiden @ { a → CAUS-FUT-3A.SG} { b → CAUS-FUT-3A.SG} @ verb @ ',
     'nav-an-ed-a @ weiden @ { a → CAUS-FUT-3A.SG} @ verb @ '],
    ['tap-t-an-i @ u.B. @ { a → t-CAUS-ANTIP} { b → t-CAUS-TR.IMP} @ verb @ ',
     'tap-t-an-i @ u.B. @ { a → t-CAUS-ANTIP} { b → t-CAUS-TR.IMP} @ verb @ ']
  ])(
    'for %s, the new analysis should be %s',
    (oldMorphologicalAnalysisString, newMorphologicalAnalysisString) =>
    expect(writeMorphAnalysisValue(mergeIdenticalOptions(
      readMorphAnalysisValue(oldMorphologicalAnalysisString) as MultiMorphologicalAnalysisWithoutEnclitics
    )))
    .toEqual(newMorphologicalAnalysisString)
  );

});
